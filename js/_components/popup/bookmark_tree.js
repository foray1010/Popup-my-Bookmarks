import element from 'virtual-element'
import forEach from 'lodash.foreach'

import BookmarkItem from './bookmark_item'
import FolderCover from './folder_cover'
import NoResult from './no_result'
import TreeHeader from './tree_header'

function afterRender(component, el) {
  setHeight(el)
}

function render({props}) {
  const isSearching = props.isSearching
  const treeIndex = props.treeIndex
  const treeItems = []
  const trees = props.trees

  const isRootBox = treeIndex === 0
  const treeInfo = trees[treeIndex]

  const genBookmarkItem = (itemInfo) => {
    return (
      <BookmarkItem
        key={itemInfo.id}
        isSearching={isSearching}
        itemInfo={itemInfo}
        treeIndex={treeIndex}
        trees={trees} />
    )
  }

  const pushTreeItem = (childrenInfo) => {
    forEach(childrenInfo, (itemInfo) => {
      treeItems.push(genBookmarkItem(itemInfo))
    })
  }

  if (isRootBox && !isSearching) {
    pushTreeItem(globals.rootTree.children)
  }

  if (treeInfo.children.length) {
    pushTreeItem(treeInfo.children)
  } else {
    if (isSearching) {
      treeItems.push(<NoResult key='no-result' />)
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
      <TreeHeader
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
        treeIndex={treeIndex}
        trees={trees} />
    </div>
  )
}

function scrollHandler(event, {props}) {
}

function setHeight(el) {
  const bookmarkList = el.getElementsByClassName('bookmark-list')[0]

  // search-box and tree-header-box height
  const bookmarkListOffsetTop = bookmarkList.getBoundingClientRect().top

  const maxListHeight = globals.maxHeight - bookmarkListOffsetTop

  const listHeight = Math.min(bookmarkList.scrollHeight, maxListHeight)

  bookmarkList.style.maxHeight = listHeight + 'px'
}

function wheelHandler(event) {
  event.preventDefault()

  const el = event.delegateTarget

  // control scrolling speed
  el.scrollTop -= parseInt(globals.itemOffsetHeight * event.wheelDelta / 120, 10)
}

export default {afterRender, render}
