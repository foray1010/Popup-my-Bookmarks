import {createElement, PropTypes} from 'react'

import OptionButton from './OptionButton'
import OptionItem from './OptionItem'

import '../../../../css/options/option-form.css'

const msgConfirm = chrome.i18n.getMessage('confirm')
const msgDefault = chrome.i18n.getMessage('default')

const OptionForm = (props) => {
  const {
    options,
    optionsConfig,
    saveOptions,
    selectedOptionFormMap,
    resetToDefaultOptions,
    updateSingleOption
  } = props

  const optionFormItems = selectedOptionFormMap
    .reduce((accumulator, optionName) => {
      const optionValue = options[optionName]
      if (optionValue !== undefined) {
        return accumulator.concat(
          <OptionItem
            key={optionName}
            optionConfig={optionsConfig[optionName]}
            optionName={optionName}
            optionValue={optionValue}
            updateSingleOption={updateSingleOption}
          />
        )
      }

      return accumulator
    }, [])

  return (
    <form>
      <table styleName='table'>
        <tbody>
          {optionFormItems}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <OptionButton
                msg={msgConfirm}
                onClick={saveOptions}
              />
            </td>
            <td>
              <OptionButton
                msg={msgDefault}
                onClick={resetToDefaultOptions}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </form>
  )
}

OptionForm.propTypes = {
  options: PropTypes.object.isRequired,
  optionsConfig: PropTypes.object.isRequired,
  saveOptions: PropTypes.func.isRequired,
  selectedOptionFormMap: PropTypes.arrayOf(PropTypes.string).isRequired,
  resetToDefaultOptions: PropTypes.func.isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default OptionForm
