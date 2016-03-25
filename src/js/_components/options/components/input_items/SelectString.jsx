import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

import {updateSingleOption} from '../../actions'

const mapStateToProps = (state) => ({
  options: state.options
})

@connect(mapStateToProps)
class OptionInput extends Component {
  render(props) {
    const {
      optionChoice,
      optionChoiceIndex,
      optionName,
      options
    } = props

    const optionValue = options[optionName]

    return (
      <option
        value={String(optionChoiceIndex)}
        selected={optionChoiceIndex === optionValue}
      >
        {optionChoice}
      </option>
    )
  }
}

@connect(mapStateToProps)
class SelectString extends Component {
  @bind
  changeHandler(evt) {
    const {
      dispatch,
      optionName
    } = this.props

    const newOptionValue = parseInt(evt.target.value, 10)

    dispatch(updateSingleOption(optionName, newOptionValue))
  }

  render(props) {
    const {
      optionConfig,
      optionName
    } = props

    const optionItems = []

    optionConfig.choices.forEach((optionChoice, optionChoiceIndex) => {
      if (optionChoice !== undefined) {
        optionItems.push(
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
      <select name={optionName} onChange={this.changeHandler}>
        {optionItems}
      </select>
    )
  }
}

export default SelectString
