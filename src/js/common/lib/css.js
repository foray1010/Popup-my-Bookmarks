// @flow

import R from 'ramda'

const genStyleSheet = (): CSSStyleSheet => {
  const styleEl: Object = document.createElement('style')

  if (!document.head) throw new Error() // it should never happen
  document.head.appendChild(styleEl)

  return styleEl.sheet
}

const sheet = genStyleSheet()
export default (styleList: Object): void => {
  R.forEachObjIndexed((props: Object, styleSelector: string): void => {
    const styleValue: string = R.compose(
      R.reduce(
        (acc, [propName: string, propValue: number | string]) => acc + `${propName}:${propValue};`,
        ''
      ),
      R.toPairs
    )(props)

    sheet.insertRule(`${styleSelector}{${styleValue}}`, sheet.cssRules.length)
  }, styleList)
}
