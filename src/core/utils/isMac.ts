export default function isMac() {
  // use `navigator.userAgentData.platform` in the future when all browsers support it
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  return globalThis.navigator.platform.startsWith('Mac')
}
