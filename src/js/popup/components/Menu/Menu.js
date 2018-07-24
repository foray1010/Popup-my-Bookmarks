// @flow strict @jsx createElement

import '../../../../css/popup/menu.css'

import {createElement} from 'react'

import type {MenuPattern} from '../../types'
import MenuRow from './MenuRow'

// disable some no-unused-prop-types checking
// because eslint-plugin-react 7.7.0 gives false alarm on nested function in functional component
type Props = {|
  focusedRow: string, // eslint-disable-line react/no-unused-prop-types
  menuPattern: MenuPattern,
  onRowClick: (string) => () => void, // eslint-disable-line react/no-unused-prop-types
  onRowMouseEnter: (string) => () => void, // eslint-disable-line react/no-unused-prop-types
  onRowMouseLeave: () => void, // eslint-disable-line react/no-unused-prop-types
  unclickableRows: Array<string> // eslint-disable-line react/no-unused-prop-types
|}
const Menu = (props: Props) => (
  <div styleName='main'>
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
