import './globals.css'

import { ReactQueryDevtools } from 'react-query/devtools'

import { ReactQueryClientProvider } from '../../../core/utils/queryClient'
import Donate from '../Donate'
import NavBar from '../NavBar'
import { NavigationProvider } from '../navigationContext'
import Router from '../Router'
import classes from './styles.css'

const App = () => (
  <ReactQueryClientProvider>
    <NavigationProvider>
      <div className={classes.main}>
        <NavBar />
        <Router />
        <Donate />
      </div>
    </NavigationProvider>

    {process.env.NODE_ENV === 'development' ? (
      <ReactQueryDevtools initialIsOpen={false} />
    ) : null}
  </ReactQueryClientProvider>
)

export default App
