import {element} from 'deku'

function initialState(props) {
  return {
    storage: props.storage
  }
}

function render({props, state}, setState) {
  globals.setRootState = setState

  return (
    <div id='app'>
    </div>
  )
}

export default {initialState, render}
