import { OPTIONS } from '../../core/constants/index.js'

export enum RoutePath {
  Contributors,
  Control,
  General,
  UserInterface,
}

export const OPTION_TABLE_MAP = {
  [RoutePath.Contributors]: [],
  [RoutePath.Control]: [
    OPTIONS.CLICK_BY_LEFT,
    OPTIONS.CLICK_BY_LEFT_CTRL,
    OPTIONS.CLICK_BY_LEFT_SHIFT,
    OPTIONS.CLICK_BY_MIDDLE,
    OPTIONS.OP_FOLDER_BY,
  ],
  [RoutePath.General]: [
    OPTIONS.DEF_EXPAND,
    OPTIONS.HIDE_ROOT_FOLDER,
    OPTIONS.SEARCH_TARGET,
    OPTIONS.MAX_RESULTS,
    OPTIONS.TOOLTIP,
    OPTIONS.WARN_OPEN_MANY,
    OPTIONS.REMEMBER_POS,
  ],
  [RoutePath.UserInterface]: [
    OPTIONS.SET_WIDTH,
    OPTIONS.FONT_SIZE,
    OPTIONS.FONT_FAMILY,
  ],
} as const satisfies Record<RoutePath, readonly OPTIONS[]>
