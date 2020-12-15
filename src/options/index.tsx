import '../manifest.yml'

import * as React from 'react'

import { renderToBody } from '../core/utils'
import App from './components/App'

renderToBody(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
