import element from 'virtual-element'

import Contributors from './Contributors'
import OptionTable from './OptionTable'

function render({props}) {
  switch (props.currentModule) {
    case 'contributors':
      return <Contributors />

    case 'control':
    case 'general':
    case 'userInterface':
      return (
        <OptionTable
          currentModule={props.currentModule}
          options={props.options}
        />
      )

    default:
      return <div />
  }
}

export default {render}
