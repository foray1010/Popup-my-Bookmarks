import constate from 'constate'
import { useState } from 'react'
import type { ValueOf } from 'type-fest'

import { RoutePath } from '../constants/index.js'

function useNavigation() {
  const [currentPath, setCurrentPath] = useState<ValueOf<typeof RoutePath>>(
    RoutePath.General,
  )
  return {
    currentPath,
    setCurrentPath,
  }
}

export const [NavigationProvider, useNavigationContext] =
  constate(useNavigation)
