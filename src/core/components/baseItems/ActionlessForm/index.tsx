import * as React from 'react'

type Props = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'action' | 'enctype' | 'method' | 'target'
>

const ActionlessForm = React.forwardRef<HTMLFormElement, Props>(
  function InnerActionlessForm({ onSubmit, ...props }: Props, ref) {
    return (
      <form
        {...props}
        ref={ref}
        onSubmit={React.useCallback(
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
