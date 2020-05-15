import * as React from 'react'
import webExtension from 'webextension-polyfill'

import Button from '../../../core/components/baseItems/Button'
import { OPTIONS } from '../../../core/constants'
import { Options, OptionsConfig } from '../../../core/types/options'
import classes from './option-form.css'
import OptionItem from './OptionItem'

const handleSubmit = (evt: React.FormEvent) => {
  evt.preventDefault()
}

interface Props {
  options: Partial<Options>
  optionsConfig: OptionsConfig
  resetToDefaultOptions: () => void
  saveOptions: () => void
  selectedOptionFormMap: Array<OPTIONS>
  updatePartialOptions: (options: Partial<Options>) => void
}
const OptionForm = (props: Props) => (
  <form onSubmit={handleSubmit}>
    <table className={classes.table}>
      <tbody>
        {props.selectedOptionFormMap.reduce<Array<React.ReactElement<{}>>>(
          (acc, optionName) => {
            const optionValue = props.options[optionName]
            if (optionValue !== undefined) {
              return [
                ...acc,
                <OptionItem
                  key={optionName}
                  optionConfig={props.optionsConfig[optionName]}
                  optionName={optionName}
                  optionValue={optionValue}
                  updatePartialOptions={props.updatePartialOptions}
                />,
              ]
            }

            return acc
          },
          [],
        )}
      </tbody>
      <tfoot>
        <tr>
          <td>
            <Button onClick={props.saveOptions}>
              {webExtension.i18n.getMessage('confirm')}
            </Button>
          </td>
          <td>
            <Button onClick={props.resetToDefaultOptions}>
              {webExtension.i18n.getMessage('default')}
            </Button>
          </td>
        </tr>
      </tfoot>
    </table>
  </form>
)

export default OptionForm
