// @flow strict
// @jsx createElement

import '../../../../css/options/input-select.css'

import * as R from 'ramda'
import {PureComponent, createElement} from 'react'

import {normalizeInputtingValue} from '../../../common/utils'

type Props = {|
  choices: Array<string>,
  optionName: string,
  optionValue: string,
  updateSingleOption: (string, string) => void
|}
class InputSelect extends PureComponent<Props> {
  inputEl: ?HTMLInputElement
  selectEl: ?HTMLSelectElement

  handleBlur = (evt: SyntheticEvent<HTMLInputElement>) => {
    const normalize = R.compose(R.join(','), R.filter(Boolean), R.map(R.trim), R.split(','))
    this.props.updateSingleOption(this.props.optionName, normalize(evt.currentTarget.value))
  }

  handleChange = (evt: SyntheticEvent<HTMLSelectElement>) => {
    if (evt.currentTarget === this.selectEl) {
      if (this.inputEl) this.inputEl.focus()
    }

    const normalize = R.compose(R.replace(/^,/, ''), normalizeInputtingValue)
    this.props.updateSingleOption(this.props.optionName, normalize(evt.currentTarget.value))
  }

  // prevent user try to save by pressing enter
  handleKeyDown = (evt: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (evt.keyCode === 13) {
      evt.preventDefault()
    }
  }

  render = () => (
    <div styleName='main'>
      <input
        ref={(ref) => {
          this.inputEl = ref
        }}
        styleName='input'
        name={this.props.optionName}
        type='text'
        value={this.props.optionValue}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
      <select
        ref={(ref) => {
          this.selectEl = ref
        }}
        styleName='select'
        defaultValue={this.props.optionValue}
        onChange={this.handleChange}
      >
        {this.props.choices.map((optionChoice, optionChoiceIndex) => (
          <option key={String(optionChoiceIndex)}>{optionChoice}</option>
        ))}
      </select>
    </div>
  )
}

export default InputSelect
