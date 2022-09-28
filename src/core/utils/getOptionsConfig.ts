import webExtension from 'webextension-polyfill'

import { OPTIONS, ROOT_ID } from '../constants'
import type { OptionsConfig } from '../types/options'

const getMessages = (messageKeys: readonly string[]) => {
  return messageKeys.map((k) => webExtension.i18n.getMessage(k))
}

export default async function getOptionsConfig(): Promise<OptionsConfig> {
  const openBookmarkChoices = getMessages([
    'clickOption1',
    'clickOption2',
    'clickOption3',
    'clickOption4',
    'clickOption5',
    'clickOption6',
    'clickOption7',
  ])

  const rootFolderChoices: Array<string> = []
  // get the root folders' title and set as the choices of 'defExpand'
  const rootFolders = await webExtension.bookmarks.getChildren(ROOT_ID)
  for (const rootFolder of rootFolders) {
    const rootFolderIdNum = Number(rootFolder.id)
    rootFolderChoices[rootFolderIdNum] = rootFolder.title
  }

  return {
    [OPTIONS.CLICK_BY_LEFT]: {
      type: 'select',
      default: 0,
      choices: openBookmarkChoices,
    },
    [OPTIONS.CLICK_BY_LEFT_CTRL]: {
      type: 'select',
      default: 4,
      choices: openBookmarkChoices,
    },
    [OPTIONS.CLICK_BY_LEFT_SHIFT]: {
      type: 'select',
      default: 5,
      choices: openBookmarkChoices,
    },
    [OPTIONS.CLICK_BY_MIDDLE]: {
      type: 'select',
      default: 2,
      choices: openBookmarkChoices,
    },
    [OPTIONS.DEF_EXPAND]: {
      type: 'select',
      default: 1,
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
      default: 0,
      choices: getMessages(['searchTargetOption1', 'searchTargetOption2']),
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
