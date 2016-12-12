import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, PropTypes, PureComponent} from 'react'
import {static as Immutable} from 'seamless-immutable'
import CSSModules from 'react-css-modules'

import {
  initOptionsValue
} from '../functions'
import {
  updateOptions
} from '../actions'
import chromep from '../../common/lib/chromePromise'

import styles from '../../../css/options/option-button.css'

const msgConfirm = chrome.i18n.getMessage('confirm')
const msgDefault = chrome.i18n.getMessage('default')

class OptionButton extends PureComponent {
  @autobind
  async handleConfirm(evt) {
    evt.persist()
    evt.preventDefault()

    const {
      dispatch,
      options
    } = this.props

    const newOptions = Immutable.asMutable(options)

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
      <div styleName='main'>
        <button
          styleName='button'
          type='submit'
          onClick={this.handleConfirm}
        >
          {msgConfirm}
        </button>
        <button
          styleName='button'
          type='reset'
          onClick={this.handleDefault}
        >
          {msgDefault}
        </button>
      </div>
    )
  }
}

OptionButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  optionsConfig: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  options: state.options,
  optionsConfig: state.optionsConfig,
  selectedNavModule: state.selectedNavModule
})

export default connect(mapStateToProps)(
  CSSModules(OptionButton, styles)
)
