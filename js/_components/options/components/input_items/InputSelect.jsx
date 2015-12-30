import element from 'virtual-element'

function afterUpdate({props}) {
  const optionInput = document.getElementsByName(props.optionName)[0]

  optionInput.focus()
}

function changeHandler(event, {props}) {
  const newOptionValue = event.delegateTarget.value.trim().replace('\s+', ' ')

  globals.updateOptionsState(props.options, props.optionName, newOptionValue)
}

function render({props}) {
  const optionName = props.optionName

  const optionValue = props.options[optionName]

  const optionItems = props.optionConfig.choices.map((optionChoice) => {
    return (
      <option selected={optionValue === optionChoice}>
        {optionChoice}
      </option>
    )
  })

  return (
    <div class='input-select-box'>
      <input name={optionName} type='text' value={optionValue} onChange={changeHandler} />
      <select onChange={changeHandler}>{optionItems}</select>
    </div>
  )
}

export default {afterUpdate, render}
