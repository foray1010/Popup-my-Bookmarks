import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import classNames from 'classnames'

import {updateSingleOption} from '../../../actions'

const msgNo = chrome.i18n.getMessage('opt_no')
const msgYes = chrome.i18n.getMessage('opt_yes')

const mapStateToProps = (state) => ({
  options: state.options
})

@connect(mapStateToProps)
class OptionInput extends Component {
  @autobind
  handleChange(evt) {
    const {
      dispatch,
      optionName
    } = this.props

    const newOptionValue = evt.target.value === 'true'

    dispatch(updateSingleOption(optionName, newOptionValue))
  }

  render() {
    const {
      optionChoice,
      optionName,
      options
    } = this.props

    const optionValue = options[optionName]

    const buttonText = optionChoice ? msgYes : msgNo
    const isChecked = optionValue === optionChoice

    const selectButtonClassName = classNames(
      'select-button-item',
      {
        'select-button-item-active': isChecked
      }
    )

    return (
      <label className={selectButtonClassName}>
        <input
          name={optionName}
          type='radio'
          value={String(optionChoice)}
          checked={isChecked}
          hidden
          onChange={this.handleChange}
        />
        {buttonText}
      </label>
    )
  }
}

const SelectButton = (props) => {
  const {
    optionName,
    options
  } = props

  const optionItems = [true, false].map((optionChoice) => (
    <OptionInput
      key={String(optionChoice)}
      optionChoice={optionChoice}
      optionName={optionName}
    />
  ))
  const optionValue = options[optionName]

  const selectdButtonIndex = optionValue ? 0 : 1

  const selectButtonCoverStyle = {
    left: `${selectdButtonIndex * 50}%`
  }

  return (
    <div className='select-button-box'>
      <div className='select-button-cover' style={selectButtonCoverStyle} />
      {optionItems}
    </div>
  )
}

if (process.env.NODE_ENV !== 'production') {
  SelectButton.propTypes = {
    optionName: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired
  }
}

export default connect(mapStateToProps)(SelectButton)
