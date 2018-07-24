// @flow strict @jsx createElement

import * as R from 'ramda'
import {PureComponent, createElement} from 'react'

type Props = {|
  maximum: number,
  minimum: number,
  optionName: string,
  optionValue: number,
  updateSingleOption: (string, number) => void
|}
class InputNumber extends PureComponent<Props> {
  handleBlur = (evt: SyntheticEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(evt.currentTarget.value, 10)

    const newOptionValue = R.clamp(this.props.minimum, this.props.maximum, parsedValue)

    this.props.updateSingleOption(this.props.optionName, newOptionValue)
  }

  handleChange = (evt: SyntheticEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(evt.currentTarget.value, 10)

    // only allow input number
    if (Number.isNaN(parsedValue)) return
    this.props.updateSingleOption(this.props.optionName, parsedValue)
  }

  // prevent user try to save by pressing enter
  handleKeyDown = (evt: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (evt.keyCode === 13) {
      evt.preventDefault()
    }
  }

  render = () => (
    <input
      name={this.props.optionName}
      type='number'
      min={this.props.minimum}
      max={this.props.maximum}
      value={String(this.props.optionValue)}
      onBlur={this.handleBlur}
      onChange={this.handleChange}
      onKeyDown={this.handleKeyDown}
    />
  )
}

export default InputNumber
