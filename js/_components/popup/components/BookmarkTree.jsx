import {element} from 'deku'
import Immutable from 'seamless-immutable'

import BookmarkItem from './BookmarkItem'
import FolderCover from './FolderCover'
import NoResult from './NoResult'
import TreeHeader from './TreeHeader'

const msgNoBookmark = chrome.i18n.getMessage('noBkmark')

const scrollHandler = (model) => (evt) => {
}

const wheelHandler = () => (evt) => {
  evt.preventDefault()

  // control scrolling speed
  evt.target.scrollTop -= Math.floor(globals.itemOffsetHeight * evt.wheelDelta / 120)
}

function setHeight(el) {
  const bookmarkList = el.getElementsByClassName('bookmark-list')[0]

  // search-box and tree-header-box height
  const bookmarkListOffsetTop = bookmarkList.getBoundingClientRect().top

  const maxListHeight = globals.maxHeight - bookmarkListOffsetTop

  const listHeight = Math.min(bookmarkList.scrollHeight, maxListHeight)

  bookmarkList.style.maxHeight = listHeight + 'px'
}

const BookmarkTree = {
  // afterRender(model) {
  //   setHeight(el)
  // },

  render(model) {
    const {context, props} = model

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
      <div class='bookmark-tree'>
        <TreeHeader
          isHidden={searchKeyword || isRootBox}
          treeIndex={treeIndex}
        />
        <ul
          class='bookmark-list'
          onScroll={scrollHandler(model)}
          onWheel={wheelHandler()}
        >
          {treeItems}
        </ul>
        <FolderCover treeIndex={treeIndex} />
      </div>
    )
  }
}

export default BookmarkTree
