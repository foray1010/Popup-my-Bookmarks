import {
  getItemHeight,
  getItemOffsetHeight
} from '.'

import css from '../../common/lib/css'

export function resetBodySize() {
  const bodyStyle = document.body.style

  // reset to original size
  bodyStyle.height = ''
  bodyStyle.width = ''
}

export function scrollIntoViewIfNeeded(el) {
  const {
    bottom,
    top
  } = el.getBoundingClientRect()

  const {
    height: parentHeight,
    top: parentTop
  } = el.parentNode.getBoundingClientRect()

  const isScrolledOutOfBottomView = bottom > parentTop + parentHeight
  const isScrolledOutOfTopView = top < parentTop

  if (isScrolledOutOfBottomView || isScrolledOutOfTopView) {
    el.scrollIntoView(isScrolledOutOfTopView)
  }
}

export function setPredefinedStyleSheet(options) {
  const {
    fontFamily,
    fontSize,
    setWidth
  } = options

  const itemHeight = getItemHeight(options)
  const itemOffsetHeight = getItemOffsetHeight(options)

  css.set({
    body: {
      'font-family': fontFamily,
      'font-size': `${fontSize}px`
    },
    '.bookmark-item': {
      height: `${itemHeight}px`
    },
    '.icon': {
      // set the width same as item height, as it is a square
      width: `${itemHeight}px`
    },
    '.panel-width': {
      // set panel (#main, #sub) width
      width: `${setWidth}px`
    },
    '.separator': {
      // set separator height depend on item height
      height: `${itemOffsetHeight / 2}px`
    }
  })
}
