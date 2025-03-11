import type { ComponentType, PropsWithChildren } from 'react'

export default function withProviders<P extends {}>(
  InnerComponent: ComponentType<P>,
  Providers: readonly ComponentType<PropsWithChildren>[],
) {
  return function ComponentWithProviders(props: P) {
    return Providers.reduceRight(
      (acc, Provider) => {
        return <Provider>{acc}</Provider>
      },
      <InnerComponent {...props} />,
    )
  }
}
