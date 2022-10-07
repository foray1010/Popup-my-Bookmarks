import Cross from '../../images/cross.svg?svgr'
import classes from './tree-header.module.css'

interface Props {
  readonly onClose: () => void
  readonly title: string
}
export default function TreeHeader(props: Props) {
  return (
    <header className={classes['main']}>
      <h1 className={classes['title']}>{props.title}</h1>
      <Cross className={classes['close']} onClick={props.onClose} />
    </header>
  )
}
