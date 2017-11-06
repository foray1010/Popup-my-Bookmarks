## Developer guide

##### Before you start
1. Install [Node.js](//github.com/nodejs/node) (version >= 8.9) via:
  - [nvm](//github.com/creationix/nvm) (Linux/Mac)
  - [Node.js official website](//nodejs.org/en/download/) (Windows)

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

  To build the whole extension and output a zip file (./__build/[version in package.json].zip) for uploading to Chrome Web Store

2. dev

  ```
  yarn dev
  ```

  To make a temporary folder `__dev` for you to load unpacked extension
  - ES2015-2017 JavaScript to ES5 JavaScript by [Babel](//github.com/babel/babel)
  - CSS4 to CSS3 by [postcss-cssnext](//github.com/MoOx/postcss-cssnext)
  - *.pug to *.html by [Pug](//github.com/pugjs/pug)

3. lint

  ```
  yarn lint
  ```

  To lint
  - ES2015-2017 JavaScript code by [ESLint](//github.com/eslint/eslint)
  - flowtype by [flow](//github.com/facebook/flow)
  - CSS4 code by [Stylelint](//github.com/stylelint/stylelint)

4. md

  ```
  yarn md
  ```

  To generate markdown file on the current directory
  - `__store.md` - Description for Chrome Web Store
  - `README.md` - Description for GitHub
