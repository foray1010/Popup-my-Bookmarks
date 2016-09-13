import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {updateSingleOption} from '../../../actions'

class Option extends Component {
  @autobind
  handleChange(evt) {
    const {
      dispatch,
      optionName,
      options
    } = this.props

    const newOptionValue = options[optionName].asMutable()
    const targetValue = parseInt(evt.target.value, 10)

    const targetValueIndex = newOptionValue.indexOf(targetValue)

    const wasChecked = targetValueIndex >= 0

    if (wasChecked) {
      newOptionValue.splice(targetValueIndex, 1)
    } else {
      newOptionValue.push(targetValue)
      newOptionValue.sort()
    }

    dispatch(updateSingleOption(optionName, newOptionValue))
  }

  render() {
    const {
      optionChoice,
      optionChoiceIndex,
      optionName,
      options
    } = this.props

    const id = `_${optionName}-${optionChoice}`.toLowerCase().replace(/\s/g, '')
    const optionValue = options[optionName]

    const isChecked = optionValue.includes(optionChoiceIndex)

    return (
      <label htmlFor={id}>
        <input
          id={id}
          name={optionName}
          type='checkbox'
          value={String(optionChoiceIndex)}
          checked={isChecked}
          onChange={this.handleChange}
        />
        {optionChoice}
      </label>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  Option.propTypes = {
    dispatch: PropTypes.func.isRequired,
    optionChoice: PropTypes.string.isRequired,
    optionChoiceIndex: PropTypes.number.isRequired,
    optionName: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired
  }
}

const mapStateToProps = (state) => ({
  options: state.options
})

export default connect(mapStateToProps)(Option)
