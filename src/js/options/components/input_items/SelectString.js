import PropTypes from 'prop-types'
import {PureComponent, createElement} from 'react'

class SelectString extends PureComponent {
  handleChange = (evt) => {
    this.props.updateSingleOption(this.props.optionName, parseInt(evt.target.value, 10))
  }

  render = () => (
    <select
      name={this.props.optionName}
      value={this.props.optionValue}
      onChange={this.handleChange}
    >
      {this.props.choices.reduce((accumulator, optionChoice, optionChoiceIndex) => {
        if (optionChoice !== undefined) {
          return [
            ...accumulator,
            <option key={String(optionChoiceIndex)} value={String(optionChoiceIndex)}>
              {optionChoice}
            </option>
          ]
        }

        return accumulator
      }, [])}
    </select>
  )
}

SelectString.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.number.isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default SelectString
