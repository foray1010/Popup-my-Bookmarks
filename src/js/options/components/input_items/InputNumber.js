import PropTypes from 'prop-types'
import R from 'ramda'
import {PureComponent, createElement} from 'react'

class InputNumber extends PureComponent {
  handleBlur = (evt) => {
    const parsedValue = parseInt(evt.target.value, 10)

    const newOptionValue = R.clamp(this.props.minimum, this.props.maximum, parsedValue)

    this.props.updateSingleOption(this.props.optionName, newOptionValue)
  }

  handleChange = (evt) => {
    const parsedValue = parseInt(evt.target.value, 10)

    // only allow input number
    if (Number.isNaN(parsedValue)) return
    this.props.updateSingleOption(this.props.optionName, parsedValue)
  }

  // prevent user try to save by pressing enter
  handleKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      evt.preventDefault()
    }
  }

  render = () => (
    <input
      name={this.props.optionName}
      type='number'
      min={this.props.minimum}
      max={this.props.maximum}
      value={String(this.props.optionValue)}
      onBlur={this.handleBlur}
      onChange={this.handleChange}
      onKeyDown={this.handleKeyDown}
    />
  )
}

InputNumber.propTypes = {
  maximum: PropTypes.number.isRequired,
  minimum: PropTypes.number.isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.number.isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default InputNumber
