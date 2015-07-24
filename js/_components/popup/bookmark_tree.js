import {element} from 'deku'

import BookmarkItem from './bookmark_item'
import FolderCover from './folder_cover'
import NoResult from './no_result'
import TreeHead from './tree_head'

function afterRender(component, el) {
  setHeight(el)
}

function render({props, state}) {
  const searchResult = props.searchResult
  const treeIndex = props.treeIndex
  const treeItems = []
  const trees = props.trees

  const isRootBox = treeIndex === 0
  const isSearching = !!searchResult
  const treeInfo = trees[treeIndex]

  // hide the folder if it is not the top two folder
  const isHiddenFolderCover = isSearching || trees.length - treeIndex <= 2

  const folderCoverClickHandler = () => {
    globals.removeTreeInfoFromIndex(trees, treeIndex + 1)
  }

  const genBookmarkItem = (itemInfo) => {
    return (
      <BookmarkItem
        key={itemInfo.id}
        itemInfo={itemInfo}
        searchResult={searchResult}
        treeIndex={treeIndex}
        trees={trees} />
    )
  }

  const pushTreeItem = (childrenInfo) => {
    childrenInfo.forEach((itemInfo) => {
      treeItems.push(genBookmarkItem(itemInfo))
    })
  }

  let treeHead
  if (!isSearching && !isRootBox) {
    treeHead = (
      <TreeHead
        treeIndex={treeIndex}
        trees={trees} />
    )
  }

  if (searchResult) {
    if (searchResult.length) {
      pushTreeItem(searchResult)
    } else {
      treeItems.push(<NoResult key='no-result' />)
    }
  } else {
    if (isRootBox) {
      pushTreeItem(globals.rootTree.children)
    }

    if (treeInfo.children.length) {
      pushTreeItem(treeInfo.children)
    } else {
      const noBookmarkInfo = Immutable({
        id: `no-bookmark-${treeInfo.id}`,
        index: -1, // as it is not appeared in the childrenInfo
        parentId: treeInfo.id,
        title: chrome.i18n.getMessage('noBkmark')
      })

      treeItems.push(genBookmarkItem(noBookmarkInfo))
    }
  }

  return (
    <div class='bookmark-tree'>
      {treeHead}
      <div
        class='bookmark-list'
        onScroll={scrollHandler}
        onWheel={wheelHandler}>
        {treeItems}
      </div>
      <FolderCover
        isHidden={isHiddenFolderCover}
        clickHandler={folderCoverClickHandler} />
    </div>
  )
}

function scrollHandler(event, {props, state}) {
}

function setHeight(el) {
  const bookmarkList = el.getElementsByClassName('bookmark-list')[0]

  // search-box and tree-head-box height
  const bookmarkListOffsetTop = bookmarkList.getBoundingClientRect().top

  const maxListHeight = globals.maxHeight - bookmarkListOffsetTop

  const listHeight = Math.min(bookmarkList.scrollHeight, maxListHeight)

  bookmarkList.style.maxHeight = listHeight + 'px'
}

function wheelHandler(event, {props, state}) {
  event.preventDefault()

  const _this = event.delegateTarget

  // control scrolling speed
  _this.scrollTop -= globals.itemHeight * event.wheelDelta / 120 >> 0
}

export default {afterRender, render}
