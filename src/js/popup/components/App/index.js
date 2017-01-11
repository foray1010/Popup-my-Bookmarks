import {connect} from 'react-redux'

import {
  closeMenu,
  onPressArrowKey,
  openMenu,
  renewTrees
} from '../../actions'
import App from './App'

const mapDispatchToProps = {
  closeMenu,
  onPressArrowKey,
  openMenu,
  renewTrees
}

const mapStateToProps = (state) => ({
  editorTarget: state.editorTarget,
  focusTarget: state.focusTarget,
  menuTarget: state.menuTarget,
  options: state.options,
  searchKeyword: state.searchKeyword,
  trees: state.trees
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
