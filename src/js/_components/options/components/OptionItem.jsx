import {connect} from 'react-redux'
import {createElement, PropTypes} from 'react'

import InputNumber from './input_items/InputNumber'
import InputSelect from './input_items/InputSelect'
import SelectButton from './input_items/SelectButton'
import SelectMultiple from './input_items/SelectMultiple'
import SelectString from './input_items/SelectString'

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
    <div className='option-item'>
      <div className='option-desc'>{chrome.i18n.getMessage('opt_' + optionName)}</div>
      <div className='option-input'>
        <InputItem
          optionConfig={optionConfig}
          optionName={optionName}
        />
      </div>
    </div>
  )
}

if (process.env.NODE_ENV !== 'production') {
  OptionItem.propTypes = {
    optionName: PropTypes.string.isRequired,
    optionsConfig: PropTypes.object.isRequired
  }
}

const mapStateToProps = (state) => ({
  optionsConfig: state.optionsConfig
})

export default connect(mapStateToProps)(OptionItem)
