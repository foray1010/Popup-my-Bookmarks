import classNames from 'clsx'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import classes from './menu-row.module.css'

interface Props {
  readonly isFocused: boolean
  readonly isUnclickable: boolean
  readonly onClick: React.MouseEventHandler
  readonly onMouseEnter: (index: number) => React.MouseEventHandler
  readonly onMouseLeave: (index: number) => React.MouseEventHandler
  readonly rowIndex: number
  readonly rowName: string
}
export default function MenuRow({
  onMouseEnter,
  onMouseLeave,
  rowIndex,
  rowName,
  ...restProps
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
      className={classNames(classes['main'], {
        [classes['focused'] as string]: restProps.isFocused,
        [classes['unclickable'] as string]: restProps.isUnclickable,
      })}
      onClick={restProps.isUnclickable ? undefined : restProps.onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {webExtension.i18n.getMessage(rowName)}
    </li>
  )
}
