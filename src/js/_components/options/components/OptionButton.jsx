import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

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

class OptionButton extends Component {
  @autobind
  async handleConfirm(evt) {
    evt.persist()
    evt.preventDefault()

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
  async handleDefault(evt) {
    evt.persist()
    evt.preventDefault()

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
        <button type='submit' onClick={this.handleConfirm}>{msgConfirm}</button>
        <button type='reset' onClick={this.handleDefault}>{msgDefault}</button>
      </div>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  OptionButton.propTypes = {
    dispatch: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
    optionsConfig: PropTypes.object.isRequired,
    selectedNavModule: PropTypes.string.isRequired
  }
}

const mapStateToProps = (state) => ({
  options: state.options,
  optionsConfig: state.optionsConfig,
  selectedNavModule: state.selectedNavModule
})

export default connect(mapStateToProps)(OptionButton)
