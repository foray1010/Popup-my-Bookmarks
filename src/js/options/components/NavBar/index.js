import R from 'ramda'
import {connect} from 'react-redux'

import {navigationCreators} from '../../reduxs'
import NavBar from './NavBar'

const mapDispatchToProps = R.pick(['switchNavModule'], navigationCreators)

const mapStateToProps = (state) => ({
  selectedNavModule: state.navigation.selectedNavModule
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
