import * as R from 'ramda'
import * as React from 'react'

import classes from '../../../../css/options/input-select.css'

interface Props {
  choices: Array<string>
  optionName: string
  optionValue: string
  updatePartialOptions: (options: {[key: string]: string}) => void
}
class InputSelect extends React.PureComponent<Props> {
  private inputEl: HTMLInputElement | null = null
  private selectEl: HTMLSelectElement | null = null

  private handleBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
    const normalize = R.compose(
      R.join(','),
      R.filter(Boolean),
      R.map(R.trim),
      R.split(',')
    )
    this.props.updatePartialOptions({
      [this.props.optionName]: normalize(evt.currentTarget.value)
    })
  }

  private handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (evt.currentTarget === this.selectEl) {
      if (this.inputEl) this.inputEl.focus()
    }

    this.props.updatePartialOptions({
      [this.props.optionName]: evt.currentTarget.value
    })
  }

  // prevent user try to save by pressing enter
  private handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.keyCode === 13) {
      evt.preventDefault()
    }
  }

  public render = () => (
    <div className={classes.main}>
      <input
        ref={(ref) => {
          this.inputEl = ref
        }}
        className={classes.input}
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
        className={classes.select}
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
