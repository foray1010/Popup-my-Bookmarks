import classNames from 'clsx'
import * as React from 'react'

import Button from '../../../../../../core/components/baseItems/Button'
import classes from './styles.module.css'

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'className' | 'hidden' | 'type'
>

export default function Option({ children, ...props }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <span>
      <input ref={inputRef} {...props} hidden type='radio' />
      <Button
        className={classNames(classes['item'], {
          [classes['itemActive'] ?? '']: props.checked,
        })}
        disabled={props.checked}
        onClick={React.useCallback(() => {
          if (inputRef.current) inputRef.current.click()
        }, [])}
      >
        {children}
      </Button>
    </span>
  )
}
