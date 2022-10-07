import * as React from 'react'

import type { Options } from '../../../core/types/options'
import { OPTIONS } from '../../constants'
import BookmarkTree from '../BookmarkTree'
import classes from './bookmark-trees.module.css'
import useRememberLastPositions from './useRememberLastPositions'

interface Props {
  readonly mainTreeHeader: React.ReactNode
  readonly options: Partial<Options>
  readonly treeIds: ReadonlyArray<string>
}
export default function BookmarkTrees(props: Props) {
  const {
    lastPositions,
    registerLastPosition,
    unregisterLastPosition,
    updateLastPosition,
  } = useRememberLastPositions({
    isEnabled: props.options.rememberPos ?? false,
  })

  const trees = props.treeIds.map((treeId) => (
    <BookmarkTree
      key={treeId}
      registerLastPosition={registerLastPosition}
      scrollTop={lastPositions?.find((x) => x.id === treeId)?.scrollTop}
      treeId={treeId}
      unregisterLastPosition={unregisterLastPosition}
      updateLastPosition={updateLastPosition}
    />
  ))

  const mainTree = trees.filter((_, index) => index % 2 === 0)
  const subTree = trees.filter((_, index) => index % 2 !== 0)

  const widthStyle = React.useMemo(
    () => ({
      width: `${props.options[OPTIONS.SET_WIDTH] ?? 0}px`,
    }),
    [props.options],
  )

  return (
    <main className={classes['main']}>
      <section className={classes['master']} style={widthStyle}>
        {props.mainTreeHeader}
        {mainTree}
      </section>
      {subTree.length > 0 && (
        <section className={classes['slave']} style={widthStyle}>
          {subTree}
        </section>
      )}
    </main>
  )
}
