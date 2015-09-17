import element from 'virtual-element'

function afterRender({props}, el) {
  const optionChoices = props.optionChoices
  const optionValue = props.options[props.optionName]
  const selectButtonCoverEl = el.getElementsByClassName('select-button-cover')[0]

  const buttonIndex = optionChoices.indexOf(optionValue)
  const itemWidthPct = 100 / optionChoices.length

  selectButtonCoverEl.style.width = itemWidthPct + '%'
  selectButtonCoverEl.style.left = buttonIndex * itemWidthPct + '%'
}

function changeHandler(event, {props}) {
  const newOptionValue = event.delegateTarget.value === 'true'

  globals.updateOptionsState(props.options, props.optionName, newOptionValue)
}

function render({props}) {
  const optionName = props.optionName

  const optionValue = props.options[optionName]

  const optionItems = props.optionChoices.map((optionChoice) => {
    const buttonText = typeof optionChoice !== 'boolean' ?
      optionChoice : chrome.i18n.getMessage(optionChoice ? 'opt_yes' : 'opt_no')
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
          onChange={changeHandler} />
        {buttonText}
      </label>
    )
  })

  return (
    <div class='select-button-box'>
      <div class='select-button-cover' />
      {optionItems}
    </div>
  )
}

export default {afterRender, render}
