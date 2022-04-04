import '../manifest.yml'

import * as React from 'react'
import { Provider } from 'react-redux'
import webExtension from 'webextension-polyfill'

import type { OPTIONS } from '../core/constants'
import configureStore from '../core/store/configureStore'
import { createAndRenderRoot, getOptionsConfig } from '../core/utils'
import App from './components/App'
import { getOptions } from './modules/options'
import { rootReducer, rootSaga } from './reduxs'

async function main(): Promise<void> {
  const [options, optionsConfig] = await Promise.all([
    getOptions(),
    getOptionsConfig(),
  ])

  // if missing option, open options page to init options
  const missingOptionNames = (Object.keys(optionsConfig) as OPTIONS[]).filter(
    (optionName) => options[optionName] === undefined,
  )
  if (missingOptionNames.length > 0) {
    await webExtension.runtime.openOptionsPage()
    return
  }

  const store = configureStore({
    rootReducer,
    rootSaga,
    preloadedState: {
      options,
    },
  })

  createAndRenderRoot(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  )
}

main().catch(console.error)
