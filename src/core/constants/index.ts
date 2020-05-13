export const IS_FIREFOX = /firefox/i.test(window.navigator.userAgent)

export enum OPTIONS {
  CLICK_BY_LEFT = 'clickByLeft',
  CLICK_BY_LEFT_CTRL = 'clickByLeftCtrl',
  CLICK_BY_LEFT_SHIFT = 'clickByLeftShift',
  CLICK_BY_MIDDLE = 'clickByMiddle',
  DEF_EXPAND = 'defExpand',
  FONT_FAMILY = 'fontFamily',
  FONT_SIZE = 'fontSize',
  HIDE_ROOT_FOLDER = 'hideRootFolder',
  MAX_RESULTS = 'maxResults',
  OP_FOLDER_BY = 'opFolderBy',
  REMEMBER_POS = 'rememberPos',
  SEARCH_TARGET = 'searchTarget',
  SET_WIDTH = 'setWidth',
  TOOLTIP = 'tooltip',
  WARN_OPEN_MANY = 'warnOpenMany',
}

export enum CLICK_OPTIONS {
  CURRENT_TAB = 'clickOption1',
  CURRENT_TAB_WITHOUT_CLOSING_PMB = 'clickOption2',
  NEW_TAB = 'clickOption3',
  BACKGROUND_TAB = 'clickOption4',
  BACKGROUND_TAB_WITHOUT_CLOSING_PMB = 'clickOption5',
  NEW_WINDOW = 'clickOption6',
  INCOGNITO_WINDOW = 'clickOption7',
}

export enum SEARCH_TARGET_OPTIONS {
  TITLE_AND_URL = 'searchTargetOption1',
  TITLE = 'searchTargetOption2',
}

export const ROOT_ID = IS_FIREFOX ? 'root________' : '0'
