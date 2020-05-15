import * as React from 'react'

type Props = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'action' | 'enctype' | 'method' | 'target'
>

const ActionlessFormWithForwardRef = React.forwardRef<HTMLFormElement, Props>(
  function ActionlessForm({ onSubmit, ...props }: Props, ref) {
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(
      (evt) => {
        evt.preventDefault()

        if (onSubmit) onSubmit(evt)
      },
      [onSubmit],
    )

    return <form {...props} ref={ref} onSubmit={handleSubmit} />
  },
)

export default ActionlessFormWithForwardRef
