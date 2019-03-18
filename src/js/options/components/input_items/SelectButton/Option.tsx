import classNames from 'classnames'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../../css/options/select-button-option.css'

interface Props {
  optionChoice: boolean
  optionName: string
  optionValue: boolean
  updatePartialOptions: (options: {[key: string]: boolean}) => void
}
class Option extends React.PureComponent<Props> {
  private inputRef = React.createRef<HTMLInputElement>()

  private handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.props.updatePartialOptions({
      [this.props.optionName]: evt.currentTarget.value === 'true'
    })
  }

  private handleClick = () => {
    if (this.inputRef.current) this.inputRef.current.click()
  }

  public render() {
    const isChecked = this.props.optionValue === this.props.optionChoice
    return (
      <div className={classes.main}>
        <input
          ref={this.inputRef}
          name={this.props.optionName}
          type='radio'
          value={String(this.props.optionChoice)}
          checked={isChecked}
          hidden
          onChange={this.handleChange}
        />
        <button
          className={classNames(classes.item, {[classes['item-active']]: isChecked})}
          type='button'
          onClick={this.handleClick}
        >
          {webExtension.i18n.getMessage(this.props.optionChoice ? 'yes' : 'no')}
        </button>
      </div>
    )
  }
}

export default Option
