import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorMessage from './ErrorMessage'

describe('ErrorMessage Component', () => {
  describe('rendering', () => {
    it('renders error message when provided', () => {
      render(<ErrorMessage message="Something went wrong" />)
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('does not render when message is null', () => {
      const { container } = render(<ErrorMessage message={null} />)
      expect(container.firstChild).toBeNull()
    })

    it('does not render when message is undefined', () => {
      const { container } = render(<ErrorMessage message={undefined} />)
      expect(container.firstChild).toBeNull()
    })

    it('does not render when message is empty string', () => {
      const { container } = render(<ErrorMessage message="" />)
      expect(container.firstChild).toBeNull()
    })

    it('applies custom className', () => {
      const { container } = render(
        <ErrorMessage message="Error" className="custom-class" />
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('has proper error styling', () => {
      const { container } = render(<ErrorMessage message="Error" />)
      const errorDiv = container.firstChild
      expect(errorDiv).toHaveClass('bg-red-50')
      expect(errorDiv).toHaveClass('border-red-500')
    })

    it('displays error icon', () => {
      render(<ErrorMessage message="Error" />)
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveClass('text-red-500')
    })
  })

  describe('accessibility', () => {
    it('has proper color contrast', () => {
      render(<ErrorMessage message="Error text" />)
      const text = screen.getByText('Error text')
      expect(text).toHaveClass('text-red-700')
    })

    it('uses semantic structure', () => {
      render(<ErrorMessage message="Error occurred" />)
      expect(screen.getByText('Error occurred').tagName).toBe('P')
    })
  })

  describe('edge cases', () => {
    it('handles very long error messages', () => {
      const longMessage = 'This is a very long error message that should still be displayed properly without breaking the layout or causing any issues in the component rendering'
      render(<ErrorMessage message={longMessage} />)
      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })

    it('handles messages with special characters', () => {
      const specialMessage = 'Error: <script>alert("xss")</script>'
      render(<ErrorMessage message={specialMessage} />)
      expect(screen.getByText(specialMessage)).toBeInTheDocument()
    })

    it('handles multiline messages', () => {
      const multilineMessage = 'Line 1\nLine 2\nLine 3'
      const { container } = render(<ErrorMessage message={multilineMessage} />)
      // Check that the component renders with the message
      expect(container.textContent).toContain('Line 1')
      expect(container.textContent).toContain('Line 2')
      expect(container.textContent).toContain('Line 3')
    })
  })
})
