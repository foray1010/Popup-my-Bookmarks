// @flow strict @jsx createElement

import '../../../../css/options/option-button.css'

import {createElement} from 'react'

type Props = {|
  msg: string,
  onClick: () => void
|}
const OptionButton = (props: Props) => (
  <button styleName='main' type='button' onClick={props.onClick}>
    {props.msg}
  </button>
)

export default OptionButton
