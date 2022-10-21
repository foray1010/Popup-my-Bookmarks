import type { OPTIONS } from '../constants/index.js'

export interface Options {
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

interface ArrayOptionConfig {
  readonly type: 'array'
  readonly default: ReadonlyArray<number | undefined>
  readonly choices: ReadonlyArray<string | undefined>
}
interface BooleanOptionConfig {
  readonly type: 'boolean'
  readonly default: boolean
}
interface IntegerOptionConfig {
  readonly type: 'integer'
  readonly default: number
  readonly minimum: number
  readonly maximum: number
}
interface SelectOptionConfig {
  readonly type: 'select'
  readonly default: number
  readonly choices: ReadonlyArray<string>
}
interface StringOptionConfig {
  readonly type: 'string'
  readonly default: string
  readonly choices: ReadonlyArray<string>
}
export type OptionConfig =
  | ArrayOptionConfig
  | BooleanOptionConfig
  | IntegerOptionConfig
  | SelectOptionConfig
  | StringOptionConfig
export type OptionsConfig = { readonly [K in keyof Options]: OptionConfig }
