import * as R from 'ramda'
import webExtension from 'webextension-polyfill'

import {Options, OptionsConfig} from '../../common/types/options'
import {getOptionsConfig} from '../../common/utils'

export const initOptions = async (): Promise<Options> => {
  const [options, optionsConfig]: [Partial<Options>, OptionsConfig] = await Promise.all([
    webExtension.storage.sync.get(),
    getOptionsConfig()
  ])

  const missingOptionKeys = R.difference(Object.keys(optionsConfig), Object.keys(options))
  const missingOptions = missingOptionKeys.reduce(
    (acc: Partial<Options>, optionName) => ({
      ...acc,
      [optionName]: R.path([optionName, 'default'], optionsConfig)
    }),
    {}
  )
  if (Object.keys(missingOptions).length) {
    await webExtension.storage.sync.set(missingOptions)
  }

  const updatedOptions: Options = await webExtension.storage.sync.get()
  return updatedOptions
}
