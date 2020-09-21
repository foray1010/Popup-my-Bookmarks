import classNames from 'classnames'
import * as React from 'react'

import LazyImage from '../../../../core/components/baseItems/LazyImage'
import classes from './bookmark-row.css'

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
const BookmarkRowWithRef = React.forwardRef(function BookmarkRow(
  props: Props,
  setRef: React.Ref<HTMLDivElement>,
) {
  const iconStyles: Record<string, string> = React.useMemo(
    () => ({
      '--iconSize': `${props.iconSize}px`,
    }),
    [props.iconSize],
  )

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
          src={props.iconUrl}
          style={iconStyles}
        />
      )}
      <div className={classes.title}>{props.title}</div>
    </div>
  )
})

export default BookmarkRowWithRef
