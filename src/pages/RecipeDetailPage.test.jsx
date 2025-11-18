import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RecipeDetailPage from './RecipeDetailPage'
import { useRecipe } from '../hooks'

vi.mock('../hooks', () => ({
  useRecipe: vi.fn(),
}))

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockUseRecipe = useRecipe

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/recipes/cozy-soup-5']}>
        <Routes>
          <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )

describe('RecipeDetailPage', () => {
  const recipe = {
    id: 5,
    name: 'Cozy Soup',
    description: '## Warm and hearty',
    instructions: 'Simmer gently',
    ingredients: '- carrots',
    tags: ['soup'],
    authorNM: 'Chef Jules',
    imageUrl: 'soup.jpg',
  }

  beforeEach(() => {
    mockNavigate.mockClear()
    mockUseRecipe.mockReset()
    mockUseRecipe.mockReturnValue({ data: { data: recipe }, isLoading: false, error: null })
  })

  it('toggles between details and printable views', async () => {
    const user = userEvent.setup()
    renderPage()

    expect(screen.getByRole('heading', { name: /cozy soup/i })).toBeInTheDocument()

    const toggle = screen.getByRole('button', { name: /print recipe/i })
    await user.click(toggle)

    // Wait for lazy-loaded PrintableRecipe component to render
    expect(await screen.findByRole('button', { name: /← view recipe/i })).toBeInTheDocument()
    // Wait for the Print Recipe button to appear in the printable view
    await screen.findByRole('button', { name: /print recipe/i })
    expect(screen.getAllByRole('button', { name: /print recipe/i })).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: /← view recipe/i }))
    expect(screen.getByRole('heading', { name: /cozy soup/i })).toBeInTheDocument()
  })

  it('navigates back to the recipes list', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /back to recipes/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/recipes')
  })
})
