import constate from 'constate'
import * as React from 'react'

import { RoutePath } from '../constants/index.js'

function useNavigation() {
  const [currentPath, setCurrentPath] = React.useState(RoutePath.General)
  return {
    currentPath,
    setCurrentPath,
  }
}

export const [NavigationProvider, useNavigationContext] =
  constate(useNavigation)
