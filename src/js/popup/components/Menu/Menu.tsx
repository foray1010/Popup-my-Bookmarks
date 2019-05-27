import * as R from 'ramda'
import * as React from 'react'

import classes from '../../../../css/popup/menu.css'
import {MenuPattern} from '../../types'
import MenuRow from './MenuRow'

interface Props {
  highlightedIndex?: number
  menuPattern: MenuPattern
  onRowClick: React.MouseEventHandler<HTMLElement>
  onRowMouseEnter: (index: number) => React.MouseEventHandler<HTMLElement>
  onRowMouseLeave: (index: number) => React.MouseEventHandler<HTMLElement>
  unclickableRows: Array<string>
}
const Menu = (props: Props) => {
  const allRowNames = props.menuPattern.reduce(R.concat, [])

  return (
    <div className={classes.main}>
      {props.menuPattern.map((rowNames) => (
        <div key={rowNames.join()}>
          {rowNames.map((rowName) => {
            const rowIndex = allRowNames.indexOf(rowName)
            return (
              <MenuRow
                key={rowName}
                isFocused={rowIndex === props.highlightedIndex}
                isUnclickable={props.unclickableRows.includes(rowName)}
                rowIndex={rowIndex}
                rowName={rowName}
                onClick={props.onRowClick}
                onMouseEnter={props.onRowMouseEnter}
                onMouseLeave={props.onRowMouseLeave}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Menu
