import * as React from 'react'

import type { Options } from '../../../core/types/options'
import { OPTIONS } from '../../constants'
import BookmarkTree from '../BookmarkTree'
import classes from './bookmark-trees.css'
import useRememberLastPositions from './useRememberLastPositions'

interface Props {
  mainTreeHeader: React.ReactNode
  options: Partial<Options>
  treeIds: Array<string>
}
const BookmarkTrees = (props: Props) => {
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

  return (
    <main
      className={classes.main}
      style={React.useMemo(
        (): Record<string, string> => ({
          '--width': `${props.options[OPTIONS.SET_WIDTH] ?? 0}px`,
        }),
        [props.options],
      )}
    >
      <section className={classes.master}>
        {props.mainTreeHeader}
        {mainTree}
      </section>
      {subTree.length > 0 && (
        <section className={classes.slave}>{subTree}</section>
      )}
    </main>
  )
}

export default BookmarkTrees
