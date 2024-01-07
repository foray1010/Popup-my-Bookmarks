# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [8.0.0](https://github.com/foray1010/Popup-my-Bookmarks/compare/v7.1.1...v8.0.0) (2024-01-07)

### ⚠ BREAKING CHANGES

- require chrome version >= 108
- require node >=18.12.0
- only support chrome >= 104
- only supports `^16.13.0 || >=18.12.0` nodejs
- require chrome >= 88
- require chrome >= 73 to reduce 6kb gzip build size
- require chrome >= 65 to support `display: contents;`

### Features

- add accent-color to checkbox ([74ed4aa](https://github.com/foray1010/Popup-my-Bookmarks/commit/74ed4aa720332e0f263514555622189a4e7fef5b))
- blur background of `Mask` ([5a283c8](https://github.com/foray1010/Popup-my-Bookmarks/commit/5a283c8433c1764c9c576ff55c334077db5c8505))
- lazy load images and add alt text ([0378908](https://github.com/foray1010/Popup-my-Bookmarks/commit/0378908bb6b07229176f5e08ab6f38d61f510963))
- migrate to Manifest V3 ([25fe2d3](https://github.com/foray1010/Popup-my-Bookmarks/commit/25fe2d31195c3ac284eb3a369cf4379907c09331))
- natural sort in search result and when sort bookmark by name ([b41685d](https://github.com/foray1010/Popup-my-Bookmarks/commit/b41685d3812a7592d3659956d4234ab7a6d77003))
- resize font size in search input based on font size options ([beecdf2](https://github.com/foray1010/Popup-my-Bookmarks/commit/beecdf21218de7023e0305efa898a6c7e007b287))
- resize header font size based on font size options ([084cc5a](https://github.com/foray1010/Popup-my-Bookmarks/commit/084cc5a106cd85a69476e3c3fa5d65126acc6b6e))
- scale the whole UI based on font size ([97bea3c](https://github.com/foray1010/Popup-my-Bookmarks/commit/97bea3c06e3862f1d2540c5d8f027d1aa4f97ecd))
- show higher resolution for bookmark favicon ([97f3a75](https://github.com/foray1010/Popup-my-Bookmarks/commit/97f3a75fb3a6d7002e20ae6227ce1bf2aa5d2344))
- support dark theme color for search and close icon ([fccb1c1](https://github.com/foray1010/Popup-my-Bookmarks/commit/fccb1c13ea0f89b3ade412d2ac9b9e15d666b13c))
- use 2014 Material Design color palettes ([296789d](https://github.com/foray1010/Popup-my-Bookmarks/commit/296789dd066c6ff56a667b474867bca8547e3c1a))
- use system-ui as macOS default font family ([e72305c](https://github.com/foray1010/Popup-my-Bookmarks/commit/e72305c954083dd9bb7ba414d2a1fc8a00f54ee5))

### Bug Fixes

- allow to use ctrl + click to open context menu in macos ([219a71a](https://github.com/foray1010/Popup-my-Bookmarks/commit/219a71acf6d0a92529a287497a258f37fa13883d))
- avoid content jumping when opening menu or editor ([201abd0](https://github.com/foray1010/Popup-my-Bookmarks/commit/201abd05824a9fa5e322c26e8f9a9cbf83ce6c6c))
- cannot create folder properly ([0eeff5d](https://github.com/foray1010/Popup-my-Bookmarks/commit/0eeff5dcb560fdfa4012a1d51b0cf9a6b56b310b))
- cannot execute multiple bookmarklets ([59ec1a1](https://github.com/foray1010/Popup-my-Bookmarks/commit/59ec1a1ae70a260ee5dde4cd2e63e0d9503902ae))
- **deps:** update dependency @babel/runtime to v7.13.9 ([#1450](https://github.com/foray1010/Popup-my-Bookmarks/issues/1450)) ([afde7bc](https://github.com/foray1010/Popup-my-Bookmarks/commit/afde7bc2a5273719bad1daceeb6659465befdbdc))
- **deps:** update dependency @babel/runtime to v7.15.3 ([#1682](https://github.com/foray1010/Popup-my-Bookmarks/issues/1682)) ([1c32cfd](https://github.com/foray1010/Popup-my-Bookmarks/commit/1c32cfd45af176bdd3c6cef86a3adbfec778072c))
- **deps:** update dependency @fontsource/archivo-narrow to v4.2.2 ([7a66740](https://github.com/foray1010/Popup-my-Bookmarks/commit/7a66740e95b85403419a87abd2533e7a3c657c58))
- **deps:** update dependency @fontsource/archivo-narrow to v4.3.0 ([e9cae46](https://github.com/foray1010/Popup-my-Bookmarks/commit/e9cae46d287151b3a6dd36520ebc1dab959a202a))
- **deps:** update dependency @fontsource/archivo-narrow to v4.4.2 ([9910e71](https://github.com/foray1010/Popup-my-Bookmarks/commit/9910e710c7c928db66447264a1897239d82cac8a))
- **deps:** update dependency @fontsource/archivo-narrow to v4.4.5 ([5487ea8](https://github.com/foray1010/Popup-my-Bookmarks/commit/5487ea861146c2eb3ddf4592209f61823a8d560c))
- **deps:** update dependency @fontsource/archivo-narrow to v4.5.1 ([5c180d4](https://github.com/foray1010/Popup-my-Bookmarks/commit/5c180d48f6c2a55c8b004c0eb43d47dd29ea02d3))
- **deps:** update dependency @fontsource/archivo-narrow to v4.5.11 ([52d9260](https://github.com/foray1010/Popup-my-Bookmarks/commit/52d926074e659f29c43d8915ed6a05421ffefb3e))
- **deps:** update dependency @fontsource/archivo-narrow to v4.5.2 ([d7d80d2](https://github.com/foray1010/Popup-my-Bookmarks/commit/d7d80d2189b4aac40705138040878af04be05a21))
- **deps:** update dependency @fontsource/archivo-narrow to v4.5.3 ([e8ddec3](https://github.com/foray1010/Popup-my-Bookmarks/commit/e8ddec383cb9ea678fca71d308b622cfd942d709))
- **deps:** update dependency @fontsource/archivo-narrow to v4.5.4 ([bc2644d](https://github.com/foray1010/Popup-my-Bookmarks/commit/bc2644d5634c49ce5fc8670b645b1c25ad5ac710))
- **deps:** update dependency @fontsource/archivo-narrow to v4.5.7 ([352433e](https://github.com/foray1010/Popup-my-Bookmarks/commit/352433e240701bad044f55415811063134f7b3e2))
- **deps:** update dependency @fontsource/archivo-narrow to v4.5.8 ([de167cd](https://github.com/foray1010/Popup-my-Bookmarks/commit/de167cd41b6828e0db6ebace8e5bc65b8fd943b7))
- **deps:** update dependency @fontsource/archivo-narrow to v4.5.9 ([7b2ac9f](https://github.com/foray1010/Popup-my-Bookmarks/commit/7b2ac9f9b786c9c2a1b7869d8874c41ec445c10d))
- **deps:** update dependency @fontsource/archivo-narrow to v5.0.13 ([7e7d319](https://github.com/foray1010/Popup-my-Bookmarks/commit/7e7d319aa2d6f1aa01c736b68d4ad79b043cdde4))
- **deps:** update dependency @fontsource/archivo-narrow to v5.0.15 ([f969ccb](https://github.com/foray1010/Popup-my-Bookmarks/commit/f969ccb8025c46cd0320eba5b6e886ad82bdcc46))
- **deps:** update dependency @tanstack/react-query to v4.1.3 ([1519827](https://github.com/foray1010/Popup-my-Bookmarks/commit/1519827f7d4afedf6c417c75246a63a0bae51046))
- **deps:** update dependency @tanstack/react-query to v4.2.1 ([1e1b400](https://github.com/foray1010/Popup-my-Bookmarks/commit/1e1b400b888a1a02b8c440da400ca42e5f081ec3))
- **deps:** update dependency @tanstack/react-query to v4.2.3 ([f4c8e0e](https://github.com/foray1010/Popup-my-Bookmarks/commit/f4c8e0ee6f43d2dc07cf46e8c5a1ebe1e1083cb7))
- **deps:** update dependency @tanstack/react-query to v4.3.4 ([ca713ec](https://github.com/foray1010/Popup-my-Bookmarks/commit/ca713ecb8aadf2419209b18c77d0d8c2dfdc22af))
- **deps:** update dependency @tanstack/react-query-devtools to v4.2.3 ([4eb5292](https://github.com/foray1010/Popup-my-Bookmarks/commit/4eb5292aefd7a39ae016c89e89720d22587c1b3b))
- **deps:** update dependency @tanstack/react-virtual to v3.0.0-beta.63 ([b01cf80](https://github.com/foray1010/Popup-my-Bookmarks/commit/b01cf803d0570c40770c689ee55b37eb80b5e0df))
- **deps:** update dependency @tanstack/react-virtual to v3.0.0-beta.65 ([547331c](https://github.com/foray1010/Popup-my-Bookmarks/commit/547331c96d94f396db4f6797948700782afa3f12))
- **deps:** update dependency classix to v2.1.35 ([52bdb8e](https://github.com/foray1010/Popup-my-Bookmarks/commit/52bdb8e862500dc53705edad800423e47b54d268))
- **deps:** update dependency clsx to v1.2.1 ([3bbb456](https://github.com/foray1010/Popup-my-Bookmarks/commit/3bbb456214b68a496458d0f038cdeb2da6846a4d))
- **deps:** update dependency constate to v3 ([490806b](https://github.com/foray1010/Popup-my-Bookmarks/commit/490806b75f0aa4c5296ac014174057a5e1e468ad))
- **deps:** update dependency constate to v3.1.0 ([994d718](https://github.com/foray1010/Popup-my-Bookmarks/commit/994d718c9544c9ad412141fff1d9655a344d08d2))
- **deps:** update dependency constate to v3.3.0 ([495ad3b](https://github.com/foray1010/Popup-my-Bookmarks/commit/495ad3b571387294b480799573c8e1252db81c9a))
- **deps:** update dependency core-js to v3.22.2 ([73e2c99](https://github.com/foray1010/Popup-my-Bookmarks/commit/73e2c99533339667e5a784eeb8d32e97da650985))
- **deps:** update dependency core-js to v3.22.4 ([c45a76b](https://github.com/foray1010/Popup-my-Bookmarks/commit/c45a76b0900b2e26009d14f8652580215af9b0df))
- **deps:** update dependency core-js to v3.22.5 ([d5352a9](https://github.com/foray1010/Popup-my-Bookmarks/commit/d5352a9d1d9ab60ddb78c90a8f3ef04af8cc4bab))
- **deps:** update dependency core-js to v3.22.7 ([d7dfcb5](https://github.com/foray1010/Popup-my-Bookmarks/commit/d7dfcb59f682bb34f6467198eac3385e4a659137))
- **deps:** update dependency core-js to v3.22.8 ([f95959b](https://github.com/foray1010/Popup-my-Bookmarks/commit/f95959b05109702ccb6a7ee61e7011f3608a83b5))
- **deps:** update dependency core-js to v3.23.3 ([070a409](https://github.com/foray1010/Popup-my-Bookmarks/commit/070a4093c2895ea2eb3017b5c124b63eb6c1fc2a))
- **deps:** update dependency core-js to v3.23.4 ([b15b744](https://github.com/foray1010/Popup-my-Bookmarks/commit/b15b744039b0241c860a26a48f4caef99c7d23f8))
- **deps:** update dependency core-js to v3.23.5 ([fa7aba4](https://github.com/foray1010/Popup-my-Bookmarks/commit/fa7aba4980bfe92155728b8a38fedf064688054b))
- **deps:** update dependency core-js to v3.25.0 ([b663d48](https://github.com/foray1010/Popup-my-Bookmarks/commit/b663d48d5cae69c71cf5f7494cb0e0d554f592c7))
- **deps:** update dependency core-js to v3.25.1 ([a3c974d](https://github.com/foray1010/Popup-my-Bookmarks/commit/a3c974d5b21c96e068fb17449768c51efa52dd05))
- **deps:** update dependency core-js to v3.27.0 ([5a8cd1d](https://github.com/foray1010/Popup-my-Bookmarks/commit/5a8cd1d3ad47649257205e9412684c480e81ac00))
- **deps:** update dependency core-js to v3.27.1 ([0c9fbce](https://github.com/foray1010/Popup-my-Bookmarks/commit/0c9fbcedce1fd5d21931322fe2b9ce95bd9484c7))
- **deps:** update dependency core-js to v3.32.1 ([3e278b0](https://github.com/foray1010/Popup-my-Bookmarks/commit/3e278b01e449d7343d53928e641a0968e326ddfa))
- **deps:** update dependency core-js to v3.33.0 ([8c7124c](https://github.com/foray1010/Popup-my-Bookmarks/commit/8c7124c7875b542564376a2740558926be218b11))
- **deps:** update dependency immer to v9.0.14 ([8094a11](https://github.com/foray1010/Popup-my-Bookmarks/commit/8094a115571ec49fe2a27ca1367cf9eb46b40de7))
- **deps:** update dependency immer to v9.0.17 ([edce73b](https://github.com/foray1010/Popup-my-Bookmarks/commit/edce73be2e98a254a6b10d4c9700338f0bfbd5ea))
- **deps:** update dependency nanoid to v3.1.16 ([69d75d9](https://github.com/foray1010/Popup-my-Bookmarks/commit/69d75d98f47880114dc92860b36e64faaa90b80f))
- **deps:** update dependency nanoid to v3.1.18 ([aa655ad](https://github.com/foray1010/Popup-my-Bookmarks/commit/aa655ad176cb3a9445069f523220918dd5da4e81))
- **deps:** update dependency nanoid to v3.1.20 ([81b1dcc](https://github.com/foray1010/Popup-my-Bookmarks/commit/81b1dccc37824b93c6c69200c2bd694c8ad5d5b1))
- **deps:** update dependency nanoid to v3.1.22 ([88bac5a](https://github.com/foray1010/Popup-my-Bookmarks/commit/88bac5a6ef85d2168841c2fb851fce53e36a40d3))
- **deps:** update dependency nanoid to v3.1.23 ([301df5f](https://github.com/foray1010/Popup-my-Bookmarks/commit/301df5fcfffcbf30be0c0b97315ad56dee774efb))
- **deps:** update dependency nanoid to v3.1.25 ([19744d7](https://github.com/foray1010/Popup-my-Bookmarks/commit/19744d7382fba9796bef3d050bb684cb7e405170))
- **deps:** update dependency nanoid to v3.1.28 ([0b19f34](https://github.com/foray1010/Popup-my-Bookmarks/commit/0b19f346af70d4262137708e1ae6f168a7788eca))
- **deps:** update dependency nanoid to v3.1.29 ([f463aea](https://github.com/foray1010/Popup-my-Bookmarks/commit/f463aeafa74230751ae157b160e8a94d0692ef35))
- **deps:** update dependency nanoid to v3.1.30 ([2ed864c](https://github.com/foray1010/Popup-my-Bookmarks/commit/2ed864c1fad26590e64d4d6d323090d346b9529b))
- **deps:** update dependency nanoid to v3.1.32 ([9c5a303](https://github.com/foray1010/Popup-my-Bookmarks/commit/9c5a3036e95d05cae305670d31ef9c3ef46d7f7e))
- **deps:** update dependency nanoid to v3.1.7 ([fa4c7b0](https://github.com/foray1010/Popup-my-Bookmarks/commit/fa4c7b0ab4b60db28d2ec260c0c2bc8859867c83))
- **deps:** update dependency nanoid to v3.1.9 ([0346126](https://github.com/foray1010/Popup-my-Bookmarks/commit/0346126c4a2bf2681fabcc8f1281592e8bf17926))
- **deps:** update dependency nanoid to v3.2.0 ([1d4cf53](https://github.com/foray1010/Popup-my-Bookmarks/commit/1d4cf53dfaa102c9576fd16983c0c1a7730959f3))
- **deps:** update dependency nanoid to v3.3.1 ([8287a4d](https://github.com/foray1010/Popup-my-Bookmarks/commit/8287a4d872eba50c595446820849c62eacd74c75))
- **deps:** update dependency nanoid to v3.3.2 ([7c84e76](https://github.com/foray1010/Popup-my-Bookmarks/commit/7c84e764997905d4df34afcd2fec33c96a161b74))
- **deps:** update dependency nanoid to v3.3.4 ([7d5416b](https://github.com/foray1010/Popup-my-Bookmarks/commit/7d5416bb6a0818eef04e46535e6bd5d8d5f77cb0))
- **deps:** update dependency ramda to v0.28.0 ([67b0937](https://github.com/foray1010/Popup-my-Bookmarks/commit/67b09371406f2ddfafc38a358408079bd1678123))
- **deps:** update dependency react-hook-form to v6.13.1 ([907e5a5](https://github.com/foray1010/Popup-my-Bookmarks/commit/907e5a5778fe1329eaa9c6f9b4d2f6bc9991b987))
- **deps:** update dependency react-hook-form to v6.14.0 ([74ae99f](https://github.com/foray1010/Popup-my-Bookmarks/commit/74ae99f873adc9b6319b4cbe48deaf0194180ab5))
- **deps:** update dependency react-hook-form to v6.14.1 ([c70d3fb](https://github.com/foray1010/Popup-my-Bookmarks/commit/c70d3fbb9ec82c416c81d3442a61d38fc424e693))
- **deps:** update dependency react-hook-form to v6.14.2 ([ed50d7b](https://github.com/foray1010/Popup-my-Bookmarks/commit/ed50d7b0921de93a28ef7cc1a8fd2051289f41c3))
- **deps:** update dependency react-hook-form to v6.15.1 ([8650a37](https://github.com/foray1010/Popup-my-Bookmarks/commit/8650a37874a90e7523b9636f2df1f68addaeee9b))
- **deps:** update dependency react-hook-form to v6.15.4 ([7d44ddc](https://github.com/foray1010/Popup-my-Bookmarks/commit/7d44ddc399706572c9e565cfe93cbe2383dc1b83))
- **deps:** update dependency react-hook-form to v6.15.5 ([bd7708c](https://github.com/foray1010/Popup-my-Bookmarks/commit/bd7708c0348acf6a71eb1b7d0b2d0cb048f282ef))
- **deps:** update dependency react-hook-form to v7.10.1 ([efd043d](https://github.com/foray1010/Popup-my-Bookmarks/commit/efd043d318d49e49805dae30c0ab61d429abdecb))
- **deps:** update dependency react-hook-form to v7.11.0 ([6261f32](https://github.com/foray1010/Popup-my-Bookmarks/commit/6261f32af8e6c3a06141dc152cfecf4463d50fe8))
- **deps:** update dependency react-hook-form to v7.11.1 ([e9f5311](https://github.com/foray1010/Popup-my-Bookmarks/commit/e9f5311ff9288003d3348fd47e1baf3361501ce0))
- **deps:** update dependency react-hook-form to v7.12.1 ([c2b8727](https://github.com/foray1010/Popup-my-Bookmarks/commit/c2b87278bd6b8760f5175706465158d8ffd3096f))
- **deps:** update dependency react-hook-form to v7.12.2 ([ff58687](https://github.com/foray1010/Popup-my-Bookmarks/commit/ff5868793610fdff7119adc09de692dc989db20f))
- **deps:** update dependency react-hook-form to v7.13.0 ([ad47ee3](https://github.com/foray1010/Popup-my-Bookmarks/commit/ad47ee3ae5fbeeb41b9ee414a8f3ae65207bdbe9))
- **deps:** update dependency react-hook-form to v7.14.2 ([4dec370](https://github.com/foray1010/Popup-my-Bookmarks/commit/4dec3702a225f965797c0a44f58ddfcb36c59866))
- **deps:** update dependency react-hook-form to v7.15.3 ([5f8f4dd](https://github.com/foray1010/Popup-my-Bookmarks/commit/5f8f4dd506a9dfcfa5d3855def678c226fd43f00))
- **deps:** update dependency react-hook-form to v7.15.4 ([8801870](https://github.com/foray1010/Popup-my-Bookmarks/commit/8801870d6a9ee63248566eccb2d4e4d41535fea8))
- **deps:** update dependency react-hook-form to v7.17.4 ([fa5f8c1](https://github.com/foray1010/Popup-my-Bookmarks/commit/fa5f8c168ff46f4d17691836270de374fe8c5084))
- **deps:** update dependency react-hook-form to v7.17.5 ([0f2b2a0](https://github.com/foray1010/Popup-my-Bookmarks/commit/0f2b2a01c7108d03f0b3a736ed60220d238925a5))
- **deps:** update dependency react-hook-form to v7.18.0 ([6c94ece](https://github.com/foray1010/Popup-my-Bookmarks/commit/6c94ecee04ce9d8cc21d8e072a0a16db866ef228))
- **deps:** update dependency react-hook-form to v7.19.5 ([905a11b](https://github.com/foray1010/Popup-my-Bookmarks/commit/905a11b875719f0e267a766c0d156d9e5461f137))
- **deps:** update dependency react-hook-form to v7.20.2 ([4235e8e](https://github.com/foray1010/Popup-my-Bookmarks/commit/4235e8eb51e3dc6d3d868cad6341ff35d6bb9345))
- **deps:** update dependency react-hook-form to v7.20.4 ([d493b51](https://github.com/foray1010/Popup-my-Bookmarks/commit/d493b519d40d78d01599f00f0518d7bfa4e7cf17))
- **deps:** update dependency react-hook-form to v7.20.5 ([c7ed196](https://github.com/foray1010/Popup-my-Bookmarks/commit/c7ed196ed9208a1b018225e7cc80be993e4725e0))
- **deps:** update dependency react-hook-form to v7.21.0 ([4acfab3](https://github.com/foray1010/Popup-my-Bookmarks/commit/4acfab3e032f9ee1aacc6574be671db298eabd08))
- **deps:** update dependency react-hook-form to v7.22.2 ([6d5ea36](https://github.com/foray1010/Popup-my-Bookmarks/commit/6d5ea361b12e8699dcd30f793893da65c4cc66fb))
- **deps:** update dependency react-hook-form to v7.22.5 ([307ebec](https://github.com/foray1010/Popup-my-Bookmarks/commit/307ebec7c78e43223d71136f4e4a0aab222b4fb4))
- **deps:** update dependency react-hook-form to v7.24.0 ([e405e69](https://github.com/foray1010/Popup-my-Bookmarks/commit/e405e699bf73c31557b4c8b80c3e4417ef0c6522))
- **deps:** update dependency react-hook-form to v7.25.3 ([1463cc9](https://github.com/foray1010/Popup-my-Bookmarks/commit/1463cc9576a19bf526bbddaf5f799671cd66ce7f))
- **deps:** update dependency react-hook-form to v7.27.0 ([6c06a74](https://github.com/foray1010/Popup-my-Bookmarks/commit/6c06a74dc6ca0039d8233b8ab5e4db748c4c13ff))
- **deps:** update dependency react-hook-form to v7.27.1 ([333ef59](https://github.com/foray1010/Popup-my-Bookmarks/commit/333ef5930fff7f781e40723dacc1e5d309f8c665))
- **deps:** update dependency react-hook-form to v7.28.0 ([fcc1300](https://github.com/foray1010/Popup-my-Bookmarks/commit/fcc1300ddc0b03eba47fed9f5519d9fa46a3ce89))
- **deps:** update dependency react-hook-form to v7.28.1 ([d825a19](https://github.com/foray1010/Popup-my-Bookmarks/commit/d825a19037308d5f3c630fe6a75555fc986878f3))
- **deps:** update dependency react-hook-form to v7.29.0 ([fcc8e11](https://github.com/foray1010/Popup-my-Bookmarks/commit/fcc8e11fb4f6556a491826a3de54c6e38c884ba2))
- **deps:** update dependency react-hook-form to v7.31.3 ([47377ab](https://github.com/foray1010/Popup-my-Bookmarks/commit/47377ab9ccbda4e0f3d62348c2c34b8625549c2f))
- **deps:** update dependency react-hook-form to v7.33.1 ([8ff7d96](https://github.com/foray1010/Popup-my-Bookmarks/commit/8ff7d962494754fe803db12bf9769e207a4cfb5d))
- **deps:** update dependency react-hook-form to v7.34.0 ([0397abc](https://github.com/foray1010/Popup-my-Bookmarks/commit/0397abc618d2c008e339e5678542eccdd634afe3))
- **deps:** update dependency react-hook-form to v7.34.2 ([c25c4c1](https://github.com/foray1010/Popup-my-Bookmarks/commit/c25c4c16928917f6b51af0966f1cf637ffccee3e))
- **deps:** update dependency react-hook-form to v7.35.0 ([9715cb6](https://github.com/foray1010/Popup-my-Bookmarks/commit/9715cb6918d385d043a1ab054d00edf0e8129051))
- **deps:** update dependency react-hook-form to v7.40.0 ([23047ba](https://github.com/foray1010/Popup-my-Bookmarks/commit/23047ba50c16e22fcfc1329a0957c9fd2e360443))
- **deps:** update dependency react-hook-form to v7.43.1 ([47cabb4](https://github.com/foray1010/Popup-my-Bookmarks/commit/47cabb4c73e4533c54ee3e0c8f04aad9f921c853))
- **deps:** update dependency react-hook-form to v7.47.0 ([84ea3c0](https://github.com/foray1010/Popup-my-Bookmarks/commit/84ea3c0c22683de988a1a45840d45dcc10b8dd8a))
- **deps:** update dependency react-hook-form to v7.7.1 ([16163a6](https://github.com/foray1010/Popup-my-Bookmarks/commit/16163a6ba7c662e02415846fe0c7cd25b77d192a))
- **deps:** update dependency react-hook-form to v7.8.4 ([ee49b90](https://github.com/foray1010/Popup-my-Bookmarks/commit/ee49b9052a71190c64e4d716602dbaa93daac3f8))
- **deps:** update dependency react-hook-form to v7.9.0 ([3dcb516](https://github.com/foray1010/Popup-my-Bookmarks/commit/3dcb516adacb605b12c5275164a6df5ec1c51221))
- **deps:** update dependency react-query to v3.12.0 ([ca37ad7](https://github.com/foray1010/Popup-my-Bookmarks/commit/ca37ad79cc8d321bd1534606c7ea721e6e34d5cc))
- **deps:** update dependency react-query to v3.13.0 ([27b6854](https://github.com/foray1010/Popup-my-Bookmarks/commit/27b68548606bef40574cbf5299612f3d391b8348))
- **deps:** update dependency react-query to v3.13.10 ([c790ebb](https://github.com/foray1010/Popup-my-Bookmarks/commit/c790ebbc8311ed67a1fb779970ebb487ee0e79ff))
- **deps:** update dependency react-query to v3.13.4 ([af8522b](https://github.com/foray1010/Popup-my-Bookmarks/commit/af8522bea73702b343fbec4609d55cf6f787a0bc))
- **deps:** update dependency react-query to v3.13.9 ([511f289](https://github.com/foray1010/Popup-my-Bookmarks/commit/511f28920b28f104c316a3708fceef944c6c411b))
- **deps:** update dependency react-query to v3.15.2 ([7cefa94](https://github.com/foray1010/Popup-my-Bookmarks/commit/7cefa94050bfb3c76d280e93ef479ac214b3b158))
- **deps:** update dependency react-query to v3.16.0 ([f436031](https://github.com/foray1010/Popup-my-Bookmarks/commit/f43603172c7ad7933db238b32157c9eb385a9075))
- **deps:** update dependency react-query to v3.16.1 ([ca40a07](https://github.com/foray1010/Popup-my-Bookmarks/commit/ca40a079e7b08b1760750fc17360cfb9d9a54d25))
- **deps:** update dependency react-query to v3.17.0 ([0e26f06](https://github.com/foray1010/Popup-my-Bookmarks/commit/0e26f06366ce4fe34514a0208df17f9fe68cbf87))
- **deps:** update dependency react-query to v3.17.2 ([ba771c7](https://github.com/foray1010/Popup-my-Bookmarks/commit/ba771c7cf93257236182530e17731e0095bb3fe3))
- **deps:** update dependency react-query to v3.18.1 ([cfc1b17](https://github.com/foray1010/Popup-my-Bookmarks/commit/cfc1b17fb73642b1cad2427fbf3f258b4b4f8107))
- **deps:** update dependency react-query to v3.19.0 ([6bc38ce](https://github.com/foray1010/Popup-my-Bookmarks/commit/6bc38ce7981932d20e7f38d4d9575c05cc2f4bc2))
- **deps:** update dependency react-query to v3.19.1 ([aabf8f4](https://github.com/foray1010/Popup-my-Bookmarks/commit/aabf8f4da84607887dca102045af2e69af43f4e8))
- **deps:** update dependency react-query to v3.19.2 ([6914c33](https://github.com/foray1010/Popup-my-Bookmarks/commit/6914c33857195388e703739713ca6e19af1f6a49))
- **deps:** update dependency react-query to v3.19.6 ([7831fd0](https://github.com/foray1010/Popup-my-Bookmarks/commit/7831fd09107a73ba7dcf0949004490f34ca41a60))
- **deps:** update dependency react-query to v3.21.0 ([57ec0b2](https://github.com/foray1010/Popup-my-Bookmarks/commit/57ec0b2b7b042a05ca9ab86a3bc4086dbfc8f182))
- **deps:** update dependency react-query to v3.21.1 ([21ccff5](https://github.com/foray1010/Popup-my-Bookmarks/commit/21ccff56e303e96d68bf97835b8dfc2b587f2dd7))
- **deps:** update dependency react-query to v3.23.2 ([437e845](https://github.com/foray1010/Popup-my-Bookmarks/commit/437e845efff6202cc6d7ca31650e47b793a59a20))
- **deps:** update dependency react-query to v3.24.4 ([4b3fdd7](https://github.com/foray1010/Popup-my-Bookmarks/commit/4b3fdd7bd9266852f0fba572e9053e81a67d921d))
- **deps:** update dependency react-query to v3.25.1 ([7236226](https://github.com/foray1010/Popup-my-Bookmarks/commit/7236226a26f1588bf740c8ef3958f44526e1a84f))
- **deps:** update dependency react-query to v3.27.0 ([16a7800](https://github.com/foray1010/Popup-my-Bookmarks/commit/16a78009c7d9a96506603f064eeccc329b15e3dc))
- **deps:** update dependency react-query to v3.31.0 ([ae4ac8a](https://github.com/foray1010/Popup-my-Bookmarks/commit/ae4ac8a0ed51eec13fb4bafec60ebba8c419ea26))
- **deps:** update dependency react-query to v3.32.1 ([42cb73e](https://github.com/foray1010/Popup-my-Bookmarks/commit/42cb73efaf3c31fd4f9dd7bf54e3f9c67c9763d0))
- **deps:** update dependency react-query to v3.32.3 ([a8b9691](https://github.com/foray1010/Popup-my-Bookmarks/commit/a8b9691fd3ded6cd0a3aecefe39733c31bba9d81))
- **deps:** update dependency react-query to v3.34.0 ([236cd49](https://github.com/foray1010/Popup-my-Bookmarks/commit/236cd49f9b12e957253b21442b09771e33609e07))
- **deps:** update dependency react-query to v3.34.12 ([8006e33](https://github.com/foray1010/Popup-my-Bookmarks/commit/8006e33b0e1f8564aed90f5aa1c802d857efea5f))
- **deps:** update dependency react-query to v3.34.14 ([c165dbf](https://github.com/foray1010/Popup-my-Bookmarks/commit/c165dbf71ff07ea9f5f83a70d33391e2b3b4cb23))
- **deps:** update dependency react-query to v3.34.15 ([eba530a](https://github.com/foray1010/Popup-my-Bookmarks/commit/eba530ad1dc3a439b2ebc741a20b6c87699057d7))
- **deps:** update dependency react-query to v3.34.16 ([188524a](https://github.com/foray1010/Popup-my-Bookmarks/commit/188524aac8c7a7fe2ef82824f00b3d1270fda8c2))
- **deps:** update dependency react-query to v3.34.5 ([15eee8b](https://github.com/foray1010/Popup-my-Bookmarks/commit/15eee8b963ceb5755043ddaf9b2037be472ea7b6))
- **deps:** update dependency react-query to v3.34.7 ([18a014a](https://github.com/foray1010/Popup-my-Bookmarks/commit/18a014af5fe388a1982fb16f7e3acce3a5d03b65))
- **deps:** update dependency react-query to v3.34.8 ([de62696](https://github.com/foray1010/Popup-my-Bookmarks/commit/de626969db394df9394ad94b474ace88774ddf23))
- **deps:** update dependency react-query to v3.38.0 ([313d239](https://github.com/foray1010/Popup-my-Bookmarks/commit/313d23946e556430094b060ec60abb4fb5f41818))
- **deps:** update dependency react-query to v3.38.1 ([f2847ec](https://github.com/foray1010/Popup-my-Bookmarks/commit/f2847ec3fc6c761ab9b92ec9d1fd951ed9bc62ba))
- **deps:** update dependency react-query to v3.39.1 ([fb62e5c](https://github.com/foray1010/Popup-my-Bookmarks/commit/fb62e5c141e9c1c75b213c0cf9399ee89bdafc66))
- **deps:** update dependency react-query to v3.39.2 ([ac64460](https://github.com/foray1010/Popup-my-Bookmarks/commit/ac64460474c792bbb142bd491e28123ab10657e8))
- **deps:** update dependency react-query to v3.5.11 ([3953ed7](https://github.com/foray1010/Popup-my-Bookmarks/commit/3953ed7beb88ca2ace578adb7e769cb59641d71f))
- **deps:** update dependency react-query to v3.5.12 ([319fbbe](https://github.com/foray1010/Popup-my-Bookmarks/commit/319fbbe1d56c8069b0d9308c46c07f9d219dc640))
- **deps:** update dependency react-query to v3.5.16 ([114cd2e](https://github.com/foray1010/Popup-my-Bookmarks/commit/114cd2ea1015318a09c67b45e807fcd6b9f00597))
- **deps:** update dependency react-query to v3.5.5 ([80c2816](https://github.com/foray1010/Popup-my-Bookmarks/commit/80c2816e61ae37f6e1709ae2a0ca91f472eb5082))
- **deps:** update dependency react-query to v3.5.9 ([e99a96a](https://github.com/foray1010/Popup-my-Bookmarks/commit/e99a96abb2a4765d7f0ef366de1ef9255005e7f1))
- **deps:** update dependency react-query to v3.6.0 ([674af2b](https://github.com/foray1010/Popup-my-Bookmarks/commit/674af2b525f3795a24d1df44ceb20298bfabe51a))
- **deps:** update dependency react-query to v3.8.2 ([ea3c68b](https://github.com/foray1010/Popup-my-Bookmarks/commit/ea3c68b079761c3f7fd722e46ff6b43dbfc23fe7))
- **deps:** update dependency react-query to v3.9.8 ([64ddb77](https://github.com/foray1010/Popup-my-Bookmarks/commit/64ddb776648355aed83d743688ee83a24351544d))
- **deps:** update dependency react-redux to v7.2.1 ([b8dfcd3](https://github.com/foray1010/Popup-my-Bookmarks/commit/b8dfcd350283acb0e4820734c94a43a9d694524a))
- **deps:** update dependency react-redux to v7.2.2 ([ca2b49f](https://github.com/foray1010/Popup-my-Bookmarks/commit/ca2b49f7ff2ea4ac12f07ea707708a91180722fd))
- **deps:** update dependency react-redux to v7.2.3 ([834d538](https://github.com/foray1010/Popup-my-Bookmarks/commit/834d538b6c9545a11abb171debb2127f4977efd2))
- **deps:** update dependency react-redux to v7.2.5 ([8efda70](https://github.com/foray1010/Popup-my-Bookmarks/commit/8efda70686a86b485a20eda3bbc57cfb6a853b4e))
- **deps:** update dependency react-virtual to v2.10.0 ([73110f7](https://github.com/foray1010/Popup-my-Bookmarks/commit/73110f763351c7a80fc79669bcd4554448f68cab))
- **deps:** update dependency react-virtual to v2.10.4 ([cf034b9](https://github.com/foray1010/Popup-my-Bookmarks/commit/cf034b9b5f39bec908329b68d429fe619c398c5b))
- **deps:** update dependency react-virtual to v2.3.2 ([0bbcdb9](https://github.com/foray1010/Popup-my-Bookmarks/commit/0bbcdb99ec618337f4badbe327e7a29a2bb8c747))
- **deps:** update dependency react-virtual to v2.4.0 ([1b14d46](https://github.com/foray1010/Popup-my-Bookmarks/commit/1b14d4631a96791c02d946ab7373ae382c462114))
- **deps:** update dependency react-virtual to v2.7.1 ([a673792](https://github.com/foray1010/Popup-my-Bookmarks/commit/a6737926c596d0ed499a659ae35ae8b7576edb2d))
- **deps:** update dependency react-virtual to v2.7.2 ([7707b11](https://github.com/foray1010/Popup-my-Bookmarks/commit/7707b11b9f9c684608f40f889acdbc5c3ecd7522))
- **deps:** update dependency react-virtual to v2.8.0 ([5bcdfdb](https://github.com/foray1010/Popup-my-Bookmarks/commit/5bcdfdbad2be53e4e340fc1b7dd9d164683d6fca))
- **deps:** update dependency react-virtual to v2.8.1 ([6771925](https://github.com/foray1010/Popup-my-Bookmarks/commit/677192551ea0249e7995536c65cdb0a4c4d9faff))
- **deps:** update dependency react-virtual to v2.8.2 ([66dbc81](https://github.com/foray1010/Popup-my-Bookmarks/commit/66dbc81e2c277375c47ce03f1d4a0a69adf09f3c))
- **deps:** update dependency react-window to v1.8.6 ([166c4e4](https://github.com/foray1010/Popup-my-Bookmarks/commit/166c4e4bca9423ef8459cedd335eb001527c16d5))
- **deps:** update dependency redux to v4.1.1 ([#1673](https://github.com/foray1010/Popup-my-Bookmarks/issues/1673)) ([921ffb6](https://github.com/foray1010/Popup-my-Bookmarks/commit/921ffb69a02c63238c3f69aa30184886c155dd13))
- **deps:** update dependency typeface-archivo-narrow to v1.1.13 ([de78f29](https://github.com/foray1010/Popup-my-Bookmarks/commit/de78f2962a734c76d5b15bf15a4b40fae431c4fa))
- **deps:** update dependency use-debounce to v9 ([1d62655](https://github.com/foray1010/Popup-my-Bookmarks/commit/1d6265527b9edac44034397c512123da1ff865e2))
- **deps:** update dependency use-resize-observer to v9 ([3a64c4c](https://github.com/foray1010/Popup-my-Bookmarks/commit/3a64c4c35c5b15e9779b27738ac1ecad2954b183))
- **deps:** update dependency webextension-polyfill to v0.10.0 ([9585bd2](https://github.com/foray1010/Popup-my-Bookmarks/commit/9585bd2ef7dd4b58cb4ef767cb0849d06807cfe0))
- **deps:** update dependency webextension-polyfill to v0.7.0 ([49ce591](https://github.com/foray1010/Popup-my-Bookmarks/commit/49ce5914bc98f11095e8d7d85626899ecb08c49e))
- **deps:** update dependency webextension-polyfill to v0.8.0 ([519d554](https://github.com/foray1010/Popup-my-Bookmarks/commit/519d554aa51f7b129e3f80ab7dad3b6a2c78e4c7))
- **deps:** update dependency webextension-polyfill to v0.9.0 ([6105a84](https://github.com/foray1010/Popup-my-Bookmarks/commit/6105a84e6a338fecd239734a167320ef51315b7c))
- **deps:** update react monorepo to v16.14.0 ([b60ffc6](https://github.com/foray1010/Popup-my-Bookmarks/commit/b60ffc65cfe50d8141a16767fcc5e440b7aac4b5))
- **deps:** update react monorepo to v17 ([21178d8](https://github.com/foray1010/Popup-my-Bookmarks/commit/21178d8089bd5dba060866c520b078aa5567b598))
- **deps:** update tanstack-query monorepo to v4.26.1 ([3095bdc](https://github.com/foray1010/Popup-my-Bookmarks/commit/3095bdc6a72fab30b894d652bc9526b40a3ca5ba))
- **deps:** update tanstack-query monorepo to v4.33.0 ([961f5f4](https://github.com/foray1010/Popup-my-Bookmarks/commit/961f5f466c27cce7f2eb5dd53c1caedb870d7450))
- **deps:** update tanstack-query monorepo to v4.36.1 ([7f473de](https://github.com/foray1010/Popup-my-Bookmarks/commit/7f473de67b38aef6d89322894b30364ce00e0704))
- do not search during IME composition ([d13d028](https://github.com/foray1010/Popup-my-Bookmarks/commit/d13d02803829622e96525b2c497c49a4c7a73929))
- does not close the popup when opening all bookmarks in an empty folder ([4a97676](https://github.com/foray1010/Popup-my-Bookmarks/commit/4a9767676efe3b34d07ba1b52ca0dd3690d7dc00))
- editor does not show in correct location ([b9db7b5](https://github.com/foray1010/Popup-my-Bookmarks/commit/b9db7b50509edb7192a254c1b6e53df8a59d752c))
- improve dragging sensitivity ([0f57b9e](https://github.com/foray1010/Popup-my-Bookmarks/commit/0f57b9e2f05724574d43a82d972553244d8912cb))
- mark input fields in options as required ([21664c5](https://github.com/foray1010/Popup-my-Bookmarks/commit/21664c5fc26f8a2aeab88226d9a36455980d0cd5))
- options page select font size is too large ([a94dc7e](https://github.com/foray1010/Popup-my-Bookmarks/commit/a94dc7ec0d7b844bc41621f2b76eb4b34e7094ca))
- should not cover search bar by 3rd level bookmark tree ([ec5dada](https://github.com/foray1010/Popup-my-Bookmarks/commit/ec5dada5bcdc18120cd96ee437ed4a7f181e36ff))

### build

- require chrome >= 73 to reduce 6kb gzip build size ([3068fbb](https://github.com/foray1010/Popup-my-Bookmarks/commit/3068fbbf51d2f19a5904c798d13fcb89650cea05))

- fix stylelint errors ([4344525](https://github.com/foray1010/Popup-my-Bookmarks/commit/43445255c66a934e94c0681a4fade11a305dce0f))
- only supports `^16.13.0 || >=18.12.0` nodejs ([4b50354](https://github.com/foray1010/Popup-my-Bookmarks/commit/4b503544a8db69ea0e2e0eca5a8e85476b2653e9))
- require chrome >= 88 ([e0ef577](https://github.com/foray1010/Popup-my-Bookmarks/commit/e0ef5775a632dd81d2c2f0c5de5ffb739ab45c83))
- require node >=18.12.0 ([dc274bf](https://github.com/foray1010/Popup-my-Bookmarks/commit/dc274bfd5b693bc6b05b33f66a8e8604b705b5fb))
- split PlainList and StyleslessElement ([e031aa8](https://github.com/foray1010/Popup-my-Bookmarks/commit/e031aa81effe1eaac4b2f01eabb57debb6b7d82f))

### [7.1.1](https://github.com/foray1010/Popup-my-Bookmarks/compare/v7.1.0...v7.1.1) (2020-11-27)

### Bug Fixes

- chrome does not show spanish translation ([123710b](https://github.com/foray1010/Popup-my-Bookmarks/commit/123710b271e1f61950cb76681df9edafa329723e))

## [7.1.0](https://github.com/foray1010/Popup-my-Bookmarks/compare/v7.0.1...v7.1.0) (2020-11-27)

### Features

- support Spanish locale (thanks cyanine) ([e4c8f01](https://github.com/foray1010/Popup-my-Bookmarks/commit/e4c8f010b68006f3adf35ea444e4b6b15580e082))

### [7.0.1](https://github.com/foray1010/Popup-my-Bookmarks/compare/v7.0.0...v7.0.1) (2019-12-03)

### Bug Fixes

- chrome 78 cannot open options page ([470bd25](https://github.com/foray1010/Popup-my-Bookmarks/commit/470bd25fb58e465ded1092e3d0f78c8bd4e117da))

## [7.0.0](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.2.1...v7.0.0) (2019-12-02)

### ⚠ BREAKING CHANGES

- require chrome version >= 64

### Features

- support dark mode ([9100419](https://github.com/foray1010/Popup-my-Bookmarks/commit/910041934c6c976e77dce9fdb6434174adc9a593))

### Bug Fixes

- drop ResizeObserver polyfill ([abd13d7](https://github.com/foray1010/Popup-my-Bookmarks/commit/abd13d738902bf573dee2fa636a52d3363ccf972))

### [6.2.1](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.2.0...v6.2.1) (2019-07-15)

### Bug Fixes

- properly polyfill ResizeObserver on chrome < 64 ([dd4dd5a](https://github.com/foray1010/Popup-my-Bookmarks/commit/dd4dd5a))

## [6.2.0](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.1.0...v6.2.0) (2019-07-06)

### Features

- support ctrl/cmd/shift modifier when opening bookmark via keyboard ([2d92927](https://github.com/foray1010/Popup-my-Bookmarks/commit/2d92927))

## [6.1.0](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.0.3...v6.1.0) (2019-05-19)

### Features

- always show cancel search button even not focusing on search (reported by [@dlbryant](https://github.com/dlbryant)) ([fe0a0c4](https://github.com/foray1010/Popup-my-Bookmarks/commit/fe0a0c4))
- avoid duplicated separator URL (suggested by [@dlbryant](https://github.com/dlbryant)) ([e7f605c](https://github.com/foray1010/Popup-my-Bookmarks/commit/e7f605c))
- increase separator width to fit the largest popup width ([c114f94](https://github.com/foray1010/Popup-my-Bookmarks/commit/c114f94))

## [6.0.3](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.0.2...v6.0.3) (2019-05-18)

### Bug Fixes

- cannot drag on the edge of the bookmark ([1ad980e](https://github.com/foray1010/Popup-my-Bookmarks/commit/1ad980e))

## [6.0.2](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.0.1...v6.0.2) (2019-05-18)

### Bug Fixes

- should not trigger dragging when clicking bookmark with a shaking hand (reported by [@dlbryant](https://github.com/dlbryant)) ([e2e8265](https://github.com/foray1010/Popup-my-Bookmarks/commit/e2e8265))

## [6.0.1](https://github.com/foray1010/Popup-my-Bookmarks/compare/v6.0.0...v6.0.1) (2019-05-17)

### Bug Fixes

- close PmB by pressing Esc on input w/o value (reported by [@alon91](https://github.com/alon91)) ([0472fe0](https://github.com/foray1010/Popup-my-Bookmarks/commit/0472fe0))
- should search immediately by pressing any key (reported by [@alon91](https://github.com/alon91)) ([f0fb879](https://github.com/foray1010/Popup-my-Bookmarks/commit/f0fb879))

## 6.0.0 (15/05/2019)

### Improvements

- rewrite the whole extension with better structure, very likely with fewer bugs
- reduce file size and improve startup speed by removing unnecessary polyfills such as `promise` and `regenerator`
- reduce file size by using `woff2` instead of `woff`

### Changes

- increase minimum Chrome version from 34 to 55
- new folder, search and cancel icons

### Bug Fixes

- some bookmark rows may not have correct height after sorting/adding/deleting bookmarks
- should not allow paste when searching
- cannot drop bookmark when dragging
- input cursor moved to the end after inputting multiple whitespace

### Translations

- support Swedish locale (thanks Bosse Johansson)
- locales update: Norwegian Bokmål(Bjorn Tore Asheim)

## 5.3.2 (30/03/2019)

### Bug Fixes

- keep resizing in options page with long option description (reported by @silou)

## 5.3.1 (1/10/2018)

### Changes

- Revert "do not close window after pressing Esc"

## 5.3.0 (29/9/2018)

### Improvements

- do not close window after pressing Esc
- remove delay when searching (suggested by @alon91)

## 5.2.0 (22/7/2018)

### Improvements

- significantly improve startup speed by injecting background page that does nothing

## 5.1.2 (26/9/2017)

### Bug Fixes

- Cannot drag item into empty folder

### Others

- Update bitcoin donation url

## 5.1.1 (6/4/2017)

### Bug Fixes

- Bookmark icon shrinks if title is too long

## 5.1.0 (6/4/2017)

### Changes

- Use `Alt + Shift + B` as keyboard shortcut (reported by n8wood in [#63](https://github.com/foray1010/Popup-my-Bookmarks/issues/63#issuecomment-291903966))

### Improvements

- Greatly improve performance when you have a very large set of bookmarks in the same folder

## 5.0.5 (30/3/2017)

### Bug Fixes

- Should not allow to trigger contextmenu by CTRL key on Windows
- Should not trigger contextmenu multiple time by long press

## 5.0.4 (29/3/2017)

### Bug Fixes

- Cannot use Norwegian Bokmål locale (again)

## 5.0.3 (29/3/2017)

### Bug Fixes

- Cannot use Norwegian Bokmål locale

## 5.0.2 (27/3/2017)

### Changes

- Use `Ctrl / CMD + Shift + B` as keyboard shortcut (reported by kaitan32 in [#63](https://github.com/foray1010/Popup-my-Bookmarks/issues/63))

## 5.0.1 (25/3/2017)

### Bug Fixes

- Wrong image/font path in css

## 5.0.0 (25/3/2017)

### Features

- Open popup by Ctrl / CMD + B (suggested by Sebastian B)
- Use `Tab` and `Shift + Tab` to navigate bookmarks
- Support trigger context menu by `Menu Key`

### Changes

- Increase minimum Chrome version from 26 to 34
- New option page (following options V2 standard)
- Support all kind of separators in separatethis.com
- Remove option: `Bookmarklet supported`, now we always support bookmarklet without permission `Read and change all your data on the websites you visit`

### Bug Fixes

- Cannot `Copy` a folder
- Cannot display the whole popup in OSX
- Wrong menu/editor position in some situations
- Setting of `Hide root folder` will be lost on second save
- `Remember last position` may fail if `Default expanded folder` is changed
- `Remember last position` may fail if any last used folder is removed

### Translations

- Support Norwegian Bokmål locales (thanks Bjorn Tore Asheim)
- Locales update: French(Alexis Schapman)

## 4.0.2.812 (8/12/2016)

### Bug Fixes

- Middle click is not working on Chrome 55

## 4.0.1.706 (7/6/2015)

### Improvements

- Dragging is now much more sensitive

### Bug Fixes

- Drag fail easily on Windows

## 4.0.0.706 (7/6/2015)

### Features

- Keyboard Navigation

### Changes

- Increase minimum Chrome version from 20 to 26
- More compact layout
- 'Open all bookmarks' now ignore separators
- Close folder by clicking its folder item when using Left Click mode (suggested by Bram Jacob)
- Close folder by clicking its box shadow when using Left Click mode

### Improvements

- More precise drag indicator
- Scroll the created item into view
- Resize the height of interface when displaying drag indicator

### Bug Fixes

- Drag indicator may still appear after dragging is ended
- Drag indicator appears next to the dragged item in some special cases
- Tooltip displays after separator has been edited
- Weird display of separator when using Chrome(Linux)
- Wrong editor position in some special cases

## 3.1.4.2802 (28/2/2015)

### Bug Fixes

- Cannot restore last position in some special cases (reported by KyosukeAce)

## 3.1.3.2702 (27/2/2015)

### Improvements

- Scroll back to the top when searching

## 3.1.2.2602 (26/2/2015)

### Bug Fixes

- Cannot save correct last position when dragging scrollbar (reported by KyosukeAce)

## 3.1.1.2602 (26/2/2015)

### Bug Fixes

- Fix logic error in moving bookmarks when option 'Open folders by Left Click' is activated
- Fix menu item cannot toggle visibility correctly

## 3.1.0.2302 (23/2/2015)

### Options

- Font family (suggested by Leebeaut Paul and David Bryant)
- Hide root folder (suggested by David Bryant)
- Remove 'Hide folder "Mobile bookmarks" if exists'

### Changes

- The options of 'Default expanded folder' are now depended on the root folders you have
- Highlight the default folder name when creating a new folder (Inspired by Dennis Long)

### Bug Fixes

- Fix wrong index when setting option 'Default expanded folder' in Opera

### Improvements

- Dragging is now much easier (a problem since the previous version)
- Reduce the sensitivity of closing folder when hovering its shadow

### Translations

- Support Russian locales (thanks Другие закладки)
- Locales update: Korean(Jinhyeok Lee)

## 3.0.0.506 (5/6/2014)

### Features

- Add Breadcrumb to tooltips during search (inspired by Ashish Bogawat)

### Options

- Remember last position (suggested by Роман Дрэйк, Ke Han)

### Changes

- Middle clicking folder or clicking "Open in background tab" will close the popup (suggested by John Cawthorne)
- Use native Chrome context menu when right clicking "input" element

### Bug Fixes

- Folders are displayed on search results
- Some search results assigned with incorrect menu
- Cannot expand folder sometimes when dragging (reported by David Bryant)

### Improvements

- Wider scrollbar (suggested by Fischers Fritze)
- Selection sort algorithm for "Sort by name", less chances to reach the maximum number of bookmarks operations per hour
- Optimized algorithm for dragging, much smoother

### Translations

- Support Dutch locales (thanks Marzas)
- Locales update: French(foX aCe), Italian(Giacomo Fabio Leone)

### Others

- A fresh new UI

## 2.2.0.1111 (11/11/2013)

### Changes

- Header's font is changed to 'Archivo Narrow' and is integrated to PmB (Size: 50KB)

### Bug Fixes

- Can't scroll while using user-defined font (reported by David Bryant)

## 2.1.0.2910 (29/10/2013)

### Features

- "Close" button for closing folder (inspired by Tom Sengers)

### Improvements

- Hovering bookmark won't close folder in "Open folders by Left Click" mode

## 2.0.1.1710 (17/10/2013)

### Bug Fixes

- Unselected bookmark is highlighted when dragging at specific condition

### Improvements

- More accurate search result
- Avoid showing separtors in search result

### Translations

- Locales update: Korean(Jinhyeok Lee)

## 2.0.0.2209 (22/9/2013)

### Features

- (Menu) Sort by name (suggested by Steven Pribilinskiy)

### Changes

- Shortened title of separator (inspired by Steven Pribilinskiy)
- Search results are now in Alphabetical order

### Options

- Search queries allowed

### Bug Fixes

- Deadloop bug when copying a folder to itself
- Item may be removed sometimes when dragging

### Improvements

- Speed up searching

### Translations

- Locales update: French(foX aCe), Italian(Giacomo Fabio Leone)

## 1.9.1.1808 (18/8/2013)

### Translations

- Support German locales (thanks Gurkan ZENGIN)
- Locales update: French(foX aCe), Italian(Giacomo Fabio Leone), Korean(Jinhyeok Lee), Vietnamese(Phan Anh)

## 1.9.0.1508 (15/8/2013)

### Features

- Support bookmarklet (reported by Chris Hagen)

### Changes

- Create new folder only when confirmed (suggested by David Bryant)

### Bug Fixes

- Can't show the last item in a folder with scrollbar displayed (reported by David Bryant)

### Translations

- Support Korean locales (thanks Jinhyeok Lee)

## 1.8.4.1008 (10/8/2013)

### Bug Fixes

- Can't scroll while dragging (reported by David Bryant)

### Translations

- Support Italian locales (thanks Giacomo Fabio Leone)

## 1.8.3.608 (6/8/2013)

### Bug Fixes

- Can't paste a folder with its subfolder content (reported by David Bryant)
- "No bookmark" indicator doesn't show in the root

### Translations

- Locales update: French(foX aCe), Vietnamese(Phan Anh)

## 1.8.2.2907 (29/7/2013)

### Improvements

- The style of separator
- Favicons can be enlarged with font size
- Popup bookmark editor after adding folder

## 1.8.1.2807 (28/7/2013)

### Changes

- Rearrange the order in menu

### Translations

- Support Vietnamese locales (thanks Phan Anh)

## 1.8.0.2607 (26/7/2013)

### Features

- Add separators

### Options

- Font size

### Bug Fixes

- Can't add folder in empty folder (reported by David Bryant)

## 1.7.2.2407 (24/7/2013)

### Features

- Color indicator for "Cut, Copy & Paste"

### Changes

- New bookmarks and folders are now inserted under the item you right clicked

### Bug Fixes

- Can't paste in empty folder

## 1.7.1.1707 (17/7/2013)

### Translations

- Locales update: French(foX aCe)

## 1.7.0.1007 (10/7/2013)

### Features

- Cut, Copy & Paste on the context menu (suggested by David Bryant)

### Changes

- The height and width of PmB are now auto stretched when needed

### Bug Fixes

- Context menu isn't showed completely in some specific situations

## 1.6.5.307 (3/7/2013)

### Improvements

- Algorithm of closing the cover between folders

## 1.6.4.207 (2/7/2013)

### Improvements

- Reduce the chance of closing the cover between folders mistakenly (inspired by David Bryant)
- The cover between folders can be closed by left click

### Bug Fixes

- Can't rename folder in "Open folders by Left Click" mode (reported by David Bryant)

## 1.6.3.3006 (30/6/2013)

### Bug Fixes

- Can't move bookmarks to main folder (reported by David Bryant)

## 1.6.2.2906 (29/6/2013)

### Options

- Open folders by Left Click

### Bug Fixes

- Can't move bookmarks to the first place of folders (reported by David Bryant)

## 1.6.1.2306 (23/6/2013)

### Bug Fixes

- When dragging bookmark on the original position, drag indicator may be displayed

### Improvements

- Reduce the sensitivity of hovering folders (suggested by David Bryant)
- Reduce RAM usage

### Translations

- Support French locales (thanks foX aCe)

## 1.6.0.206 (2/6/2013)

### Changes

- Folder name's font changed to "Arial Narrow"

### Options

- Left/ Ctrl+Left/ Shift+Left/ Middle Click to open bookmarks in specified location (inspired by Ahmad Moawya)
- Remove "Always open bookmark in new tab"

### Improvements

- Better color scheme and layout (hopefully)

## 1.5.1.1505 (15/5/2013)

### Bug Fixes

- The height of bookmark tree may be incorrect after searching

## 1.5.0.1305 (13/5/2013)

### Features

- Ctrl + Click to open bookmarks w/o closing the popup (suggested by Cantate Domino)

### Options

- Always open bookmark in new tab (suggested by bryan wang)

### Improvements

- Expand folders smoothly
- Smoother searching
- Scrolling distance now also depends on mouse wheel speed
- New options won't reset saved settings anymore

## 1.4.1.2904 (29/4/2013)

### Changes

- Folder name's font changed to "Agency FB" (inspired by Timo Oster)

## 1.4.0.2604 (26/4/2013)

### Features

- Middle click mouse to open all bookmarks (suggested by George Dekavalas)

### Changes

- Scrolling distance now depends on the height of a item (suggested by DiegoPerotti)

### Options

- Warn me when opening multiple tabs might slow down Chrome (suggested by George Dekavalas)

## 1.3.0.1404 (14/4/2013)

### Changes

- When a bookmark's title is null, show its url instead of title (suggested by DiegoPerotti)

### Bug Fixes

- Rename or delete bookmarks on search page may not be shown
- The height is not set correctly in some cases
- (Temporary) Duplicated scroll bar on Mac OS (reported by NightRain)

### Improvements

- Dragging improvement
- UI improvement: Right Click Menu

## 1.2.0.904 (9/4/2013)

### Bug Fixes

- Index is not correct when dragging an item downward in the same folder

## 1.1.1.404 (4/4/2013)

### Improvements

- UI improvement

## 1.1.0.3103 (31/3/2013)

### Features

- Scrolling Animation

### Bug Fixes

- Unable to drag item into an empty folder

### Improvements

- More responsive dragging

## 1.0.3.2903 (29/3/2013)

### Improvements

- Dragging improvement

### Translations

- Locales update: Simplified Chinese

## 1.0.2.2803 (28/3/2013)

### Bug Fixes

- Right click menu error(again)
- Url can't be shown when editing bookmarks
- Invalid input is not checked on Options page

### Improvements

- Reduce startup time

### Translations

- Support Traditional and Simplified Chinese locales

## 1.0.1.2703 (27/3/2013)

### Bug Fixes

- Right click menu error

### Improvements

- Dragging improvement
- UI improvement

## 1.0.0.2603 (26/3/2013)

- initial version
