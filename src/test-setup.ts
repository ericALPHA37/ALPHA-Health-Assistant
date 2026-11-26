import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest globals=false: registo explícito para garantir isolamento dos testes.
afterEach(cleanup)
