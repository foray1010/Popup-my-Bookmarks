import {element} from 'deku'

import Contributors from './Contributors'
import OptionTable from './OptionTable'

const NavModuleMapper = {
  render(model) {
    const {context} = model

    const {selectedNavModule} = context

    switch (selectedNavModule) {
      case 'contributors':
        return <Contributors />

      case 'control':
      case 'general':
      case 'userInterface':
        return (
          <OptionTable />
        )

      default:
        return <main />
    }
  }
}

export default NavModuleMapper
