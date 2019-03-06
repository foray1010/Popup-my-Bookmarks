import {OPTIONS} from '../constants'

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

export interface OptionConfig {
  choices?: Array<string>
  default?: Options[keyof Options]
  maximum?: number
  minimum?: number
  type: string
}
export type OptionsConfig = {[K in keyof Options]: OptionConfig}
