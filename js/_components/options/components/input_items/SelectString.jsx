import {element} from 'deku'

import {updateSingleOption} from '../../actions'

const changeHandler = (model) => (evt) => {
  const {dispatch, props} = model

  const {optionName} = props
  const newOptionValue = parseInt(evt.target.value, 10)

  dispatch(updateSingleOption(optionName, newOptionValue))
}

const OptionInput = {
  render(model) {
    const {context, props} = model

    const {optionChoice, optionChoiceIndex, optionName} = props
    const {options} = context

    const optionValue = options[optionName]

    return (
      <option
        value={String(optionChoiceIndex)}
        selected={optionChoiceIndex === optionValue}
      >
        {optionChoice}
      </option>
    )
  }
}

const SelectString = {
  render(model) {
    const {props} = model

    const {optionConfig, optionName} = props

    const optionItems = []

    optionConfig.choices.forEach((optionChoice, optionChoiceIndex) => {
      if (optionChoice !== undefined) {
        optionItems.push(
          <OptionInput
            key={String(optionChoiceIndex)}
            optionChoice={optionChoice}
            optionChoiceIndex={optionChoiceIndex}
            optionName={optionName}
          />
        )
      }
    })

    return (
      <select name={optionName} onChange={changeHandler(model)}>
        {optionItems}
      </select>
    )
  }
}

export default SelectString
