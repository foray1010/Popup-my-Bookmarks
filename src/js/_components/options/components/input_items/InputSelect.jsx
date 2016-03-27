import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {updateSingleOption} from '../../actions'

const mapStateToProps = (state) => ({
  options: state.options
})

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
      <option key={String(optionChoiceIndex)}>
        {optionChoice}
      </option>
    ))

    return (
      <div className='input-select-box'>
        <input
          name={optionName}
          type='text'
          value={optionValue}
          onChange={this.handleChange}
        />
        <select
          defaultValue={optionValue}
          onChange={this.handleChange}
        >
          {optionItems}
        </select>
      </div>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  InputSelect.propTypes = {
    dispatch: PropTypes.func.isRequired,
    optionConfig: PropTypes.object.isRequired,
    optionName: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired
  }
}

export default connect(mapStateToProps)(InputSelect)
