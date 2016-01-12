import {element} from 'deku'

import {updateSingleOption} from '../../actions'

const changeHandler = (model) => (evt) => {
  const {context, dispatch, props} = model

  const {optionConfig, optionName} = props
  const {options} = context

  const el = evt.target

  const newOptionValue = parseInt(el.value, 10)

  if (isNaN(newOptionValue) ||
      newOptionValue < optionConfig.minimum ||
      newOptionValue > optionConfig.maximum) {
    el.value = options[optionName]
  } else {
    dispatch(updateSingleOption(optionName, newOptionValue))
  }
}

const InputNumber = {
  render(model) {
    const {context, props} = model

    const {optionConfig, optionName} = props
    const {options} = context

    const optionValue = options[optionName]

    return (
      <input
        name={optionName}
        type='number'
        min={optionConfig.minimum}
        max={optionConfig.maximum}
        value={String(optionValue)}
        onChange={changeHandler(model)}
      />
    )
  }
}

export default InputNumber
