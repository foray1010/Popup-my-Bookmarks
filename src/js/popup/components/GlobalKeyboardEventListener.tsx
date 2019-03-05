import * as React from 'react'
import EventListener from 'react-event-listener'
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
  if (props.isDisableGlobalKeyboardEvent) return null

  return <EventListener target={document} onKeyDown={props.onKeyDown} />
}

export default connect(mapStateToProps)(GlobalKeyboardEventListener)
