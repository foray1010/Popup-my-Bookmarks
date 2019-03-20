import * as R from 'ramda'
import * as React from 'react'

interface Props {
  maximum: number
  minimum: number
  optionName: string
  optionValue: number
  updatePartialOptions: (options: {[key: string]: number}) => void
}
class InputNumber extends React.PureComponent<Props> {
  private handleBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(evt.currentTarget.value, 10)

    const newOptionValue = R.clamp(this.props.minimum, this.props.maximum, parsedValue)

    this.props.updatePartialOptions({
      [this.props.optionName]: newOptionValue
    })
  }

  private handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(evt.currentTarget.value, 10)

    // only allow input number
    if (Number.isNaN(parsedValue)) return

    this.props.updatePartialOptions({
      [this.props.optionName]: parsedValue
    })
  }

  public render = () => (
    <input
      name={this.props.optionName}
      type='number'
      min={this.props.minimum}
      max={this.props.maximum}
      value={String(this.props.optionValue)}
      onBlur={this.handleBlur}
      onChange={this.handleChange}
    />
  )
}

export default InputNumber
