import {ActionType, createAction, createReducer} from 'typesafe-actions'

import {
  KeyBindingEventCallback,
  KeyBindingMeta,
  KeyBindingsContextType
} from '../KeyBindingsContext'

export const keyBindingsPerWindowCreators = {
  addEventListener: createAction(
    'ADD_EVENT_LISTENER',
    (action) => ({priority = 0, ...meta}: KeyBindingMeta, callback: KeyBindingEventCallback) =>
      action({...meta, priority, callback})
  ),
  removeEventListener: createAction(
    'REMOVE_EVENT_LISTENER',
    (action) => ({priority = 0, ...meta}: KeyBindingMeta, callback: KeyBindingEventCallback) =>
      action({...meta, priority, callback})
  )
}

export const keyBindingsPerWindowReducer = createReducer<
KeyBindingsContextType['keyBindingsPerWindow'],
ActionType<typeof keyBindingsPerWindowCreators>
>(new Map())
  .handleAction(keyBindingsPerWindowCreators.addEventListener, (state, {payload}) => {
    const {callback, key, priority, windowId} = payload

    const keyBindings = state.get(windowId) || []
    const updatedKeyBindings = [...keyBindings, {callback, key, priority}].sort(
      (a, b) => a.priority - b.priority
    )

    return new Map(state).set(windowId, updatedKeyBindings)
  })
  .handleAction(keyBindingsPerWindowCreators.removeEventListener, (state, {payload}) => {
    const {callback, key, priority, windowId} = payload

    const keyBindings = state.get(windowId)
    if (!keyBindings) return state

    const updatedKeyBindings = keyBindings.filter((keyBinding) => {
      return (
        keyBinding.callback !== callback ||
        keyBinding.key.toString() !== key.toString() ||
        keyBinding.priority !== priority
      )
    })

    return new Map(state).set(windowId, updatedKeyBindings)
  })
