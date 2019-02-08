// @flow strict

import * as React from 'react'

import classes from '../../../../css/popup/tree-header.css'

type Props = {|
  onClose: () => void,
  title: string
|}
const TreeHeader = (props: Props) => (
  <header className={classes.main}>
    <h1 className={classes.title}>{props.title}</h1>
    <button className={classes.close} type='button' tabIndex='-1' onClick={props.onClose} />
  </header>
)

export default TreeHeader
