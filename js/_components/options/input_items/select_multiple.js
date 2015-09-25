import element from 'virtual-element'

function changeHandler(event, {props}) {
  const optionName = props.optionName
  const targetValue = parseInt(event.delegateTarget.value, 10)

  const newOptionValue = props.options[optionName].asMutable()

  const targetValueIndex = newOptionValue.indexOf(targetValue)

  const wasChecked = targetValueIndex >= 0

  if (wasChecked) {
    newOptionValue.splice(targetValueIndex, 1)
  } else {
    newOptionValue.push(targetValue)
    newOptionValue.sort()
  }

  globals.updateOptionsState(props.options, optionName, newOptionValue)
}

function render({props}) {
  const checkboxItems = []
  const optionName = props.optionName

  const optionValue = props.options[optionName]

  props.optionConfig.choices.forEach((optionChoice, optionChoiceIndex) => {
    if (optionChoice !== undefined) {
      const isChecked = optionValue.indexOf(optionChoiceIndex) >= 0

      checkboxItems.push(
        <label>
          <input
            name={props.optionName}
            type='checkbox'
            value={String(optionChoiceIndex)}
            checked={isChecked}
            onChange={changeHandler} />
          {optionChoice}
        </label>
      )
    }
  })

  return (
    <div class='select-multiple-box'>
      {checkboxItems}
    </div>
  )
}

export default {render}
