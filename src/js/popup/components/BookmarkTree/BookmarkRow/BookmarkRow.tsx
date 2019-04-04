import classNames from 'classnames'
import * as R from 'ramda'
import * as React from 'react'
import styled from 'styled-components'

import classes from '../../../../../css/popup/bookmark-row.css'

interface IconImgProps {
  iconSize: number
}
const IconImg = styled('img')<IconImgProps>`
  width: ${R.prop('iconSize')}px;
`

interface Props {
  className?: string
  iconSize: number
  iconUrl?: string
  isHighlighted: boolean
  isUnclickable: boolean
  onAuxClick?: (evt: React.MouseEvent<HTMLElement>) => void
  onClick?: (evt: React.MouseEvent<HTMLElement>) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  title: string
  tooltip?: string
}
const BookmarkRow = (props: Props) => {
  return (
    <div
      className={classNames(
        classes.main,
        {
          [classes.highlighted]: props.isHighlighted,
          [classes.unclickable]: props.isUnclickable
        },
        props.className
      )}
      onAuxClick={props.isUnclickable ? undefined : props.onAuxClick}
      onClick={props.isUnclickable ? undefined : props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      title={props.tooltip}
    >
      {props.iconUrl && (
        <IconImg iconSize={props.iconSize} className={classes.icon} src={props.iconUrl} alt='' />
      )}
      <div className={classes.title}>{props.title}</div>
    </div>
  )
}

export default BookmarkRow
