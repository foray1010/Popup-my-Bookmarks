/* @flow */

import {static as Immutable} from 'seamless-immutable'

export function createAction(
  type: string,
  payloadCreator: ?Function
): Function {
  return (...args: Array<*>): Object => {
    return Immutable({
      type,
      payload: payloadCreator ? payloadCreator(...args) : null
    })
  }
}
