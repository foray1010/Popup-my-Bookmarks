import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component} from 'react'

import {updateSingleOption} from '../../actions'

const mapStateToProps = (state) => ({
  options: state.options
})

@connect(mapStateToProps)
class InputSelect extends Component {
  componentDidUpdate() {
    const {optionName} = this.props

    const optionInput = document.getElementsByName(optionName)[0]

    optionInput.focus()
  }

  @autobind
  handleChange(evt) {
    const {
      dispatch,
      optionName
    } = this.props

    const newOptionValue = evt.target.value.trim().replace(/\s+/g, ' ')

    dispatch(updateSingleOption(optionName, newOptionValue))
  }

  render() {
    const {
      optionConfig,
      optionName,
      options
    } = this.props

    const optionValue = options[optionName]

    const optionItems = optionConfig.choices.asMutable().map((optionChoice, optionChoiceIndex) => (
      <OptionInput
        key={String(optionChoiceIndex)}
        optionChoice={optionChoice}
        optionName={optionName}
      />
    ))

    return (
      <div className='input-select-box'>
        <input
          name={optionName}
          type='text'
          value={optionValue}
          onChange={this.handleChange}
        />
        <select onChange={this.handleChange}>{optionItems}</select>
      </div>
    )
  }
}

@connect(mapStateToProps)
class OptionInput extends Component {
  render() {
    const {
      optionChoice,
      optionName,
      options
    } = this.props

    const optionValue = options[optionName]

    return (
      <option selected={optionValue === optionChoice}>
        {optionChoice}
      </option>
    )
  }
}

export default InputSelect
