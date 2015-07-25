import {element} from 'deku'
import forEach from 'lodash.foreach'

import BookmarkTree from './bookmark_tree'
import Search from './search'

function render({props}) {
  const mainPanelItems = [
    <Search key='search' />
  ]
  const panelClasses = ['panel', 'panel-width']
  const searchResult = props.searchResult
  const subPanelItems = []
  const trees = props.trees

  const genBookmarkTree = (id, thisTreeIndex) => {
    return (
      <BookmarkTree
        key={id}
        searchResult={searchResult}
        treeIndex={thisTreeIndex}
        trees={trees} />
    )
  }

  if (searchResult) {
    mainPanelItems.push(genBookmarkTree('search-result', null))
  } else {
    forEach(trees, (treeInfo, treeIndex) => {
      const targetPanelItems = treeIndex % 2 === 0 ?
        mainPanelItems : subPanelItems

      targetPanelItems.push(genBookmarkTree(treeInfo.id, treeIndex))
    })
  }

  const subPanelClass = panelClasses.slice()
  if (!subPanelItems.length) {
    subPanelClass.push('display-none')
  }

  return (
    <div id='panel-box'>
      <div class='panel-row'>
        <div id='sub' class={subPanelClass}>
          {subPanelItems}
        </div>
        <div id='main' class={panelClasses}>
          {mainPanelItems}
        </div>
      </div>
    </div>
  )
}

export default {render}
