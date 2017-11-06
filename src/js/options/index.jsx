import 'babel-polyfill'
import Immutable from 'seamless-immutable'
import {createElement} from 'react'
import {Provider} from 'react-redux'
import {render} from 'react-dom'

import '../../manifest.yml'
import App from './components/App'
import configureStore from '../common/store/configureStore'
import getOptionsConfig from '../common/lib/getOptionsConfig'
import reducers from './reducers'
import {initOptionsValue} from './functions'
import {NAV_MODULE_GENERAL} from './constants'

!(async () => {
  const optionsConfig = await getOptionsConfig()

  const options = await initOptionsValue(optionsConfig)

  /* Create a Redux store to handle all UI actions and side-effects */
  const store = configureStore(
    reducers,
    Immutable({
      options: options,
      optionsConfig: optionsConfig,
      selectedNavModule: NAV_MODULE_GENERAL
    })
  )

  /* render the app */
  const rootEl = document.createElement('div')
  document.body.appendChild(rootEl)
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootEl
  )
})().catch((err) => console.error(err.stack))
