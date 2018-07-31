// @flow strict

import {connect} from 'react-redux'

import {navigationCreators} from '../../reduxs'
import NavBar from './NavBar'

const mapDispatchToProps = {
  switchNavModule: navigationCreators.switchNavModule
}

const mapStateToProps = (state) => ({
  selectedNavModule: state.navigation.selectedNavModule
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
