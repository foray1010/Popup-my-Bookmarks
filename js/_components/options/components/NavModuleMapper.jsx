import {element} from 'deku'

import {
  NAV_MODULE_CONTRIBUTORS,
  NAV_MODULE_CONTROL,
  NAV_MODULE_GENERAL,
  NAV_MODULE_USER_INTERFACE
} from '../constants'
import Contributors from './Contributors'
import OptionTable from './OptionTable'

const NavModuleMapper = {
  render(model) {
    const {context} = model

    const {selectedNavModule} = context

    switch (selectedNavModule) {
      case NAV_MODULE_CONTRIBUTORS:
        return <Contributors />

      case NAV_MODULE_CONTROL:
      case NAV_MODULE_GENERAL:
      case NAV_MODULE_USER_INTERFACE:
        return (
          <OptionTable />
        )

      default:
        return <main />
    }
  }
}

export default NavModuleMapper
