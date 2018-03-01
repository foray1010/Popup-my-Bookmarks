// @flow

import {combineSagas} from '../../common/utils'
import {bookmarkSaga} from './bookmark/saga'
import {menuSaga} from './menu/saga'

export const rootSaga = combineSagas([bookmarkSaga, menuSaga])
