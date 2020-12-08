import ReactQueryDefaultConfigProvider from '../../core/utils/ReactQueryDefaultConfigProvider'
import classes from './app.css'
import Donate from './Donate'
import NavBar from './NavBar'
import { NavigationProvider } from './navigationContext'
import Router from './Router'

const App = () => (
  <ReactQueryDefaultConfigProvider>
    <NavigationProvider>
      <div className={classes.main}>
        <NavBar />
        <Router />
        <Donate />
      </div>
    </NavigationProvider>
  </ReactQueryDefaultConfigProvider>
)

export default App
