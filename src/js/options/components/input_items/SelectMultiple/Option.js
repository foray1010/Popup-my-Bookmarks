// @flow
// @jsx createElement

import {PureComponent, createElement} from 'react'
import Immutable from 'seamless-immutable'

type Props = {
  optionChoice: string,
  optionChoiceIndex: number,
  optionName: string,
  optionValue: number[],
  updateSingleOption: (string, number[]) => void
};
class Option extends PureComponent<Props> {
  inputId = Math.random()
    .toString(36)
    .substring(2)

  handleChange = (evt: SyntheticEvent<HTMLInputElement>) => {
    const checkboxValue = parseInt(evt.currentTarget.value, 10)

    const wasChecked = this.props.optionValue.includes(checkboxValue)

    let newOptionValue
    if (wasChecked) {
      newOptionValue = this.props.optionValue.filter((x) => x !== checkboxValue)
    } else {
      const mutableNewOptionValue = [checkboxValue, ...this.props.optionValue].sort()
      newOptionValue = Immutable(mutableNewOptionValue)
    }

    this.props.updateSingleOption(this.props.optionName, newOptionValue)
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

export default Option
