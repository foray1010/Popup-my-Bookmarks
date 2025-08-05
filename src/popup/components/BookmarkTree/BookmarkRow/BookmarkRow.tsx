import classNames from 'classix'
import type { JSX } from 'react'

import StylelessButton from '@/core/components/baseItems/StylelessButton/index.js'

import * as classes from './bookmark-row.module.css'

type Props = Readonly<
  JSX.IntrinsicElements['button'] & {
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
  ...buttonProps
}: Props) {
  return (
    <StylelessButton
      {...buttonProps}
      className={classNames(
        classes.main,
        isHighlighted && classes.highlighted,
        isUnclickable && classes.unclickable,
        buttonProps.className,
      )}
      title={tooltip}
      onAuxClick={isUnclickable ? undefined : buttonProps.onAuxClick}
      onContextMenu={isUnclickable ? undefined : buttonProps.onContextMenu}
    >
      {iconUrl && <img alt='' className={classes.icon} src={iconUrl} />}
      <span className={classes.title}>{title}</span>
    </StylelessButton>
  )
}

export default BookmarkRow
