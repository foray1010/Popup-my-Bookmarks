import webExtension from 'webextension-polyfill'

import StylelessButton from '@/core/components/baseItems/StylelessButton/index.js'
import { Component as Cross } from '@/popup/images/cross.svg?svgUse'

import * as classes from './tree-header.module.css'

type Props = Readonly<{
  onClose: () => void
  title: string
}>
export default function TreeHeader(props: Props) {
  return (
    <header className={classes.main}>
      <h1 className={classes.title}>{props.title}</h1>
      <StylelessButton
        aria-label={webExtension.i18n.getMessage('cancel')}
        className={classes['close-button']}
        onClick={props.onClose}
      >
        <Cross aria-hidden className={classes['close-icon']} />
      </StylelessButton>
    </header>
  )
}
