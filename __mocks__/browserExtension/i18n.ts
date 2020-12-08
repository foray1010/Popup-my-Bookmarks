import messages from '../../src/core/_locales/en/messages.json'

type Messages = {
  [key: string]:
    | {
        message: string
        description: string
      }
    | undefined
}

const i18n: typeof browser.i18n = {
  // @ts-expect-error
  detectLanguage() {},
  // @ts-expect-error
  getAcceptLanguages() {},
  getMessage(messageName) {
    return (messages as Messages)[messageName]?.message ?? ''
  },
  // @ts-expect-error
  getUILanguage() {},
}

export default i18n
