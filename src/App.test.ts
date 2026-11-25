import { describe, expect, it } from 'vitest'
import { findTopic } from './data/topics'

describe('findTopic', () => {
  it('finds a topic independent of accents and case', () => {
    expect(findTopic('VACINACAO')?.title).toBe('Vacinação')
    expect(findTopic('água potável')?.title).toBe('Água potável e saúde')
  })

  it('returns no result for unsupported topics or short input', () => {
    expect(findTopic('sono')).toBeUndefined()
    expect(findTopic('a')).toBeUndefined()
    expect(findTopic('   ')).toBeUndefined()
  })

  it('includes a secure, explicit source URL for every supported result', () => {
    for (const query of ['vacinas', 'hidratação']) {
      const result = findTopic(query)
      expect(result?.source.url).toMatch(/^https:\/\//)
    }
  })
})
