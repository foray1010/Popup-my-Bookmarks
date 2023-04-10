import * as React from 'react'

import type { Options } from '../../../core/types/options.js'
import { OPTIONS } from '../../constants/index.js'
import BookmarkTree from '../BookmarkTree/index.js'
import classes from './bookmark-trees.module.css'

type Props = {
  readonly firstTreeHeader: React.ReactNode
  readonly options: Options
  readonly treeIds: ReadonlyArray<string>
}
export default function BookmarkTrees(props: Props) {
  const trees = props.treeIds.map((treeId) => (
    <BookmarkTree key={treeId} treeId={treeId} />
  ))

  const firstSectionItems = trees.filter((_, index) => index % 2 === 0)
  const secondSectionItems = trees.filter((_, index) => index % 2 !== 0)

  const widthStyle = React.useMemo(
    () => ({
      width: `${props.options[OPTIONS.SET_WIDTH]}px`,
    }),
    [props.options],
  )

  return (
    <main className={classes['main']}>
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
