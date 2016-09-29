import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import classNames from 'classnames'
import CSSModules from 'react-css-modules'

import {updateSingleOption} from '../../../actions'

import styles from '../../../../../css/options/select-button-option.css'

const msgNo = chrome.i18n.getMessage('no')
const msgYes = chrome.i18n.getMessage('yes')

class Option extends Component {
  @autobind
  handleChange(evt) {
    const {
      dispatch,
      optionName
    } = this.props

    const newOptionValue = evt.target.value === 'true'

    dispatch(updateSingleOption(optionName, newOptionValue))
  }

  @autobind
  handleClick() {
    this.inputEl.click()
  }

  render() {
    const {
      optionChoice,
      optionName,
      options
    } = this.props

    const buttonText = optionChoice ? msgYes : msgNo
    const optionValue = options[optionName]

    const isChecked = optionValue === optionChoice

    const thisStyleName = classNames(
      'item',
      {
        'item-active': isChecked
      }
    )

    return (
      <div styleName='main'>
        <input
          ref={(ref) => {
            this.inputEl = ref
          }}
          name={optionName}
          type='radio'
          value={String(optionChoice)}
          checked={isChecked}
          hidden
          onChange={this.handleChange}
        />
        <button
          styleName={thisStyleName}
          type='button'
          onClick={this.handleClick}
        >
          {buttonText}
        </button>
      </div>
    )
  }
}

Option.propTypes = {
  dispatch: PropTypes.func.isRequired,
  optionChoice: PropTypes.bool.isRequired,
  optionName: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  options: state.options
})

export default connect(mapStateToProps)(
  CSSModules(Option, styles, {allowMultiple: true})
)
