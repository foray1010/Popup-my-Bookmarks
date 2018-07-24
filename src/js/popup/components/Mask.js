// @flow strict @jsx createElement

import '../../../css/popup/mask.css'

import * as R from 'ramda'
import {createElement} from 'react'
import styled from 'styled-components'

const Main = styled('div')`
  background-color: ${R.prop('backgroundColor')};
  opacity: ${R.prop('opacity')};
`

type Props = {|
  backgroundColor: string,
  onClick: () => void,
  opacity: number
|}
const Mask = (props: Props) => (
  <Main
    styleName='main'
    backgroundColor={props.backgroundColor}
    opacity={props.opacity}
    onClick={props.onClick}
  />
)

export default Mask
