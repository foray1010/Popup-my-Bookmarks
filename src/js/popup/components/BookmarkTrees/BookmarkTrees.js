// @flow strict
// @jsx createElement

import '../../../../css/popup/bookmark-trees.css'

import * as R from 'ramda'
import {createElement} from 'react'
import type {Node} from 'react'
import styled from 'styled-components'

import BookmarkTree from '../BookmarkTree'

type Props = {|
  className: string,
  mainTreeHeader: Node,
  treeIds: Array<string>
|}
const BookmarkTrees = (props: Props) => {
  const trees = props.treeIds.map((treeId) => <BookmarkTree key={treeId} treeId={treeId} />)

  const mainTree = trees.filter((x, index) => index % 2 === 0)
  const subTree = trees.filter((x, index) => index % 2 !== 0)

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
    width: ${R.path(['options', 'setWidth'])}px;
  }
`
