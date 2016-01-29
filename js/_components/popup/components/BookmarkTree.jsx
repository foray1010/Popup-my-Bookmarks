import {element} from 'deku'
import Immutable from 'seamless-immutable'

import {
  DRAG_INDICATOR,
  MAX_HEIGHT
} from '../constants'
import {
  genDummyItemInfo
} from '../functions'
import BookmarkItem from './BookmarkItem'
import DragIndicator from './DragIndicator'
import FolderCover from './FolderCover'
import NoResult from './NoResult'
import TreeHeader from './TreeHeader'

const msgNoBookmark = chrome.i18n.getMessage('noBkmark')

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
  const bookmarkList = el.getElementsByClassName('bookmark-list')[0]

  // search-box and tree-header-box height
  const bookmarkListOffsetTop = bookmarkList.getBoundingClientRect().top

  const maxListHeight = MAX_HEIGHT - bookmarkListOffsetTop

  const listHeight = Math.min(bookmarkList.scrollHeight, maxListHeight)

  bookmarkList.style.maxHeight = listHeight + 'px'
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

    const treeItems = []

    const isRootBox = treeIndex === 0
    const treeInfo = trees[treeIndex]

    const genBookmarkItem = (itemInfo) => {
      return (
        <BookmarkItem
          key={itemInfo.id}
          itemInfo={itemInfo}
          treeIndex={treeIndex}
        />
      )
    }

    if (treeInfo.children.length) {
      for (const itemInfo of treeInfo.children) {
        treeItems.push(genBookmarkItem(itemInfo))
      }
    } else {
      if (searchKeyword) {
        treeItems.push(<NoResult key='no-result' />)
      } else {
        const noBookmarkInfo = Immutable({
          ...genDummyItemInfo(),
          id: `no-bookmark-${treeInfo.id}`,
          index: -1, // as it is not appeared in the childrenInfo
          parentId: treeInfo.id,
          title: msgNoBookmark
        })

        treeItems.push(genBookmarkItem(noBookmarkInfo))
      }
    }

    if (dragIndicator && dragIndicator.parentId === treeInfo.id) {
      treeItems.splice(dragIndicator.index, 0, <DragIndicator />)
    }

    if (isRootBox && !searchKeyword) {
      for (const itemInfo of rootTree.children) {
        treeItems.unshift(genBookmarkItem(itemInfo))
      }
    }

    return (
      <div id={path} class='bookmark-tree'>
        <TreeHeader
          isHidden={Boolean(searchKeyword || isRootBox)}
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
