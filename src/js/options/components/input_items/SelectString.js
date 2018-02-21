// @flow
// @jsx createElement

import {PureComponent, createElement} from 'react'

type Props = {
  choices: Array<string | void>,
  optionName: string,
  optionValue: number,
  updateSingleOption: (string, number) => void
};
class SelectString extends PureComponent<Props> {
  handleChange = (evt: SyntheticEvent<HTMLSelectElement>) => {
    this.props.updateSingleOption(this.props.optionName, parseInt(evt.currentTarget.value, 10))
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

export default SelectString
