import element from 'virtual-element'

function clickCoverHandler(event, {props}) {
  closeFolder(props)
}

function closeFolder(props) {
  globals.removeTreeInfoFromIndex(props.trees, props.treeIndex + 1)
}

function render({props}) {
  const delay = 300
  // hide the folder if it is not the top two folder
  const isHidden = props.trees.length - props.treeIndex <= 2
  const xyRange = 20

  const mouseLeaveHandler = () => {
    clearTimeout(triggerOnClickTimer)
    triggerOnClickTimer = null
  }

  const mouseMoveHandler = (event) => {
    mousePosition = {
      x: event.x,
      y: event.y
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
        closeFolder(props)
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
      onClick={clickCoverHandler}
      onMouseLeave={mouseLeaveHandler}
      onMouseMove={mouseMoveHandler} />
  )
}

export default {render}
