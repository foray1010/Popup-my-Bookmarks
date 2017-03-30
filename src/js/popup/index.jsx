import 'babel-polyfill'
import {createElement} from 'react'
import {Provider} from 'react-redux'
import {render} from 'react-dom'
import _difference from 'lodash/difference'
import Immutable from 'seamless-immutable'

import '../../manifest.yml'
import {
  getItemOffsetHeight,
  getRootTree,
  initTrees,
  openOptionsPage
} from './functions'
import App from './components/App'
import chromep from '../common/lib/chromePromise'
import configureStore from '../common/store/configureStore'
import getOptionsConfig from '../common/lib/getOptionsConfig'
import reducers from './reducers'

!async function () {
  const optionsPromise = chromep.storage.sync.get(null)
  const optionsConfigPromise = getOptionsConfig()

  const options = await optionsPromise
  const optionsConfig = await optionsConfigPromise

  /* if missing option */
  const missingOptionKeys = _difference(
    Object.keys(optionsConfig),
    Object.keys(options)
  )
  if (missingOptionKeys.length !== 0) {
    openOptionsPage()
    return
  }

  /* Create a Redux store to handle all UI actions and side-effects */
  const rootTreePromise = getRootTree(options)
  const treesPromise = initTrees(options)

  const rootTree = await rootTreePromise
  const trees = await treesPromise

  const store = configureStore(reducers, Immutable({
    itemOffsetHeight: getItemOffsetHeight(options),
    options: options,
    rootTree: rootTree,
    trees: trees
  }))

  /* render the app */
  render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('root'))
}().catch((err) => console.error(err.stack))
