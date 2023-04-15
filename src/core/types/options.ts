import type { OPTIONS } from '../constants/index.js'

export type Options = Readonly<{
  [OPTIONS.CLICK_BY_LEFT]: number
  [OPTIONS.CLICK_BY_LEFT_CTRL]: number
  [OPTIONS.CLICK_BY_LEFT_SHIFT]: number
  [OPTIONS.CLICK_BY_MIDDLE]: number
  [OPTIONS.DEF_EXPAND]: number
  [OPTIONS.FONT_FAMILY]: string
  [OPTIONS.FONT_SIZE]: number
  [OPTIONS.HIDE_ROOT_FOLDER]: ReadonlyArray<number>
  [OPTIONS.MAX_RESULTS]: number
  [OPTIONS.OP_FOLDER_BY]: boolean
  [OPTIONS.REMEMBER_POS]: boolean
  [OPTIONS.SEARCH_TARGET]: number
  [OPTIONS.SET_WIDTH]: number
  [OPTIONS.TOOLTIP]: boolean
  [OPTIONS.WARN_OPEN_MANY]: boolean
}>
// check if all OPTIONS are handled in Options, will be removed by minifier so won't affect bundle size
;({}) as Options satisfies Record<OPTIONS, unknown>

export type ArrayOptionConfig = Readonly<{
  type: 'array'
  default: ReadonlyArray<number | undefined>
  choices: ReadonlyArray<string | undefined>
}>
export type BooleanOptionConfig = Readonly<{
  type: 'boolean'
  default: boolean
}>
export type IntegerOptionConfig = Readonly<{
  type: 'integer'
  default: number
  minimum: number
  maximum: number
}>
export type SelectOptionConfig = Readonly<{
  type: 'select'
  default: number
  choices: ReadonlyArray<string>
}>
export type StringOptionConfig = Readonly<{
  type: 'string'
  default: string
  choices: ReadonlyArray<string>
}>
export type OptionsConfig = Readonly<{
  [OPTIONS.CLICK_BY_LEFT]: SelectOptionConfig
  [OPTIONS.CLICK_BY_LEFT_CTRL]: SelectOptionConfig
  [OPTIONS.CLICK_BY_LEFT_SHIFT]: SelectOptionConfig
  [OPTIONS.CLICK_BY_MIDDLE]: SelectOptionConfig
  [OPTIONS.DEF_EXPAND]: SelectOptionConfig
  [OPTIONS.FONT_FAMILY]: StringOptionConfig
  [OPTIONS.FONT_SIZE]: IntegerOptionConfig
  [OPTIONS.HIDE_ROOT_FOLDER]: ArrayOptionConfig
  [OPTIONS.MAX_RESULTS]: IntegerOptionConfig
  [OPTIONS.OP_FOLDER_BY]: BooleanOptionConfig
  [OPTIONS.REMEMBER_POS]: BooleanOptionConfig
  [OPTIONS.SEARCH_TARGET]: SelectOptionConfig
  [OPTIONS.SET_WIDTH]: IntegerOptionConfig
  [OPTIONS.TOOLTIP]: BooleanOptionConfig
  [OPTIONS.WARN_OPEN_MANY]: BooleanOptionConfig
}>
// check if all OPTIONS are handled in OptionsConfig, will be removed by minifier so won't affect bundle size
;({}) as OptionsConfig satisfies Record<OPTIONS, unknown>
