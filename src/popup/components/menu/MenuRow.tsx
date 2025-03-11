import classNames from 'classix'
import type { MouseEventHandler } from 'react'
import type { ValueOf } from 'type-fest'
import webExtension from 'webextension-polyfill'

import type { MenuItem } from './constants.js'
import * as classes from './menu-row.module.css'

type Props = Readonly<{
  isFocused: boolean
  isUnclickable: boolean
  onClick: MouseEventHandler
  onMouseEnter: MouseEventHandler
  onMouseLeave: MouseEventHandler
  rowName: ValueOf<typeof MenuItem>
}>
export default function MenuRow({
  isFocused,
  isUnclickable,
  onClick,
  onMouseEnter,
  onMouseLeave,
  rowName,
}: Props) {
  return (
    <li
      aria-disabled={isUnclickable}
      className={classNames(
        classes.main,
        isFocused && classes.focused,
        isUnclickable && classes.unclickable,
      )}
      role='menuitem'
      tabIndex={0}
      onClick={isUnclickable ? undefined : onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {webExtension.i18n.getMessage(rowName)}
    </li>
  )
}
