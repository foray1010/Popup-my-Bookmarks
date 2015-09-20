import element from 'virtual-element'

function changeHandler(event, {props}) {
  const newOptionValue = parseInt(event.delegateTarget.value, 10)

  globals.updateOptionsState(props.options, props.optionName, newOptionValue)
}

function render({props}) {
  const optionItems = []
  const optionName = props.optionName

  const optionValue = props.options[optionName]

  props.optionChoices.forEach((optionChoice, optionChoiceIndex) => {
    if (optionChoice !== undefined) {
      optionItems.push(
        <option
          value={String(optionChoiceIndex)}
          selected={optionChoiceIndex === optionValue}>
          {optionChoice}
        </option>
      )
    }
  })

  return <select name={optionName} onChange={changeHandler}>{optionItems}</select>
}

export default {render}
