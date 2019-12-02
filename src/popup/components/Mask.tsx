import * as React from 'react'

import classes from './mask.css'

interface Props {
  onClick: React.MouseEventHandler
  opacity: number
}
const Mask = (props: Props) => {
  const styles = React.useMemo(
    (): object => ({
      '--opacity': props.opacity,
    }),
    [props.opacity],
  )

  return <div className={classes.main} style={styles} onClick={props.onClick} />
}

export default Mask
