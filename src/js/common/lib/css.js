import _forEach from 'lodash/forEach'

const sheet = genStyleEl().sheet

function genStyleEl() {
  const styleEl = document.createElement('style')

  document.head.appendChild(styleEl)

  return styleEl
}

export const set = (param1, param2) => {
  const _action = (styleList, styleSelector) => {
    let styleValue = ''

    _forEach(styleList, (propValue, propName) => {
      styleValue += `${propName}:${propValue};`
    })

    sheet.insertRule(
      styleSelector + '{' + styleValue + '}',
      sheet.cssRules.length
    )
  }

  if (param2 === undefined) {
    _forEach(param1, _action)
  } else {
    _action(param1, param2)
  }
}

export const unsetAll = () => {
  while (sheet.cssRules[0]) {
    sheet.deleteRule(0)
  }
}
