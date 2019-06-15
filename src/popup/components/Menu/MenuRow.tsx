import classNames from 'classnames'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import classes from './menu-item.css'

interface Props {
  isFocused: boolean
  isUnclickable: boolean
  onClick: React.MouseEventHandler
  onMouseEnter: (index: number) => React.MouseEventHandler
  onMouseLeave: (index: number) => React.MouseEventHandler
  rowIndex: number
  rowName: string
}
const MenuRow = ({onMouseEnter, onMouseLeave, rowIndex, rowName, ...restProps}: Props) => {
  const handleMouseEnter = React.useMemo(() => onMouseEnter(rowIndex), [onMouseEnter, rowIndex])
  const handleMouseLeave = React.useMemo(() => onMouseLeave(rowIndex), [onMouseLeave, rowIndex])

  return (
    <div
      className={classNames(classes.main, {
        [classes.focused]: restProps.isFocused,
        [classes.unclickable]: restProps.isUnclickable
      })}
      onClick={restProps.isUnclickable ? undefined : restProps.onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {webExtension.i18n.getMessage(rowName)}
    </div>
  )
}

export default MenuRow
