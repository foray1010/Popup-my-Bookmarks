// @flow strict @jsx createElement

import {createElement} from 'react'

import classes from '../../../../css/options/option-button.css'

type Props = {|
  msg: string,
  onClick: () => void
|}
const OptionButton = (props: Props) => (
  <button className={classes.main} type='button' onClick={props.onClick}>
    {props.msg}
  </button>
)

export default OptionButton
