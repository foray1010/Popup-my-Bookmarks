/* eslint redux-saga/no-unhandled-errors: 'off' */

import Chance from 'chance'
import {call, put} from 'redux-saga/effects'
import {getType} from 'typesafe-actions'

import {queryTabs} from '../../../../../common/utils'
import * as bookmarkCreators from '../../actions'
import {addCurrentPage} from './addCurrentPage'

const chance = Chance('addCurrentPage')

const currentTabs = [
  {
    title: '  title  ',
    url: '  https://google.com/  '
  },
  {
    title: chance.word(),
    url: chance.url()
  }
]

describe('addCurrentPage', () => {
  test('should successfully add current tab as bookmark', () => {
    const index = chance.integer()
    const parentId = String(chance.integer())

    const generator = addCurrentPage({
      type: getType(bookmarkCreators.addCurrentPage),
      payload: {parentId, index}
    })

    expect(generator.next().value).toEqual(
      call(queryTabs, {
        currentWindow: true,
        active: true
      })
    )

    expect(generator.next(currentTabs).value).toEqual(
      put(bookmarkCreators.createBookmark(parentId, index, '  title  ', '  https://google.com/  '))
    )

    expect(generator.next().done).toBe(true)
  })
})
