import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import classNames from 'classnames'
import CSSModules from 'react-css-modules'

import {updateSingleOption} from '../../../actions'

import styles from '../../../../../css/options/select-button-option.css'

const msgNo = chrome.i18n.getMessage('no')
const msgYes = chrome.i18n.getMessage('yes')

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

    const thisStyleName = classNames(
      'item',
      {
        'item-active': isChecked
      }
    )

    return (
      <label styleName='main' htmlFor={id}>
        <input
          id={id}
          name={optionName}
          type='radio'
          value={String(optionChoice)}
          checked={isChecked}
          hidden
          onChange={this.handleChange}
        />
        <div styleName={thisStyleName}>
          {buttonText}
        </div>
      </label>
    )
  }
}

Option.propTypes = {
  dispatch: PropTypes.func.isRequired,
  optionChoice: PropTypes.bool.isRequired,
  optionName: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  options: state.options
})

export default connect(mapStateToProps)(
  CSSModules(Option, styles, {allowMultiple: true})
)
