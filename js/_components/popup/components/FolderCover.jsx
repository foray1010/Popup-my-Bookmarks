import {element} from 'deku'

import {
  removeTreeInfosAfterIndex
} from '../actions'

const clickCoverHandler = (model) => () => {
  closeFolder(model)
}

function closeFolder(model) {
  const {dispatch, props} = model

  const {treeIndex} = props

  dispatch(removeTreeInfosAfterIndex(treeIndex))
}

const FolderCover = {
  render(model) {
    const {context, props} = model

    const {treeIndex} = props
    const {trees} = context

    const delay = 300
    // hide the folder if it is not the top two folder
    const isHidden = trees.length - treeIndex <= 2
    const xyRange = 20

    const mouseLeaveHandler = () => () => {
      clearTimeout(triggerOnClickTimer)
      triggerOnClickTimer = null
    }

    const mouseMoveHandler = () => (evt) => {
      mousePosition = {
        x: evt.x,
        y: evt.y
      }

      if (!triggerOnClickTimer) {
        triggerOnClickByXYRange(mousePosition)
      }
    }

    const triggerOnClickByXYRange = (mousePositionOrig) => {
      const isInTriggerPoint = (axis) => {
        const displacement = Math.abs(mousePosition[axis] - mousePositionOrig[axis])

        return displacement < xyRange
      }

      triggerOnClickTimer = setTimeout(() => {
        const isTrigger = isInTriggerPoint('x') && isInTriggerPoint('y')

        if (isTrigger) {
          closeFolder(model)
          triggerOnClickTimer = null
        } else {
          triggerOnClickByXYRange(mousePosition)
        }
      }, delay)
    }

    let mousePosition
    let triggerOnClickTimer = null

    return (
      <div
        class='cover'
        hidden={isHidden}
        onClick={clickCoverHandler(model)}
        onMouseLeave={mouseLeaveHandler(model)}
        onMouseMove={mouseMoveHandler(model)}
      />
    )
  }
}

export default FolderCover
