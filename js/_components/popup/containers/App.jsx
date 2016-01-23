import {element} from 'deku'
import debounce from 'lodash.debounce'

import {getSearchResult} from '../components/Search'
import {
  updateEditorTarget,
  updateMenuTarget,
  updateTrees
} from '../actions'
import css from '../../lib/css'
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
      const slicedTrees = globals.getSlicedTrees(trees, removeFromIndex)

      renewTrees(slicedTrees)
    } else {
      renewCurrentTrees()
    }
  }

  const renewTrees = debounce(async (oldTrees) => {
    const {searchKeyword} = currentContext

    // Promise.all cannot recognize immutable array
    const newTrees = await Promise.all(oldTrees.asMutable().map((treeInfo) => {
      if (treeInfo.id === 'search-result') {
        return getSearchResult(currentContext, searchKeyword)
      }

      return globals.getFlatTree(treeInfo.id)
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

function initStyleOptions(options) {
  // if the font family's name has whitespace, use quote to embed it
  const fontFamily = options.fontFamily.split(',')
    .map((x) => {
      x = x.trim()

      if (x.indexOf(' ') >= 0) {
        x = JSON.stringify(x)
      }

      return x
    })
    .join(',')
  const fontSize = options.fontSize

  const itemHeight = globals.goldenGap * 2 + fontSize

  // +1 for border width, globals.goldenGap for padding
  globals.itemOffsetHeight = (1 + globals.goldenGap) * 2 + itemHeight

  css.set({
    body: {
      font: `${fontSize}px ${fontFamily}`
    },
    '.bookmark-item': {
      height: itemHeight + 'px'
    },
    '.icon': {
      // set the width same as item height, as it is a square
      width: itemHeight + 'px'
    },
    '.panel-width': {
      // set panel (#main, #sub) width
      width: options.setWidth + 'px'
    },
    '.separator': {
      // set separator height depend on item height
      height: (globals.itemOffsetHeight / 2) + 'px'
    }
  })
}

const App = {
  onCreate(model) {
    const {context, dispatch} = model

    const {options} = context

    currentContext = context

    initStyleOptions(options)

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
