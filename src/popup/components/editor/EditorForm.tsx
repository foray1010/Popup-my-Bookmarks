import { useForm } from '@tanstack/react-form'
import { type CSSProperties, useId } from 'react'
import webExtension from 'webextension-polyfill'

import ActionlessForm from '@/core/components/baseItems/ActionlessForm/index.js'
import Button from '@/core/components/baseItems/Button/index.js'
import Input from '@/core/components/baseItems/Input/index.js'

import * as classes from './editor-form.module.css'

type Props = Readonly<{
  defaultTitle?: string
  defaultUrl?: string | undefined
  header: string
  isAllowedToEditUrl: boolean
  onCancel: () => void
  onConfirm: (title: string, url?: string) => void | Promise<void>
  style?: CSSProperties
}>
export default function Editor({ onConfirm, ...props }: Props) {
  const form = useForm({
    defaultValues: {
      title: props.defaultTitle ?? '',
      url: props.defaultUrl,
    },
    async onSubmit({ value }) {
      await onConfirm(value.title, value.url)
    },
  })

  const headerId = useId()

  return (
    <ActionlessForm
      aria-labelledby={headerId}
      className={classes.main}
      style={props.style}
      onSubmit={async () => form.handleSubmit()}
    >
      <h2 className={classes.header} id={headerId}>
        {props.header}
      </h2>

      <form.Field name='title'>
        {(field) => {
          return (
            <Input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className={classes.input}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(evt) => field.handleChange(evt.currentTarget.value)}
            />
          )
        }}
      </form.Field>
      {props.isAllowedToEditUrl && (
        <form.Field name='url'>
          {(field) => {
            return (
              <Input
                className={classes.input}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(evt) => field.handleChange(evt.currentTarget.value)}
              />
            )
          }}
        </form.Field>
      )}

      <div className={classes['button-group']}>
        <form.Subscribe
          selector={(state) => !state.canSubmit || state.isSubmitting}
        >
          {(disabled) => {
            return (
              <Button disabled={disabled} type='submit'>
                {webExtension.i18n.getMessage('confirm')}
              </Button>
            )
          }}
        </form.Subscribe>
        <Button onClick={props.onCancel}>
          {webExtension.i18n.getMessage('cancel')}
        </Button>
      </div>
    </ActionlessForm>
  )
}
