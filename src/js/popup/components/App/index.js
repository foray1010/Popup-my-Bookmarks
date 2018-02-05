import PropTypes from 'prop-types'
import R from 'ramda'
import {PureComponent, createElement} from 'react'
import {connect} from 'react-redux'

import {closeMenu, dragEnd, onPressArrowKey, openMenu, renewTrees} from '../../actions'
import {setPredefinedStyleSheet, updateLastUsedTreeIds} from '../../functions'
import App from './App'
import BookmarkEventsHOC from './BookmarkEventsHOC'
import KeyboardNavHOC from './KeyboardNavHOC'
import MouseControlHOC from './MouseControlHOC'

class AppContainer extends PureComponent {
  static propTypes = {
    isSearching: PropTypes.bool.isRequired,
    options: PropTypes.object.isRequired,
    trees: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  componentDidMount() {
    setPredefinedStyleSheet(this.props.options)
  }

  componentDidUpdate(prevProps) {
    if (this.props.trees !== prevProps.trees) {
      const isRememberLastPosition = this.props.options.rememberPos && !this.props.isSearching
      if (isRememberLastPosition) {
        updateLastUsedTreeIds(this.props.trees)
      }
    }
  }

  render = () => <App {...this.props} />
}

const mapDispatchToProps = {
  closeMenu,
  dragEnd,
  onPressArrowKey,
  openMenu,
  renewTrees
}

const mapStateToProps = (state) => ({
  dragIndicator: state.dragIndicator,
  dragTarget: state.dragTarget,
  editorTarget: state.editorTarget,
  focusTarget: state.focusTarget,
  isSearching: Boolean(state.searchKeyword),
  menuTarget: state.menuTarget,
  options: state.options,
  selectedMenuItem: state.selectedMenuItem,
  trees: state.trees
})

export default R.compose(
  connect(mapStateToProps, mapDispatchToProps),
  BookmarkEventsHOC,
  KeyboardNavHOC,
  MouseControlHOC
)(AppContainer)
