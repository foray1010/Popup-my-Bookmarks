import { render, screen } from '@testing-library/react'

import PlainList from '.'

describe('PlainList', () => {
  it('should have computed style `list-style: none`', () => {
    const testId = 'testId'

    render(<PlainList data-testid={testId} />)

    expect(window.getComputedStyle(screen.getByTestId(testId)).listStyle).toBe(
      'none',
    )
  })
})
