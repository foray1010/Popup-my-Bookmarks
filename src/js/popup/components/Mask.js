// @flow strict

import * as R from 'ramda'
import * as React from 'react'
import styled from 'styled-components'

import classes from '../../../css/popup/mask.css'

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
    className={classes.main}
    backgroundColor={props.backgroundColor}
    opacity={props.opacity}
    onClick={props.onClick}
  />
)

export default Mask
