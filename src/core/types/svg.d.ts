declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.svg?svgr' {
  import type * as React from 'react'

  const ReactComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}
