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
  private inputRef = React.createRef<HTMLInputElement>()
  private selectRef = React.createRef<HTMLSelectElement>()

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
    if (evt.currentTarget === this.selectRef.current) {
      if (this.inputRef.current) this.inputRef.current.focus()
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
        ref={this.inputRef}
        className={classes.input}
        name={this.props.optionName}
        type='text'
        value={this.props.optionValue}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
      <select
        ref={this.selectRef}
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
