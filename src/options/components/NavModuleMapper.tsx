import { NAV_MODULE } from '../constants'
import Contributors from './Contributors'
import { useNavigationContext } from './navigationContext'
import OptionForm from './OptionForm'

const NavModuleMapper = () => {
  const { selectedNavModule } = useNavigationContext()

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
