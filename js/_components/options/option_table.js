import element from 'virtual-element'

import OptionButton from './option_button'
import OptionItem from './option_item'

function render({props}) {
  const optionTableItems = globals.optionTableMap[props.currentModule].map((optionName) => {
    return (
      <OptionItem
        key={optionName}
        optionName={optionName}
        options={props.options} />
    )
  })

  return (
    <div>
      <div id='option-table'>
        {optionTableItems}
      </div>
      <OptionButton
        currentModule={props.currentModule}
        options={props.options} />
    </div>
  )
}

export default {render}
