import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component} from 'react'

import {updateSingleOption} from '../../actions'

const mapStateToProps = (state) => ({
  options: state.options
})

@connect(mapStateToProps)
class OptionInput extends Component {
  render() {
    const {
      optionChoice,
      optionChoiceIndex,
      optionName,
      options
    } = this.props

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
  @autobind
  handleChange(evt) {
    const {
      dispatch,
      optionName
    } = this.props

    const newOptionValue = parseInt(evt.target.value, 10)

    dispatch(updateSingleOption(optionName, newOptionValue))
  }

  render() {
    const {
      optionConfig,
      optionName
    } = this.props

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
      <select name={optionName} onChange={this.handleChange}>
        {optionItems}
      </select>
    )
  }
}

export default SelectString
