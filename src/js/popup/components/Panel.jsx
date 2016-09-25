import {connect} from 'react-redux'
import {createElement, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import BookmarkTree from './BookmarkTree'
import Search from './Search'

import styles from '../../../css/popup/panel.css'

const Panel = (props) => {
  const {trees} = props

  const mainPanelItems = []
  const subPanelItems = []

  for (const [treeIndex] of trees.entries()) {
    const targetPanelItems = treeIndex % 2 === 0 ? mainPanelItems : subPanelItems

    targetPanelItems.push(
      <BookmarkTree
        key={String(treeIndex)}
        treeIndex={treeIndex}
      />
    )
  }

  mainPanelItems.unshift(
    <Search key='search' />
  )

  return (
    <main styleName='main'>
      <section styleName='master' className='panel-width'>
        {mainPanelItems}
      </section>
      <section styleName='slave' className='panel-width' hidden={!subPanelItems.length}>
        {subPanelItems}
      </section>
    </main>
  )
}

Panel.propTypes = {
  trees: PropTypes.arrayOf(PropTypes.object).isRequired
}

const mapStateToProps = (state) => ({
  trees: state.trees
})

export default connect(mapStateToProps)(
  CSSModules(Panel, styles)
)
