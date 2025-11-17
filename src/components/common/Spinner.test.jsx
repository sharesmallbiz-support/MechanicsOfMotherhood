import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Spinner from './Spinner'

describe('Spinner Component', () => {
  describe('rendering', () => {
    it('renders spinner element', () => {
      const { container } = render(<Spinner />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('applies default medium size', () => {
      const { container } = render(<Spinner />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toHaveClass('w-8', 'h-8')
    })

    it('applies small size', () => {
      const { container } = render(<Spinner size="sm" />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toHaveClass('w-4', 'h-4')
    })

    it('applies large size', () => {
      const { container } = render(<Spinner size="lg" />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toHaveClass('w-12', 'h-12')
    })

    it('applies extra large size', () => {
      const { container } = render(<Spinner size="xl" />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toHaveClass('w-16', 'h-16')
    })

    it('applies custom className', () => {
      const { container } = render(<Spinner className="custom-class" />)
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('has proper loading indicator styling', () => {
      const { container } = render(<Spinner />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toHaveClass('border-4')
      expect(spinner).toHaveClass('rounded-full')
    })
  })
})
