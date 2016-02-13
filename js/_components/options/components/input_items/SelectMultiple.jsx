import {element} from 'deku'

import {updateSingleOption} from '../../actions'

const changeHandler = (model) => (evt) => {
  const {context, dispatch, props} = model

  const {optionName} = props
  const {options} = context

  const newOptionValue = options[optionName].asMutable()
  const targetValue = parseInt(evt.target.value, 10)

  const targetValueIndex = newOptionValue.indexOf(targetValue)

  const wasChecked = targetValueIndex >= 0

  if (wasChecked) {
    newOptionValue.splice(targetValueIndex, 1)
  } else {
    newOptionValue.push(targetValue)
    newOptionValue.sort()
  }

  dispatch(updateSingleOption(optionName, newOptionValue))
}

const OptionInput = {
  render(model) {
    const {context, props} = model

    const {optionChoice, optionChoiceIndex, optionName} = props
    const {options} = context

    const optionValue = options[optionName]

    const isChecked = optionValue.includes(optionChoiceIndex)

    return (
      <label>
        <input
          name={optionName}
          type='checkbox'
          value={String(optionChoiceIndex)}
          checked={isChecked}
          onChange={changeHandler(model)}
        />
        {optionChoice}
      </label>
    )
  }
}

const SelectMultiple = {
  render(model) {
    const {props} = model

    const {optionConfig, optionName} = props

    const checkboxItems = []

    optionConfig.choices.forEach((optionChoice, optionChoiceIndex) => {
      if (optionChoice !== undefined) {
        checkboxItems.push(
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
      <div class='select-multiple-box'>
        {checkboxItems}
      </div>
    )
  }
}

export default SelectMultiple
