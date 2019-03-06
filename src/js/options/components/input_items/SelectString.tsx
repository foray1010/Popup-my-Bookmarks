import * as React from 'react'

interface Props {
  choices: Array<string | void>
  optionName: string
  optionValue: number
  updatePartialOptions: (options: {[key: string]: number}) => void
}
class SelectString extends React.PureComponent<Props> {
  private handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.updatePartialOptions({
      [this.props.optionName]: parseInt(evt.currentTarget.value, 10)
    })
  }

  public render = () => (
    <select
      name={this.props.optionName}
      value={this.props.optionValue}
      onChange={this.handleChange}
    >
      {this.props.choices.reduce(
        (acc: Array<React.ReactElement>, optionChoice, optionChoiceIndex) => {
          if (optionChoice !== undefined) {
            return [
              ...acc,
              <option key={String(optionChoiceIndex)} value={String(optionChoiceIndex)}>
                {optionChoice}
              </option>
            ]
          }

          return acc
        },
        []
      )}
    </select>
  )
}

export default SelectString
