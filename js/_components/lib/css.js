function propEach(obj, fn) {
  for (const propName of Object.keys(obj)) {
    fn(propName, obj[propName])
  }
}

const css = (() => {
  const styleEl = document.createElement('style')

  document.head.appendChild(styleEl)

  const sheet = styleEl.sheet

  const set = (param1, param2) => {
    const _action = (styleSelector, styleList) => {
      let styleValue = ''

      propEach(styleList, (propName, propValue) => {
        styleValue += `${propName}:${propValue};`
      })

      sheet.insertRule(
        styleSelector + '{' + styleValue + '}',
        sheet.cssRules.length
      )
    }

    if (param2 === undefined) {
      propEach(param1, _action)
    } else {
      _action(param1, param2)
    }
  }

  const unsetAll = () => {
    while (sheet.cssRules[0]) {
      sheet.deleteRule(0)
    }
  }

  return {set, unsetAll}
})()

export default css
