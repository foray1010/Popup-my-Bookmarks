import messages from '../../src/core/_locales/en/messages.json'

type Messages = Record<
  string,
  | {
      readonly message: string
      readonly description: string
    }
  | undefined
>

const i18n: typeof browser.i18n = {
  detectLanguage() {
    throw new Error('Not implemented')
  },
  getAcceptLanguages() {
    throw new Error('Not implemented')
  },
  getMessage(messageName) {
    return (messages as Messages)[messageName]?.message ?? ''
  },
  getUILanguage() {
    throw new Error('Not implemented')
  },
}

export default i18n
