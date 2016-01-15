import {element} from 'deku'

import {
  updateEditorTarget,
  updateMenuTarget
} from '../actions'

const clickHandler = (model) => () => {
  const {dispatch} = model

  globals.resetBodySize()

  dispatch([
    updateEditorTarget(null),
    updateMenuTarget(null)
  ])
}

const MenuCover = {
  render(model) {
    const {context} = model

    const {editorTarget, menuTarget} = context

    // if editor or menu has target, show menu-cover
    const isHidden = !(editorTarget || menuTarget)

    return (
      <div
        id='menu-cover'
        class='cover'
        hidden={isHidden}
        onClick={clickHandler(model)}
      />
    )
  }
}

export default MenuCover
