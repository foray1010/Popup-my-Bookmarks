import {connect} from 'react-redux'
import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import {
  OPTION_TABLE_MAP
} from '../constants'
import OptionButton from './OptionButton'
import OptionItem from './OptionItem'

import styles from '../../../css/options/option-form.scss'

const OptionForm = (props) => {
  const {
    options,
    selectedNavModule
  } = props

  const OptionFormItems = []
  const selectedOptionFormMap = OPTION_TABLE_MAP[selectedNavModule]

  for (const optionName of selectedOptionFormMap) {
    if (options[optionName] !== undefined) {
      OptionFormItems.push(
        <OptionItem
          key={optionName}
          optionName={optionName}
        />
      )
    }
  }

  return (
    <form>
      <table styleName='table'>
        <tbody>
          {OptionFormItems}
        </tbody>
      </table>
      <OptionButton />
    </form>
  )
}

OptionForm.propTypes = {
  options: PropTypes.object.isRequired,
  selectedNavModule: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  options: state.options,
  selectedNavModule: state.selectedNavModule
})

export default connect(mapStateToProps)(
  CSSModules(OptionForm, styles)
)
