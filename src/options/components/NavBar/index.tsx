import * as React from 'react'
import { useSelector } from 'react-redux'

import useAction from '../../../core/hooks/useAction'
import type { RootState } from '../../reduxs'
import { navigationCreators } from '../../reduxs'
import NavBar from './NavBar'

type Props = Omit<
  React.ComponentProps<typeof NavBar>,
  'selectedNavModule' | 'switchNavModule'
>

const NavBarContainer = (props: Props) => {
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
