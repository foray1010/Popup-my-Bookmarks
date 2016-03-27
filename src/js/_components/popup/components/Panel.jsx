import {connect} from 'react-redux'
import {createElement, PropTypes} from 'react'
import classNames from 'classnames'

import BookmarkTree from './BookmarkTree'
import Search from './Search'

const Panel = (props) => {
  const {trees} = props

  const mainPanelItems = [
    <Search key='search-box' />
  ]
  const panelClassName = classNames('panel', 'panel-width')
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

  return (
    <main id='panel-box'>
      <div id='main' className={panelClassName}>
        {mainPanelItems}
      </div>
      <div id='sub' className={panelClassName} hidden={!subPanelItems.length}>
        {subPanelItems}
      </div>
    </main>
  )
}

if (process.env.NODE_ENV !== 'production') {
  Panel.propTypes = {
    trees: PropTypes.arrayOf(PropTypes.object).isRequired
  }
}

const mapStateToProps = (state) => ({
  trees: state.trees
})

export default connect(mapStateToProps)(Panel)
