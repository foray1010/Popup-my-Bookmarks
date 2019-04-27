import 'core-js/es'

import '../../manifest.yml'

import * as React from 'react'
import {Provider} from 'react-redux'

import configureStore from '../common/store/configureStore'
import {renderToBody} from '../common/utils'
import App from './components/App'
import {rootReducer, rootSaga} from './reduxs'
import {initOptions} from './utils'

const main = async (): Promise<void> => {
  const options = await initOptions()

  const store = configureStore({
    rootReducer,
    rootSaga,
    preloadedState: {options}
  })

  renderToBody(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}

main().catch((err: Error) => {
  console.error(err)
})
