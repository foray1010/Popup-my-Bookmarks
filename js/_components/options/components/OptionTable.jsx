import {element} from 'deku'

import {
  OPTION_TABLE_MAP
} from '../constants'
import OptionButton from './OptionButton'
import OptionItem from './OptionItem'

const OptionTable = {
  render(model) {
    const {context} = model

    const {options, selectedNavModule} = context

    const selectedOptionTableMap = OPTION_TABLE_MAP[selectedNavModule]

    const optionTableItems = []

    for (const optionName of selectedOptionTableMap) {
      if (options[optionName] !== undefined) {
        optionTableItems.push(
          <OptionItem
            key={optionName}
            optionName={optionName}
          />
        )
      }
    }

    return (
      <main>
        <div id='option-table'>
          {optionTableItems}
        </div>
        <OptionButton />
      </main>
    )
  }
}

export default OptionTable
