import classNames from 'clsx'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import type { MenuItem } from './constants.js'
import classes from './menu-row.module.css'

interface Props {
  readonly isFocused: boolean
  readonly isUnclickable: boolean
  readonly onClick: React.MouseEventHandler
  readonly onMouseEnter: (index: number) => React.MouseEventHandler
  readonly onMouseLeave: (index: number) => React.MouseEventHandler
  readonly rowIndex: number
  readonly rowName: MenuItem
}
export default function MenuRow({
  isFocused,
  isUnclickable,
  onClick,
  onMouseEnter,
  onMouseLeave,
  rowIndex,
  rowName,
}: Props) {
  const handleMouseEnter = React.useMemo(
    () => onMouseEnter(rowIndex),
    [onMouseEnter, rowIndex],
  )
  const handleMouseLeave = React.useMemo(
    () => onMouseLeave(rowIndex),
    [onMouseLeave, rowIndex],
  )

  return (
    <li
      aria-disabled={isUnclickable}
      className={classNames(classes['main'], {
        [classes['focused'] as string]: isFocused,
        [classes['unclickable'] as string]: isUnclickable,
      })}
      role='menuitem'
      onClick={isUnclickable ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {webExtension.i18n.getMessage(rowName)}
    </li>
  )
}
