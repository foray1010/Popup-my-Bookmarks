import { useSelector } from 'react-redux'

import { NAV_MODULE } from '../constants'
import type { RootState } from '../reduxs'
import Contributors from './Contributors'
import OptionForm from './OptionForm'

const NavModuleMapper = () => {
  const selectedNavModule = useSelector(
    (state: RootState) => state.navigation.selectedNavModule,
  )

  switch (selectedNavModule) {
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

export default NavModuleMapper
