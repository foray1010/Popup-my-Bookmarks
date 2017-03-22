import 'babel-polyfill'
import {createElement} from 'react'
import {Provider} from 'react-redux'
import {render} from 'react-dom'
import Immutable from 'seamless-immutable'

import '../../manifest.yml'
import {
  initOptionsValue
} from './functions'
import {
  NAV_MODULE_GENERAL
} from './constants'
import App from './components/App'
import configureStore from '../common/store/configureStore'
import getOptionsConfig from '../common/lib/getOptionsConfig'
import reducers from './reducers'

!async function () {
  const optionsConfig = await getOptionsConfig()

  const options = await initOptionsValue(optionsConfig)

  /* Create a Redux store to handle all UI actions and side-effects */
  const store = configureStore(reducers, Immutable({
    options: options,
    optionsConfig: optionsConfig,
    selectedNavModule: NAV_MODULE_GENERAL
  }))

  /* render the app */
  render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('root'))
}().catch((err) => console.error(err.stack))
