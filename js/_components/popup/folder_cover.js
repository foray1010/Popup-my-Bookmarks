import element from 'virtual-element'

function render({props}) {
  const delay = 300
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
      const displacement = Math.abs(
        mousePosition[axis] - mousePositionOrig[axis]
      )

      return displacement < xyRange
    }

    triggerOnClickTimer = setTimeout(() => {
      const isTrigger = isInTriggerPoint('x') && isInTriggerPoint('y')

      if (isTrigger) {
        props.clickHandler()
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
      hidden={props.isHidden}
      onClick={props.clickHandler}
      onMouseLeave={mouseLeaveHandler}
      onMouseMove={mouseMoveHandler} />
  )
}

export default {render}
