import {connect} from 'react-redux'
import {createElement, PropTypes} from 'react'

import {
  OPTION_TABLE_MAP
} from '../constants'
import OptionButton from './OptionButton'
import OptionItem from './OptionItem'

const OptionTable = (props) => {
  const {
    options,
    selectedNavModule
  } = props

  const optionTableItems = []
  const selectedOptionTableMap = OPTION_TABLE_MAP[selectedNavModule]

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
    <form>
      <div>
        {optionTableItems}
      </div>
      <OptionButton />
    </form>
  )
}

OptionTable.propTypes = {
  options: PropTypes.object.isRequired,
  selectedNavModule: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  options: state.options,
  selectedNavModule: state.selectedNavModule
})

export default connect(mapStateToProps)(OptionTable)
