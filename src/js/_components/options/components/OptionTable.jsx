import {connect} from 'react-redux'
import {createElement, PropTypes} from 'react'

import {
  OPTION_TABLE_MAP
} from '../constants'
import OptionButton from './OptionButton'
import OptionItem from './OptionItem'

const mapStateToProps = (state) => ({
  options: state.options,
  selectedNavModule: state.selectedNavModule
})

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
    <main>
      <div id='option-table'>
        {optionTableItems}
      </div>
      <OptionButton />
    </main>
  )
}

if (process.env.NODE_ENV !== 'production') {
  OptionTable.propTypes = {
    options: PropTypes.object.isRequired,
    selectedNavModule: PropTypes.string.isRequired
  }
}

export default connect(mapStateToProps)(OptionTable)
