import * as React from 'react'

interface Props {
  optionChoice: string
  optionChoiceIndex: number
  optionName: string
  optionValue: Array<number | void>
  updatePartialOptions: (options: {[key: string]: Array<number | void>}) => void
}
class Option extends React.PureComponent<Props> {
  private inputId = Math.random()
    .toString(36)
    .substring(2)

  private handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const checkboxValue = parseInt(evt.currentTarget.value, 10)

    const wasChecked = this.props.optionValue.includes(checkboxValue)

    let newOptionValue
    if (wasChecked) {
      newOptionValue = this.props.optionValue.filter((x) => x !== checkboxValue)
    } else {
      newOptionValue = [checkboxValue, ...this.props.optionValue].sort()
    }

    this.props.updatePartialOptions({
      [this.props.optionName]: newOptionValue
    })
  }

  public render = () => (
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
