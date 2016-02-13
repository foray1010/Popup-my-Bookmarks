import {element} from 'deku'
import debounce from 'lodash.debounce'

import {
  genBookmarkList,
  getBookmarkType,
  getFlatTree,
  getSlicedTrees,
  isFolder
} from '../functions'
import {getSearchResult} from '../components/Search'
import {
  removeTreeInfosFromIndex,
  replaceTreeInfoByIndex,
  updateEditorTarget,
  updateMenuTarget,
  updateKeyboardTarget,
  updateTrees
} from '../actions'
import {
  TYPE_ROOT_FOLDER
} from '../constants'
import Editor from '../components/Editor'
import Menu from '../components/Menu'
import MenuCover from '../components/MenuCover'
import Panel from '../components/Panel'

let currentContext = null

const contextMenuHandler = (evt) => {
  // allow native context menu if it is an input element
  if (evt.target.tagName === 'INPUT') {
    return
  }

  // disable native context menu
  evt.preventDefault()
}

const keyDownHandler = (model) => async (evt) => {
  const keyCode = evt.keyCode

  switch (keyCode) {
    case 37: // left
      await keyboardArrowLeftRightHandler(model, true)
      break

    case 38: // up
      evt.preventDefault()
      await keyboardArrowUpDownHandler(model, true)
      break

    case 39: // right
      await keyboardArrowLeftRightHandler(model, false)
      break

    case 40: // down
      evt.preventDefault()
      await keyboardArrowUpDownHandler(model, false)
      break

    default:
  }
}

const mouseDownHandler = (evt) => {
  // disable the scrolling arrows after middle click
  if (evt.button === 1) {
    evt.preventDefault()
  }
}

function getKeyboardTargetTreeIndex(context) {
  const {keyboardTarget, trees} = context

  if (!keyboardTarget) {
    return trees.length - 1
  }

  if (getBookmarkType(keyboardTarget) === TYPE_ROOT_FOLDER) {
    return 0
  }

  return trees.findIndex((treeInfo) => treeInfo.id === keyboardTarget.parentId)
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

async function keyboardArrowLeftRightHandler(model, isLeft) {
  const {context, dispatch} = model

  const {editorTarget, keyboardTarget, menuTarget, trees} = context

  if (editorTarget || menuTarget) return
  if (!keyboardTarget) return

  const targetTreeIndex = getKeyboardTargetTreeIndex(context)

  if (isLeft) {
    if (trees.length > 0) {
      const prevTreeIndex = targetTreeIndex - 1
      const prevTreeInfo = trees[prevTreeIndex]

      const prevBookmarkList = genBookmarkList(context, prevTreeInfo, prevTreeIndex)

      dispatch([
        removeTreeInfosFromIndex(targetTreeIndex),
        updateKeyboardTarget(
          prevBookmarkList.find((itemInfo) => itemInfo.id === keyboardTarget.parentId)
        )
      ])
    }
  } else {
    if (isFolder(keyboardTarget)) {
      const nextTreeIndex = targetTreeIndex + 1
      const nextTreeInfo = await getFlatTree(keyboardTarget.id)

      const nextBookmarkList = genBookmarkList(context, nextTreeInfo, nextTreeIndex)

      dispatch([
        await replaceTreeInfoByIndex(nextTreeIndex, nextTreeInfo),
        updateKeyboardTarget(nextBookmarkList[0])
      ])
    }
  }
}

async function keyboardArrowUpDownHandler(model, isUp) {
  const {context, dispatch} = model

  const {editorTarget, keyboardTarget, menuTarget, trees} = context

  if (editorTarget || menuTarget) return

  const targetTreeIndex = getKeyboardTargetTreeIndex(context)

  const targetBookmarkList = genBookmarkList(context, trees[targetTreeIndex], targetTreeIndex)

  const lastItemIndex = targetBookmarkList.length - 1

  let nextSelectedIndex
  if (keyboardTarget) {
    const origSelectedIndex = targetBookmarkList
      .findIndex((itemInfo) => itemInfo.id === keyboardTarget.id)

    if (isUp) {
      nextSelectedIndex = origSelectedIndex - 1
      if (nextSelectedIndex < 0) {
        nextSelectedIndex = lastItemIndex
      }
    } else {
      nextSelectedIndex = origSelectedIndex + 1
      if (nextSelectedIndex > lastItemIndex) {
        nextSelectedIndex = 0
      }
    }
  } else {
    nextSelectedIndex = isUp ? lastItemIndex : 0
  }

  dispatch(updateKeyboardTarget(targetBookmarkList[nextSelectedIndex]))
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

  render(model) {
    console.log('render')

    return (
      <div
        id='app'
        onContextMenu={contextMenuHandler}
        onKeyDown={keyDownHandler(model)}
        onMouseDown={mouseDownHandler}
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
