import '../../../../css/options/option-form.css'

import PropTypes from 'prop-types'
import {createElement} from 'react'
import webExtension from 'webextension-polyfill'

import OptionButton from './OptionButton'
import OptionItem from './OptionItem'

const OptionForm = (props) => {
  const {
    options,
    optionsConfig,
    saveOptions,
    selectedOptionFormMap,
    resetToDefaultOptions,
    updateSingleOption
  } = props

  const optionFormItems = selectedOptionFormMap.reduce((accumulator, optionName) => {
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
        <tbody>{optionFormItems}</tbody>
        <tfoot>
          <tr>
            <td>
              <OptionButton msg={webExtension.i18n.getMessage('confirm')} onClick={saveOptions} />
            </td>
            <td>
              <OptionButton
                msg={webExtension.i18n.getMessage('default')}
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
