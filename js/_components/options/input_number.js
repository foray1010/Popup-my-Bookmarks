import element from 'virtual-element'

function changeHandler(event, {props}) {
  const el = event.delegateTarget
  const optionName = props.optionName

  const newOptionValue = parseInt(el.value, 10)

  if (isNaN(newOptionValue) ||
      newOptionValue < props.optionChoices[0] ||
      newOptionValue > props.optionChoices[1]) {
    el.value = props.options[optionName]
  } else {
    globals.updateOptionsState(props.options, optionName, newOptionValue)
  }
}

function render({props}) {
  const optionName = props.optionName

  const optionValue = props.options[optionName]

  return (
    <input
      name={optionName}
      type='number'
      min={props.optionChoices[0]}
      max={props.optionChoices[1]}
      value={optionValue}
      onChange={changeHandler} />
  )
}

export default {render}
