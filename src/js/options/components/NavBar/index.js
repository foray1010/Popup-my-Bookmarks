import {connect} from 'react-redux'

import NavBar from './NavBar'
import {switchNavModule} from '../../actions'

const mapDispatchToProps = {
  switchNavModule
}

const mapStateToProps = (state) => ({
  selectedNavModule: state.selectedNavModule
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
