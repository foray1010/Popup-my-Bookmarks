import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, PropTypes, PureComponent} from 'react'
import {static as Immutable} from 'seamless-immutable'
import CSSModules from 'react-css-modules'

import {updateSingleOption} from '../../actions'

import styles from '../../../../css/options/input-select.css'

class InputSelect extends PureComponent {
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

    const optionItems = Immutable.asMutable(optionConfig.choices).map((optionChoice, optionChoiceIndex) => (
      <option key={String(optionChoiceIndex)}>
        {optionChoice}
      </option>
    ))

    return (
      <div styleName='main'>
        <input
          ref={(ref) => {
            this.inputEl = ref
          }}
          styleName='input'
          name={optionName}
          type='text'
          value={optionValue}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <select
          styleName='select'
          defaultValue={optionValue}
          onChange={this.handleChange}
        >
          {optionItems}
        </select>
      </div>
    )
  }
}

InputSelect.propTypes = {
  dispatch: PropTypes.func.isRequired,
  optionConfig: PropTypes.object.isRequired,
  optionName: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  options: state.options
})

export default connect(mapStateToProps)(
  CSSModules(InputSelect, styles)
)
