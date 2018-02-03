import '../../../../../css/options/select-button-option.css'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import {PureComponent, createElement} from 'react'
import webExtension from 'webextension-polyfill'

class Option extends PureComponent {
  handleChange = (evt) => {
    this.props.updateSingleOption(this.props.optionName, evt.target.value === 'true')
  }

  handleClick = () => {
    this.inputEl.click()
  }

  render() {
    const {optionChoice, optionName, optionValue} = this.props

    const isChecked = optionValue === optionChoice

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
          styleName={classNames('item', {'item-active': isChecked})}
          type='button'
          onClick={this.handleClick}
        >
          {webExtension.i18n.getMessage(optionChoice ? 'yes' : 'no')}
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
