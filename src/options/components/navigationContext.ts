import constate from 'constate'
import { useState } from 'react'

import { RoutePath } from '../constants/index.js'

function useNavigation() {
  const [currentPath, setCurrentPath] = useState(RoutePath.General)
  return {
    currentPath,
    setCurrentPath,
  }
}

export const [NavigationProvider, useNavigationContext] =
  constate(useNavigation)
