// @flow strict

import type {Saga} from 'redux-saga'
import {call} from 'redux-saga/effects'

import {updateBookmark} from '../../../../../common/utils'

type Payload = {|
  id: string,
  title: string,
  url: string
|}
export function* editBookmark({id, title, url}: Payload): Saga<void> {
  yield call(updateBookmark, id, {
    title,
    ...(url ? {url} : null)
  })
}
