import * as React from 'react'
import { useForm } from 'react-hook-form'
import webExtension from 'webextension-polyfill'

import ActionlessForm from '../../../core/components/baseItems/ActionlessForm/index.js'
import Button from '../../../core/components/baseItems/Button/index.js'
import Input from '../../../core/components/baseItems/Input/index.js'
import classes from './editor-form.module.css'

interface Props {
  readonly defaultTitle?: string
  readonly defaultUrl?: string | undefined
  readonly header: string
  readonly isAllowedToEditUrl: boolean
  readonly onCancel: () => void
  readonly onConfirm: (title: string, url?: string) => void | Promise<void>
  readonly style: React.CSSProperties
}
export default function Editor({ onConfirm, ...props }: Props) {
  const { register, handleSubmit } = useForm<{
    title: string
    url?: string
  }>()

  return (
    <ActionlessForm
      className={classes['main']}
      style={props.style}
      onSubmit={React.useMemo(() => {
        return handleSubmit(async (variables) => {
          await onConfirm(variables.title, variables.url)
        })
      }, [handleSubmit, onConfirm])}
    >
      <div className={classes['header']}>{props.header}</div>

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
