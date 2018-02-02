import 'babel-polyfill'

import '../../manifest.yml'

import {createElement} from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import Immutable from 'seamless-immutable'

import getOptionsConfig from '../common/lib/getOptionsConfig'
import configureStore from '../common/store/configureStore'
import App from './components/App'
import {initOptionsValue} from './functions'
import reducers from './reduxs'
import sagas from './sagas'

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
