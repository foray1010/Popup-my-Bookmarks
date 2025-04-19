import { useForm } from '@tanstack/react-form'
import type { ValueOf } from 'type-fest'
import webExtension from 'webextension-polyfill'

import ActionlessForm from '../../../core/components/baseItems/ActionlessForm/index.js'
import Button from '../../../core/components/baseItems/Button/index.js'
import type { OPTIONS } from '../../../core/constants/index.js'
import type { Options, OptionsConfig } from '../../../core/types/options.js'
import * as classes from './option-form.module.css'
import OptionItem from './OptionItem/index.js'

type Props = Readonly<{
  defaultValues: Partial<Options>
  onReset: () => void
  onSubmit: (variables: Partial<Options>) => void
  optionsConfig: OptionsConfig
  selectedOptionFormMap: ReadonlyArray<ValueOf<typeof OPTIONS>>
}>
export default function OptionForm(props: Props) {
  const form = useForm({
    defaultValues: props.defaultValues,
    onSubmit({ value }) {
      props.onSubmit(value)
    },
  })

  return (
    <ActionlessForm
      aria-label='Options'
      className={classes.form}
      onReset={props.onReset}
      onSubmit={async () => form.handleSubmit()}
    >
      <table className={classes.table}>
        <tbody>
          {props.selectedOptionFormMap.map((optionName) => (
            <tr key={optionName}>
              <td>{webExtension.i18n.getMessage(optionName)}</td>
              <td className={classes['item-input']}>
                <form.Field name={optionName}>
                  {(field) => {
                    const optionConfig = props.optionsConfig[optionName]
                    return (
                      <OptionItem
                        {...optionConfig}
                        name={field.name}
                        // @ts-expect-error Cannot narrow down the union type
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={field.handleChange}
                      />
                    )
                  }}
                </form.Field>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
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
            </td>
            <td>
              <Button type='reset'>
                {webExtension.i18n.getMessage('default')}
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </ActionlessForm>
  )
}
