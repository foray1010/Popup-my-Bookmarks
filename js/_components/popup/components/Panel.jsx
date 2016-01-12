import {element} from 'deku'

import BookmarkTree from './BookmarkTree'
import Search from './Search'

const Panel = {
  render(model) {
    const {context} = model

    const {trees} = context

    const mainPanelItems = [
      <Search key='search-box' />
    ]
    const panelClasses = ['panel', 'panel-width']
    const subPanelItems = []

    trees.forEach((treeInfo, treeIndex) => {
      const targetPanelItems = treeIndex % 2 === 0 ? mainPanelItems : subPanelItems

      targetPanelItems.push(
        <BookmarkTree
          key={treeInfo.id}
          treeIndex={treeIndex}
        />
      )
    })

    const subPanelClass = panelClasses.slice()
    if (!subPanelItems.length) {
      subPanelClass.push('display-none')
    }

    return (
      <main id='panel-box'>
        <div id='main' class={panelClasses.join(' ')}>
          {mainPanelItems}
        </div>
        <div id='sub' class={subPanelClass.join(' ')}>
          {subPanelItems}
        </div>
      </main>
    )
  }
}

export default Panel
