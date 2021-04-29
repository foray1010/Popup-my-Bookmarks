import { render, screen } from '@testing-library/react'

import StylelessElement from '.'

describe('StylelessElement', () => {
  it('should have computed style `display: contents`', () => {
    const testId = 'testId'

    render(<StylelessElement data-testid={testId} />)

    expect(window.getComputedStyle(screen.getByTestId(testId)).display).toBe(
      'contents',
    )
  })
})
