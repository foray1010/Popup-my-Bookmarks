import {connect} from 'react-redux'

import {
  closeMenuCover
} from '../../actions'
import MenuCover from './MenuCover'

const mapDispatchToProps = {
  closeMenuCover
}

const mapStateToProps = (state) => ({
  // if editor or menu has target, show menu-cover
  isHidden: !(state.editorTarget || state.menuTarget)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuCover)
