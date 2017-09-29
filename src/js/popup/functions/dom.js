// @flow

import * as css from '../../common/lib/css'
import bookmarkItemStyles from '../../../css/popup/bookmark-item.css'
import editorStyles from '../../../css/popup/editor.css'
import panelStyles from '../../../css/popup/panel.css'
import {getItemIconHeight} from '.'

function getClassSelector(className: string): string {
  // remove class name from compose
  className = className.split(' ')[0]

  return `.${className}`
}

export function resetBodySize(): void {
  const body = document.body
  if (body) {
    // reset to original size
    body.style.height = ''
    body.style.width = ''
  }
}

export function setPredefinedStyleSheet(options: Object): void {
  const {
    fontFamily,
    fontSize,
    setWidth
  }: {
    fontFamily: string,
    fontSize: number,
    setWidth: number
  } = options

  const itemIconHeight: number = getItemIconHeight(options)
  const panelWidthSelector: string = [editorStyles.main, panelStyles.master, panelStyles.slave]
    .map(getClassSelector)
    .join(',')

  css.set({
    body: {
      'font-family': `${fontFamily}, sans-serif`,
      'font-size': `${fontSize}px`
    },
    [getClassSelector(bookmarkItemStyles.icon)]: {
      width: `${itemIconHeight}px`
    },
    [panelWidthSelector]: {
      width: `${setWidth}px`
    }
  })
}

export function tryFocusToSearchInput(): void {
  const searchEl = document.getElementById('search')
  if (searchEl && searchEl !== document.activeElement) {
    searchEl.focus()
  }
}
