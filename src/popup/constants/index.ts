export * from '../../core/constants'

export const GOLDEN_GAP = 2
export const MAX_HEIGHT = 598
export const MIN_BOOKMARK_ICON_SIZE = 16
export const NO_BOOKMARK_ID_PREFIX = 'NO_BOOKMARK_ID_'
export const SEARCH_RESULT_ID = 'SEARCH_RESULT_ID'
export const SEPARATE_THIS_URL = 'http://separatethis.com/'

export const MENU_ADD_FOLDER = 'addFolder'
export const MENU_ADD_PAGE = 'addPage'
export const MENU_ADD_SEPARATOR = 'addSeparator'
export const MENU_COPY = 'copy'
export const MENU_CUT = 'cut'
export const MENU_DEL = 'del'
export const MENU_EDIT = 'edit'
export const MENU_OPEN_ALL = 'openAll'
export const MENU_OPEN_ALL_IN_I = 'openAllInI'
export const MENU_OPEN_ALL_IN_N = 'openAllInN'
export const MENU_OPEN_IN_B = 'openInB'
export const MENU_OPEN_IN_I = 'openInI'
export const MENU_OPEN_IN_N = 'openInN'
export const MENU_PASTE = 'paste'
export const MENU_RENAME = 'rename'
export const MENU_SORT_BY_NAME = 'sortByName'

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
