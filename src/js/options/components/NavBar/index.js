import {connect} from 'react-redux'

import {switchNavModule} from '../../actions'
import NavBar from './NavBar'

const mapDispatchToProps = {
  switchNavModule
}

const mapStateToProps = (state) => ({
  selectedNavModule: state.selectedNavModule
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
