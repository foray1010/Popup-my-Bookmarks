/* eslint redux-saga/no-unhandled-errors: 'off' */

import Chance from 'chance'
import {put} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import * as CST from '../../../../constants'
import * as bookmarkCreators from '../../actions'
import {addSeparator} from './addSeparator'

const chance = Chance('addSeparator')

describe('addSeparator', () => {
  test('should successfully add separator', () => {
    const index = chance.integer()
    const parentId = String(chance.integer())

    const generator = addSeparator({
      type: getType(bookmarkCreators.addSeparator),
      payload: {parentId, index}
    })

    expect(generator.next().value).toEqual(
      put(bookmarkCreators.createBookmark(parentId, index, '- '.repeat(42), CST.SEPARATE_THIS_URL))
    )

    expect(generator.next().done).toBe(true)
  })
})
