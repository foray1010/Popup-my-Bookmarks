import chromep from '../../common/lib/chromePromise'

export async function initOptionsValue(optionsConfig) {
  const options = await chromep.storage.sync.get(null)
  const updatedOptions = {}

  for (const optionName of Object.keys(optionsConfig)) {
    const optionConfig = optionsConfig[optionName]

    const optionDefaultValue = optionConfig.default

    if (options[optionName] === undefined) {
      options[optionName] = optionDefaultValue
      updatedOptions[optionName] = optionDefaultValue
    }
  }

  await chromep.storage.sync.set(updatedOptions)

  return options
}
