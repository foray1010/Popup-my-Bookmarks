// @flow strict @jsx createElement

import * as R from 'ramda'
import {Fragment, createElement} from 'react'
import {Helmet} from 'react-helmet'
import {connect} from 'react-redux'

import App from './App'
import withMouseEvents from './withMouseEvents'

type Props = {|
  isShowEditor: boolean,
  isShowMenu: boolean,
  options: Object
|}
const AppContainer = (props: Props) => (
  <Fragment>
    <Helmet>
      <style>
        {`
          body {
            font-family: ${props.options.fontFamily}, sans-serif;
            font-size: ${props.options.fontSize}px;
          }
        `}
      </style>
    </Helmet>
    <App isShowEditor={props.isShowEditor} isShowMenu={props.isShowMenu} />
  </Fragment>
)

const mapStateToProps = (state) => ({
  isShowEditor: Boolean(state.editor.targetId),
  isShowMenu: Boolean(state.menu.targetId),
  options: state.options
})

export default R.compose(
  withMouseEvents,
  connect(mapStateToProps)
)(AppContainer)
