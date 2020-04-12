import * as React from 'react'
import { useSelector } from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import type { RootState } from '../../reduxs'
import { navigationCreators } from '../../reduxs'
import NavBar from './NavBar'

const NavBarContainer = <T extends {}>(props: T) => {
  const selectedNavModule = useSelector(
    (state: RootState) => state.navigation.selectedNavModule,
  )

  const switchNavModule = useAction(navigationCreators.switchNavModule)

  return (
    <NavBar
      {...props}
      selectedNavModule={selectedNavModule}
      switchNavModule={switchNavModule}
    />
  )
}

export default NavBarContainer
