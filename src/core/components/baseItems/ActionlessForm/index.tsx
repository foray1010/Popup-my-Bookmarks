import * as React from 'react'

type Props = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'action' | 'enctype' | 'method' | 'target'
>

const ActionlessForm = React.forwardRef<HTMLFormElement, Props>(
  function InnerActionlessForm({ onSubmit, ...props }: Props, ref) {
    return (
      <form
        // `<form>` is not considered as role='form' when no accessible name, such as `aria-label`
        role='form'
        {...props}
        ref={ref}
        onSubmit={React.useCallback<React.FormEventHandler<HTMLFormElement>>(
          (evt) => {
            evt.preventDefault()

            if (onSubmit) onSubmit(evt)
          },
          [onSubmit],
        )}
      />
    )
  },
)

export default ActionlessForm
