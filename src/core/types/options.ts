import { OPTIONS } from '../constants'

export interface Options {
  [OPTIONS.CLICK_BY_LEFT]: string
  [OPTIONS.CLICK_BY_LEFT_CTRL]: string
  [OPTIONS.CLICK_BY_LEFT_SHIFT]: string
  [OPTIONS.CLICK_BY_MIDDLE]: string
  [OPTIONS.DEF_EXPAND]: string
  [OPTIONS.FONT_FAMILY]: string
  [OPTIONS.FONT_SIZE]: number
  [OPTIONS.HIDE_ROOT_FOLDER]: Array<string>
  [OPTIONS.MAX_RESULTS]: number
  [OPTIONS.OP_FOLDER_BY]: boolean
  [OPTIONS.REMEMBER_POS]: boolean
  [OPTIONS.SEARCH_TARGET]: string
  [OPTIONS.SET_WIDTH]: number
  [OPTIONS.TOOLTIP]: boolean
  [OPTIONS.WARN_OPEN_MANY]: boolean
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
interface SelectMultipleOptionConfig {
  type: 'array'
  default: Array<string>
  choices: Map<string, string>
}
interface SelectOptionConfig {
  type: 'select'
  default: string
  choices: Map<string, string>
}
interface StringOptionConfig {
  type: 'string'
  default: string
  choices: Array<string>
}
export type OptionConfig =
  | BooleanOptionConfig
  | IntegerOptionConfig
  | SelectMultipleOptionConfig
  | SelectOptionConfig
  | StringOptionConfig
export type OptionsConfig = { [K in keyof Options]: OptionConfig }
