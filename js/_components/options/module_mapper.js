import element from 'virtual-element'

import Contributors from './contributors'
import OptionTable from './option_table'

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
          options={props.options} />
      )

    default:
      return <div />
  }
}

export default {render}
