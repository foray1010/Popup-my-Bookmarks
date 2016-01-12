import {element} from 'deku'

import {updateSingleOption} from '../../actions'

const msgNo = chrome.i18n.getMessage('opt_no')
const msgYes = chrome.i18n.getMessage('opt_yes')

const changeHandler = (model) => (evt) => {
  const {dispatch, props} = model

  const {optionName} = props

  const newOptionValue = evt.target.value === 'true'

  dispatch(updateSingleOption(optionName, newOptionValue))
}

const OptionInput = {
  render(model) {
    const {context, props} = model

    const {optionChoice, optionName} = props
    const {options} = context

    const optionValue = options[optionName]

    const buttonText = optionChoice ? msgYes : msgNo
    const isChecked = optionValue === optionChoice
    const selectButtonClasses = ['select-button-item']

    if (isChecked) {
      selectButtonClasses.push('select-button-item-active')
    }

    return (
      <label class={selectButtonClasses.join(' ')}>
        <input
          name={optionName}
          type='radio'
          value={String(optionChoice)}
          checked={isChecked}
          hidden
          onChange={changeHandler(model)}
        />
        {buttonText}
      </label>
    )
  }
}

const SelectButton = {
  render(model) {
    const {context, props} = model

    const {optionName} = props
    const {options} = context

    const optionValue = options[optionName]

    const optionItems = [true, false].map((optionChoice) => {
      return (
        <OptionInput
          key={String(optionChoice)}
          optionChoice={optionChoice}
          optionName={optionName}
        />
      )
    })
    const selectdButtonIndex = optionValue ? 0 : 1

    const selectButtonCoverStyle = `left: ${selectdButtonIndex * 50}%`

    return (
      <div class='select-button-box'>
        <div class='select-button-cover' style={selectButtonCoverStyle} />
        {optionItems}
      </div>
    )
  }
}

export default SelectButton
