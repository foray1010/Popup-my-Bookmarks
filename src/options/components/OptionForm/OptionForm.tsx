import { Controller, useForm } from 'react-hook-form'
import webExtension from 'webextension-polyfill'

import ActionlessForm from '../../../core/components/baseItems/ActionlessForm'
import Button from '../../../core/components/baseItems/Button'
import type { OPTIONS } from '../../../core/constants'
import type { Options, OptionsConfig } from '../../../core/types/options'
import classes from './option-form.module.css'
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
              <td className={classes.itemDesc}>
                {webExtension.i18n.getMessage(optionName)}
              </td>
              <td className={classes.itemInput}>
                <Controller
                  control={control}
                  defaultValue={props.defaultValues[optionName]}
                  name={optionName}
                  render={({ field }) => {
                    // do not pass ref as not all option items forward reference
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { ref, ...rest } = field
                    return (
                      <OptionItem
                        {...rest}
                        optionConfig={props.optionsConfig[optionName]}
                      />
                    )
                  }}
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
