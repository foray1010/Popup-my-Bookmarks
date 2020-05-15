import * as React from 'react'

import Button from '../../../core/components/baseItems/Button'
import classes from './tree-header.css'

interface Props {
  onClose: () => void
  title: string
}
const TreeHeader = (props: Props) => (
  <header className={classes.main}>
    <h1 className={classes.title}>{props.title}</h1>
    <Button className={classes.close} tabIndex={-1} onClick={props.onClose} />
  </header>
)

export default TreeHeader
