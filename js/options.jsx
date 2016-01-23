import 'babel-polyfill'
import {createApp, element} from 'deku'

import {
  initOptionsValue
} from './_components/options/functions'
import {
  NAV_MODULE_GENERAL
} from './_components/options/constants'
import App from './_components/options/containers/App'
import configureStore from './_components/store/configureStore'
import getOptionsConfig from './_components/getOptionsConfig'
import Immutable from 'seamless-immutable'
import reducers from './_components/options/reducers'

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
  const render = createApp(document.getElementById('container'), store.dispatch)

  const renderer = () => render(<App />, store.getState())

  renderer()
  store.subscribe(renderer)
}().catch((err) => console.error(err.stack))
