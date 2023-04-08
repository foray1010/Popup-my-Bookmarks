import type { OPTIONS } from '../constants/index.js'

export type Options = {
  readonly [OPTIONS.CLICK_BY_LEFT]: number
  readonly [OPTIONS.CLICK_BY_LEFT_CTRL]: number
  readonly [OPTIONS.CLICK_BY_LEFT_SHIFT]: number
  readonly [OPTIONS.CLICK_BY_MIDDLE]: number
  readonly [OPTIONS.DEF_EXPAND]: number
  readonly [OPTIONS.FONT_FAMILY]: string
  readonly [OPTIONS.FONT_SIZE]: number
  readonly [OPTIONS.HIDE_ROOT_FOLDER]: ReadonlyArray<number>
  readonly [OPTIONS.MAX_RESULTS]: number
  readonly [OPTIONS.OP_FOLDER_BY]: boolean
  readonly [OPTIONS.REMEMBER_POS]: boolean
  readonly [OPTIONS.SEARCH_TARGET]: number
  readonly [OPTIONS.SET_WIDTH]: number
  readonly [OPTIONS.TOOLTIP]: boolean
  readonly [OPTIONS.WARN_OPEN_MANY]: boolean
}
// check if all OPTIONS are handled in Options, will be removed by minifier so won't affect bundle size
;({}) as Options satisfies Record<OPTIONS, unknown>

export type ArrayOptionConfig = {
  readonly type: 'array'
  readonly default: ReadonlyArray<number | undefined>
  readonly choices: ReadonlyArray<string | undefined>
}
export type BooleanOptionConfig = {
  readonly type: 'boolean'
  readonly default: boolean
}
export type IntegerOptionConfig = {
  readonly type: 'integer'
  readonly default: number
  readonly minimum: number
  readonly maximum: number
}
export type SelectOptionConfig = {
  readonly type: 'select'
  readonly default: number
  readonly choices: ReadonlyArray<string>
}
export type StringOptionConfig = {
  readonly type: 'string'
  readonly default: string
  readonly choices: ReadonlyArray<string>
}
export type OptionsConfig = {
  readonly [OPTIONS.CLICK_BY_LEFT]: SelectOptionConfig
  readonly [OPTIONS.CLICK_BY_LEFT_CTRL]: SelectOptionConfig
  readonly [OPTIONS.CLICK_BY_LEFT_SHIFT]: SelectOptionConfig
  readonly [OPTIONS.CLICK_BY_MIDDLE]: SelectOptionConfig
  readonly [OPTIONS.DEF_EXPAND]: SelectOptionConfig
  readonly [OPTIONS.FONT_FAMILY]: StringOptionConfig
  readonly [OPTIONS.FONT_SIZE]: IntegerOptionConfig
  readonly [OPTIONS.HIDE_ROOT_FOLDER]: ArrayOptionConfig
  readonly [OPTIONS.MAX_RESULTS]: IntegerOptionConfig
  readonly [OPTIONS.OP_FOLDER_BY]: BooleanOptionConfig
  readonly [OPTIONS.REMEMBER_POS]: BooleanOptionConfig
  readonly [OPTIONS.SEARCH_TARGET]: SelectOptionConfig
  readonly [OPTIONS.SET_WIDTH]: IntegerOptionConfig
  readonly [OPTIONS.TOOLTIP]: BooleanOptionConfig
  readonly [OPTIONS.WARN_OPEN_MANY]: BooleanOptionConfig
}
// check if all OPTIONS are handled in OptionsConfig, will be removed by minifier so won't affect bundle size
;({}) as OptionsConfig satisfies Record<OPTIONS, unknown>
