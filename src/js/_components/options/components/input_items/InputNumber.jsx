import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {updateSingleOption} from '../../actions'

class InputNumber extends Component {
  @autobind
  handleChange(evt) {
    const {
      dispatch,
      optionConfig,
      optionName,
      options
    } = this.props

    const inputEl = evt.target

    const newOptionValue = parseInt(inputEl.value, 10)

    if (isNaN(newOptionValue) ||
        newOptionValue < optionConfig.minimum ||
        newOptionValue > optionConfig.maximum) {
      inputEl.value = options[optionName]
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

if (process.env.NODE_ENV !== 'production') {
  InputNumber.propTypes = {
    dispatch: PropTypes.func.isRequired,
    optionConfig: PropTypes.object.isRequired,
    optionName: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired
  }
}

const mapStateToProps = (state) => ({
  options: state.options
})

export default connect(mapStateToProps)(InputNumber)
