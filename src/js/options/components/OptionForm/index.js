// @flow strict

import * as React from 'react'
import {connect} from 'react-redux'

import {getOptionsConfig} from '../../../common/utils'
import {OPTION_TABLE_MAP} from '../../constants'
import {type RootState, optionsCreators} from '../../reduxs'
import OptionForm from './OptionForm'

type Props = {|
  options: Object,
  resetToDefaultOptions: () => void,
  saveOptions: () => void,
  selectedOptionFormMap: Array<string>,
  updateSingleOption: (string, any) => void
|}
type State = {|
  optionsConfig: ?Object
|}
class OptionFormContainer extends React.PureComponent<Props, State> {
  state = {
    optionsConfig: null
  }

  async componentDidMount() {
    this.setState({
      optionsConfig: await getOptionsConfig()
    })
  }

  render() {
    if (!this.state.optionsConfig) return null
    return (
      <OptionForm
        options={this.props.options}
        optionsConfig={this.state.optionsConfig}
        resetToDefaultOptions={this.props.resetToDefaultOptions}
        saveOptions={this.props.saveOptions}
        selectedOptionFormMap={this.props.selectedOptionFormMap}
        updateSingleOption={this.props.updateSingleOption}
      />
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  options: state.options,
  selectedOptionFormMap: OPTION_TABLE_MAP[state.navigation.selectedNavModule]
})

const mapDispatchToProps = {
  saveOptions: optionsCreators.saveOptions,
  resetToDefaultOptions: optionsCreators.resetToDefaultOptions,
  updateSingleOption: optionsCreators.updateSingleOption
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionFormContainer)
