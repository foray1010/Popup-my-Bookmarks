import {element} from 'deku'
import Immutable from 'seamless-immutable'

import {
  MAX_HEIGHT
} from '../constants'
import BookmarkItem from './BookmarkItem'
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

    const {rootTree, searchKeyword, trees} = context
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

    const pushTreeItems = (thisTreeInfo) => {
      for (const itemInfo of thisTreeInfo.children) {
        treeItems.push(genBookmarkItem(itemInfo))
      }
    }

    if (isRootBox && !searchKeyword) {
      pushTreeItems(rootTree)
    }

    if (treeInfo.children.length) {
      pushTreeItems(treeInfo)
    } else {
      if (searchKeyword) {
        treeItems.push(<NoResult key='no-result' />)
      } else {
        const noBookmarkInfo = Immutable({
          id: `no-bookmark-${treeInfo.id}`,
          index: -1, // as it is not appeared in the childrenInfo
          parentId: treeInfo.id,
          title: msgNoBookmark
        })

        treeItems.push(genBookmarkItem(noBookmarkInfo))
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
