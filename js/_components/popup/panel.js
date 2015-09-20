import element from 'virtual-element'

import BookmarkTree from './bookmark_tree'
import Search from './search'

function render({props}) {
  const isSearching = props.isSearching
  const mainPanelItems = [
    <Search key='search-box' />
  ]
  const panelClasses = ['panel', 'panel-width']
  const subPanelItems = []
  const trees = props.trees

  trees.forEach((treeInfo, treeIndex) => {
    const targetPanelItems = treeIndex % 2 === 0 ? mainPanelItems : subPanelItems

    targetPanelItems.push(
      <BookmarkTree
        key={treeInfo.id}
        isSearching={isSearching}
        treeIndex={treeIndex}
        trees={trees} />
    )
  })

  const subPanelClass = panelClasses.slice()
  if (!subPanelItems.length) {
    subPanelClass.push('display-none')
  }

  return (
    <div id='panel-box'>
      <div id='main' class={panelClasses.join(' ')}>
        {mainPanelItems}
      </div>
      <div id='sub' class={subPanelClass.join(' ')}>
        {subPanelItems}
      </div>
    </div>
  )
}

export default {render}
