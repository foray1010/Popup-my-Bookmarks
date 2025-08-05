import type { Compilation, Compiler, RspackPluginInstance } from '@rspack/core'

export class GenerateJsonPlugin implements RspackPluginInstance {
  #json: unknown
  #filename: string

  public constructor({ json, filename }: { json: unknown; filename: string }) {
    this.#json = json
    this.#filename = filename
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.emit.tap(
      'GenerateJsonPlugin',
      (compilation: Compilation) => {
        const manifestJson = JSON.stringify(this.#json, null, 2)

        // @ts-expect-error Seems the additional properties are not required
        compilation.assets[this.#filename] = {
          source: () => manifestJson,
          size: () => manifestJson.length,
        }
      },
    )
  }
}
