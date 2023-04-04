import '../manifest.yml'

import * as React from 'react'
import webExtension from 'webextension-polyfill'

import type { OPTIONS } from '../core/constants/index.js'
import { createAndRenderRoot, getOptionsConfig } from '../core/utils/index.js'
import App from './components/App/index.js'
import { getOptions } from './modules/options.js'

async function main(): Promise<void> {
  const [options, optionsConfig] = await Promise.all([
    getOptions(),
    getOptionsConfig(),
  ])

  // if missing option, open options page to init options
  const missingOptionNames = (
    Object.keys(optionsConfig) as readonly OPTIONS[]
  ).filter((optionName) => options[optionName] === undefined)
  if (missingOptionNames.length > 0) {
    await webExtension.runtime.openOptionsPage()
    return
  }

  createAndRenderRoot(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

main().catch(console.error)
