import * as React from 'react'

import classes from '../../../../css/popup/menu.css'
import {MenuPattern} from '../../types'
import MenuRow from './MenuRow'

interface Props {
  focusedRow: string
  menuPattern: MenuPattern
  onRowClick: (rowName: string) => () => void
  onRowMouseEnter: (rowName: string) => () => void
  onRowMouseLeave: () => void
  unclickableRows: Array<string>
}
const Menu = (props: Props) => (
  <div className={classes.main}>
    {props.menuPattern.map((rowNames) => (
      <div key={rowNames.join()}>
        {rowNames.map((rowName) => (
          <MenuRow
            key={rowName}
            isFocused={rowName === props.focusedRow}
            isUnclickable={props.unclickableRows.includes(rowName)}
            rowName={rowName}
            onClick={props.onRowClick}
            onMouseEnter={props.onRowMouseEnter}
            onMouseLeave={props.onRowMouseLeave}
          />
        ))}
      </div>
    ))}
  </div>
)

export default Menu
