import { ReactComponent as Cross } from '../../images/cross.svg'
import classes from './tree-header.css'

interface Props {
  onClose: () => void
  title: string
}
const TreeHeader = (props: Props) => (
  <header className={classes.main}>
    <h1 className={classes.title}>{props.title}</h1>
    <Cross className={classes.close} onClick={props.onClose} />
  </header>
)

export default TreeHeader
