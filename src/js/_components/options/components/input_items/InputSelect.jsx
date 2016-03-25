import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

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

  @bind
  changeHandler(evt) {
    const {
      dispatch,
      optionName
    } = this.props

    const newOptionValue = evt.target.value.trim().replace(/\s+/g, ' ')

    dispatch(updateSingleOption(optionName, newOptionValue))
  }

  render(props) {
    const {
      optionConfig,
      optionName,
      options
    } = props

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
          onChange={this.changeHandler}
        />
        <select onChange={this.changeHandler}>{optionItems}</select>
      </div>
    )
  }
}

@connect(mapStateToProps)
class OptionInput extends Component {
  render(props) {
    const {
      optionChoice,
      optionName,
      options
    } = props

    const optionValue = options[optionName]

    return (
      <option selected={optionValue === optionChoice}>
        {optionChoice}
      </option>
    )
  }
}

export default InputSelect
