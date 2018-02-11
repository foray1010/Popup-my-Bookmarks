import '../../../../css/options/option-form.css'

import PropTypes from 'prop-types'
import {createElement} from 'react'
import webExtension from 'webextension-polyfill'

import OptionButton from './OptionButton'
import OptionItem from './OptionItem'

const OptionForm = (props) => (
  <form>
    <table styleName='table'>
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

OptionForm.propTypes = {
  options: PropTypes.object.isRequired,
  optionsConfig: PropTypes.object.isRequired,
  saveOptions: PropTypes.func.isRequired,
  selectedOptionFormMap: PropTypes.arrayOf(PropTypes.string).isRequired,
  resetToDefaultOptions: PropTypes.func.isRequired,
  updateSingleOption: PropTypes.func.isRequired
}

export default OptionForm
