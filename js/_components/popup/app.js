import forEach from 'lodash.foreach'
import {element} from 'deku'

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
  const createElementInTree = (newTrees, id, itemInfo) => {
    let hit = false

    forEach(newTrees, (treeInfo) => {
      if (treeInfo.id === itemInfo.parentId) {
        hit = true

        treeInfo.children.splice(itemInfo.index, 0, itemInfo)

        return false
      }
    })

    return hit
  }

  const removeElementFromTree = (newTrees, id, removeInfo) => {
    let hit = false

    forEach(newTrees, (treeInfo, treeIndex) => {
      if (treeInfo.id === removeInfo.parentId) {
        hit = true

        treeInfo.children.splice(removeInfo.index, 1)
      }

      if (treeInfo.id === id) {
        hit = true

        newTrees.splice(treeIndex, 1)
      }
    })

    return hit
  }

  chrome.bookmarks.onChanged.addListener((id) => {
    const newTrees = currentStateTrees.asMutable({deep: true})

    chrome.bookmarks.get(id, (results) => {
      const itemInfo = results[0]

      let hit = false

      forEach(newTrees, (treeInfo) => {
        if (treeInfo.id === itemInfo.parentId) {
          hit = true

          treeInfo.children[itemInfo.index] = itemInfo
        }

        if (treeInfo.id === id) {
          hit = true

          treeInfo.title = itemInfo.title
        }
      })

      if (hit) {
        globals.setRootState({
          trees: Immutable(newTrees)
        })
      }
    })
  })

  chrome.bookmarks.onCreated.addListener((id, itemInfo) => {
    const newTrees = currentStateTrees.asMutable({deep: true})

    const hit = createElementInTree(newTrees, id, itemInfo)

    if (hit) {
      globals.setRootState({
        trees: Immutable(newTrees)
      })
    }
  })

  chrome.bookmarks.onMoved.addListener((id) => {
    const newTrees = currentStateTrees.asMutable({deep: true})

    chrome.bookmarks.get(id, (results) => {
      const itemInfo = results[0]

      const removeHit = removeElementFromTree(newTrees, id, itemInfo)

      const createHit = createElementInTree(newTrees, id, itemInfo)

      if (removeHit || createHit) {
        globals.setRootState({
          trees: Immutable(newTrees)
        })
      }
    })
  })

  chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
    const newTrees = currentStateTrees.asMutable({deep: true})

    const hit = removeElementFromTree(newTrees, id, removeInfo)

    if (hit) {
      globals.setRootState({
        trees: Immutable(newTrees)
      })
    }
  })
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

  const fontSizePx = globals.storage.fontSize + 'px'

  // -2 for border width
  const separatorHeightPx = (globals.itemHeight / 2) - 2 + 'px'

  // set panel (#main, #sub) width
  CSS.set('.panel-width', {
    width: globals.storage.setWidth + 'px'
  })

  // set font style
  CSS.set('body', {
    font: fontSizePx + ' ' + fontFamily
  })

  if (globals.storage.fontSize > 16) {
    CSS.set({
      '.bookmark-item': {
        height: fontSizePx,
        'line-height': fontSizePx
      },
      '.icon': {
        width: fontSizePx
      }
    })
  }

  // set separator height depend on item height
  CSS.set('.separator', {
    height: separatorHeightPx,
    'line-height': separatorHeightPx
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
