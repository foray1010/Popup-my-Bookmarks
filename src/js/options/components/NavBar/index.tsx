import * as React from 'react'
import {useSelector} from 'react-redux'

import useAction from '../../../common/hooks/useAction'
import {RootState, navigationCreators} from '../../reduxs'
import NavBar from './NavBar'

const NavBarContainer = <T extends {}>(props: T) => {
  const selectedNavModule = useSelector((state: RootState) => state.navigation.selectedNavModule)

  const switchNavModule = useAction(navigationCreators.switchNavModule)

  return (
    <NavBar {...props} selectedNavModule={selectedNavModule} switchNavModule={switchNavModule} />
  )
}

export default NavBarContainer
