import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import Option from './Option'

import styles from '../../../../../css/options/select-multiple.css'

const SelectMultiple = (props) => {
  const {
    choices,
    optionName,
    optionValue,
    updateSingleOption
  } = props

  const checkboxItems = []
  for (const [optionChoiceIndex, optionChoice] of choices.entries()) {
    if (optionChoice !== undefined) {
      checkboxItems.push(
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
  }

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

export default CSSModules(SelectMultiple, styles)
