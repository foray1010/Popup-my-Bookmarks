import * as R from 'ramda'
import * as React from 'react'

import classes from '../../../../css/options/input-select.css'

interface Props {
  choices: Array<string>
  optionName: string
  optionValue: string
  updatePartialOptions: (options: {[key: string]: string}) => void
}
const InputSelect = ({choices, optionName, optionValue, updatePartialOptions}: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const selectRef = React.useRef<HTMLSelectElement>(null)

  const handleBlur = React.useCallback(
    (evt: React.FocusEvent<HTMLInputElement>) => {
      const normalize = R.compose(
        R.join(','),
        R.filter(Boolean),
        R.map(R.trim),
        R.split(',')
      )
      updatePartialOptions({
        [optionName]: normalize(evt.currentTarget.value)
      })
    },
    [optionName, updatePartialOptions]
  )

  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (evt.currentTarget === selectRef.current) {
        if (inputRef.current) inputRef.current.focus()
      }

      updatePartialOptions({
        [optionName]: evt.currentTarget.value
      })
    },
    [optionName, updatePartialOptions]
  )

  return (
    <div className={classes.main}>
      <input
        ref={inputRef}
        className={classes.input}
        name={optionName}
        type='text'
        value={optionValue}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <select
        ref={selectRef}
        className={classes.select}
        defaultValue={optionValue}
        onChange={handleChange}
      >
        {choices.map((optionChoice, optionChoiceIndex) => (
          <option key={String(optionChoiceIndex)}>{optionChoice}</option>
        ))}
      </select>
    </div>
  )
}

export default InputSelect
