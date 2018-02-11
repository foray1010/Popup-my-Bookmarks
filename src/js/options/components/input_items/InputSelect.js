import '../../../../css/options/input-select.css'

import PropTypes from 'prop-types'
import * as R from 'ramda'
import {PureComponent, createElement} from 'react'

import {normalizeInputtingValue} from '../../../common/functions'

class InputSelect extends PureComponent {
  handleBlur = (evt) => {
    const normalize = R.compose(R.join(','), R.filter(R.identity), R.map(R.trim), R.split(','))
    this.props.updateSingleOption(this.props.optionName, normalize(evt.target.value))
  }

  handleChange = (evt) => {
    if (evt.target === this.selectEl) {
      this.inputEl.focus()
    }

    const normalize = R.compose(R.replace(/^,/, ''), normalizeInputtingValue)
    this.props.updateSingleOption(this.props.optionName, normalize(evt.target.value))
  }

  // prevent user try to save by pressing enter
  handleKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      evt.preventDefault()
    }
  }

  render = () => (
    <div styleName='main'>
      <input
        ref={(ref) => {
          this.inputEl = ref
        }}
        styleName='input'
        name={this.props.optionName}
        type='text'
        value={this.props.optionValue}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
      <select
        ref={(ref) => {
          this.selectEl = ref
        }}
        styleName='select'
        defaultValue={this.props.optionValue}
        onChange={this.handleChange}
      >
        {this.props.choices.map((optionChoice, optionChoiceIndex) => (
          <option key={String(optionChoiceIndex)}>{optionChoice}</option>
        ))}
      </select>
    </div>
  )
}

InputSelect.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.string.isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default InputSelect
