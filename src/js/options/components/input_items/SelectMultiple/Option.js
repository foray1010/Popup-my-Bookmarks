import PropTypes from 'prop-types'
import {PureComponent, createElement} from 'react'
import Immutable from 'seamless-immutable'

class Option extends PureComponent {
  inputId = Math.random()
    .toString(36)
    .substring(2)

  handleChange = (evt) => {
    const {optionName, optionValue, updateSingleOption} = this.props

    const checkboxValue = parseInt(evt.target.value, 10)

    const wasChecked = optionValue.includes(checkboxValue)

    let newOptionValue
    if (wasChecked) {
      newOptionValue = optionValue.filter((x) => x !== checkboxValue)
    } else {
      const mutableNewOptionValue = [checkboxValue, ...optionValue].sort()
      newOptionValue = Immutable(mutableNewOptionValue)
    }

    updateSingleOption(optionName, newOptionValue)
  }

  render = () => (
    <label htmlFor={this.inputId}>
      <input
        id={this.inputId}
        name={this.props.optionName}
        type='checkbox'
        value={String(this.props.optionChoiceIndex)}
        checked={this.props.optionValue.includes(this.props.optionChoiceIndex)}
        onChange={this.handleChange}
      />
      {this.props.optionChoice}
    </label>
  )
}

Option.propTypes = {
  optionChoice: PropTypes.string.isRequired,
  optionChoiceIndex: PropTypes.number.isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.arrayOf(PropTypes.number).isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default Option
