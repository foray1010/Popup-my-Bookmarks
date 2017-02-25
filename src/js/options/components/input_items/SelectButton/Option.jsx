import {autobind} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import classNames from 'classnames'

import '../../../../../css/options/select-button-option.css'

const msgNo = chrome.i18n.getMessage('no')
const msgYes = chrome.i18n.getMessage('yes')

class Option extends PureComponent {
  @autobind
  handleChange(evt) {
    const {
      optionName,
      updateSingleOption
    } = this.props

    const newOptionValue = evt.target.value === String(true)

    updateSingleOption(optionName, newOptionValue)
  }

  @autobind
  handleClick() {
    this.inputEl.click()
  }

  render() {
    const {
      optionChoice,
      optionName,
      optionValue
    } = this.props

    const buttonText = optionChoice ? msgYes : msgNo

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
  optionChoice: PropTypes.bool.isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.bool.isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default Option
