// @flow

import R from 'ramda'

import chromep from '../../common/lib/chromePromise'

export const initOptionsValue = async (optionsConfig: Object): Promise<Object> => {
  const options: Object = await chromep.storage.sync.get(null)

  const missingOptionKeys: string[] = R.difference(Object.keys(optionsConfig), Object.keys(options))
  const updatedOptions: Object = missingOptionKeys.reduce((acc, optionName) => {
    const optionConfig: Object = optionsConfig[optionName]

    const optionDefaultValue: any = optionConfig.default

    return {
      ...acc,
      [optionName]: optionDefaultValue
    }
  }, {})

  await chromep.storage.sync.set(updatedOptions)

  return {
    ...options,
    ...updatedOptions
  }
}
