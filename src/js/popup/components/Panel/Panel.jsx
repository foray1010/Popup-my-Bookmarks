import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import BookmarkTree from '../BookmarkTree'
import Search from '../Search'

import styles from '../../../../css/popup/panel.css'

const Panel = (props) => {
  const {trees} = props

  const panelItems = trees.reduce((accumulator, treeInfo, treeIndex) => {
    return accumulator.concat(
      <BookmarkTree
        key={treeInfo.id}
        treeIndex={treeIndex}
      />
    )
  }, [])

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

export default CSSModules(Panel, styles)
