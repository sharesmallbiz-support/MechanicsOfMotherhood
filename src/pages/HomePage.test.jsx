import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import HomePage from './HomePage'
import { useRecipes, useWebsiteConfig } from '../hooks'

vi.mock('../hooks', () => ({
  useRecipes: vi.fn(),
  useWebsiteConfig: vi.fn(),
}))

const mockUseRecipes = useRecipes
const mockUseWebsiteConfig = useWebsiteConfig

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </HelmetProvider>
  )

describe('HomePage', () => {
  beforeEach(() => {
    mockUseRecipes.mockReset()
    mockUseWebsiteConfig.mockReset()
  })

  it('renders hero content and featured recipes', () => {
    mockUseWebsiteConfig.mockReturnValue({
      data: { data: { websiteTitle: 'Mechanics HQ', description: 'Fresh meals' } },
    })
    mockUseRecipes.mockReturnValue({
      data: {
        data: [
          { id: 1, name: 'Herb Pasta', description: 'Tasty', servings: 4, authorNM: 'Chef' },
        ],
      },
      isLoading: false,
      error: null,
    })

    renderPage()

    expect(screen.getByRole('heading', { name: /mechanics hq/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /featured recipes/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explore all recipes/i })).toHaveAttribute('href', '/recipes')
    expect(screen.getByText('Herb Pasta')).toBeInTheDocument()
  })
})
