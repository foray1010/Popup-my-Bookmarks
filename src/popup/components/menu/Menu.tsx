import type * as React from 'react'

import PlainList from '../../../core/components/baseItems/PlainList'
import type { MenuPattern } from '../../types'
import classes from './menu.module.css'
import MenuRow from './MenuRow'

interface Props {
  readonly highlightedIndex?: number
  readonly menuPattern: MenuPattern
  readonly onRowClick: React.MouseEventHandler
  readonly onRowMouseEnter: (index: number) => React.MouseEventHandler
  readonly onRowMouseLeave: (index: number) => React.MouseEventHandler
  readonly unclickableRows: ReadonlyArray<string>
}
export default function Menu(props: Props) {
  const allRowNames = props.menuPattern.flat()

  return (
    <PlainList className={classes.main}>
      {props.menuPattern.map((rowNames) => (
        <li key={rowNames.join()}>
          <PlainList>
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
        </li>
      ))}
    </PlainList>
  )
}
