/* eslint-disable @typescript-eslint/require-await */

import messages from '../../src/core/_locales/en/messages.json'
import { hasOwn } from './utils/object.js'

type II18n = typeof browser.i18n
class I18n implements II18n {
  public async detectLanguage(): Promise<never> {
    throw new Error('Not implemented')
  }

  public async getAcceptLanguages() {
    return Array.from(navigator.languages)
  }

  public getMessage(messageName: string) {
    if (!hasOwn(messages, messageName)) return ''
    return messages[messageName].message
  }

  public getUILanguage() {
    return navigator.language
  }
}

const i18n = new I18n()
export default i18n
