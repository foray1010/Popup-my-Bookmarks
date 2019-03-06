import * as React from 'react'
import {connect} from 'react-redux'

import {NAV_MODULE} from '../constants'
import {RootState} from '../reduxs'
import Contributors from './Contributors'
import OptionForm from './OptionForm'

const mapStateToProps = (state: RootState) => ({
  selectedNavModule: state.navigation.selectedNavModule
})

type Props = ReturnType<typeof mapStateToProps>
const NavModuleMapper = (props: Props) => {
  switch (props.selectedNavModule) {
    case NAV_MODULE.CONTRIBUTORS:
      return <Contributors />

    case NAV_MODULE.CONTROL:
    case NAV_MODULE.GENERAL:
    case NAV_MODULE.USER_INTERFACE:
      return <OptionForm />

    default:
      return null
  }
}

export default connect(mapStateToProps)(NavModuleMapper)
