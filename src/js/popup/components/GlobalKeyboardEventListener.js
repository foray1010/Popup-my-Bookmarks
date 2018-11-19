// @flow strict @jsx createElement

import {createElement} from 'react'
import EventListener from 'react-event-listener'
import {connect} from 'react-redux'

import type {RootState} from '../reduxs'

type Props = {|
  isDisableGlobalKeyboardEvent: boolean,
  onKeyDown?: (KeyboardEvent) => void
|}
const GlobalKeyboardEventListener = (props: Props) =>
  !props.isDisableGlobalKeyboardEvent && (
    <EventListener target={document} onKeyDown={props.onKeyDown} />
  )

const mapStateToProps = (state: RootState) => ({
  isDisableGlobalKeyboardEvent: state.ui.isDisableGlobalKeyboardEvent
})

export default connect(mapStateToProps)(GlobalKeyboardEventListener)
