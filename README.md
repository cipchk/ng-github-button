# ng-github-button

Unofficial GitHub buttons in Angular.

[![NPM version](https://img.shields.io/npm/v/ng-github-button.svg)](https://www.npmjs.com/package/ng-github-button)
![Ci](https://github.com/cipchk/ng-github-button/workflows/Ci/badge.svg)

## Demo

[Live Demo](https://cipchk.github.io/ng-github-button/) or [stackblitz](https://stackblitz.com/edit/ng-github-button)

## Usage

### 1. Install

```
npm install ng-github-button --save
```

import `GithubButtonModule`。

```typescript
import { GithubButtonModule } from 'ng-github-button';

@NgModule({
    imports: [ BrowserModule, GithubButtonModule ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2、Template

```html
<github-button type="stargazers" size="large" namespace="cipchk" repo="ng-github-button"></github-button>
```

| Name    | Type           | Default  | Summary |
| ------- | ------------- | ----- | ----- |
| `type` | `stargazers,subscribers,forks` | - | - |
| `size` | `default,large` | - | - |
| `namespace` | `string` | - | Your GitHub id or organization name. |
| `repo` | `string` | - | The name of your repository. |
| `showZero` | `boolean` | `false` | Can be show zero value |

## Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/cipchk/ng-github-button/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/cipchk/ng-github-button/blob/master/LICENSE) file for the full text)
