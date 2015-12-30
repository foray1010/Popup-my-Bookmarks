import element from 'virtual-element'

function changeHandler(event, {props}) {
  const el = event.delegateTarget
  const optionConfig = props.optionConfig
  const optionName = props.optionName

  const newOptionValue = parseInt(el.value, 10)

  if (isNaN(newOptionValue) ||
      newOptionValue < optionConfig.minimum ||
      newOptionValue > optionConfig.maximum) {
    el.value = props.options[optionName]
  } else {
    globals.updateOptionsState(props.options, optionName, newOptionValue)
  }
}

function render({props}) {
  const optionConfig = props.optionConfig
  const optionName = props.optionName

  const optionValue = props.options[optionName]

  return (
    <input
      name={optionName}
      type='number'
      min={optionConfig.minimum}
      max={optionConfig.maximum}
      value={String(optionValue)}
      onChange={changeHandler}
    />
  )
}

export default {render}
