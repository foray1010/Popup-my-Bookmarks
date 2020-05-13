import classNames from 'classnames'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import classes from './select-button-option.css'

interface Props {
  optionChoice: boolean
  optionName: string
  optionValue: boolean
  updatePartialOptions: (options: { [key: string]: boolean }) => void
}
const Option = ({
  optionChoice,
  optionName,
  optionValue,
  updatePartialOptions,
}: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = React.useCallback(() => {
    updatePartialOptions({
      [optionName]: optionChoice,
    })
  }, [optionChoice, optionName, updatePartialOptions])

  const handleClick = React.useCallback(() => {
    if (inputRef.current) inputRef.current.click()
  }, [])

  const isChecked = optionValue === optionChoice
  return (
    <label className={classes.main}>
      <input
        ref={inputRef}
        name={optionName}
        type='radio'
        value={String(optionChoice)}
        checked={isChecked}
        hidden
        onChange={handleChange}
      />
      <button
        className={classNames(classes.item, {
          [classes['item-active']]: isChecked,
        })}
        type='button'
        onClick={handleClick}
      >
        {webExtension.i18n.getMessage(optionChoice ? 'yes' : 'no')}
      </button>
    </label>
  )
}

export default Option
