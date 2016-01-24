import {element} from 'deku'
import debounce from 'lodash.debounce'

import {
  getFlatTree,
  getSlicedTrees
} from '../functions'
import {getSearchResult} from '../components/Search'
import {
  updateEditorTarget,
  updateMenuTarget,
  updateTrees
} from '../actions'
import Editor from '../components/Editor'
import Menu from '../components/Menu'
import MenuCover from '../components/MenuCover'
import Panel from '../components/Panel'

let currentContext = null

const contextMenuHandler = () => (evt) => {
  // allow native context menu if it is an input element
  if (evt.target.tagName === 'INPUT') {
    return
  }

  // disable native context menu
  evt.preventDefault()
}

const mouseDownHandler = () => (evt) => {
  // disable the scrolling arrows after middle click
  if (evt.button === 1) {
    evt.preventDefault()
  }
}

function initBookmarkEvent(dispatch) {
  const renewCurrentTrees = () => renewTrees(currentContext.trees)

  const renewSlicedTreesById = (itemId) => {
    const {trees} = currentContext

    const removeFromIndex = trees.findIndex((treeInfo) => treeInfo.id === itemId)

    if (removeFromIndex >= 0) {
      const slicedTrees = getSlicedTrees(trees, removeFromIndex)

      renewTrees(slicedTrees)
    } else {
      renewCurrentTrees()
    }
  }

  const renewTrees = debounce(async (oldTrees) => {
    const {searchKeyword} = currentContext

    const newTrees = await Promise.all(oldTrees.asMutable().map((treeInfo) => {
      if (treeInfo.id === 'search-result') {
        return getSearchResult(currentContext, searchKeyword)
      }

      return getFlatTree(treeInfo.id)
    }))

    dispatch([
      // to make sure the menu is not activated when bookmark is updating
      updateEditorTarget(null),
      updateMenuTarget(null),

      updateTrees(newTrees)
    ])
  }, 100)

  chrome.bookmarks.onChanged.addListener(renewCurrentTrees)
  chrome.bookmarks.onCreated.addListener(renewCurrentTrees)
  chrome.bookmarks.onMoved.addListener(renewSlicedTreesById)
  chrome.bookmarks.onRemoved.addListener(renewSlicedTreesById)
}

const App = {
  onCreate(model) {
    const {context, dispatch} = model

    currentContext = context

    initBookmarkEvent(dispatch)
  },

  onUpdate(model) {
    const {context} = model

    currentContext = context
  },

  render() {
    console.log('render')

    return (
      <div
        id='app'
        onContextMenu={contextMenuHandler()}
        onMouseDown={mouseDownHandler()}
      >
        <Panel />
        <MenuCover />
        <Menu />
        <Editor />
      </div>
    )
  }
}

export default App
