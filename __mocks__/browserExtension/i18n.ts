/* eslint-disable @typescript-eslint/require-await */

import messages from '@/core/_locales/en/messages.json'

class I18n implements Readonly<typeof browser.i18n> {
  public async detectLanguage(): Promise<never> {
    throw new Error('Not implemented')
  }

  public async getAcceptLanguages() {
    return Array.from(navigator.languages)
  }

  public getMessage(messageName: string) {
    if (!Object.hasOwn(messages, messageName)) return ''
    return messages[messageName as keyof typeof messages].message
  }

  public getUILanguage() {
    return navigator.language
  }
}

const i18n = new I18n()
export default i18n
