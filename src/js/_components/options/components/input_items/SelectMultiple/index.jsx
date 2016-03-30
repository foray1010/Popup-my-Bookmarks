import {createElement, PropTypes} from 'react'

import Option from './Option'

const SelectMultiple = (props) => {
  const {
    optionConfig,
    optionName
  } = props

  const checkboxItems = []

  optionConfig.choices.forEach((optionChoice, optionChoiceIndex) => {
    if (optionChoice !== undefined) {
      checkboxItems.push(
        <Option
          key={String(optionChoiceIndex)}
          optionChoice={optionChoice}
          optionChoiceIndex={optionChoiceIndex}
          optionName={optionName}
        />
      )
    }
  })

  return (
    <span className='select-multiple-box'>
      {checkboxItems}
    </span>
  )
}

if (process.env.NODE_ENV !== 'production') {
  SelectMultiple.propTypes = {
    optionConfig: PropTypes.object.isRequired,
    optionName: PropTypes.string.isRequired
  }
}

export default SelectMultiple
