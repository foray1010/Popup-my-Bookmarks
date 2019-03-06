import * as React from 'react'
import {connect} from 'react-redux'

import {OptionsConfig} from '../../../common/types/options'
import {getOptionsConfig} from '../../../common/utils'
import {OPTION_TABLE_MAP} from '../../constants'
import {RootState, optionsCreators} from '../../reduxs'
import OptionForm from './OptionForm'

const mapStateToProps = (state: RootState) => ({
  options: state.options,
  selectedOptionFormMap: OPTION_TABLE_MAP[state.navigation.selectedNavModule]
})

const mapDispatchToProps = {
  saveOptions: optionsCreators.saveOptions,
  resetToDefaultOptions: optionsCreators.resetToDefaultOptions,
  updatePartialOptions: optionsCreators.updatePartialOptions
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
interface State {
  optionsConfig?: OptionsConfig
}
class OptionFormContainer extends React.PureComponent<Props, State> {
  public state = {
    optionsConfig: undefined
  }

  public async componentDidMount() {
    this.setState({
      optionsConfig: await getOptionsConfig()
    })
  }

  public render() {
    const {optionsConfig} = this.state
    if (!optionsConfig) return null

    return (
      <OptionForm
        options={this.props.options}
        optionsConfig={optionsConfig}
        resetToDefaultOptions={this.props.resetToDefaultOptions}
        saveOptions={this.props.saveOptions}
        selectedOptionFormMap={this.props.selectedOptionFormMap}
        updatePartialOptions={this.props.updatePartialOptions}
      />
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionFormContainer)
