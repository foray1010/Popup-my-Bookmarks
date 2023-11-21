declare module '*.png' {
  const imagePath: string
  export default imagePath
}

declare module '*.svg' {
  const imagePath: string
  export default imagePath
}

declare module '*.svg?svgr' {
  import type * as React from 'react'

  const ReactComponent: React.ComponentType<React.JSX.IntrinsicElements['svg']>
  export default ReactComponent
}

declare module '*.webp' {
  const imagePath: string
  export default imagePath
}
