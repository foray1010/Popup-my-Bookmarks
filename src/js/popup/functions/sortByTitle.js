// @flow

import * as R from 'ramda'

import * as TYPES from '../types'

const collator = new window.Intl.Collator()

export const sortByTitle = R.sort((a: TYPES.BookmarkInfo, b: TYPES.BookmarkInfo) =>
  collator.compare(a.title, b.title))
