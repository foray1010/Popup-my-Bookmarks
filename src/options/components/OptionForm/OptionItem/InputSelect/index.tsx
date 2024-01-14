import {
  type ChangeEventHandler,
  type ComponentProps,
  useCallback,
  useRef,
} from 'react'

import Input from '../../../../../core/components/baseItems/Input/index.js'
import Select from '../../../../../core/components/baseItems/Select/index.js'
import * as classes from './styles.module.css'

type RestInputProps = Readonly<
  Omit<ComponentProps<typeof Input>, 'className' | 'onChange' | 'value'>
>

type Props = Readonly<
  RestInputProps & {
    choices: ReadonlyArray<string>
    onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>
    value: string
  }
>
export default function InputSelect({
  choices,
  value,
  onChange,
  ...restProps
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)

  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> =
    useCallback(
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
