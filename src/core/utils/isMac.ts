export default function isMac() {
  // use `navigator.userAgentData.platform` in the future when all browsers support it
  return globalThis.navigator.platform.startsWith('Mac')
}
