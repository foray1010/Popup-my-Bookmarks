import classNames from 'classnames'
import * as React from 'react'

import classes from '../../../../../css/popup/bookmark-row.css'

interface Props {
  className?: string
  iconSize: number
  iconUrl?: string
  isHighlighted: boolean
  isUnclickable: boolean
  onAuxClick?: React.MouseEventHandler<HTMLElement>
  onClick?: React.MouseEventHandler<HTMLElement>
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
  title: string
  tooltip?: string
}
const BookmarkRow = React.forwardRef((props: Props, setRef: React.Ref<HTMLDivElement>) => {
  const iconStyles = React.useMemo(
    (): object => ({
      '--iconSize': `${props.iconSize}px`
    }),
    [props.iconSize]
  )

  return (
    <div
      ref={setRef}
      className={classNames(
        classes.main,
        {
          [classes.highlighted]: props.isHighlighted,
          [classes.unclickable]: props.isUnclickable
        },
        props.className
      )}
      onAuxClick={props.isUnclickable ? undefined : props.onAuxClick}
      onClick={props.isUnclickable ? undefined : props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      title={props.tooltip}
    >
      {props.iconUrl && (
        <img className={classes.icon} src={props.iconUrl} style={iconStyles} alt='' />
      )}
      <div className={classes.title}>{props.title}</div>
    </div>
  )
})

export default BookmarkRow
