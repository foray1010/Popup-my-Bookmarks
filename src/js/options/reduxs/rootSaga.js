// @flow strict

import {combineSagas} from '../../common/utils'
import {navigationSaga} from './navigation/saga'
import {optionsSaga} from './options/saga'

export const rootSaga = combineSagas([navigationSaga, optionsSaga])
