import * as React from 'react'

import AbsolutePositionContext, {AbsolutePositionContextType} from './AbsolutePositionContext'

interface Props {
  children: React.ReactNode
}
const AbsolutePositionProvider = (props: Props) => {
  const [bodySizeStack, setBodySizeStack] = React.useState<
    AbsolutePositionContextType['bodySizeStack']
  >([])

  const contextValue = React.useMemo(
    (): AbsolutePositionContextType => ({
      bodySizeStack,
      setBodySizeStack
    }),
    [bodySizeStack, setBodySizeStack]
  )

  return (
    <AbsolutePositionContext.Provider value={contextValue}>
      {props.children}
    </AbsolutePositionContext.Provider>
  )
}

export default AbsolutePositionProvider
