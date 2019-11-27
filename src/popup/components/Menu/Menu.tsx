import * as React from 'react'

import { MenuPattern } from '../../types'
import classes from './menu.css'
import MenuRow from './MenuRow'

interface Props {
  highlightedIndex?: number
  menuPattern: MenuPattern
  onRowClick: React.MouseEventHandler
  onRowMouseEnter: (index: number) => React.MouseEventHandler
  onRowMouseLeave: (index: number) => React.MouseEventHandler
  unclickableRows: Array<string>
}
const Menu = (props: Props) => {
  const allRowNames = props.menuPattern.flat()

  return (
    <div className={classes.main}>
      {props.menuPattern.map(rowNames => (
        <div key={rowNames.join()}>
          {rowNames.map(rowName => {
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
