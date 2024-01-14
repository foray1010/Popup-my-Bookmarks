import classNames from 'classix'
import type { JSX } from 'react'

import * as classes from './bookmark-row.module.css'

type Props = Readonly<
  JSX.IntrinsicElements['div'] & {
    iconUrl?: string | undefined
    isHighlighted: boolean
    isUnclickable: boolean
    title: string
    tooltip?: string | undefined
  }
>
function BookmarkRow({
  iconUrl,
  isHighlighted,
  isUnclickable,
  title,
  tooltip,
  ...divProps
}: Props) {
  return (
    <div
      {...divProps}
      className={classNames(
        classes.main,
        isHighlighted && classes.highlighted,
        isUnclickable && classes.unclickable,
        divProps.className,
      )}
      tabIndex={0}
      title={tooltip}
      onAuxClick={isUnclickable ? undefined : divProps.onAuxClick}
      onClick={isUnclickable ? undefined : divProps.onClick}
      onContextMenu={isUnclickable ? undefined : divProps.onContextMenu}
    >
      {iconUrl && <img className={classes.icon} src={iconUrl} />}
      <div className={classes.title}>{title}</div>
    </div>
  )
}

export default BookmarkRow
