import {autobind} from 'core-decorators'
import {createElement, PropTypes, PureComponent} from 'react'
import {static as Immutable} from 'seamless-immutable'
import md5 from 'blueimp-md5'

class Option extends PureComponent {
  @autobind
  handleChange(evt) {
    const {
      optionName,
      optionValue,
      updateSingleOption
    } = this.props

    const checkboxValue = parseInt(evt.target.value, 10)

    const wasChecked = optionValue.includes(checkboxValue)

    let newOptionValue
    if (wasChecked) {
      newOptionValue = optionValue
        .filter((x) => x !== checkboxValue)
    } else {
      const mutableNewOptionValue = [checkboxValue]
        .concat(optionValue)
        .sort()
      newOptionValue = Immutable(mutableNewOptionValue)
    }

    updateSingleOption(optionName, newOptionValue)
  }

  render() {
    const {
      optionChoice,
      optionChoiceIndex,
      optionName,
      optionValue
    } = this.props

    const id = md5(
      [
        optionName,
        optionChoice
      ].join()
    )
    const isChecked = optionValue.includes(optionChoiceIndex)

    return (
      <label htmlFor={id}>
        <input
          id={id}
          name={optionName}
          type='checkbox'
          value={String(optionChoiceIndex)}
          checked={isChecked}
          onChange={this.handleChange}
        />
        {optionChoice}
      </label>
    )
  }
}

Option.propTypes = {
  optionChoice: PropTypes.string.isRequired,
  optionChoiceIndex: PropTypes.number.isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.arrayOf(PropTypes.number).isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default Option
