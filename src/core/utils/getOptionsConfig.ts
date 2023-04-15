import webExtension from 'webextension-polyfill'

import { OPTIONS, ROOT_ID } from '../constants/index.js'
import type { OptionsConfig } from '../types/options.js'
import isMac from './isMac.js'

function getMessages(messageKeys: readonly string[]) {
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

  const rootFolderChoicesMutable: string[] = []
  // get the root folders' title and set as the choices of 'defExpand'
  const rootFolders = await webExtension.bookmarks.getChildren(ROOT_ID)
  for (const rootFolder of rootFolders) {
    const rootFolderIdNum = Number(rootFolder.id)
    rootFolderChoicesMutable[rootFolderIdNum] = rootFolder.title
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
      choices: rootFolderChoicesMutable,
    },
    [OPTIONS.FONT_FAMILY]: {
      type: 'string',
      // `system-ui` may not work well on some OS/language combinations, but macOS is fine
      // see https://github.com/w3c/csswg-drafts/issues/3658
      default: isMac() ? 'system-ui' : 'sans-serif',
      choices: [
        'system-ui',
        'sans-serif',
        'serif',
        'monospace',
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
      choices: rootFolderChoicesMutable,
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
  } as const
}
