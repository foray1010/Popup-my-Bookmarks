import '../../../../../css/options/select-multiple.css'

import PropTypes from 'prop-types'
import {createElement} from 'react'

import Option from './Option'

const SelectMultiple = (props) => (
  <span styleName='main'>
    {props.choices.reduce((accumulator, optionChoice, optionChoiceIndex) => {
      if (optionChoice !== undefined) {
        return [
          ...accumulator,
          <Option
            key={String(optionChoiceIndex)}
            optionChoice={optionChoice}
            optionChoiceIndex={optionChoiceIndex}
            optionName={props.optionName}
            optionValue={props.optionValue}
            updateSingleOption={props.updateSingleOption}
          />
        ]
      }

      return accumulator
    }, [])}
  </span>
)

SelectMultiple.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.arrayOf(PropTypes.number).isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default SelectMultiple
