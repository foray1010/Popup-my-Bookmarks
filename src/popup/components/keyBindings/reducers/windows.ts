import { ActionType, createAction, createReducer } from 'typesafe-actions'

export interface WindowsState {
  activeWindowId?: string
  activeWindowIdQueue: ReadonlyArray<string>
}

export const windowsInitialState: WindowsState = {
  activeWindowIdQueue: [],
}

export const windowsCreators = {
  setActiveWindowId: createAction(
    'SET_ACTIVE_WINDOW_ID',
    action => (windowId: string) => action(windowId),
  ),
  unsetActiveWindowId: createAction(
    'UNSET_ACTIVE_WINDOW_ID',
    action => (windowId: string) => action(windowId),
  ),
}

export const windowsReducer = createReducer<
  WindowsState,
  ActionType<typeof windowsCreators>
>(windowsInitialState)
  .handleAction(
    windowsCreators.setActiveWindowId,
    (state, { payload: windowId }) => {
      const activeWindowIdQueue = [
        ...state.activeWindowIdQueue.filter(x => x !== windowId),
        windowId,
      ]
      return {
        activeWindowId: activeWindowIdQueue[activeWindowIdQueue.length - 1],
        activeWindowIdQueue,
      }
    },
  )
  .handleAction(
    windowsCreators.unsetActiveWindowId,
    (state, { payload: windowId }) => {
      const activeWindowIdQueue = state.activeWindowIdQueue.filter(
        x => x !== windowId,
      )
      return {
        activeWindowId: activeWindowIdQueue[activeWindowIdQueue.length - 1],
        activeWindowIdQueue,
      }
    },
  )
