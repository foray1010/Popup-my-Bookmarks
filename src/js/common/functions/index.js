// @flow

import Immutable from 'seamless-immutable'

export const createAction = (type: string, payloadCreator: ?Function) => (
  ...args: Array<*>
): Object =>
  Immutable({
    type,
    payload: payloadCreator ? payloadCreator(...args) : null
  })

export const normalizeInputtingValue = (value: string): string =>
  value.trimLeft().replace(/\s+/g, ' ')
