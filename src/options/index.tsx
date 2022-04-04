import '../manifest.yml'

import * as React from 'react'

import { createAndRenderRoot } from '../core/utils'
import App from './components/App'

createAndRenderRoot(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
