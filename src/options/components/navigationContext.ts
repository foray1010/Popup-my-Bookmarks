import constate from 'constate'
import * as React from 'react'

import { NAV_MODULE } from '../constants'

function useNavigation() {
  const [selectedNavModule, switchNavModule] = React.useState(
    NAV_MODULE.GENERAL,
  )
  return {
    selectedNavModule,
    switchNavModule,
  }
}

export const [NavigationProvider, useNavigationContext] = constate(
  useNavigation,
)
