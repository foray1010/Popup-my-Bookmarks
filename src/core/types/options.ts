import type { OPTIONS } from '../constants'

export interface Options {
  [OPTIONS.CLICK_BY_LEFT]: number
  [OPTIONS.CLICK_BY_LEFT_CTRL]: number
  [OPTIONS.CLICK_BY_LEFT_SHIFT]: number
  [OPTIONS.CLICK_BY_MIDDLE]: number
  [OPTIONS.DEF_EXPAND]: number
  [OPTIONS.FONT_FAMILY]: string
  [OPTIONS.FONT_SIZE]: number
  [OPTIONS.HIDE_ROOT_FOLDER]: Array<number>
  [OPTIONS.MAX_RESULTS]: number
  [OPTIONS.OP_FOLDER_BY]: boolean
  [OPTIONS.REMEMBER_POS]: boolean
  [OPTIONS.SEARCH_TARGET]: number
  [OPTIONS.SET_WIDTH]: number
  [OPTIONS.TOOLTIP]: boolean
  [OPTIONS.WARN_OPEN_MANY]: boolean
}

interface ArrayOptionConfig {
  type: 'array'
  default: Array<number | undefined>
  choices: Array<string | undefined>
}
interface BooleanOptionConfig {
  type: 'boolean'
  default: boolean
}
interface IntegerOptionConfig {
  type: 'integer'
  default: number
  minimum: number
  maximum: number
}
interface SelectOptionConfig {
  type: 'select'
  default: number
  choices: Array<string>
}
interface StringOptionConfig {
  type: 'string'
  default: string
  choices: Array<string>
}
export type OptionConfig =
  | ArrayOptionConfig
  | BooleanOptionConfig
  | IntegerOptionConfig
  | SelectOptionConfig
  | StringOptionConfig
export type OptionsConfig = { [K in keyof Options]: OptionConfig }
