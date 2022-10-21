import { render, screen } from '@testing-library/react'

import ExternalLink from './index.js'

describe('ExternalLink', () => {
  it('should have correct attributes', () => {
    const externalHRef = 'http://duckduckgo.com'
    const name = 'click me'

    render(<ExternalLink href={externalHRef}>{name}</ExternalLink>)

    const anchorElement = screen.getByRole('link', { name })

    expect(anchorElement).toHaveAttribute(
      'rel',
      expect.stringMatching(/noopener/),
    )
    expect(anchorElement).toHaveAttribute(
      'rel',
      expect.stringMatching(/noreferrer/),
    )
    expect(anchorElement).toHaveAttribute('target', '_blank')
  })
})
