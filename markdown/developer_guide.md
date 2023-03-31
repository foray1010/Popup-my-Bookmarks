## Developer guide

### Before you start

1. We are using [corepack](https://nodejs.org/api/corepack.html) to manage the `yarn` version

   ```sh
   corepack enable
   ```

1. `cd` to your workspace and install all dependencies

   ```sh
   yarn install
   ```

### Commands

1. build

   ```sh
   yarn build
   ```

   To build the whole extension and output a zip file (./build/production/{version_in_package.json}.zip) for uploading to Chrome Web Store

1. dev

   ```sh
   yarn dev
   ```

   To build a temporary folder `build/development` for loading unpacked extension

1. lint

   ```sh
   yarn lint
   ```

   To lint if all files follow our linter config

1. md

   ```sh
   yarn md
   ```

   To generate markdown files

   - `build/store.md` - Description for Chrome Web Store
   - `README.md` - Description for GitHub
