import * as React from 'react'
import {connect} from 'react-redux'

import {
  NAV_MODULE_CONTRIBUTORS,
  NAV_MODULE_CONTROL,
  NAV_MODULE_GENERAL,
  NAV_MODULE_USER_INTERFACE
} from '../constants'
import {RootState} from '../reduxs'
import Contributors from './Contributors'
import OptionForm from './OptionForm'

const mapStateToProps = (state: RootState) => ({
  selectedNavModule: state.navigation.selectedNavModule
})

type Props = ReturnType<typeof mapStateToProps>
const NavModuleMapper = (props: Props) => {
  switch (props.selectedNavModule) {
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

export default connect(mapStateToProps)(NavModuleMapper)
