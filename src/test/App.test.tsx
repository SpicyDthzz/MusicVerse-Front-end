import { render, screen } from '@testing-library/react'
import App from '../App'
import { describe, expect, it } from 'vitest'

describe('App component', () => {
  it('debería renderizar el texto MusicVerse', () => {
    render(<App />)
    const elementos = screen.getAllByText('MusicVerse')
    expect(elementos.length).toBeGreaterThan(0)  
  })
})