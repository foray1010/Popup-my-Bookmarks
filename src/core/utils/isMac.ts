export default function isMac() {
  // use `navigator.userAgentData.platform` in the future when all browsers support it
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  return window.navigator.platform.startsWith('Mac')
}
