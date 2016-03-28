import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {updateSingleOption} from '../../actions'

class InputNumber extends Component {
  @autobind
  handleBlur(evt) {
    const {
      dispatch,
      optionConfig,
      optionName
    } = this.props

    const inputEl = evt.target

    const newOptionValue = parseInt(inputEl.value, 10)

    if (newOptionValue < optionConfig.minimum) {
      dispatch(updateSingleOption(optionName, optionConfig.minimum))
    } else if (newOptionValue > optionConfig.maximum) {
      dispatch(updateSingleOption(optionName, optionConfig.maximum))
    }
  }

  @autobind
  handleChange(evt) {
    const {
      dispatch,
      optionName
    } = this.props

    const inputEl = evt.target

    const newOptionValue = parseInt(inputEl.value, 10)

    if (isNaN(newOptionValue)) {
      return
    } else {
      dispatch(updateSingleOption(optionName, newOptionValue))
    }
  }

  @autobind
  handleKeyDown(evt) {
    // when click Enter, it will submit the form
    if (evt.keyCode === 13) {
      this.handleBlur(evt)
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
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
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
