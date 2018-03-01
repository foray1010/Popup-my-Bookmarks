// @flow

import * as R from 'ramda'
import webExtension from 'webextension-polyfill'

import {getOptionsConfig} from '../../common/utils'

export const initOptions = async (): Promise<Object> => {
  const [options: Object, optionsConfig: Object] = await Promise.all([
    webExtension.storage.sync.get(null),
    getOptionsConfig()
  ])

  const missingOptionKeys: $ReadOnlyArray<string> = R.difference(
    Object.keys(optionsConfig),
    Object.keys(options)
  )
  const missingOptions: Object = missingOptionKeys.reduce(
    (acc, optionName) => ({
      ...acc,
      [optionName]: R.path([optionName, 'default'], optionsConfig)
    }),
    {}
  )
  if (Object.keys(missingOptions).length) {
    await webExtension.storage.sync.set(missingOptions)
  }

  return {
    ...options,
    ...missingOptions
  }
}
