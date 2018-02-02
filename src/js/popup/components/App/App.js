import '../../../../css/popup/app.css'

import PropTypes from 'prop-types'
import R from 'ramda'
import {PureComponent, createElement} from 'react'

import {setPredefinedStyleSheet, updateLastUsedTreeIds} from '../../functions'
import Editor from '../Editor'
import Menu from '../Menu'
import MenuCover from '../MenuCover'
import Panel from '../Panel'
import BookmarkEventsHOC from './BookmarkEventsHOC'
import KeyboardNavHOC from './KeyboardNavHOC'
import MouseControlHOC from './MouseControlHOC'

class App extends PureComponent {
  componentWillMount() {
    const {options} = this.props

    setPredefinedStyleSheet(options)
  }

  componentDidUpdate(prevProps) {
    const {isSearching, options, trees} = this.props

    if (trees !== prevProps.trees) {
      const isRememberLastPosition = options.rememberPos && !isSearching
      if (isRememberLastPosition) {
        updateLastUsedTreeIds(trees)
      }
    }
  }

  render = () => (
    <div>
      <Panel />
      <MenuCover />
      <Menu />
      <Editor />
    </div>
  )
}

App.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
  trees: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default R.compose(BookmarkEventsHOC, KeyboardNavHOC, MouseControlHOC)(App)
