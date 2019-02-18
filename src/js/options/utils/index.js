// @flow strict

import * as R from 'ramda'
import webExtension from 'webextension-polyfill'

import type {Options} from '../../common/types/options'
import {getOptionsConfig} from '../../common/utils'

export const initOptions = async (): Promise<Options> => {
  const [options: $Shape<Options>, optionsConfig] = await Promise.all([
    webExtension.storage.sync.get(null),
    getOptionsConfig()
  ])

  const missingOptionKeys: Array<string> = R.difference(
    Object.keys(optionsConfig),
    Object.keys(options)
  )
  const missingOptions = missingOptionKeys.reduce(
    (acc: $Shape<Options>, optionName) => ({
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
