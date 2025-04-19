import '../manifest.yml'

import { StrictMode } from 'react'
import type { ValueOf } from 'type-fest'
import webExtension from 'webextension-polyfill'

import type { OPTIONS } from '@/core/constants/index.js'
import createAndRenderRoot from '@/core/utils/createAndRenderRoot.js'
import getOptionsConfig from '@/core/utils/getOptionsConfig.js'

import App from './components/App/index.js'
import { getOptions } from './modules/options.js'

async function main(): Promise<void> {
  const [options, optionsConfig] = await Promise.all([
    getOptions(),
    getOptionsConfig(),
  ])

  // if missing option, open options page to init options
  const missingOptionNames = (
    Object.keys(optionsConfig) as readonly ValueOf<typeof OPTIONS>[]
  ).filter((optionName) => options[optionName] === undefined)
  if (missingOptionNames.length > 0) {
    await webExtension.runtime.openOptionsPage()
    return
  }

  createAndRenderRoot(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

main().catch(console.error)
