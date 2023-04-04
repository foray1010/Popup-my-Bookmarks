/* eslint-disable @typescript-eslint/require-await, import/no-nodejs-modules */

import path from 'node:path'

type IRuntime = Partial<typeof browser.runtime>
class Runtime implements IRuntime {
  public getURL(subPath: string) {
    return path.join(
      'chrome-extension://apidhijjdkkimhbifblnemkcnmhellkf',
      subPath,
    )
  }

  public async openOptionsPage() {
    window.close()
  }
}

const runtime = new Runtime() as typeof browser.runtime
export default runtime
