// @flow
// @jsx createElement

import * as R from 'ramda'
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

const mapStateToProps = R.compose(R.pick(['isDisableGlobalKeyboardEvent']), R.prop('ui'))

export default connect(mapStateToProps)(GlobalKeyboardEventListener)
