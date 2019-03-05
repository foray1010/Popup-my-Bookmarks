import {$Values} from 'utility-types'

export interface Options {
  clickByLeft: number
  clickByLeftCtrl: number
  clickByLeftShift: number
  clickByMiddle: number
  defExpand: number
  fontFamily: string
  fontSize: number
  hideRootFolder: Array<number>
  maxResults: number
  opFolderBy: boolean
  rememberPos: boolean
  searchTarget: number
  setWidth: number
  tooltip: boolean
  warnOpenMany: boolean
}

export interface OptionConfig {
  choices?: Array<string>
  default?: $Values<Options>
  maximum?: number
  minimum?: number
  type: string
}
export interface OptionsConfig {
  [key: string]: OptionConfig
}
