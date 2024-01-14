import type { ComponentType, PropsWithChildren } from 'react'

export default function withProviders<P extends {}>(
  // eslint-disable-next-line functional/prefer-immutable-types
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
