import classNames from 'classnames'
import * as React from 'react'
import webExtension from 'webextension-polyfill'

import classes from '../../../../css/popup/menu-item.css'

interface Props {
  isFocused: boolean
  isUnclickable: boolean
  onClick: (rowName: string) => () => void
  onMouseEnter: (rowName: string) => () => void
  onMouseLeave: () => void
  rowName: string
}
const MenuRow = ({onClick, onMouseEnter, rowName, ...restProps}: Props) => {
  const handleClick = React.useMemo(() => onClick(rowName), [onClick, rowName])
  const handleMouseEnter = React.useMemo(() => onMouseEnter(rowName), [onMouseEnter, rowName])

  return (
    <div
      className={classNames(classes.main, {
        [classes.focused]: restProps.isFocused,
        [classes.unclickable]: restProps.isUnclickable
      })}
      onClick={restProps.isUnclickable ? undefined : handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={restProps.onMouseLeave}
    >
      {webExtension.i18n.getMessage(rowName)}
    </div>
  )
}

export default MenuRow
