// @flow strict

import * as React from 'react'
import {connect} from 'react-redux'

import type {Options} from '../../../common/types/options'
import {getOptionsConfig} from '../../../common/utils'
import {OPTION_TABLE_MAP} from '../../constants'
import {type RootState, optionsCreators} from '../../reduxs'
import OptionForm from './OptionForm'

type Props = {|
  options: Options,
  resetToDefaultOptions: () => void,
  saveOptions: () => void,
  selectedOptionFormMap: Array<string>,
  updatePartialOptions: ($Shape<Options>) => void
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
        updatePartialOptions={this.props.updatePartialOptions}
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
  updatePartialOptions: optionsCreators.updatePartialOptions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionFormContainer)
