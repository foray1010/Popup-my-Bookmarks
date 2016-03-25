import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component} from 'react'

import {updateSingleOption} from '../../actions'

const mapStateToProps = (state) => ({
  options: state.options
})

@connect(mapStateToProps)
class InputNumber extends Component {
  @autobind
  handleChange(evt) {
    const {
      dispatch,
      optionConfig,
      optionName,
      options
    } = this.props

    const el = evt.target

    const newOptionValue = parseInt(el.value, 10)

    if (isNaN(newOptionValue) ||
        newOptionValue < optionConfig.minimum ||
        newOptionValue > optionConfig.maximum) {
      el.value = options[optionName]
    } else {
      dispatch(updateSingleOption(optionName, newOptionValue))
    }
  }

  render() {
    const {
      optionConfig,
      optionName,
      options
    } = this.props

    const optionValue = options[optionName]

    return (
      <input
        name={optionName}
        type='number'
        min={optionConfig.minimum}
        max={optionConfig.maximum}
        value={String(optionValue)}
        onChange={this.handleChange}
      />
    )
  }
}

export default InputNumber
