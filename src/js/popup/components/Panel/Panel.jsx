import {createElement, PropTypes} from 'react'

import BookmarkTree from '../BookmarkTree'
import Search from '../Search'

import '../../../../css/popup/panel.css'

const Panel = (props) => {
  const {trees} = props

  const panelItems = trees.map((treeInfo, treeIndex) => (
    <BookmarkTree
      key={treeInfo.id}
      treeIndex={treeIndex}
    />
  ))

  const mainPanelItems = panelItems.filter((x, treeIndex) => treeIndex % 2 === 0)
  const subPanelItems = panelItems.filter((x, treeIndex) => treeIndex % 2 === 1)

  return (
    <main styleName='main'>
      <section styleName='master'>
        <Search />
        {mainPanelItems}
      </section>
      <section styleName='slave' hidden={!subPanelItems.length}>
        {subPanelItems}
      </section>
    </main>
  )
}

Panel.propTypes = {
  trees: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Panel
