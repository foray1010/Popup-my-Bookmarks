import type { FC, JSX } from 'react'

type Props = Readonly<
  Omit<
    JSX.IntrinsicElements['form'],
    'action' | 'enctype' | 'method' | 'target'
  >
>
const ActionlessForm: FC<Props> = ({ onSubmit, ref, ...props }) => {
  return (
    <form
      {...props}
      ref={ref}
      onSubmit={(evt) => {
        evt.preventDefault()

        onSubmit?.(evt)
      }}
    />
  )
}

export default ActionlessForm
