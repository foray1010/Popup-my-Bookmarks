import classNames from 'clsx'
import * as React from 'react'

import LazyImage from '../../../../core/components/baseItems/LazyImage.js'
import classes from './bookmark-row.module.css'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  readonly iconUrl?: string | undefined
  readonly isHighlighted: boolean
  readonly isUnclickable: boolean
  readonly title: string
  readonly tooltip?: string | undefined
}
const BookmarkRow = React.forwardRef(function InnerBookmarkRow(
  { iconUrl, isHighlighted, isUnclickable, title, tooltip, ...divProps }: Props,
  setRef: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={setRef}
      {...divProps}
      className={classNames(
        classes['main'],
        {
          [classes['highlighted'] as string]: isHighlighted,
          [classes['unclickable'] as string]: isUnclickable,
        },
        divProps.className,
      )}
      title={tooltip}
      onAuxClick={isUnclickable ? undefined : divProps.onAuxClick}
      onClick={isUnclickable ? undefined : divProps.onClick}
      onContextMenu={isUnclickable ? undefined : divProps.onContextMenu}
    >
      {iconUrl && <LazyImage className={classes['icon']} src={iconUrl} />}
      <div className={classes['title']}>{title}</div>
    </div>
  )
})

export default BookmarkRow
