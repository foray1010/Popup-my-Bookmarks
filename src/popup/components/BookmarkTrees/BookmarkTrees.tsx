import * as React from 'react'

import BookmarkTree from '../BookmarkTree/index.js'
import classes from './bookmark-trees.module.css'

type Props = Readonly<{
  firstTreeHeader: React.ReactNode
  treeIds: ReadonlyArray<string>
  width: number
}>
export default function BookmarkTrees(props: Props) {
  const trees = props.treeIds.map((treeId) => (
    <BookmarkTree key={treeId} treeId={treeId} />
  ))

  const firstSectionItems = trees.filter((_, index) => index % 2 === 0)
  const secondSectionItems = trees.filter((_, index) => index % 2 !== 0)

  const widthStyle = React.useMemo(
    () => ({
      width: `${props.width}px`,
    }),
    [props.width],
  )

  return (
    <main className={classes.main}>
      <section className={classes['first-section']} style={widthStyle}>
        {props.firstTreeHeader}
        {firstSectionItems}
      </section>
      {secondSectionItems.length > 0 && (
        <section className={classes['second-section']} style={widthStyle}>
          {secondSectionItems}
        </section>
      )}
    </main>
  )
}
