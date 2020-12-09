import { Controller, useForm } from 'react-hook-form'
import webExtension from 'webextension-polyfill'

import ActionlessForm from '../../../core/components/baseItems/ActionlessForm'
import Button from '../../../core/components/baseItems/Button'
import type { OPTIONS } from '../../../core/constants'
import type { Options, OptionsConfig } from '../../../core/types/options'
import classes from './option-form.css'
import OptionItem from './OptionItem'

interface Props {
  defaultValues: Partial<Options>
  onReset: () => void
  onSubmit: (variables: Partial<Options>) => void
  optionsConfig: OptionsConfig
  selectedOptionFormMap: Array<OPTIONS>
}
export default function OptionForm(props: Props) {
  const { control, handleSubmit } = useForm()

  return (
    <ActionlessForm
      onReset={props.onReset}
      onSubmit={handleSubmit(props.onSubmit)}
    >
      <table className={classes.table}>
        <tbody>
          {props.selectedOptionFormMap.map((optionName) => (
            <tr key={optionName}>
              <td className={classes['item-desc']}>
                {webExtension.i18n.getMessage(optionName)}
              </td>
              <td className={classes['item-input']}>
                <Controller
                  control={control}
                  defaultValue={props.defaultValues[optionName]}
                  name={optionName}
                  render={({ name, onBlur, onChange, value }) => (
                    <OptionItem
                      name={name}
                      optionConfig={props.optionsConfig[optionName]}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Button type='submit'>
                {webExtension.i18n.getMessage('confirm')}
              </Button>
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
