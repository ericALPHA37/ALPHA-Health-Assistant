import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const input = () => screen.getByRole('searchbox', { name: /sobre que tema geral/i })
const submit = () => screen.getByRole('button', { name: 'Consultar' })

describe('App', () => {
  it('renders the limitations, labelled form and persistent live region', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Health Assistant' })).toBeInTheDocument()
    expect(screen.getByRole('note')).toHaveTextContent(/não diagnostica, não prescreve/i)
    expect(screen.getByRole('note')).toHaveTextContent(/sem revisão clínica independente/i)
    expect(input()).toHaveAttribute('maxlength', '200')
    expect(input()).toBeRequired()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('shows a sourced answer using keyboard submission', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(input(), 'vacinação{Enter}')
    expect(screen.getByRole('status')).toHaveTextContent('Vacinação')
    const link = screen.getByRole('link', { name: /consultar:/i })
    expect(link).toHaveAttribute('href', 'https://www.who.int/health-topics/vaccines-and-immunization')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAttribute('referrerpolicy', 'no-referrer')
  })

  it.each(['sono', 'vacina e água', '   '])('shows no invented answer for %s', async (query) => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(input(), query)
    await user.click(submit())
    expect(screen.getByRole('status')).toHaveTextContent(/nenhum tema único/i)
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('clears stale results when the query changes and permits a new search', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(input(), 'vacina{Enter}')
    expect(screen.getByRole('heading', { name: 'Vacinação' })).toBeInTheDocument()
    await user.clear(input())
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    await user.type(input(), 'água')
    await user.click(submit())
    expect(screen.getByRole('heading', { name: 'Água potável e saúde' })).toBeInTheDocument()
    await user.clear(input())
    await user.type(input(), 'sono{Enter}')
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('does not render user text as HTML even when it includes a valid keyword', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await user.type(input(), '<img src=x onerror=alert(1)> vacina')
    await user.click(submit())
    expect(screen.getByRole('heading', { name: 'Vacinação' })).toBeInTheDocument()
    expect(container.querySelector('img, script')).toBeNull()
  })

  it('rejects overlong programmatic queries as well as limiting normal typing', () => {
    render(<App />)
    fireEvent.change(input(), { target: { value: 'vacina' + ' '.repeat(201) + 'x' } })
    fireEvent.submit(screen.getByRole('search'))
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })
})
