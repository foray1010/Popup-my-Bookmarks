import './globals.module.css'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { ReactQueryClientProvider } from '../../../core/utils/queryClient.js'
import withProviders from '../../../core/utils/withProviders.js'
import Donate from '../Donate.js'
import NavBar from '../NavBar/index.js'
import { NavigationProvider } from '../navigationContext.js'
import Router from '../Router.js'

function InnerApp() {
  return (
    <>
      <NavBar />
      <Router />
      <Donate />

      {process.env['NODE_ENV'] === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </>
  )
}

const App = withProviders(InnerApp, [
  ReactQueryClientProvider,
  NavigationProvider,
])
export default App
