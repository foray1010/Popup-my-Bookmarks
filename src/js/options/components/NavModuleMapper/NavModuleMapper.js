// @flow
// @jsx createElement

import {createElement} from 'react'

import {
  NAV_MODULE_CONTRIBUTORS,
  NAV_MODULE_CONTROL,
  NAV_MODULE_GENERAL,
  NAV_MODULE_USER_INTERFACE
} from '../../constants'
import Contributors from '../Contributors'
import OptionForm from '../OptionForm'

type Props = {
  selectedNavModule: string
};
const NavModuleMapper = (props: Props) => {
  switch (props.selectedNavModule) {
    case NAV_MODULE_CONTRIBUTORS:
      return <Contributors />

    case NAV_MODULE_CONTROL:
    case NAV_MODULE_GENERAL:
    case NAV_MODULE_USER_INTERFACE:
      return <OptionForm />

    default:
      return null
  }
}

export default NavModuleMapper
