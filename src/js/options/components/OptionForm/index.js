import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import {getOptionsConfig} from '../../../common/functions'
import {OPTION_TABLE_MAP} from '../../constants'
import {optionsCreators} from '../../reduxs'
import OptionForm from './OptionForm'

class OptionFormContainer extends PureComponent {
  state = {
    optionsConfig: null
  }

  async componentWillMount() {
    this.setState({
      optionsConfig: await getOptionsConfig()
    })
  }

  render = () =>
    (this.state.optionsConfig ? (
      <OptionForm {...this.props} optionsConfig={this.state.optionsConfig} />
    ) : null)
}

const mapStateToProps = (state) => ({
  options: state.options,
  selectedOptionFormMap: OPTION_TABLE_MAP[state.navigation.selectedNavModule]
})

const mapDispatchToProps = R.pick(
  ['saveOptions', 'resetToDefaultOptions', 'updateSingleOption'],
  optionsCreators
)

export default connect(mapStateToProps, mapDispatchToProps)(OptionFormContainer)
