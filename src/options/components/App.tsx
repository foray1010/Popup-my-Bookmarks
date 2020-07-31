import ReactQueryDefaultConfigProvider from '../../core/utils/ReactQueryDefaultConfigProvider'
import classes from './app.css'
import Donate from './Donate'
import NavBar from './NavBar'
import { NavigationProvider } from './navigationContext'
import NavModuleMapper from './NavModuleMapper'

const App = () => (
  <ReactQueryDefaultConfigProvider>
    <NavigationProvider>
      <div className={classes.main}>
        <NavBar />
        <NavModuleMapper />
        <Donate />
      </div>
    </NavigationProvider>
  </ReactQueryDefaultConfigProvider>
)

export default App
