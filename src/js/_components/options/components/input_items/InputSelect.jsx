import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {updateSingleOption} from '../../actions'

class InputSelect extends Component {
  @autobind
  handleBlur(evt) {
    const {
      dispatch,
      optionName
    } = this.props

    const newOptionValue = evt.target.value
      .trim()
      .replace(/,\s/g, ',')
      .replace(/,$/, '')

    dispatch(updateSingleOption(optionName, newOptionValue))
  }

  @autobind
  handleChange(evt) {
    const {
      dispatch,
      optionName
    } = this.props

    const newOptionValue = evt.target.value
      .trimLeft()
      .replace(/\s+/g, ' ')
      .replace(/^,/, '')

    dispatch(updateSingleOption(optionName, newOptionValue))

    if (evt.target.tagName === 'SELECT') {
      this.inputEl.focus()
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

    const optionItems = optionConfig.choices.asMutable().map((optionChoice, optionChoiceIndex) => (
      <option key={String(optionChoiceIndex)}>
        {optionChoice}
      </option>
    ))

    return (
      <div className='input-select-box'>
        <input
          ref={(ref) => {
            this.inputEl = ref
          }}
          name={optionName}
          type='text'
          value={optionValue}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
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

const mapStateToProps = (state) => ({
  options: state.options
})

export default connect(mapStateToProps)(InputSelect)
