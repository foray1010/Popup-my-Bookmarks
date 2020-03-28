import * as React from 'react'

import { Options } from '../../../core/types/options'
import { OPTIONS } from '../../constants'
import BookmarkTree from '../BookmarkTree'
import classes from './bookmark-trees.css'

interface Props {
  mainTreeHeader: React.ReactNode
  options: Partial<Options>
  treeIds: Array<string>
}
const BookmarkTrees = (props: Props) => {
  const trees = props.treeIds.map((treeId) => (
    <BookmarkTree key={treeId} treeId={treeId} />
  ))

  const mainTree = trees.filter((_, index) => index % 2 === 0)
  const subTree = trees.filter((_, index) => index % 2 !== 0)

  const sectionWidth = props.options[OPTIONS.SET_WIDTH] ?? 0
  const styles: object = React.useMemo(
    () => ({
      '--width': `${sectionWidth}px`,
    }),
    [sectionWidth],
  )

  return (
    <main className={classes.main}>
      <section className={classes.master} style={styles}>
        {props.mainTreeHeader}
        {mainTree}
      </section>
      {Boolean(subTree.length) && (
        <section className={classes.slave} style={styles}>
          {subTree}
        </section>
      )}
    </main>
  )
}

export default BookmarkTrees
