import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import classNames from 'classnames'

import {updateSingleOption} from '../../../actions'

const msgNo = chrome.i18n.getMessage('opt_no')
const msgYes = chrome.i18n.getMessage('opt_yes')

class Option extends Component {
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

    const buttonText = optionChoice ? msgYes : msgNo
    const id = `_${optionName}-${optionChoice}`.toLowerCase().replace(/\s/g, '')
    const optionValue = options[optionName]

    const isChecked = optionValue === optionChoice

    const selectButtonClassName = classNames(
      'select-button-item',
      {
        'select-button-item-active': isChecked
      }
    )

    return (
      <label className='select-button-label' htmlFor={id}>
        <input
          id={id}
          name={optionName}
          type='radio'
          value={String(optionChoice)}
          checked={isChecked}
          hidden
          onChange={this.handleChange}
        />
        <div className={selectButtonClassName}>
          {buttonText}
        </div>
      </label>
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  Option.propTypes = {
    dispatch: PropTypes.func.isRequired,
    optionChoice: PropTypes.bool.isRequired,
    optionName: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired
  }
}

const mapStateToProps = (state) => ({
  options: state.options
})

export default connect(mapStateToProps)(Option)
