import {combineSagas} from '../../common/utils'
import {bookmarkSaga} from './bookmark/saga'
import {editorSaga} from './editor/saga'
import {localStorageSaga} from './localStorage/saga'
import {menuSaga} from './menu/saga'

export const rootSaga = combineSagas([bookmarkSaga, editorSaga, localStorageSaga, menuSaga])
