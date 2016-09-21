import {connect} from 'react-redux'
import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import InputNumber from './input_items/InputNumber'
import InputSelect from './input_items/InputSelect'
import SelectButton from './input_items/SelectButton'
import SelectMultiple from './input_items/SelectMultiple'
import SelectString from './input_items/SelectString'

import styles from '../../../css/options/option-item.scss'

const OptionItem = (props) => {
  const {
    optionName,
    optionsConfig
  } = props

  const optionConfig = optionsConfig[optionName]

  const InputItem = (() => {
    switch (optionConfig.type) {
      case 'array':
        return SelectMultiple

      case 'boolean':
        return SelectButton

      case 'integer':
        if (optionConfig.choices) {
          return SelectString
        }

        return InputNumber

      case 'string':
        return InputSelect

      default:
        return null
    }
  })()

  return (
    <div styleName='main'>
      <div styleName='desc'>{chrome.i18n.getMessage('opt_' + optionName)}</div>
      <div styleName='input'>
        <InputItem
          optionConfig={optionConfig}
          optionName={optionName}
        />
      </div>
    </div>
  )
}

OptionItem.propTypes = {
  optionName: PropTypes.string.isRequired,
  optionsConfig: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  optionsConfig: state.optionsConfig
})

export default connect(mapStateToProps)(
  CSSModules(OptionItem, styles)
)
