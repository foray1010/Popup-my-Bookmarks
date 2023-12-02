import { forwardRef, type JSX } from 'react'

type Props = Readonly<
  Omit<
    JSX.IntrinsicElements['form'],
    'action' | 'enctype' | 'method' | 'target'
  >
>
const ActionlessForm = forwardRef<HTMLFormElement, Props>(
  function InnerActionlessForm({ onSubmit, ...props }, ref) {
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
