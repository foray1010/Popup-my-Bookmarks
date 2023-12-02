import '../manifest.yml'

import { StrictMode } from 'react'

import createAndRenderRoot from '../core/utils/createAndRenderRoot.js'
import App from './components/App/index.js'

createAndRenderRoot(
  <StrictMode>
    <App />
  </StrictMode>,
)
