import {element} from 'deku'

import {reloadOptions} from '../actions'
import chromep from '../../lib/chromePromise'

const msgConfirm = chrome.i18n.getMessage('confirm')
const msgDefault = chrome.i18n.getMessage('default')

const confirmButtonHandler = (model) => async () => {
  const {context, dispatch} = model

  const {options, selectedNavModule} = context

  const newOptions = options.asMutable()

  for (const optionName of globals.optionTableMap[selectedNavModule]) {
    const optionConfig = globals.optionsConfig[optionName]

    if (optionConfig.permissions) {
      const isSuccess = await globals.setPermission(
        optionName,
        optionConfig,
        newOptions[optionName]
      )

      if (!isSuccess) {
        newOptions[optionName] = optionConfig.default
      }
    }
  }

  await chromep.storage.sync.set(newOptions)

  dispatch(await reloadOptions())
}

const defaultButtonHandler = (model) => async () => {
  const {dispatch} = model

  await chromep.storage.sync.clear()

  await globals.initOptionsValue()

  dispatch(await reloadOptions())
}

const OptionButton = {
  render(model) {
    return (
      <div id='option-button-box'>
        <button onClick={confirmButtonHandler(model)}>{msgConfirm}</button>
        <button onClick={defaultButtonHandler(model)}>{msgDefault}</button>
      </div>
    )
  }
}

export default OptionButton
