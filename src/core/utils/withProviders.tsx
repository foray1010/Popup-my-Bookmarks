import type * as React from 'react'

export default function withProviders<P extends {}>(
  InnerComponent: React.ComponentType<P>,
  Providers: React.ComponentType<{ children?: React.ReactNode }>[],
) {
  return function ComponentWithProviders(props: P) {
    return Providers.reduceRight((acc, Provider) => {
      return <Provider>{acc}</Provider>
    }, <InnerComponent {...props} />)
  }
}
