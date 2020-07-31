import { ActionType, createAction, createReducer } from 'typesafe-actions'

type KeyDefinition = string | RegExp
export type KeyBindingMeta = Readonly<{
  key: KeyDefinition
  priority?: number
  windowId: string
}>
export type KeyBindingEventCallback = (evt: KeyboardEvent) => void
type KeyBinding = Readonly<{
  priority: number
  key: KeyDefinition
  callback: KeyBindingEventCallback
}>
type KeyBindingsPerWindowState = Map<string, ReadonlyArray<KeyBinding>>

export const keyBindingsPerWindowInitialState: KeyBindingsPerWindowState = new Map()

export const keyBindingsPerWindowCreators = {
  addEventListener: createAction(
    'ADD_EVENT_LISTENER',
    (
      { priority = 0, ...meta }: KeyBindingMeta,
      callback: KeyBindingEventCallback,
    ) => ({ ...meta, priority, callback }),
  )(),
  removeEventListener: createAction(
    'REMOVE_EVENT_LISTENER',
    (
      { priority = 0, ...meta }: KeyBindingMeta,
      callback: KeyBindingEventCallback,
    ) => ({ ...meta, priority, callback }),
  )(),
}

export const keyBindingsPerWindowReducer = createReducer<
  KeyBindingsPerWindowState,
  ActionType<typeof keyBindingsPerWindowCreators>
>(keyBindingsPerWindowInitialState)
  .handleAction(
    keyBindingsPerWindowCreators.addEventListener,
    (state, { payload }) => {
      const { callback, key, priority, windowId } = payload

      const keyBindings = state.get(windowId) ?? []
      const updatedKeyBindings = [
        ...keyBindings,
        { callback, key, priority },
      ].sort((a, b) => a.priority - b.priority)

      return new Map(state).set(windowId, updatedKeyBindings)
    },
  )
  .handleAction(
    keyBindingsPerWindowCreators.removeEventListener,
    (state, { payload }) => {
      const { callback, key, priority, windowId } = payload

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
    },
  )
