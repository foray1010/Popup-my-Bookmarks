import {element} from 'deku'

import {
  initOptionsValue,
  setPermission
} from '../functions'
import {
  OPTION_TABLE_MAP
} from '../constants'
import {
  updateOptions
} from '../actions'
import chromep from '../../lib/chromePromise'

const msgConfirm = chrome.i18n.getMessage('confirm')
const msgDefault = chrome.i18n.getMessage('default')

const confirmButtonHandler = (model) => async () => {
  const {context, dispatch} = model

  const {options, optionsConfig, selectedNavModule} = context

  const newOptions = options.asMutable()

  for (const optionName of OPTION_TABLE_MAP[selectedNavModule]) {
    const optionConfig = optionsConfig[optionName]

    if (optionConfig.permissions) {
      const isSuccess = await setPermission(
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

  dispatch(updateOptions(newOptions))
}

const defaultButtonHandler = (model) => async () => {
  const {context, dispatch} = model

  const {optionsConfig} = context

  await chromep.storage.sync.clear()

  const newOptions = await initOptionsValue(optionsConfig)

  dispatch(updateOptions(newOptions))
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
