import { render, screen } from '@testing-library/react'
import { Button } from '../components/ui/button'
import { describe, expect, it } from 'vitest'

describe('Button component', () => {
  it('debería renderizar el botón correctamente', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
