import {connect} from 'react-redux'

import MenuCover from './MenuCover'
import {closeMenuCover} from '../../actions'

const mapDispatchToProps = {
  closeMenuCover
}

const mapStateToProps = (state) => ({
  // if editor or menu has target, show menu-cover
  isHidden: !(state.editorTarget || state.menuTarget)
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuCover)
