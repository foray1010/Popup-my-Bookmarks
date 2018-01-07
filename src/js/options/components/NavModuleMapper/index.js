import {connect} from 'react-redux'

import NavModuleMapper from './NavModuleMapper'

const mapStateToProps = (state) => ({
  selectedNavModule: state.navigation.selectedNavModule
})

export default connect(mapStateToProps)(NavModuleMapper)
