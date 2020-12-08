import * as React from 'react'
import { useForm } from 'react-hook-form'
import webExtension from 'webextension-polyfill'

import ActionlessForm from '../../../core/components/baseItems/ActionlessForm'
import Button from '../../../core/components/baseItems/Button'
import Input from '../../../core/components/baseItems/Input'
import classes from './editor.css'

interface Props {
  header: string
  initialTitle: string
  initialUrl: string
  isAllowedToEditUrl: boolean
  onCancel: () => void
  onConfirm: (title: string, url: string) => void
  width: number
}
const Editor = ({ onConfirm, ...props }: Props) => {
  const { register, handleSubmit } = useForm<{
    title: string
    url: string
  }>()

  return (
    <ActionlessForm
      className={classes.main}
      style={React.useMemo(
        (): Record<string, string> => ({
          '--width': `${props.width}px`,
        }),
        [props.width],
      )}
      onSubmit={React.useMemo(() => {
        return handleSubmit((variables) => {
          onConfirm(variables.title, variables.url)
        })
      }, [handleSubmit, onConfirm])}
    >
      <span className={classes.header}>{props.header}</span>

      <Input
        ref={register}
        autoFocus
        className={classes.input}
        defaultValue={props.initialTitle}
        name='title'
      />
      <Input
        ref={register}
        className={classes.input}
        defaultValue={props.initialUrl}
        hidden={!props.isAllowedToEditUrl}
        name='url'
      />

      <Button type='submit'>{webExtension.i18n.getMessage('confirm')}</Button>
      <Button onClick={props.onCancel}>
        {webExtension.i18n.getMessage('cancel')}
      </Button>
    </ActionlessForm>
  )
}

export default Editor
