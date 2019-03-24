import '@babel/polyfill'

import '../../manifest.yml'

import * as R from 'ramda'
import * as React from 'react'
import {Provider} from 'react-redux'
import webExtension from 'webextension-polyfill'

import configureStore from '../common/store/configureStore'
import {Options, OptionsConfig} from '../common/types/options'
import {getOptionsConfig, renderToBody} from '../common/utils'
import App from './components/App'
import {rootReducer, rootSaga} from './reduxs'
import {LocalStorage} from './types/localStorage'

const main = async (): Promise<void> => {
  const [localStorage, options, optionsConfig]: [
    LocalStorage,
    Partial<Options>,
    OptionsConfig
  ] = await Promise.all([
    webExtension.storage.local.get(),
    webExtension.storage.sync.get(),
    getOptionsConfig()
  ])

  // if missing option, open options page to init options
  const missingOptionKeys = R.difference(Object.keys(optionsConfig), Object.keys(options))
  if (missingOptionKeys.length !== 0) {
    await webExtension.runtime.openOptionsPage()
    return
  }

  const store = configureStore({
    rootReducer,
    rootSaga,
    preloadedState: {
      lastPositions: localStorage.lastPositions || [],
      options
    }
  })

  renderToBody(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}

main().catch((err) => {
  console.error(err)
})
