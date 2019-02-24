# ng-github-button

Unofficial GitHub buttons in Angular.

[![NPM version](https://img.shields.io/npm/v/ng-github-button.svg)](https://www.npmjs.com/package/ng-github-button)
[![Build Status](https://travis-ci.org/cipchk/ng-github-button.svg?branch=master)](https://travis-ci.org/cipchk/ng-github-button)

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
<github-button token="REQUIRED" type="stargazers" size="large" namespace="cipchk" repo="ng-github-button"></github-button>
```

| Name    | Type           | Default  | Summary |
| ------- | ------------- | ----- | ----- |
| `token` | `string` | - | **REQUIRED** To communicate with the GraphQL server, you'll need an OAuth token with the right scopes, [Creating a personal access token for the command line](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) |
| `namespace` | `string` | - | **REQUIRED** Your GitHub id or organization name. |
| `repo` | `string` | - | **REQUIRED** The name of your repository. |
| `type` | `stargazers,subscribers,watchers,forks` | `stargazers`| - |
| `size` | `default,large` | - | - |
| `showZero` | `boolean` | `false` | Can be show zero value |
| `query` | `string` | - | Custom query string in github api v4, pls refer to [GraphQL API v4](https://developer.github.com/v4/guides/) |
| `callback` | `(data: any) => string` | - | Callback in data render |
| `svg` | `string` | - | Icon |

## Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/cipchk/ng-github-button/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/cipchk/ng-github-button/blob/master/LICENSE) file for the full text)
