// @flow
// @jsx createElement

import * as R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import {getOptionsConfig} from '../../../common/utils'
import {OPTION_TABLE_MAP} from '../../constants'
import {optionsCreators} from '../../reduxs'
import OptionForm from './OptionForm'

type Props = {|
  options: Object,
  resetToDefaultOptions: () => void,
  saveOptions: () => void,
  selectedOptionFormMap: $ReadOnlyArray<string>,
  updateSingleOption: (string, any) => void
|}
type State = {|
  optionsConfig: ?Object
|}
class OptionFormContainer extends PureComponent<Props, State> {
  state = {
    optionsConfig: null
  }

  async componentDidMount() {
    this.setState({
      optionsConfig: await getOptionsConfig()
    })
  }

  render = () =>
    (this.state.optionsConfig ? (
      <OptionForm
        options={this.props.options}
        optionsConfig={this.state.optionsConfig}
        resetToDefaultOptions={this.props.resetToDefaultOptions}
        saveOptions={this.props.saveOptions}
        selectedOptionFormMap={this.props.selectedOptionFormMap}
        updateSingleOption={this.props.updateSingleOption}
      />
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
