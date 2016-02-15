import {connect} from 'react-redux'
import {h} from 'preact'

import BookmarkTree from './BookmarkTree'
import Search from './Search'

const mapStateToProps = (state) => ({
  trees: state.trees
})

const Panel = (props) => {
  const {trees} = props

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
      <div id='main' className={panelClasses.join(' ')}>
        {mainPanelItems}
      </div>
      <div id='sub' className={subPanelClass.join(' ')}>
        {subPanelItems}
      </div>
    </main>
  )
}

export default connect(mapStateToProps)(Panel)
