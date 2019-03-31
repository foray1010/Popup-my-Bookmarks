import * as R from 'ramda'
import * as React from 'react'
import styled from 'styled-components'

import classes from '../../../../css/popup/bookmark-trees.css'
import {Options} from '../../../common/types/options'
import {OPTIONS} from '../../constants'
import BookmarkTree from '../BookmarkTree'

interface MainProps {
  options: Partial<Options>
}
const Main = styled('main')<MainProps>`
  & > section {
    width: ${R.pathOr(0, ['options', OPTIONS.SET_WIDTH])}px;
  }
`

type Props = MainProps & {
  mainTreeHeader: React.ReactNode
  treeIds: Array<string>
}
const BookmarkTrees = (props: Props) => {
  const trees = props.treeIds.map((treeId) => <BookmarkTree key={treeId} treeId={treeId} />)

  const mainTree = trees.filter((x, index) => index % 2 === 0)
  const subTree = trees.filter((x, index) => index % 2 !== 0)

  return (
    <Main className={classes.main} options={props.options}>
      <section className={classes.master}>
        {props.mainTreeHeader}
        {mainTree}
      </section>
      {Boolean(subTree.length) && <section className={classes.slave}>{subTree}</section>}
    </Main>
  )
}

export default BookmarkTrees
