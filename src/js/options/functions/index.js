// @flow

import R from 'ramda'
import webExtension from 'webextension-polyfill'

export const initOptionsValue = async (optionsConfig: Object): Promise<Object> => {
  const options: Object = await webExtension.storage.sync.get(null)

  const missingOptionKeys: string[] = R.difference(Object.keys(optionsConfig), Object.keys(options))
  const updatedOptions: Object = missingOptionKeys.reduce((acc, optionName) => {
    const optionConfig: Object = optionsConfig[optionName]

    const optionDefaultValue: any = optionConfig.default

    return {
      ...acc,
      [optionName]: optionDefaultValue
    }
  }, {})

  await webExtension.storage.sync.set(updatedOptions)

  return {
    ...options,
    ...updatedOptions
  }
}
