import classNames from 'clsx'
import * as React from 'react'

import LazyImage from '../../../../core/components/baseItems/LazyImage.js'
import classes from './bookmark-row.module.css'

interface Props {
  readonly className?: string | undefined
  readonly iconUrl?: string
  readonly isHighlighted: boolean
  readonly isUnclickable: boolean
  readonly onAuxClick?: React.MouseEventHandler
  readonly onClick?: React.MouseEventHandler
  readonly onMouseEnter?: React.MouseEventHandler
  readonly onMouseLeave?: React.MouseEventHandler
  readonly title: string
  readonly tooltip?: string | undefined
}
const BookmarkRow = React.forwardRef(function InnerBookmarkRow(
  props: Props,
  setRef: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={setRef}
      className={classNames(
        classes['main'],
        {
          [classes['highlighted'] as string]: props.isHighlighted,
          [classes['unclickable'] as string]: props.isUnclickable,
        },
        props.className,
      )}
      title={props.tooltip}
      onAuxClick={props.isUnclickable ? undefined : props.onAuxClick}
      onClick={props.isUnclickable ? undefined : props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {props.iconUrl && (
        <LazyImage
          alt={props.title}
          className={classes['icon']}
          src={props.iconUrl}
        />
      )}
      <div className={classes['title']}>{props.title}</div>
    </div>
  )
})

export default BookmarkRow
