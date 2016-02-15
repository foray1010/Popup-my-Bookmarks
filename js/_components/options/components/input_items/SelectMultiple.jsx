import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

import {updateSingleOption} from '../../actions'

const mapStateToProps = (state) => ({
  options: state.options
})

@connect(mapStateToProps)
class OptionInput extends Component {
  @bind
  changeHandler(evt) {
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

  render(props) {
    const {
      optionChoice,
      optionChoiceIndex,
      optionName,
      options
    } = props

    const optionValue = options[optionName]

    const isChecked = optionValue.includes(optionChoiceIndex)

    return (
      <label>
        <input
          name={optionName}
          type='checkbox'
          value={String(optionChoiceIndex)}
          checked={isChecked}
          onChange={this.changeHandler}
        />
        {optionChoice}
      </label>
    )
  }
}

@connect(mapStateToProps)
class SelectMultiple extends Component {
  render(props) {
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
}

export default SelectMultiple
