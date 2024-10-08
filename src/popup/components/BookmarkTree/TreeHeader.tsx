import { Component as Cross } from '../../images/cross.svg?svgUse'
import * as classes from './tree-header.module.css'

type Props = Readonly<{
  onClose: () => void
  title: string
}>
export default function TreeHeader(props: Props) {
  return (
    <header className={classes.main}>
      <h1 className={classes.title}>{props.title}</h1>
      <Cross className={classes.close} tabIndex={0} onClick={props.onClose} />
    </header>
  )
}
