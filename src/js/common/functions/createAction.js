// @flow

import Immutable from 'seamless-immutable'

export default (type: string, payloadCreator: ?Function) => (...args: Array<*>): Object =>
  Immutable({
    type,
    payload: payloadCreator ? payloadCreator(...args) : null
  })
