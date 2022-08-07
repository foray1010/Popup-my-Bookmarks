export * from '../../core/constants'

export const MAX_HEIGHT = 598
export const NO_BOOKMARK_ID_PREFIX = 'NO_BOOKMARK_ID_'
export const SEARCH_RESULT_ID = 'SEARCH_RESULT_ID'
export const SEPARATE_THIS_URL = 'http://separatethis.com/'

export enum MenuItem {
  AddFolder = 'addFolder',
  AddPage = 'addPage',
  AddSeparator = 'addSeparator',
  Copy = 'copy',
  Cut = 'cut',
  Delete = 'del',
  Edit = 'edit',
  OpenAll = 'openAll',
  OpenAllInIncognitoWindow = 'openAllInI',
  OpenAllInNewWindow = 'openAllInN',
  OpenInBackgroundTab = 'openInB',
  OpenInIncognitoWindow = 'openInI',
  OpenInNewWindow = 'openInN',
  Paste = 'paste',
  Rename = 'rename',
  SortByName = 'sortByName',
}

export enum OPEN_IN_TYPES {
  BACKGROUND_TAB,
  CURRENT_TAB,
  INCOGNITO_WINDOW,
  NEW_TAB,
  NEW_WINDOW,
}

export enum BOOKMARK_TYPES {
  BOOKMARK,
  DRAG_INDICATOR,
  FOLDER,
  NO_BOOKMARK,
  SEPARATOR,
}
