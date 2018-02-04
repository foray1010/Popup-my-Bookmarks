import 'babel-polyfill'

import '../../manifest.yml'

import {createElement} from 'react'
import {Provider} from 'react-redux'
import Immutable from 'seamless-immutable'

import {renderToBody} from '../common/functions'
import configureStore from '../common/store/configureStore'
import App from './components/App'
import {initOptions} from './functions'
import {rootReducer, rootSaga} from './reduxs'

const main = async () => {
  const options = await initOptions()

  /* Create a Redux store to handle all UI actions and side-effects */
  const store = configureStore({
    rootReducer,
    rootSaga,
    preloadedState: Immutable({
      options
    })
  })

  /* render the app */
  renderToBody(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

main().catch((err) => console.error(err.stack))
