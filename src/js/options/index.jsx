import 'babel-polyfill'
import Immutable from 'seamless-immutable'
import {createElement} from 'react'
import {Provider} from 'react-redux'
import {render} from 'react-dom'

import '../../manifest.yml'
import App from './components/App'
import configureStore from '../common/store/configureStore'
import getOptionsConfig from '../common/lib/getOptionsConfig'
import reducers from './reduxs'
import sagas from './sagas'
import {initOptionsValue} from './functions'

const main = async () => {
  const optionsConfig = await getOptionsConfig()

  const options = await initOptionsValue(optionsConfig)

  /* Create a Redux store to handle all UI actions and side-effects */
  const store = configureStore({
    reducers,
    sagas,
    preloadedState: Immutable({
      options
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
