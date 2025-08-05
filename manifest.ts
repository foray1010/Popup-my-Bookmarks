import browserslist from 'browserslist'
import type browser from 'webextension-polyfill'

import pkg from './package.json' with { type: 'json' }

const minimumChromeVersion = browserslist()
  .map((browserVersion) => {
    const matchResult = browserVersion.match(/^chrome ((?:\d|\.)+)$/u)
    return matchResult?.[1]
  })
  .filter(Boolean)
  .toSorted((a, b) => Number(a) - Number(b))[0]

export const manifest:
  | browser._manifest.WebExtensionManifest
  // eslint-disable-next-line no-undef
  | chrome.runtime.ManifestV3 = {
  name: 'Popup my Bookmarks',
  short_name: 'PmB',
  version: pkg.version,
  manifest_version: 3,
  minimum_chrome_version: minimumChromeVersion,
  offline_enabled: true,

  default_locale: 'en',
  description: '__MSG_extDesc__',
  homepage_url: 'https://github.com/foray1010/Popup-my-Bookmarks',

  icons: {
    '16': './images/icon16.png',
    '48': './images/icon48.png',
    '128': './images/icon128.png',
  },

  action: {
    default_icon: './images/icon38.png',
    default_popup: './popup.html',
  },

  options_ui: {
    page: './options.html',
  },

  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Alt+Shift+B',
      },
    },
  },

  content_security_policy: {
    extension_pages:
      "base-uri 'none'; default-src 'none'; form-action 'none'; frame-ancestors 'none'; img-src 'self' data:; script-src 'self'; style-src 'unsafe-inline';",
  },

  permissions: [
    // this grant permission to run bookmarklet on current page
    'activeTab',
    'bookmarks',
    'favicon',
    // required to execute bookmarklet
    'scripting',
    'storage',
    // this is a fix for we cannot save current page as bookmark,
    // if we open the popup before the current page finished loading
    'tabs',
  ],
}
