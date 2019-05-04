import * as React from 'react'

import classes from '../../../css/popup/mask.css'

interface Props {
  backgroundColor: string
  onClick: () => void
  opacity: number
}
const Mask = (props: Props) => {
  const styles = React.useMemo(
    (): object => ({
      '--backgroundColor': props.backgroundColor,
      '--opacity': props.opacity
    }),
    [props.backgroundColor, props.opacity]
  )

  return <main className={classes.main} style={styles} onClick={props.onClick} />
}

export default Mask
