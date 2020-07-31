import '../manifest.yml'

import * as React from 'react'
import { ReactQueryDevtools } from 'react-query-devtools'

import { renderToBody } from '../core/utils'
import App from './components/App'

renderToBody(
  <React.StrictMode>
    <App />
    {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools /> : null}
  </React.StrictMode>,
)
