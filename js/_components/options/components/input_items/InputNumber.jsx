import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

import {updateSingleOption} from '../../actions'

const mapStateToProps = (state) => ({
  options: state.options
})

@connect(mapStateToProps)
class InputNumber extends Component {
  @bind
  changeHandler(evt) {
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

  render(props) {
    const {
      optionConfig,
      optionName,
      options
    } = props

    const optionValue = options[optionName]

    return (
      <input
        name={optionName}
        type='number'
        min={optionConfig.minimum}
        max={optionConfig.maximum}
        value={String(optionValue)}
        onChange={this.changeHandler}
      />
    )
  }
}

export default InputNumber
