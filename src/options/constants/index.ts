import * as CST from '../../core/constants/index.js'

export enum RoutePath {
  Contributors,
  Control,
  General,
  UserInterface,
}

export const OPTION_TABLE_MAP = {
  [RoutePath.Contributors]: [],
  [RoutePath.Control]: [
    CST.OPTIONS.CLICK_BY_LEFT,
    CST.OPTIONS.CLICK_BY_LEFT_CTRL,
    CST.OPTIONS.CLICK_BY_LEFT_SHIFT,
    CST.OPTIONS.CLICK_BY_MIDDLE,
    CST.OPTIONS.OP_FOLDER_BY,
  ],
  [RoutePath.General]: [
    CST.OPTIONS.DEF_EXPAND,
    CST.OPTIONS.HIDE_ROOT_FOLDER,
    CST.OPTIONS.SEARCH_TARGET,
    CST.OPTIONS.MAX_RESULTS,
    CST.OPTIONS.TOOLTIP,
    CST.OPTIONS.WARN_OPEN_MANY,
    CST.OPTIONS.REMEMBER_POS,
  ],
  [RoutePath.UserInterface]: [
    CST.OPTIONS.SET_WIDTH,
    CST.OPTIONS.FONT_SIZE,
    CST.OPTIONS.FONT_FAMILY,
  ],
} as const satisfies Record<RoutePath, readonly CST.OPTIONS[]>
