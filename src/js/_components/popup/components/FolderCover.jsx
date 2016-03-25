import {bind} from 'decko'
import {connect} from 'react-redux'
import {Component, h} from 'preact'

import {
  removeTreeInfosFromIndex
} from '../actions'

const mapStateToProps = (state, ownProps) => ({
  // hide the folder if it is not the top two folder
  isHidden: state.trees.length - ownProps.treeIndex <= 2
})

@connect(mapStateToProps)
class FolderCover extends Component {
  @bind
  closeHandler() {
    const {
      dispatch,
      treeIndex
    } = this.props

    dispatch(removeTreeInfosFromIndex(treeIndex + 1))
  }

  render(props) {
    const {isHidden} = props

    const delay = 300
    const xyRange = 20

    let mousePosition = null
    let triggerOnClickTimer = null

    const mouseLeaveHandler = () => {
      clearTimeout(triggerOnClickTimer)
      triggerOnClickTimer = null
    }

    const mouseMoveHandler = (evt) => {
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
          this.closeHandler()
          triggerOnClickTimer = null
        } else {
          triggerOnClickByXYRange(mousePosition)
        }
      }, delay)
    }

    return (
      <div
        className='cover'
        hidden={isHidden}
        onClick={this.closeHandler}
        onMouseLeave={mouseLeaveHandler}
        onMouseMove={mouseMoveHandler}
      />
    )
  }
}

export default FolderCover
