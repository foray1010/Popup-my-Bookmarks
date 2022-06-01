import classNames from 'clsx'
import * as React from 'react'

import LazyImage from '../../../../core/components/baseItems/LazyImage'
import classes from './bookmark-row.module.css'

interface Props {
  className?: string
  iconSize: number
  iconUrl?: string
  isHighlighted: boolean
  isUnclickable: boolean
  onAuxClick?: React.MouseEventHandler
  onClick?: React.MouseEventHandler
  onMouseEnter?: React.MouseEventHandler
  onMouseLeave?: React.MouseEventHandler
  title: string
  tooltip?: string
}
const BookmarkRow = React.forwardRef(function InnerBookmarkRow(
  props: Props,
  setRef: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={setRef}
      className={classNames(
        classes.main,
        {
          [classes.highlighted]: props.isHighlighted,
          [classes.unclickable]: props.isUnclickable,
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
          className={classes.icon}
          height={props.iconSize}
          src={props.iconUrl}
          width={props.iconSize}
        />
      )}
      <div className={classes.title}>{props.title}</div>
    </div>
  )
})

export default BookmarkRow
