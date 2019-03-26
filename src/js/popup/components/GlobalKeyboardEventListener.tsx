import * as React from 'react'
import {connect} from 'react-redux'

import {RootState} from '../reduxs'

interface OwnProps {
  onKeyDown?: (evt: KeyboardEvent) => void
}

const mapStateToProps = (state: RootState) => ({
  isDisableGlobalKeyboardEvent: state.ui.isDisableGlobalKeyboardEvent
})

type Props = OwnProps & ReturnType<typeof mapStateToProps>
const GlobalKeyboardEventListener = (props: Props) => {
  React.useEffect(() => {
    if (props.isDisableGlobalKeyboardEvent) return undefined

    if (props.onKeyDown) document.addEventListener('keydown', props.onKeyDown)

    return () => {
      if (props.onKeyDown) document.removeEventListener('keydown', props.onKeyDown)
    }
  }, [props.isDisableGlobalKeyboardEvent, props.onKeyDown])

  return null
}

export default connect(mapStateToProps)(GlobalKeyboardEventListener)
