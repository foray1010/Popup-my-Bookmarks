import {connect} from 'react-redux'
import {createElement, PropTypes} from 'react'

import {
  NAV_MODULE_CONTRIBUTORS,
  NAV_MODULE_CONTROL,
  NAV_MODULE_GENERAL,
  NAV_MODULE_USER_INTERFACE
} from '../constants'
import Contributors from './Contributors'
import OptionForm from './OptionForm'

const NavModuleMapper = (props) => {
  const {selectedNavModule} = props

  switch (selectedNavModule) {
    case NAV_MODULE_CONTRIBUTORS:
      return <Contributors />

    case NAV_MODULE_CONTROL:
    case NAV_MODULE_GENERAL:
    case NAV_MODULE_USER_INTERFACE:
      return <OptionForm />

    default:
      return null
  }
}

NavModuleMapper.propTypes = {
  selectedNavModule: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  selectedNavModule: state.selectedNavModule
})

export default connect(mapStateToProps)(NavModuleMapper)
