import type * as React from 'react'

import PlainList from '../../../core/components/baseItems/PlainList/index.js'
import classes from './menu.module.css'
import MenuRow from './MenuRow.js'
import type { MenuPattern } from './types.js'

type Props = {
  readonly highlightedIndex?: number | undefined
  readonly menuPattern: MenuPattern
  readonly onRowClick: React.MouseEventHandler
  readonly onRowMouseEnter: (index: number) => React.MouseEventHandler
  readonly onRowMouseLeave: (index: number) => React.MouseEventHandler
  readonly unclickableRows: ReadonlyArray<string>
}
export default function Menu(props: Props) {
  const allRowNames = props.menuPattern.flat()

  return (
    <div className={classes['main']} role='menu'>
      {props.menuPattern.map((rowNames) => (
        <PlainList key={rowNames.join()} role='group'>
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
        </PlainList>
      ))}
    </div>
  )
}
