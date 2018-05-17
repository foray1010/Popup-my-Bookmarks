// @flow strict

import * as R from 'ramda'

import type {BookmarkInfo} from '../types'

const collator = new Intl.Collator()

export const sortByTitle = R.sort((a: BookmarkInfo, b: BookmarkInfo) =>
  collator.compare(a.title, b.title))
