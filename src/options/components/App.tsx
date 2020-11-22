import classes from './app.css'
import Donate from './Donate'
import NavBar from './NavBar'
import NavModuleMapper from './NavModuleMapper'

const App = () => (
  <div className={classes.main}>
    <NavBar />
    <NavModuleMapper />
    <Donate />
  </div>
)

export default App
