import * as React from 'react'

import classes from './input-select.css'

const normalize = (value: string) => {
  return value
    .split(',')
    .map(x => x.trim())
    .filter(Boolean)
    .join(',')
}

interface Props {
  choices: Array<string>
  optionName: string
  optionValue: string
  updatePartialOptions: (options: { [key: string]: string }) => void
}
const InputSelect = ({
  choices,
  optionName,
  optionValue,
  updatePartialOptions,
}: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const selectRef = React.useRef<HTMLSelectElement>(null)

  const handleBlur = React.useCallback(
    (evt: React.FocusEvent<HTMLInputElement>) => {
      updatePartialOptions({
        [optionName]: normalize(evt.currentTarget.value),
      })
    },
    [optionName, updatePartialOptions],
  )

  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (evt.currentTarget === selectRef.current) {
        if (inputRef.current) inputRef.current.focus()
      }

      updatePartialOptions({
        [optionName]: evt.currentTarget.value,
      })
    },
    [optionName, updatePartialOptions],
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
