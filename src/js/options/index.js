// @flow strict @jsx createElement

import '@babel/polyfill'

import '../../manifest.yml'

import {createElement} from 'react'
import {Provider} from 'react-redux'

import configureStore from '../common/store/configureStore'
import {renderToBody} from '../common/utils'
import App from './components/App'
import {rootReducer, rootSaga} from './reduxs'
import {initOptions} from './utils'

const main = async () => {
  const options = await initOptions()

  const store = configureStore({
    rootReducer,
    rootSaga,
    preloadedState: {options}
  })

  renderToBody(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

main().catch((err) => console.error(err.stack))
