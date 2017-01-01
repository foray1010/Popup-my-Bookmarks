import {autobind} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'

class SelectString extends PureComponent {
  @autobind
  handleChange(evt) {
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

    const optionItems = []
    for (const [optionChoiceIndex, optionChoice] of choices.entries()) {
      if (optionChoice !== undefined) {
        optionItems.push(
          <option
            key={String(optionChoiceIndex)}
            value={String(optionChoiceIndex)}
          >
            {optionChoice}
          </option>
        )
      }
    }

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
