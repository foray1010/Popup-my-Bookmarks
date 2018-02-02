import R from 'ramda'
import {connect} from 'react-redux'

import {Creators as navigationCreators} from '../../reduxs/navigationRedux'
import NavBar from './NavBar'

const mapDispatchToProps = R.pick(['switchNavModule'], navigationCreators)

const mapStateToProps = (state) => ({
  selectedNavModule: state.navigation.selectedNavModule
})

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
