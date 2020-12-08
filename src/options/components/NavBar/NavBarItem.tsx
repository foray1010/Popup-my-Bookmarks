import classNames from 'clsx'
import * as React from 'react'

import Button from '../../../core/components/baseItems/Button'
import type { NAV_MODULE } from '../../constants'
import classes from './nav-bar-item.css'

interface Props {
  isActive: boolean
  navModule: NAV_MODULE
  switchNavModule: (navModule: NAV_MODULE) => void
  title: string
}
const NavBarItem = ({ navModule, switchNavModule, ...restProps }: Props) => {
  const handleClick = React.useCallback(() => {
    switchNavModule(navModule)
  }, [navModule, switchNavModule])

  return (
    <Button
      className={classNames(classes.main, {
        [classes['main-active']]: restProps.isActive,
      })}
      onClick={handleClick}
    >
      {restProps.title}
    </Button>
  )
}

export default NavBarItem
