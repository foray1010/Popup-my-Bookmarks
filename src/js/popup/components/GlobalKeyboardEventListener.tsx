import * as React from 'react'
import EventListener from 'react-event-listener'
import {connect} from 'react-redux'

import {RootState} from '../reduxs'

const mapStateToProps = (state: RootState) => ({
  isDisableGlobalKeyboardEvent: state.ui.isDisableGlobalKeyboardEvent
})

type Props = ReturnType<typeof mapStateToProps> & {
  onKeyDown?: (evt: KeyboardEvent) => void
}
const GlobalKeyboardEventListener = (props: Props) =>
  !props.isDisableGlobalKeyboardEvent && (
    <EventListener target={document} onKeyDown={props.onKeyDown} />
  )

export default connect(mapStateToProps)(GlobalKeyboardEventListener)
