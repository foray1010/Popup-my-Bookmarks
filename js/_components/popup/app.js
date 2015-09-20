import debounce from 'lodash.debounce'
import element from 'virtual-element'

import Editor from './editor'
import {getSearchResult} from './search'
import Menu from './menu'
import MenuCover from './menu_cover'
import Panel from './panel'

let currentState

function afterMount({}, el, setState) {
  globals.setRootState = setState

  initBookmarkEvent()
}

function afterUpdate({props, state}, prevProps, prevState, setState) {
  if (prevState.isSearching && !state.isSearching) {
    setState({
      trees: getDefaultTrees(props)
    })
  }
}

function beforeMount() {
  initStyleOptions()
}

function beforeRender({state}) {
  // assume this module will always update
  currentState = state
}

function contextMenuHandler(event) {
  const target = event.target

  // allow native context menu if it is an input element
  if (target.tagName === 'INPUT') {
    return
  }

  // disable native context menu
  event.preventDefault()
}

function getDefaultTrees(props) {
  return Immutable([props.defExpandTree])
}

function initBookmarkEvent() {
  const renewCurrentTrees = () => renewTrees(currentState.trees)

  const renewTrees = debounce(async function(oldTrees) {
    // Promise.all cannot recognize immutable array
    const newTrees = await Promise.all(oldTrees.asMutable().map((treeInfo) => {
      if (treeInfo.id === 'search-result') {
        return getSearchResult()
      }

      return globals.getFlatTree(treeInfo.id)
    }))

    globals.setRootState({
      // to make sure the menu is not activated when bookmark is updating
      editorTarget: null,
      menuTarget: null,

      trees: Immutable(newTrees)
    })
  }, 100)

  const renewSlicedTreesById = (itemId) => {
    const removeFromIndex = currentState.trees.findIndex((treeInfo) => {
      return treeInfo.id === itemId
    })

    const slicedTrees = globals.getSlicedTrees(currentState.trees, removeFromIndex)

    renewTrees(slicedTrees)
  }

  chrome.bookmarks.onChanged.addListener(renewCurrentTrees)
  chrome.bookmarks.onCreated.addListener(renewCurrentTrees)
  chrome.bookmarks.onMoved.addListener(renewSlicedTreesById)
  chrome.bookmarks.onRemoved.addListener(renewSlicedTreesById)
}

function initialState(props) {
  return {
    editorTarget: null,
    isSearching: false,
    menuTarget: null,
    mousePos: Immutable({x: 0, y: 0}),
    trees: getDefaultTrees(props)
  }
}

function initStyleOptions() {
  // if the font family's name has whitespace, use quote to embed it
  const fontFamily = globals.options.fontFamily.split(',')
    .map((x) => {
      x = x.trim()

      if (x.indexOf(' ') >= 0) {
        x = `"${x}"`
      }

      return x
    })
    .join(',')
  const fontSize = globals.options.fontSize

  const itemHeight = globals.goldenGap * 2 + fontSize

  // +1 for border width, globals.goldenGap for padding
  globals.itemOffsetHeight = (1 + globals.goldenGap) * 2 + itemHeight

  CSS.set({
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
      width: globals.options.setWidth + 'px'
    },
    '.separator': {
      // set separator height depend on item height
      height: (globals.itemOffsetHeight / 2) + 'px'
    }
  })
}

// disable the scrolling arrows after middle click
function mouseDownHandler(event) {
  if (event.button === 1) {
    event.preventDefault()
  }
}

function render({state}) {
  // if menu or editor has target, show menu-cover
  const isHiddenMenuCover = !(state.menuTarget || state.editorTarget)

  return (
    <div
      id='app'
      onContextMenu={contextMenuHandler}
      onMouseDown={mouseDownHandler}>
      <Panel
        isSearching={state.isSearching}
        trees={state.trees} />
      <MenuCover isHidden={isHiddenMenuCover} />
      <Menu
        isSearching={state.isSearching}
        menuTarget={state.menuTarget}
        mousePos={state.mousePos} />
      <Editor editorTarget={state.editorTarget} />
    </div>
  )
}

export default {afterMount, afterUpdate, beforeMount, beforeRender, initialState, render}
