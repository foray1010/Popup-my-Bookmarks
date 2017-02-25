import {createElement, PropTypes} from 'react'

import Option from './Option'

import '../../../../../css/options/select-multiple.css'

const SelectMultiple = (props) => {
  const {
    choices,
    optionName,
    optionValue,
    updateSingleOption
  } = props

  const checkboxItems = choices
    .reduce((accumulator, optionChoice, optionChoiceIndex) => {
      if (optionChoice !== undefined) {
        return accumulator.concat(
          <Option
            key={String(optionChoiceIndex)}
            optionChoice={optionChoice}
            optionChoiceIndex={optionChoiceIndex}
            optionName={optionName}
            optionValue={optionValue}
            updateSingleOption={updateSingleOption}
          />
        )
      }

      return accumulator
    }, [])

  return (
    <span styleName='main'>
      {checkboxItems}
    </span>
  )
}

SelectMultiple.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.arrayOf(PropTypes.number).isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default SelectMultiple
