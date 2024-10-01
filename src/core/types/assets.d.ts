/// <reference types="@svg-use/webpack/client" />

declare module '*.png' {
  const imagePath: string
  export default imagePath
}

declare module '*.svg' {
  const imagePath: string
  export default imagePath
}

declare module '*.webp' {
  const imagePath: string
  export default imagePath
}

declare module '*.yml' {
  const data: never
  export default data
}
