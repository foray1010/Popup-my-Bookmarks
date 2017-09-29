import {connect} from 'react-redux'

import Menu from './Menu'
import {closeMenuCover} from '../../actions'

const mapDispatchToProps = {
  closeMenuCover
}

const mapStateToProps = (state) => ({
  isSearching: Boolean(state.searchKeyword),
  menuPattern: state.menuPattern,
  menuTarget: state.menuTarget,
  mousePosition: state.mousePosition
})

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
