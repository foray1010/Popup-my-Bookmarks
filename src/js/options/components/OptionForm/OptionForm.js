// @flow strict

import * as React from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/options/option-form.css'
import OptionButton from './OptionButton'
import OptionItem from './OptionItem'

type Props = {|
  options: Object,
  optionsConfig: Object,
  resetToDefaultOptions: () => void,
  saveOptions: () => void,
  selectedOptionFormMap: Array<string>,
  updateSingleOption: (string, any) => void
|}
const OptionForm = (props: Props) => (
  <form>
    <table className={classes.table}>
      <tbody>
        {props.selectedOptionFormMap.reduce((acc, optionName) => {
          const optionValue = props.options[optionName]
          if (optionValue !== undefined) {
            return [
              ...acc,
              <OptionItem
                key={optionName}
                optionConfig={props.optionsConfig[optionName]}
                optionName={optionName}
                optionValue={optionValue}
                updateSingleOption={props.updateSingleOption}
              />
            ]
          }

          return acc
        }, [])}
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
