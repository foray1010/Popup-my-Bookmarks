import * as React from 'react'
import webExtension from 'webextension-polyfill'

import { OPTIONS } from '../../../core/constants'
import { Options, OptionsConfig } from '../../../core/types/options'
import classes from './option-form.css'
import OptionButton from './OptionButton'
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
            <OptionButton
              msg={webExtension.i18n.getMessage('confirm')}
              onClick={props.saveOptions}
            />
          </td>
          <td>
            <OptionButton
              msg={webExtension.i18n.getMessage('default')}
              onClick={props.resetToDefaultOptions}
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </form>
)

export default OptionForm
