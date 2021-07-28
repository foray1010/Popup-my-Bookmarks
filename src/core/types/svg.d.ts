declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.svg?svgr' {
  import * as React from 'react'

  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}
