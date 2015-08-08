import debounce from 'lodash.debounce'
import element from 'virtual-element'

import Editor from './editor'
import Menu from './menu'
import MenuCover from './menu_cover'
import Panel from './panel'

let currentStateTrees

function afterMount({}, el, setState) {
  globals.setRootState = setState

  initBookmarkEvent()
}

function beforeMount() {
  initStyleOptions()
}

function beforeRender({state}) {
  // assume this module will always update
  currentStateTrees = state.trees
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

function initBookmarkEvent() {
  const renewTrees = debounce((oldTrees) => {
    const treesIdList = oldTrees.asMutable()
      .map((treeInfo) => treeInfo.id)

    Promise.all(treesIdList.map((treeId) => {
      return globals.getFlatTree(treeId)
    }))
      .then((newTrees) => {
        globals.setRootState({
          // to make sure the menu is not activated when bookmark is updating
          editorTarget: null,
          menuTarget: null,

          trees: Immutable(newTrees)
        })
      })
  }, 100)

  const renewSplicedTreesById = (id) => {
    let hit = false

    renewTrees(currentStateTrees.filter((treeInfo) => {
      if (treeInfo.id === id) {
        hit = true
      }

      // remove all the following treeInfo after hit
      return !hit
    }))
  }

  chrome.bookmarks.onChanged.addListener(() => renewTrees(currentStateTrees))
  chrome.bookmarks.onCreated.addListener(() => renewTrees(currentStateTrees))
  chrome.bookmarks.onMoved.addListener(renewSplicedTreesById)
  chrome.bookmarks.onRemoved.addListener(renewSplicedTreesById)
}

function initialState(props) {
  return {
    editorTarget: null,
    menuTarget: null,
    mousePos: Immutable({x: 0, y: 0}),
    searchResult: null,
    trees: Immutable([props.defExpandTree])
  }
}

function initStyleOptions() {
  // if the font family's name has whitespace, use quote to embed it
  const fontFamily = globals.storage.fontFamily.split(',')
    .map((x) => {
      x = x.trim()

      if (x.indexOf(' ') >= 0) {
        x = `"${x}"`
      }

      return x
    })
    .join(',')
  const fontSize = globals.storage.fontSize

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
      width: globals.storage.setWidth + 'px'
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
        searchResult={state.searchResult}
        trees={state.trees} />
      <MenuCover isHidden={isHiddenMenuCover} />
      <Menu
        menuTarget={state.menuTarget}
        mousePos={state.mousePos}
        searchResult={state.searchResult} />
      <Editor editorTarget={state.editorTarget} />
    </div>
  )
}

export default {afterMount, beforeMount, beforeRender, initialState, render}
