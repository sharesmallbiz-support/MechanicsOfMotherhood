import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './SearchBar'

describe('SearchBar Component', () => {
  describe('rendering', () => {
    it('renders search input and button', () => {
      render(<SearchBar onSearch={vi.fn()} />)
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
    })

    it('uses custom placeholder', () => {
      render(<SearchBar onSearch={vi.fn()} placeholder="Search recipes..." />)
      expect(screen.getByPlaceholderText('Search recipes...')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(
        <SearchBar onSearch={vi.fn()} className="custom-class" />
      )
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('interactions', () => {
    it('updates input value when typing', async () => {
      const user = userEvent.setup()
      render(<SearchBar onSearch={vi.fn()} />)

      const input = screen.getByPlaceholderText('Search...')
      await user.type(input, 'test query')

      expect(input).toHaveValue('test query')
    })

    it('calls onSearch with input value on button click', async () => {
      const handleSearch = vi.fn()
      const user = userEvent.setup()

      render(<SearchBar onSearch={handleSearch} />)

      const input = screen.getByPlaceholderText('Search...')
      const button = screen.getByRole('button', { name: /search/i })

      await user.type(input, 'test query')
      await user.click(button)

      expect(handleSearch).toHaveBeenCalledWith('test query')
    })

    it('calls onSearch on Enter key press', async () => {
      const handleSearch = vi.fn()
      const user = userEvent.setup()

      render(<SearchBar onSearch={handleSearch} />)

      const input = screen.getByPlaceholderText('Search...')
      await user.type(input, 'test query{Enter}')

      expect(handleSearch).toHaveBeenCalledWith('test query')
    })

    it('prevents default form submission', async () => {
      const handleSearch = vi.fn()
      const user = userEvent.setup()

      render(<SearchBar onSearch={handleSearch} />)

      const input = screen.getByPlaceholderText('Search...')
      await user.type(input, 'test{Enter}')

      // Should be called via our handler, not browser default
      expect(handleSearch).toHaveBeenCalledTimes(1)
    })

    it('can be cleared and searched again', async () => {
      const handleSearch = vi.fn()
      const user = userEvent.setup()

      render(<SearchBar onSearch={handleSearch} />)

      const input = screen.getByPlaceholderText('Search...')
      const button = screen.getByRole('button', { name: /search/i })

      await user.type(input, 'first search')
      await user.click(button)
      expect(handleSearch).toHaveBeenCalledWith('first search')

      await user.clear(input)
      await user.type(input, 'second search')
      await user.click(button)
      expect(handleSearch).toHaveBeenCalledWith('second search')
      expect(handleSearch).toHaveBeenCalledTimes(2)
    })

    it('can search with empty string', async () => {
      const handleSearch = vi.fn()
      const user = userEvent.setup()

      render(<SearchBar onSearch={handleSearch} />)

      const button = screen.getByRole('button', { name: /search/i })
      await user.click(button)

      expect(handleSearch).toHaveBeenCalledWith('')
    })
  })

  describe('accessibility', () => {
    it('has proper form structure', () => {
      const { container } = render(<SearchBar onSearch={vi.fn()} />)
      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('search button is keyboard accessible', async () => {
      const handleSearch = vi.fn()
      const user = userEvent.setup()

      render(<SearchBar onSearch={handleSearch} />)

      const button = screen.getByRole('button', { name: /search/i })
      button.focus()
      await user.keyboard('{Enter}')

      expect(handleSearch).toHaveBeenCalled()
    })
  })
})
