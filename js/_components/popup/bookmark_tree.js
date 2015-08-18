import element from 'virtual-element'
import forEach from 'lodash.foreach'

import BookmarkItem from './bookmark_item'
import FolderCover from './folder_cover'
import NoResult from './no_result'
import TreeHead from './tree_head'

function afterRender(component, el) {
  setHeight(el)
}

function render({props}) {
  const searchResult = props.searchResult
  const treeIndex = props.treeIndex
  const treeItems = []
  const trees = props.trees

  const isRootBox = treeIndex === 0
  const isSearching = Boolean(searchResult)
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
    forEach(childrenInfo, (itemInfo) => {
      treeItems.push(genBookmarkItem(itemInfo))
    })
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
      <TreeHead
        isHidden={isSearching || isRootBox}
        treeIndex={treeIndex}
        trees={trees} />
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

function scrollHandler(event, {props}) {
}

function setHeight(el) {
  const bookmarkList = el.getElementsByClassName('bookmark-list')[0]

  // search-box and tree-head-box height
  const bookmarkListOffsetTop = bookmarkList.getBoundingClientRect().top

  const maxListHeight = globals.maxHeight - bookmarkListOffsetTop

  const listHeight = Math.min(bookmarkList.scrollHeight, maxListHeight)

  bookmarkList.style.maxHeight = listHeight + 'px'
}

function wheelHandler(event) {
  event.preventDefault()

  const _this = event.delegateTarget

  // control scrolling speed
  _this.scrollTop -= parseInt(globals.itemOffsetHeight * event.wheelDelta / 120, 10)
}

export default {afterRender, render}
