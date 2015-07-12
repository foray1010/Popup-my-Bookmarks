import {element} from 'deku'

import Donate from './donate'

function initialState(props) {
  return {
    storage: Immutable(props.storage)
  }
}

function render({props, state}, setState) {
  globals.setRootState = setState

  return (
    <div id='app'>
      <Donate />
    </div>
  )
}

export default {initialState, render}
