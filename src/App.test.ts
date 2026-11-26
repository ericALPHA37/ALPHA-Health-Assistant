import { describe, expect, it } from 'vitest'
import { findTopic, MAX_QUERY_LENGTH, topics } from './data/topics'

describe('findTopic', () => {
  it.each(['VACINACAO', 'vacinas', 'vacinar', 'vacinações', 'imunização', 'imunizacoes'])('matches explicit vaccination alias %s', (query) => {
    expect(findTopic(query)?.id).toBe('vacinacao')
  })

  it.each(['água potável', 'AGUA', 'águas', 'potáveis', 'hidratação', 'a\u0301gua'])('matches water alias %s', (query) => {
    expect(findTopic(query)?.id).toBe('agua')
  })

  it.each(['vacina,', '(vacina)', 'sobre/vacina', 'vacina—informação', 'quero saber sobre vacina por favor'])('handles word boundaries: %s', (query) => {
    expect(findTopic(query)?.id).toBe('vacinacao')
  })

  it.each(['aguaceiro', 'aguado', 'aguarda', 'hidratante', 'vacinal', 'antivacina', 'sono', 'a', '', '   ', '<script>alert(1)</script>'])('rejects unsupported input: %s', (query) => {
    expect(findTopic(query)).toBeUndefined()
  })

  it('rejects ambiguous queries regardless of topic order', () => {
    expect(findTopic('água e vacinação')).toBeUndefined()
    expect(findTopic('vacinas e hidratação')).toBeUndefined()
    expect(findTopic('vacina vacina')?.id).toBe('vacinacao')
  })

  it('enforces the input length boundary outside the UI too', () => {
    expect(findTopic('vacina'.padEnd(MAX_QUERY_LENGTH, ' '))?.id).toBe('vacinacao')
    expect(findTopic('vacina'.padEnd(MAX_QUERY_LENGTH + 1, ' '))).toBeUndefined()
  })

  it('every topic has a unique ID, explicit WHO HTTPS source and substantive content', () => {
    expect(topics).toHaveLength(2)
    expect(new Set(topics.map((topic) => topic.id)).size).toBe(topics.length)
    for (const topic of topics) {
      const url = new URL(topic.source.url)
      expect(url.protocol).toBe('https:')
      expect(url.hostname).toBe('www.who.int')
      expect(topic.source.label).not.toBe('')
      expect(topic.content.trim().length).toBeGreaterThan(20)
      expect(topic.keywords.length).toBeGreaterThan(0)
      for (const keyword of topic.keywords) expect(findTopic(keyword)).toBe(topic)
    }
  })
})
