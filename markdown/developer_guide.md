## Developer guide

##### Before you start
1. Install [Node.js](https://github.com/nodejs/node) (version >= 8.9) via:
  - [nvm](https://github.com/creationix/nvm) (Linux / Mac)
  - [Node.js official website](https://nodejs.org/en/download/) (Windows)

2. Install [yarn](https://github.com/yarnpkg/yarn)

  ```
  npm install -g yarn
  ```

3. `cd` to your workspace and install all dependencies

  ```
  yarn install
  ```

##### Commands
1. build

  ```
  yarn build
  ```

  To build the whole extension and output a zip file (./build/production/[version in package.json].zip) for uploading to Chrome Web Store

2. dev

  ```
  yarn dev
  ```

  To build a temporary folder `build/development` for loading unpacked extension
  - ES2015-2017 JavaScript to ES5 JavaScript by [Babel](https://github.com/babel/babel)
  - CSS4 to CSS3 by [postcss-cssnext](https://github.com/MoOx/postcss-cssnext)

3. lint

  ```
  yarn lint
  ```

  To lint if all files follow our linter config
  - ES2015-2017 JavaScript code by [ESLint](https://github.com/eslint/eslint)
  - flowtype by [flow](https://github.com/facebook/flow)
  - CSS4 code by [Stylelint](https://github.com/stylelint/stylelint)

4. md

  ```
  yarn md
  ```

  To generate markdown files
  - `build/store.md` - Description for Chrome Web Store
  - `README.md` - Description for GitHub
