// @flow strict @jsx createElement

import {createElement} from 'react'
import EventListener from 'react-event-listener'
import {connect} from 'react-redux'

type Props = {|
  isDisableGlobalKeyboardEvent: boolean,
  onKeyDown?: (KeyboardEvent) => void
|}
const GlobalKeyboardEventListener = (props: Props) =>
  !props.isDisableGlobalKeyboardEvent && (
    <EventListener target={document} onKeyDown={props.onKeyDown} />
  )

const mapStateToProps = (state) => ({
  isDisableGlobalKeyboardEvent: state.ui.isDisableGlobalKeyboardEvent
})

export default connect(mapStateToProps)(GlobalKeyboardEventListener)
