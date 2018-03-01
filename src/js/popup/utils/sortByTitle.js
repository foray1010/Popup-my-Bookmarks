// @flow

import * as R from 'ramda'

const collator = new window.Intl.Collator()

export const sortByTitle = R.sort((a, b) => collator.compare(a.title, b.title))
