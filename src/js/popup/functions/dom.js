/* @flow */

import {
  getItemHeight,
  getItemOffsetHeight
} from '.'
import * as css from '../../common/lib/css'

import bookmarkItemStyles from '../../../css/popup/bookmark-item.css'
import bookmarkTreeStyles from '../../../css/popup/bookmark-tree.css'
import editorStyles from '../../../css/popup/editor.css'
import panelStyles from '../../../css/popup/panel.css'

export function getBookmarkListEls(): Object[] {
  const getBookmarkListElsFromPanel = (...args: string[]): Object[] => {
    const selector: string = args
      .map(getClassSelector)
      .join(' > ')
    const els: NodeList<*> = document.querySelectorAll(selector)
    return Array.from(els)
  }

  const bookmarkListElsInMaster: Object[] = getBookmarkListElsFromPanel(
    panelStyles.master,
    bookmarkTreeStyles.main,
    bookmarkTreeStyles.list
  )
  const bookmarkListElsInSlave: Object[] = getBookmarkListElsFromPanel(
    panelStyles.slave,
    bookmarkTreeStyles.main,
    bookmarkTreeStyles.list
  )

  // it should NEVER happen
  if (
    bookmarkListElsInMaster.length < bookmarkListElsInSlave.length ||
    bookmarkListElsInMaster.length - bookmarkListElsInSlave.length > 1
  ) {
    throw new Error()
  }

  const bookmarkListEls: Object[] = []
  const totalLength: number = bookmarkListElsInMaster.length + bookmarkListElsInSlave.length
  for (let i: number = 0; i < totalLength; i += 1) {
    const el: Object = i % 2 === 0 ?
      bookmarkListElsInMaster.shift() :
      bookmarkListElsInSlave.shift()
    bookmarkListEls.push(el)
  }

  return bookmarkListEls
}

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

export function scrollIntoViewIfNeeded(el: Object): void {
  const {
    bottom,
    top
  } = el.getBoundingClientRect()

  const {
    height: parentHeight,
    top: parentTop
  }: {
    height: number,
    top: number
  } = el.parentNode.getBoundingClientRect()

  const isScrolledOutOfBottomView: boolean = bottom > parentTop + parentHeight
  const isScrolledOutOfTopView: boolean = top < parentTop

  if (isScrolledOutOfBottomView || isScrolledOutOfTopView) {
    el.scrollIntoView(isScrolledOutOfTopView)
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

  const itemHeight: number = getItemHeight(options)
  const itemOffsetHeight: number = getItemOffsetHeight(options)
  const panelWidthSelector: string = [
    editorStyles.main,
    panelStyles.master,
    panelStyles.slave
  ]
    .map(getClassSelector)
    .join(',')

  css.set({
    body: {
      'font-family': fontFamily,
      'font-size': `${fontSize}px`
    },
    [getClassSelector(bookmarkItemStyles.icon)]: {
      // set the width same as item height, as it is a square
      width: `${itemHeight}px`
    },
    [getClassSelector(bookmarkItemStyles.main)]: {
      height: `${itemHeight}px`
    },
    [getClassSelector(bookmarkItemStyles.separator)]: {
      // set separator height depend on item height
      height: `${itemOffsetHeight / 2}px`
    },
    [panelWidthSelector]: {
      width: `${setWidth}px`
    }
  })
}
