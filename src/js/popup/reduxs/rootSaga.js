// @flow

import {combineSagas} from '../../common/functions'
import {bookmarkSaga} from './bookmark/saga'

export const rootSaga = combineSagas([bookmarkSaga])
