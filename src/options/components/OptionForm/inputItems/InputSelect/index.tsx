import * as React from 'react'

import Input from '../../../../../core/components/baseItems/Input'
import Select from '../../../../../core/components/baseItems/Select'
import classes from './styles.css'

type RestInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'className' | 'onChange' | 'value'
>

interface Props extends RestInputProps {
  choices: Array<string>
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>
  value: string
}
const InputSelect = ({ choices, value, onChange, ...restProps }: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const selectRef = React.useRef<HTMLSelectElement>(null)

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = React.useCallback(
    (evt) => {
      if (evt.currentTarget === selectRef.current) {
        if (inputRef.current) inputRef.current.focus()
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

export default InputSelect
