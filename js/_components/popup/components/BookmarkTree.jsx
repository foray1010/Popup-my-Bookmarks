import {element} from 'deku'

import {
  MAX_HEIGHT
} from '../constants'
import {
  genBookmarkList
} from '../functions'
import BookmarkItem from './BookmarkItem'
import DragIndicator from './DragIndicator'
import FolderCover from './FolderCover'
import NoResult from './NoResult'
import TreeHeader from './TreeHeader'

const afterRender = (model) => window.requestAnimationFrame(() => {
  const {path} = model

  const el = document.getElementById(path)

  if (el) {
    setHeight(el)
  }
})

const scrollHandler = (model) => (evt) => {
}

const wheelHandler = (model) => function (evt) {
  evt.preventDefault()

  const {context} = model

  const {itemOffsetHeight} = context

  // control scrolling speed
  this.scrollTop -= Math.floor(itemOffsetHeight * evt.wheelDelta / 120)
}

function setHeight(el) {
  const bookmarkListEl = el.getElementsByClassName('bookmark-list')[0]

  // search-box and tree-header-box height
  const bookmarkListElOffsetTop = bookmarkListEl.getBoundingClientRect().top

  const maxListHeight = MAX_HEIGHT - bookmarkListElOffsetTop

  const listHeight = Math.min(bookmarkListEl.scrollHeight, maxListHeight)

  bookmarkListEl.style.maxHeight = listHeight + 'px'
}

const BookmarkTree = {
  onCreate(model) {
    afterRender(model)
  },

  onUpdate(model) {
    afterRender(model)
  },

  render(model) {
    const {context, path, props} = model

    const {dragIndicator, rootTree, searchKeyword, trees} = context
    const {treeIndex} = props

    const isFirstTree = treeIndex === 0
    const treeInfo = trees[treeIndex]
    const treeItems = []

    const bookmarkList = genBookmarkList(context, treeInfo, treeIndex)

    for (const itemInfo of bookmarkList) {
      treeItems.push(
        <BookmarkItem
          key={itemInfo.id}
          itemInfo={itemInfo}
          treeIndex={treeIndex}
        />
      )
    }

    if (dragIndicator && dragIndicator.parentId === treeInfo.id) {
      let dragIndicatorIndex = dragIndicator.index

      if (isFirstTree && !searchKeyword) {
        dragIndicatorIndex += rootTree.children.length
      }

      treeItems.splice(dragIndicator.index, 0, <DragIndicator />)
    }

    if (searchKeyword && bookmarkList.length === 0) {
      treeItems.push(
        <NoResult key='no-result' />
      )
    }

    return (
      <div id={path} class='bookmark-tree'>
        <TreeHeader
          isHidden={Boolean(isFirstTree || searchKeyword)}
          treeIndex={treeIndex}
        />
        <ul
          class='bookmark-list'
          onScroll={scrollHandler(model)}
          onWheel={wheelHandler(model)}
        >
          {treeItems}
        </ul>
        <FolderCover treeIndex={treeIndex} />
      </div>
    )
  }
}

export default BookmarkTree
