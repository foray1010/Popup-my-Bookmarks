// @flow
// @jsx createElement

import '../../../css/popup/mask.css'

import {createElement} from 'react'

type Props = {|
  onClick: () => void
|}
const Mask = (props: Props) => <div styleName='main' onClick={props.onClick} />

export default Mask
