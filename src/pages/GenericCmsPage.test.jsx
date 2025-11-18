import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import GenericCmsPage from './GenericCmsPage'
import { findMenuByUrl } from '../api'

vi.mock('../api', () => ({
  findMenuByUrl: vi.fn(),
}))

const mockFindMenuByUrl = findMenuByUrl

const renderPage = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/about']}>
        <GenericCmsPage />
      </MemoryRouter>
    </HelmetProvider>
  )

describe('GenericCmsPage', () => {
  let consoleError

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockFindMenuByUrl.mockReset()
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  it('renders CMS content when the API call succeeds', async () => {
    mockFindMenuByUrl.mockResolvedValue({
      success: true,
      data: { title: 'About Mechanics', content: '# Welcome friends' },
    })

    renderPage()

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /about mechanics/i })).toBeInTheDocument()
    )
    expect(mockFindMenuByUrl).toHaveBeenCalledWith(2, '/about')
  })

  it('surfaces an error message when the API call fails', async () => {
    mockFindMenuByUrl.mockRejectedValue(new Error('Network issue'))

    renderPage()

    await waitFor(() =>
      expect(screen.getByText(/network issue/i)).toBeInTheDocument()
    )
  })
})
