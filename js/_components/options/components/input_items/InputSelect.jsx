import {element} from 'deku'

import {updateSingleOption} from '../../actions'

const changeHandler = (model) => (evt) => {
  const {dispatch, props} = model

  const {optionName} = props

  const newOptionValue = evt.target.value.trim().replace(/\s+/g, ' ')

  dispatch(updateSingleOption(optionName, newOptionValue))
}

const InputSelect = {
  onUpdate(model) {
    const {props} = model

    const {optionName} = props

    const optionInput = document.getElementsByName(optionName)[0]

    optionInput.focus()
  },

  render(model) {
    const {context, props} = model

    const {optionConfig, optionName} = props
    const {options} = context

    const compiledChangeHandler = changeHandler(model)
    const optionValue = options[optionName]

    const optionItems = optionConfig.choices.map((optionChoice, optionChoiceIndex) => {
      return (
        <OptionInput
          key={String(optionChoiceIndex)}
          optionChoice={optionChoice}
          optionName={optionName}
        />
      )
    })

    return (
      <div class='input-select-box'>
        <input
          name={optionName}
          type='text'
          value={optionValue}
          onChange={compiledChangeHandler}
        />
        <select onChange={compiledChangeHandler}>{optionItems}</select>
      </div>
    )
  }
}

const OptionInput = {
  render(model) {
    const {context, props} = model

    const {optionChoice, optionName} = props
    const {options} = context

    const optionValue = options[optionName]

    return (
      <option selected={optionValue === optionChoice}>
        {optionChoice}
      </option>
    )
  }
}

export default InputSelect
