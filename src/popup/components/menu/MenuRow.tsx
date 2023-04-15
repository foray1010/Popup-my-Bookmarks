import classNames from 'classix'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import type { MenuItem } from './constants.js'
import classes from './menu-row.module.css'

type Props = Readonly<{
  isFocused: boolean
  isUnclickable: boolean
  onClick: React.MouseEventHandler
  onMouseEnter: (index: number) => React.MouseEventHandler
  onMouseLeave: (index: number) => React.MouseEventHandler
  rowIndex: number
  rowName: MenuItem
}>
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
      className={classNames(
        classes['main'],
        isFocused && classes['focused'],
        isUnclickable && classes['unclickable'],
      )}
      role='menuitem'
      onClick={isUnclickable ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {webExtension.i18n.getMessage(rowName)}
    </li>
  )
}
