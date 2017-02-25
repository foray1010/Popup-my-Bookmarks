import {createElement, PropTypes} from 'react'

import Option from './Option'

import '../../../../../css/options/select-button.css'

const SelectButton = (props) => {
  const {
    optionName,
    optionValue,
    updateSingleOption
  } = props

  const optionChoices = [true, false]
  const selectdButtonIndex = optionValue ? 0 : 1

  const leftPercentage = selectdButtonIndex * (100 / optionChoices.length)

  const optionItems = optionChoices.map((optionChoice) => (
    <Option
      key={String(optionChoice)}
      optionChoice={optionChoice}
      optionName={optionName}
      optionValue={optionValue}
      updateSingleOption={updateSingleOption}
    />
  ))

  return (
    <div styleName='main'>
      <div
        styleName='cover'
        style={{
          left: `${leftPercentage}%`
        }}
      />
      {optionItems}
    </div>
  )
}

SelectButton.propTypes = {
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.bool.isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default SelectButton
