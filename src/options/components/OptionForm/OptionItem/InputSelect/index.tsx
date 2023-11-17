import * as React from 'react'

import Input from '../../../../../core/components/baseItems/Input/index.js'
import Select from '../../../../../core/components/baseItems/Select/index.js'
import classes from './styles.module.css'

type RestInputProps = Readonly<
  Omit<React.ComponentProps<typeof Input>, 'className' | 'onChange' | 'value'>
>

type Props = Readonly<
  RestInputProps & {
    choices: ReadonlyArray<string>
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>
    value: string
  }
>
export default function InputSelect({
  choices,
  value,
  onChange,
  ...restProps
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const selectRef = React.useRef<HTMLSelectElement>(null)

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = React.useCallback(
    (evt) => {
      if (evt.currentTarget === selectRef.current) {
        inputRef.current?.focus()
      }

      onChange(evt)
    },
    [onChange],
  )

  return (
    <div className={classes.main}>
      <Input
        ref={inputRef}
        {...restProps}
        className={classes.input}
        value={value}
        onChange={handleChange}
      />
      <Select
        ref={selectRef}
        className={classes.select}
        defaultValue={value}
        onChange={handleChange}
      >
        {choices.map((optionChoice, optionChoiceIndex) => (
          <option key={optionChoiceIndex}>{optionChoice}</option>
        ))}
      </Select>
    </div>
  )
}
