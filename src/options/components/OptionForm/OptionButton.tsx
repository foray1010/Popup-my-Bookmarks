import * as React from 'react'

import classes from './option-button.css'

interface Props {
  msg: string
  onClick: React.MouseEventHandler
}
const OptionButton = (props: Props) => (
  <button className={classes.main} type='button' onClick={props.onClick}>
    {props.msg}
  </button>
)

export default OptionButton
