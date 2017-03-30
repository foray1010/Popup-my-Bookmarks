/* @flow */

import _difference from 'lodash/difference'

import chromep from '../../common/lib/chromePromise'

export async function initOptionsValue(optionsConfig: Object): Object {
  const options: Object = await chromep.storage.sync.get(null)

  const missingOptionKeys: string[] = _difference(
    Object.keys(optionsConfig),
    Object.keys(options)
  )
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
