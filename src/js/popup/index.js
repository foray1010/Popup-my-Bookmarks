// @flow strict @jsx createElement

import 'babel-polyfill'

import '../../manifest.yml'

import * as R from 'ramda'
import {createElement} from 'react'
import {Provider} from 'react-redux'
import webExtension from 'webextension-polyfill'

import configureStore from '../common/store/configureStore'
import {getOptionsConfig, renderToBody} from '../common/utils'
import App from './components/App'
import {rootReducer, rootSaga} from './reduxs'

const main = async () => {
  const [options, optionsConfig] = await Promise.all([
    webExtension.storage.sync.get(null),
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
    preloadedState: {options}
  })

  renderToBody(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

main().catch((err) => console.error(err.stack))
