import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

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

const mapStateToProps = (state) => ({
  options: state.options,
  optionsConfig: state.optionsConfig,
  selectedNavModule: state.selectedNavModule
})

@connect(mapStateToProps)
class OptionButton extends Component {
  @bind
  async confirmButtonHandler() {
    const {
      dispatch,
      options,
      optionsConfig,
      selectedNavModule
    } = this.props

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

  @bind
  async defaultButtonHandler() {
    const {
      dispatch,
      optionsConfig
    } = this.props

    await chromep.storage.sync.clear()

    const newOptions = await initOptionsValue(optionsConfig)

    dispatch(updateOptions(newOptions))
  }

  render() {
    return (
      <div id='option-button-box'>
        <button onClick={this.confirmButtonHandler}>{msgConfirm}</button>
        <button onClick={this.defaultButtonHandler}>{msgDefault}</button>
      </div>
    )
  }
}

export default OptionButton
