import webExtension from 'webextension-polyfill'

import {
  CLICK_OPTIONS,
  IS_FIREFOX,
  OPTIONS,
  ROOT_ID,
  SEARCH_TARGET_OPTIONS,
} from '../constants'
import { OptionsConfig } from '../types/options'

const genOptionsByMsgKey = (messageKeys: string[]): Map<string, string> => {
  const options = new Map<string, string>()
  for (const messageKey of messageKeys) {
    options.set(messageKey, webExtension.i18n.getMessage(messageKey))
  }
  return options
}

const getOptionsConfig = async (): Promise<OptionsConfig> => {
  const openBookmarkChoices = genOptionsByMsgKey([
    CLICK_OPTIONS.CURRENT_TAB,
    CLICK_OPTIONS.CURRENT_TAB_WITHOUT_CLOSING_PMB,
    CLICK_OPTIONS.NEW_TAB,
    CLICK_OPTIONS.BACKGROUND_TAB,
    CLICK_OPTIONS.BACKGROUND_TAB_WITHOUT_CLOSING_PMB,
    CLICK_OPTIONS.NEW_WINDOW,
    CLICK_OPTIONS.INCOGNITO_WINDOW,
  ])

  const rootFolderChoices = new Map<string, string>()
  // get the root folders' title and set as the choices of 'defExpand'
  const rootFolders = await webExtension.bookmarks.getChildren(ROOT_ID)
  for (const rootFolder of rootFolders) {
    rootFolderChoices.set(rootFolder.id, rootFolder.title)
  }

  return {
    [OPTIONS.CLICK_BY_LEFT]: {
      type: 'select',
      default: CLICK_OPTIONS.CURRENT_TAB,
      choices: openBookmarkChoices,
    },
    [OPTIONS.CLICK_BY_LEFT_CTRL]: {
      type: 'select',
      default: CLICK_OPTIONS.BACKGROUND_TAB_WITHOUT_CLOSING_PMB,
      choices: openBookmarkChoices,
    },
    [OPTIONS.CLICK_BY_LEFT_SHIFT]: {
      type: 'select',
      default: CLICK_OPTIONS.NEW_WINDOW,
      choices: openBookmarkChoices,
    },
    [OPTIONS.CLICK_BY_MIDDLE]: {
      type: 'select',
      default: CLICK_OPTIONS.NEW_TAB,
      choices: openBookmarkChoices,
    },
    [OPTIONS.DEF_EXPAND]: {
      type: 'select',
      // `1` is 'Bookmarks Bar' in Chrome
      default: IS_FIREFOX
        ? 'menu________'
        : rootFolderChoices.has('1')
        ? '1'
        : ROOT_ID,
      choices: rootFolderChoices,
    },
    [OPTIONS.FONT_FAMILY]: {
      type: 'string',
      default: 'sans-serif',
      choices: [
        'monospace',
        'sans-serif',
        'serif',
        'Archivo Narrow',
        'Arial',
        'Comic Sans MS',
        'Georgia',
        'Lucida Sans Unicode',
        'Tahoma',
        'Trebuchet MS',
        'Verdana',
      ],
    },
    [OPTIONS.FONT_SIZE]: {
      type: 'integer',
      default: 12,
      minimum: 10,
      maximum: 30,
    },
    [OPTIONS.HIDE_ROOT_FOLDER]: {
      type: 'array',
      default: [],
      choices: rootFolderChoices,
    },
    [OPTIONS.MAX_RESULTS]: {
      type: 'integer',
      default: 50,
      minimum: 10,
      maximum: 200,
    },
    [OPTIONS.OP_FOLDER_BY]: {
      type: 'boolean',
      default: false,
    },
    [OPTIONS.REMEMBER_POS]: {
      type: 'boolean',
      default: false,
    },
    [OPTIONS.SEARCH_TARGET]: {
      type: 'select',
      default: SEARCH_TARGET_OPTIONS.TITLE_AND_URL,
      choices: genOptionsByMsgKey([
        SEARCH_TARGET_OPTIONS.TITLE_AND_URL,
        SEARCH_TARGET_OPTIONS.TITLE,
      ]),
    },
    [OPTIONS.SET_WIDTH]: {
      type: 'integer',
      default: 280,
      minimum: 100,
      maximum: 399,
    },
    [OPTIONS.TOOLTIP]: {
      type: 'boolean',
      default: false,
    },
    [OPTIONS.WARN_OPEN_MANY]: {
      type: 'boolean',
      default: true,
    },
  }
}

export default getOptionsConfig
