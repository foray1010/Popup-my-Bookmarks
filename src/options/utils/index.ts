import * as R from 'ramda'
import webExtension from 'webextension-polyfill'

import type { OPTIONS } from '../../core/constants'
import type { Options, OptionsConfig } from '../../core/types/options'
import { getOptionsConfig } from '../../core/utils'

export const initOptions = async (): Promise<Options> => {
  const [options, optionsConfig] = await Promise.all<
    Partial<Options>,
    OptionsConfig
  >([webExtension.storage.sync.get(), getOptionsConfig()])

  const missingOptionKeys = R.difference(
    Object.keys(optionsConfig) as OPTIONS[],
    Object.keys(options) as OPTIONS[],
  )
  const missingOptions = missingOptionKeys.reduce<Partial<Options>>(
    (acc, optionName) => ({
      ...acc,
      [optionName]: optionsConfig[optionName].default,
    }),
    {},
  )
  if (Object.keys(missingOptions).length) {
    await webExtension.storage.sync.set(missingOptions)
  }

  const updatedOptions = (await webExtension.storage.sync.get()) as Options
  return updatedOptions
}
