import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import Option from './Option'
import styles from '../../../../../css/options/select-multiple.scss'

const SelectMultiple = (props) => {
  const {
    optionConfig,
    optionName
  } = props

  const checkboxItems = []

  for (const [optionChoiceIndex, optionChoice] of optionConfig.choices.entries()) {
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
  }

  return (
    <span styleName='main'>
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

export default CSSModules(SelectMultiple, styles)
