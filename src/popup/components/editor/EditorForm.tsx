import * as React from 'react'
import { useForm } from 'react-hook-form'
import webExtension from 'webextension-polyfill'

import ActionlessForm from '../../../core/components/baseItems/ActionlessForm'
import Button from '../../../core/components/baseItems/Button'
import Input from '../../../core/components/baseItems/Input'
import classes from './editor-form.module.css'

interface Props {
  defaultTitle?: string
  defaultUrl?: string
  header: string
  isAllowedToEditUrl: boolean
  onCancel(): void
  onConfirm(title: string, url?: string): void
  style: React.CSSProperties
}
export default function Editor({ onConfirm, ...props }: Props) {
  const { register, handleSubmit } = useForm<{
    title: string
    url: string
  }>()

  return (
    <ActionlessForm
      className={classes.main}
      style={props.style}
      onSubmit={React.useMemo(() => {
        return handleSubmit((variables) => {
          onConfirm(variables.title, variables.url)
        })
      }, [handleSubmit, onConfirm])}
    >
      <span className={classes.header}>{props.header}</span>

      <Input
        {...register('title')}
        autoFocus
        className={classes.input}
        defaultValue={props.defaultTitle}
      />
      <Input
        {...register('url')}
        className={classes.input}
        defaultValue={props.defaultUrl}
        hidden={!props.isAllowedToEditUrl}
      />

      <Button type='submit'>{webExtension.i18n.getMessage('confirm')}</Button>
      <Button onClick={props.onCancel}>
        {webExtension.i18n.getMessage('cancel')}
      </Button>
    </ActionlessForm>
  )
}
