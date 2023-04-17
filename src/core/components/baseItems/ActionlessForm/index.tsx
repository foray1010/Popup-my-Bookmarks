import * as React from 'react'

type Props = Readonly<
  Omit<
    React.FormHTMLAttributes<HTMLFormElement>,
    'action' | 'enctype' | 'method' | 'target'
  >
>

const ActionlessForm = React.forwardRef<HTMLFormElement, Props>(
  function InnerActionlessForm({ onSubmit, ...props }: Props, ref) {
    return (
      <form
        // `<form>` is not considered as role='form' when no accessible name, such as `aria-label`
        role='form'
        {...props}
        ref={ref}
        onSubmit={(evt) => {
          evt.preventDefault()

          onSubmit?.(evt)
        }}
      />
    )
  },
)

export default ActionlessForm
