import messages from '../../src/core/_locales/en/messages.json'

const hasOwn = <T extends string>(
  object: Record<T, unknown>,
  key: string,
): key is T => {
  return Object.prototype.hasOwnProperty.call(object, key)
}

const i18n: typeof browser.i18n = {
  detectLanguage() {
    throw new Error('Not implemented')
  },
  getAcceptLanguages() {
    throw new Error('Not implemented')
  },
  getMessage(messageName) {
    if (!hasOwn(messages, messageName)) return ''
    return messages[messageName].message
  },
  getUILanguage() {
    throw new Error('Not implemented')
  },
}

export default i18n
