import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'
import classNames from 'classnames'

import {updateSingleOption} from '../../actions'

const msgNo = chrome.i18n.getMessage('opt_no')
const msgYes = chrome.i18n.getMessage('opt_yes')

const mapStateToProps = (state) => ({
  options: state.options
})

@connect(mapStateToProps)
class OptionInput extends Component {
  @bind
  changeHandler(evt) {
    const {
      dispatch,
      optionName
    } = this.props

    const newOptionValue = evt.target.value === 'true'

    dispatch(updateSingleOption(optionName, newOptionValue))
  }

  render(props) {
    const {
      optionChoice,
      optionName,
      options
    } = props

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
          onChange={this.changeHandler}
        />
        {buttonText}
      </label>
    )
  }
}

@connect(mapStateToProps)
class SelectButton extends Component {
  render(props) {
    const {
      optionName,
      options
    } = props

    const optionValue = options[optionName]

    const optionItems = [true, false].map((optionChoice) => (
      <OptionInput
        key={String(optionChoice)}
        optionChoice={optionChoice}
        optionName={optionName}
      />
    ))

    const selectdButtonIndex = optionValue ? 0 : 1

    const selectButtonCoverStyle = `left: ${selectdButtonIndex * 50}%`

    return (
      <div className='select-button-box'>
        <div className='select-button-cover' style={selectButtonCoverStyle} />
        {optionItems}
      </div>
    )
  }
}

export default SelectButton
