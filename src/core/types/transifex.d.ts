declare module 'transifex' {
  interface Transifex {
    // eslint-disable-next-line @typescript-eslint/no-misused-new
    new (options: { credential: string; project_slug?: string }): Transifex

    statisticsMethodsAsync(
      projectSlug: string,
      resourceSlug: string,
      languageCode?: string,
    ): Promise<Array<string>>

    translationInstanceMethodAsync(
      projectSlug: string,
      resourceSlug: string,
      availableLanguage: string,
      options?: { mode?: string },
    ): Promise<string>
  }

  const transifex: Transifex
  export default transifex
}
