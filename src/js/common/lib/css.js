/* @flow */

import R from 'ramda'

const sheet: Object = genStyleEl().sheet

function genStyleEl(): Object {
  const styleEl = document.createElement('style')

  if (!document.head) throw new Error() // it should never happen
  document.head.appendChild(styleEl)

  return styleEl
}

export const set = (styleList: Object): void => {
  R.forEachObjIndexed((
    props: Object,
    styleSelector: string
  ): void => {
    let styleValue: string = ''

    R.forEachObjIndexed((
      propValue: number | string,
      propName: string
    ): void => {
      styleValue += `${propName}:${propValue};`
    }, props)

    sheet.insertRule(
      styleSelector + '{' + styleValue + '}',
      sheet.cssRules.length
    )
  }, styleList)
}

export const unsetAll = (): void => {
  while (sheet.cssRules[0]) {
    sheet.deleteRule(0)
  }
}
