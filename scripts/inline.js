const fs = require('fs')
const path = require('path')
const glob = require('glob').sync
const less = require('less');

function inlineResourcesForDirectory(folderPath) {
  glob(path.join(folderPath, '**/*.ts')).forEach(filePath => inlineResources(filePath))
}

function inlineResources(filePath) {
  let fileContent = fs.readFileSync(filePath, 'utf-8')

  fileContent = inlineStyles(fileContent, filePath)
  fileContent = inlineTemplate(fileContent, filePath)

  fs.writeFileSync(filePath, fileContent, 'utf-8')
}

function inlineStyles(fileContent, filePath) {
    return fileContent.replace(/styleUrls\s*:\s*\[\s*'([^']+?\.less)'\s*\]/g, (_match, templateUrl) => {
      const templatePath = path.join(path.dirname(filePath), templateUrl.replace('.less', '.css'));
      const templateContent = loadResourceFile(templatePath);
      return `styles: [\`${templateContent}\`]`;
    });
}

function inlineTemplate(fileContent, filePath) {
  return fileContent.replace(/templateUrl\s*:\s*'([^']+?\.html)'/g, (_match, templateUrl) => {
    const templatePath = path.join(path.dirname(filePath), templateUrl);
    const templateContent = loadResourceFile(templatePath);
    return `template: \`${templateContent}\``;
  });
}

function loadLessFile(filePath) {
    return less.render(fs.readFileSync(filePath, 'utf-8')).then(res => res.css);
}

function loadResourceFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8')
    .replace(/([\n\r]\s*)+/gm, ' ')
}

inlineResourcesForDirectory('./__gen_lib')
