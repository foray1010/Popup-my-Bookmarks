import element from 'virtual-element'

async function confirmButtonHandler(event, {props}) {
  const currentModule = props.currentModule
  const newOptions = props.options.asMutable()

  for (const optionName of globals.optionTableMap[currentModule]) {
    const optionInfo = globals.optionsSchema.find((option) => option.name === optionName)

    if (optionInfo.permissions) {
      const isSuccess = await globals.setPermission(optionInfo, newOptions[optionName])

      if (!isSuccess) {
        newOptions[optionName] = optionInfo.defaultValue
      }
    }
  }

  await chromep.storage.sync.set(newOptions)

  const options = await globals.getCurrentModuleOptions(currentModule)

  globals.setRootState({
    options: Immutable(options)
  })
}

async function defaultButtonHandler(event, {props}) {
  await chromep.storage.sync.clear()

  await globals.initOptionsValue()

  const options = await globals.getCurrentModuleOptions(props.currentModule)

  globals.setRootState({
    options: Immutable(options)
  })
}

function render() {
  return (
    <div id='option-button-box'>
      <button onClick={confirmButtonHandler}>{chrome.i18n.getMessage('confirm')}</button>
      <button onClick={defaultButtonHandler}>{chrome.i18n.getMessage('default')}</button>
    </div>
  )
}

export default {render}
