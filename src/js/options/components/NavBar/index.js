import R from 'ramda'
import {connect} from 'react-redux'

import NavBar from './NavBar'
import {Creators as navigationCreators} from '../../reduxs/navigationRedux'

const mapDispatchToProps = R.pick(['switchNavModule'], navigationCreators)

const mapStateToProps = (state) => ({
  selectedNavModule: state.navigation.selectedNavModule
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
