import './globals.module.css'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { ReactQueryClientProvider } from '../../../core/utils/queryClient'
import withProviders from '../../../core/utils/withProviders'
import Donate from '../Donate'
import NavBar from '../NavBar'
import { NavigationProvider } from '../navigationContext'
import Router from '../Router'
import classes from './styles.module.css'

function InnerApp() {
  return (
    <>
      <div className={classes.main}>
        <NavBar />
        <Router />
        <Donate />
      </div>

      {process.env.NODE_ENV === 'development' ? (
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
