import element from 'virtual-element'

function clickHandler() {
  globals.resetBodySize()

  globals.setRootState({
    editorTarget: null,
    menuTarget: null
  })
}

function render({props}) {
  return (
    <div
      id='menu-cover'
      class='cover'
      hidden={props.isHidden}
      onClick={clickHandler} />
  )
}

export default {render}
