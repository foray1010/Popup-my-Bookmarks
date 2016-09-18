import {autobind} from 'core-decorators'
import {connect} from 'react-redux'
import {createElement, Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'

import {
  removeTreeInfosFromIndex
} from '../actions'

import styles from '../../../css/popup/folder-cover.scss'

class FolderCover extends Component {
  @autobind
  handleClose() {
    const {
      dispatch,
      treeIndex
    } = this.props

    dispatch(removeTreeInfosFromIndex(treeIndex + 1))
  }

  render() {
    const {isHidden} = this.props

    const delay = 300
    const xyRange = 20

    let mousePosition = null
    let triggerOnClickTimer = null

    const handleMouseLeave = () => {
      clearTimeout(triggerOnClickTimer)
      triggerOnClickTimer = null
    }

    const handleMouseMove = (evt) => {
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
          this.handleClose()
          triggerOnClickTimer = null
        } else {
          triggerOnClickByXYRange(mousePosition)
        }
      }, delay)
    }

    return (
      <div
        styleName='main'
        hidden={isHidden}
        onClick={this.handleClose}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      />
    )
  }
}

if (process.env.NODE_ENV !== 'production') {
  FolderCover.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isHidden: PropTypes.bool.isRequired,
    treeIndex: PropTypes.number.isRequired
  }
}

const mapStateToProps = (state, ownProps) => ({
  // hide the folder if it is not the top two folder
  isHidden: state.trees.length - ownProps.treeIndex <= 2
})

export default connect(mapStateToProps)(
  CSSModules(FolderCover, styles)
)
