declare module 'transifex' {
  interface Transifex {
    // eslint-disable-next-line @typescript-eslint/no-misused-new
    new (options: {
      readonly credential: string
      readonly project_slug?: string
    }): Transifex

    statisticsMethodsAsync(
      projectSlug: string,
      resourceSlug: string,
      languageCode?: string,
    ): Promise<ReadonlyArray<string>>

    translationInstanceMethodAsync(
      projectSlug: string,
      resourceSlug: string,
      availableLanguage: string,
      options?: { readonly mode?: string },
    ): Promise<string>
  }

  const transifex: Transifex
  export default transifex
}
