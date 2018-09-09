// @flow strict @jsx createElement

import classNames from 'classnames'
import {PureComponent, createElement} from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../../css/options/select-button-option.css'

type Props = {|
  optionChoice: boolean,
  optionName: string,
  optionValue: boolean,
  updateSingleOption: (string, boolean) => void
|}
class Option extends PureComponent<Props> {
  inputEl: ?HTMLInputElement

  handleChange = (evt: SyntheticEvent<HTMLInputElement>) => {
    this.props.updateSingleOption(this.props.optionName, evt.currentTarget.value === 'true')
  }

  handleClick = () => {
    if (this.inputEl) this.inputEl.click()
  }

  render() {
    const isChecked = this.props.optionValue === this.props.optionChoice
    return (
      <div className={classes.main}>
        <input
          ref={(ref) => {
            this.inputEl = ref
          }}
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
