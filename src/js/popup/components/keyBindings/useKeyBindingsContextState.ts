import * as React from 'react'
import {ActionType, createAction, getType} from 'typesafe-actions'

import useMapDispatchToCallback from '../../hooks/useMapDispatchToCallback'
import {KeyBindingEventCallback, KeyBindingMeta, KeyBindingsContextType} from './KeyBindingsContext'

const keyBindingsPerLevelCreators = {
  addEventListener: createAction(
    'ADD_EVENT_LISTENER',
    (action) => (
      {level = 0, priority = 0, ...meta}: KeyBindingMeta,
      callback: KeyBindingEventCallback
    ) => action({...meta, level, priority, callback})
  ),
  removeEventListener: createAction(
    'REMOVE_EVENT_LISTENER',
    (action) => (
      {level = 0, priority = 0, ...meta}: KeyBindingMeta,
      callback: KeyBindingEventCallback
    ) => action({...meta, level, priority, callback})
  )
}

const keyBindingsPerLevelReducer = (
  state: KeyBindingsContextType['keyBindingsPerLevel'],
  action: ActionType<typeof keyBindingsPerLevelCreators>
): KeyBindingsContextType['keyBindingsPerLevel'] => {
  switch (action.type) {
    case getType(keyBindingsPerLevelCreators.addEventListener): {
      const {callback, key, level, priority} = action.payload

      const keyBindings = state.get(level) || []
      const updatedKeyBindings = [...keyBindings, {callback, key, priority}].sort(
        (a, b) => a.priority - b.priority
      )

      return new Map(state).set(level, updatedKeyBindings)
    }

    case getType(keyBindingsPerLevelCreators.removeEventListener): {
      const {callback, key, level, priority} = action.payload

      const keyBindings = state.get(level)
      if (!keyBindings) return state

      const updatedKeyBindings = keyBindings.filter((keyBinding) => {
        return (
          keyBinding.callback !== callback ||
          keyBinding.key.toString() !== key.toString() ||
          keyBinding.priority !== priority
        )
      })

      return new Map(state).set(level, updatedKeyBindings)
    }

    default:
      return state
  }
}

const useKeyBindingsContextState = (): KeyBindingsContextType => {
  const [currentLayerLevel, setLayerLevel] = React.useState<
  KeyBindingsContextType['currentLayerLevel']
  >(0)
  const [keyBindingsPerLevel, dispatch] = React.useReducer(keyBindingsPerLevelReducer, new Map())

  const addEventListener = useMapDispatchToCallback(
    dispatch,
    keyBindingsPerLevelCreators.addEventListener
  )

  const removeEventListener = useMapDispatchToCallback(
    dispatch,
    keyBindingsPerLevelCreators.removeEventListener
  )

  return React.useMemo(
    () => ({
      currentLayerLevel,
      keyBindingsPerLevel,
      addEventListener,
      removeEventListener,
      setLayerLevel
    }),
    [addEventListener, keyBindingsPerLevel, currentLayerLevel, removeEventListener]
  )
}

export default useKeyBindingsContextState
