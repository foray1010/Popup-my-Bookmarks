import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component} from 'react'

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
  @autobind
  async handleConfirm() {
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

  @autobind
  async handleDefault() {
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
        <button onClick={this.handleConfirm}>{msgConfirm}</button>
        <button onClick={this.handleDefault}>{msgDefault}</button>
      </div>
    )
  }
}

export default OptionButton
