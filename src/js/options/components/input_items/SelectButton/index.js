import '../../../../../css/options/select-button.css'

import PropTypes from 'prop-types'
import R from 'ramda'
import {createElement} from 'react'

import Option from './Option'

const getLeftPercentage = R.compose(
  (x) => `${x}%`,
  (optionChoices, optionValue) => optionChoices.indexOf(optionValue) * (100 / optionChoices.length)
)

const SelectButton = (props) => (
  <div styleName='main'>
    <div
      styleName='cover'
      style={{
        left: getLeftPercentage(props.optionChoices, props.optionValue)
      }}
    />
    {props.optionChoices.map((optionChoice) => (
      <Option
        key={String(optionChoice)}
        optionChoice={optionChoice}
        optionName={props.optionName}
        optionValue={props.optionValue}
        updateSingleOption={props.updateSingleOption}
      />
    ))}
  </div>
)

SelectButton.defaultProps = {
  optionChoices: [true, false]
}

SelectButton.propTypes = {
  optionChoices: PropTypes.arrayOf(PropTypes.bool).isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.bool.isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default SelectButton
