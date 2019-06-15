import classNames from 'classnames'
import * as React from 'react'

import {NAV_MODULE} from '../../constants'
import classes from './nav-bar-item.css'

interface Props {
  isActive: boolean
  navModule: NAV_MODULE
  switchNavModule: (navModule: NAV_MODULE) => void
  title: string
}
const NavBarItem = ({navModule, switchNavModule, ...restProps}: Props) => {
  const handleClick = React.useCallback(() => {
    switchNavModule(navModule)
  }, [navModule, switchNavModule])

  return (
    <button
      className={classNames(classes.main, {
        [classes['main-active']]: restProps.isActive
      })}
      type='button'
      onClick={handleClick}
    >
      {restProps.title}
    </button>
  )
}

export default NavBarItem
