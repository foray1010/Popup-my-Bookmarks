import {connect} from 'react-redux'

import {
  closeMenuCover
} from '../../actions'
import Menu from './Menu'

const mapDispatchToProps = {
  closeMenuCover
}

const mapStateToProps = (state) => ({
  isSearching: Boolean(state.searchKeyword),
  menuPattern: state.menuPattern,
  menuTarget: state.menuTarget,
  mousePosition: state.mousePosition
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)
