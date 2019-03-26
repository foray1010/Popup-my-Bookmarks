import {combineSagas} from '../../common/utils'
import {bookmarkSaga} from './bookmark/saga'
import {editorSaga} from './editor/saga'
import {lastPositionsSaga} from './lastPositions/saga'
import {menuSaga} from './menu/saga'

export const rootSaga = combineSagas([bookmarkSaga, editorSaga, lastPositionsSaga, menuSaga])
