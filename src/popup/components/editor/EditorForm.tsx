import * as React from 'react'
import { useForm } from 'react-hook-form'
import webExtension from 'webextension-polyfill'

import ActionlessForm from '../../../core/components/baseItems/ActionlessForm/index.js'
import Button from '../../../core/components/baseItems/Button/index.js'
import Input from '../../../core/components/baseItems/Input/index.js'
import classes from './editor-form.module.css'

type Props = Readonly<{
  defaultTitle?: string
  defaultUrl?: string | undefined
  header: string
  isAllowedToEditUrl: boolean
  onCancel: () => void
  onConfirm: (title: string, url?: string) => void | Promise<void>
  style?: React.CSSProperties
}>
export default function Editor({ onConfirm, ...props }: Props) {
  const { register, handleSubmit } = useForm<
    Readonly<{
      title: string
      url?: string
    }>
  >()

  const headerId = React.useId()

  return (
    <ActionlessForm
      aria-labelledby={headerId}
      className={classes['main']}
      style={props.style}
      onSubmit={handleSubmit(async (variables) => {
        await onConfirm(variables.title, variables.url)
      })}
    >
      <h2 className={classes['header']} id={headerId}>
        {props.header}
      </h2>

      <Input
        {...register('title')}
        autoFocus
        className={classes['input']}
        defaultValue={props.defaultTitle}
      />
      {props.isAllowedToEditUrl && (
        <Input
          {...register('url')}
          className={classes['input']}
          defaultValue={props.defaultUrl}
        />
      )}

      <div className={classes['button-group']}>
        <Button type='submit'>{webExtension.i18n.getMessage('confirm')}</Button>
        <Button onClick={props.onCancel}>
          {webExtension.i18n.getMessage('cancel')}
        </Button>
      </div>
    </ActionlessForm>
  )
}
