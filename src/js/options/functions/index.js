/* @flow */

import chromep from '../../common/lib/chromePromise'

export async function initOptionsValue(optionsConfig: Object): Object {
  const options: Object = await chromep.storage.sync.get(null)
  const updatedOptions: Object = {}

  for (const optionName: string of Object.keys(optionsConfig)) {
    if (options[optionName] === undefined) {
      const optionConfig: Object = optionsConfig[optionName]

      const optionDefaultValue: any = optionConfig.default

      options[optionName] = optionDefaultValue
      updatedOptions[optionName] = optionDefaultValue
    }
  }

  await chromep.storage.sync.set(updatedOptions)

  return options
}
