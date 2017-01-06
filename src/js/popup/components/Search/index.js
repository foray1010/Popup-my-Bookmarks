import {connect} from 'react-redux'

import {
  updateTreesBySearchKeyword
} from '../../actions'
import Search from './Search'

const mapDispatchToProps = {
  updateTreesBySearchKeyword
}

const mapStateToProps = (state) => ({
  isMenuCoverHidden: !(state.editorTarget || state.menuTarget),
  options: state.options,
  searchKeyword: state.searchKeyword
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
