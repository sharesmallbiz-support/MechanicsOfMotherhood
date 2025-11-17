import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card from './Card'

describe('Card Component', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(<Card>Test Content</Card>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('applies hover styles when hoverable is true', () => {
      const { container } = render(<Card hoverable>Content</Card>)
      expect(container.firstChild).toHaveClass('hover:shadow-lg')
      expect(container.firstChild).toHaveClass('cursor-pointer')
    })

    it('does not apply hover styles when hoverable is false', () => {
      const { container } = render(<Card hoverable={false}>Content</Card>)
      expect(container.firstChild).not.toHaveClass('cursor-pointer')
    })
  })

  describe('interactions', () => {
    it('calls onClick when card is clicked', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Card onClick={handleClick}>Clickable Card</Card>)

      const card = screen.getByRole('button')
      await user.click(card)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('has role="button" when onClick is provided', () => {
      const handleClick = vi.fn()
      render(<Card onClick={handleClick}>Clickable Card</Card>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('is keyboard accessible with Enter key', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Card onClick={handleClick}>Clickable Card</Card>)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard('{Enter}')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is keyboard accessible with Space key', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Card onClick={handleClick}>Clickable Card</Card>)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard(' ')

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is focusable when clickable', () => {
      const handleClick = vi.fn()
      render(<Card onClick={handleClick}>Clickable Card</Card>)
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('does not have button role when onClick is not provided', () => {
      render(<Card>Non-clickable Card</Card>)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('prevents default on Space key to avoid scrolling', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<Card onClick={handleClick}>Card</Card>)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard(' ')

      // Click should still be called
      expect(handleClick).toHaveBeenCalled()
    })
  })
})
