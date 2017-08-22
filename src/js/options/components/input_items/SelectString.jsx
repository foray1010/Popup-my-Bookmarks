import {createElement, PureComponent} from 'react'
import PropTypes from 'prop-types'

class SelectString extends PureComponent {
  handleChange = (evt) => {
    const {
      optionName,
      updateSingleOption
    } = this.props

    const newOptionValue = parseInt(evt.target.value, 10)

    updateSingleOption(optionName, newOptionValue)
  }

  render() {
    const {
      choices,
      optionName,
      optionValue
    } = this.props

    const optionItems = choices
      .reduce((accumulator, optionChoice, optionChoiceIndex) => {
        if (optionChoice !== undefined) {
          return accumulator.concat(
            <option
              key={String(optionChoiceIndex)}
              value={String(optionChoiceIndex)}
            >
              {optionChoice}
            </option>
          )
        }

        return accumulator
      }, [])

    return (
      <select
        name={optionName}
        value={optionValue}
        onChange={this.handleChange}
      >
        {optionItems}
      </select>
    )
  }
}

SelectString.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.number.isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default SelectString
