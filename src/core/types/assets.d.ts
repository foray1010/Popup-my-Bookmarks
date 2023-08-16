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

  const ReactComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module '*.webp' {
  const imagePath: string
  export default imagePath
}
