declare module '*.png' {
  const imagePath: string
  export default imagePath
}

declare module '*.svg' {
  const imagePath: string
  export default imagePath
}

declare module '*.svg?svgr' {
  import type { ComponentType, JSX } from 'react'

  const ReactComponent: ComponentType<JSX.IntrinsicElements['svg']>
  export default ReactComponent
}

declare module '*.webp' {
  const imagePath: string
  export default imagePath
}
