import classNames from 'classnames'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import Button from '../../../../../core/components/baseItems/Button'
import classes from './styles.css'

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
    <label>
      <input
        ref={inputRef}
        checked={isChecked}
        hidden
        name={optionName}
        type='radio'
        value={String(optionChoice)}
        onChange={handleChange}
      />
      <Button
        className={classNames(classes.item, {
          [classes['item-active']]: isChecked,
        })}
        disabled={isChecked}
        onClick={handleClick}
      >
        {webExtension.i18n.getMessage(optionChoice ? 'yes' : 'no')}
      </Button>
    </label>
  )
}

export default Option
