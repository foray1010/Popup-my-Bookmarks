import 'babel-polyfill'

import '../../manifest.yml'

import R from 'ramda'
import {createElement} from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import Immutable from 'seamless-immutable'
import webExtension from 'webextension-polyfill'

import getOptionsConfig from '../common/lib/getOptionsConfig'
import configureStore from '../common/store/configureStore'
import App from './components/App'
import {getItemOffsetHeight, getRootTree, initTrees} from './functions'
import reducers from './reducers'

const main = async () => {
  const optionsPromise = webExtension.storage.sync.get(null)
  const optionsConfigPromise = getOptionsConfig()

  const options = await optionsPromise
  const optionsConfig = await optionsConfigPromise

  /* if missing option */
  const missingOptionKeys = R.difference(Object.keys(optionsConfig), Object.keys(options))
  if (missingOptionKeys.length !== 0) {
    await webExtension.runtime.openOptionsPage()
    return
  }

  /* Create a Redux store to handle all UI actions and side-effects */
  const rootTreePromise = getRootTree(options)
  const treesPromise = initTrees(options)

  const rootTree = await rootTreePromise
  const trees = await treesPromise

  const store = configureStore({
    rootReducer: reducers,
    preloadedState: Immutable({
      itemOffsetHeight: getItemOffsetHeight(options),
      options,
      rootTree,
      trees
    })
  })

  /* render the app */
  const rootEl = document.createElement('div')
  document.body.appendChild(rootEl)
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootEl
  )
}

main().catch((err) => console.error(err.stack))
