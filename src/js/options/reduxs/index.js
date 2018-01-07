import {combineReducers} from 'redux'

import navigationRedux from './navigationRedux'
import optionsRedux from './optionsRedux'

export default combineReducers({
  navigation: navigationRedux,
  options: optionsRedux
})
