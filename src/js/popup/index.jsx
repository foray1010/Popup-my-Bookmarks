import 'babel-polyfill'
import {createElement} from 'react'
import {Provider} from 'react-redux'
import {render} from 'react-dom'
import {static as Immutable} from 'seamless-immutable'

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
  const options = await chromep.storage.sync.get(null)

  /* if first run */
  const optionsConfig = await getOptionsConfig()
  for (const optionName of Object.keys(optionsConfig)) {
    if (options[optionName] === undefined) {
      await openOptionsPage()
      return
    }
  }

  /* Create a Redux store to handle all UI actions and side-effects */
  const store = configureStore(reducers, Immutable({
    itemOffsetHeight: getItemOffsetHeight(options),
    options: options,
    rootTree: await getRootTree(options),
    trees: await initTrees(options)
  }))

  /* render the app */
  render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('root'))
}().catch((err) => console.error(err.stack))
