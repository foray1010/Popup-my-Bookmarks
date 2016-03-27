import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {updateSingleOption} from '../../actions'

const mapStateToProps = (state) => ({
  options: state.options
})

@connect(mapStateToProps)
class OptionInput extends Component {
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

    const optionValue = options[optionName]

    const isChecked = optionValue.includes(optionChoiceIndex)

    return (
      <label>
        <input
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

const SelectMultiple = (props) => {
  const {
    optionConfig,
    optionName
  } = props

  const checkboxItems = []

  optionConfig.choices.forEach((optionChoice, optionChoiceIndex) => {
    if (optionChoice !== undefined) {
      checkboxItems.push(
        <OptionInput
          key={String(optionChoiceIndex)}
          optionChoice={optionChoice}
          optionChoiceIndex={optionChoiceIndex}
          optionName={optionName}
        />
      )
    }
  })

  return (
    <div className='select-multiple-box'>
      {checkboxItems}
    </div>
  )
}

if (process.env.NODE_ENV !== 'production') {
  SelectMultiple.propTypes = {
    optionConfig: PropTypes.object.isRequired,
    optionName: PropTypes.string.isRequired
  }
}

export default connect(mapStateToProps)(SelectMultiple)
