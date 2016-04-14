import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'

import {updateSingleOption} from '../../actions'

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
      optionName,
      options
    } = this.props

    const optionItems = []
    const optionValue = options[optionName]

    for (const [optionChoiceIndex, optionChoice] of optionConfig.choices.entries()) {
      if (optionChoice !== undefined) {
        optionItems.push(
          <option
            key={String(optionChoiceIndex)}
            value={String(optionChoiceIndex)}
          >
            {optionChoice}
          </option>
        )
      }
    }

    return (
      <select
        name={optionName}
        value={optionValue}
        onChange={this.handleChange}
      >
        {optionItems}
      </select>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  SelectString.propTypes = {
    dispatch: PropTypes.func.isRequired,
    optionConfig: PropTypes.object.isRequired,
    optionName: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired
  }
}

const mapStateToProps = (state) => ({
  options: state.options
})

export default connect(mapStateToProps)(SelectString)
