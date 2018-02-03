import {combineSagas} from '../../common/functions'
import {navigationSaga} from './navigation/saga'
import {optionsSaga} from './options/saga'

export const rootSaga = combineSagas([navigationSaga, optionsSaga])
