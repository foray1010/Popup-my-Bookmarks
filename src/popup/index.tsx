import '../manifest.yml'

import * as React from 'react'
import { Provider } from 'react-redux'
import webExtension from 'webextension-polyfill'

import type { OPTIONS } from '../core/constants'
import configureStore from '../core/store/configureStore'
import type { Options, OptionsConfig } from '../core/types/options'
import { getOptionsConfig, renderToBody } from '../core/utils'
import App from './components/App'
import { rootReducer, rootSaga } from './reduxs'
import type { LocalStorage } from './types/localStorage'

const main = async (): Promise<void> => {
  const [localStorage, options, optionsConfig] = await Promise.all<
    LocalStorage,
    Partial<Options>,
    OptionsConfig
  >([
    webExtension.storage.local.get(),
    webExtension.storage.sync.get(),
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
      lastPositions: localStorage.lastPositions ?? [],
      options,
    },
  })

  renderToBody(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  )
}

main().catch((err: Error) => {
  console.error(err)
})
