import 'babel-polyfill'
import {createApp, element} from 'deku'

import './_components/common'
import './_components/options/globals'
import App from './_components/options/containers/App'
import configureStore from './_components/store/configureStore'
import getOptionsConfig from './_components/getOptionsConfig'
import Immutable from 'seamless-immutable'
import reducers from './_components/options/reducers'

!async function () {
  globals.optionsConfig = await getOptionsConfig()

  await globals.initOptionsValue()

  /* Create a Redux store to handle all UI actions and side-effects */
  const options = await chromep.storage.sync.get(null)

  const store = configureStore(reducers, Immutable({
    options: options,
    selectedNavModule: 'general'
  }))

  /* render the app */
  const render = createApp(document.getElementById('container'), store.dispatch)

  const renderer = () => render(<App />, store.getState())

  renderer()
  store.subscribe(renderer)
}().catch((err) => console.error(err.stack))
