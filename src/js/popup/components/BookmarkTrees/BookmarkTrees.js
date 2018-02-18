// @flow
// @jsx createElement

import '../../../../css/popup/bookmark-trees.css'

import {createElement} from 'react'
import type {Element} from 'react'
import styled from 'react-emotion'

import BookmarkTree from '../BookmarkTree'

type Props = {
  className: string,
  mainTreeHeader: Element<*>,
  treeIds: string[]
};
const BookmarkTrees = (props: Props) => {
  const trees = props.treeIds.map((treeId) => <BookmarkTree key={treeId} treeId={treeId} />)

  const mainTree = trees.filter((x, index) => index % 2 === 0)
  const subTree = trees.filter((x, index) => index % 2 === 1)

  return (
    <main className={props.className} styleName='main'>
      <section styleName='master'>
        {props.mainTreeHeader}
        {mainTree}
      </section>
      {Boolean(subTree.length) && <section styleName='slave'>{subTree}</section>}
    </main>
  )
}

export default styled(BookmarkTrees)`
  & > section {
    width: ${(props) => props.options.setWidth}px;
  }
`
