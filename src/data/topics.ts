export const MAX_QUERY_LENGTH = 200

export interface Topic {
  readonly id: string
  readonly title: string
  readonly content: string
  readonly keywords: readonly string[]
  readonly source: {
    readonly label: string
    readonly url: string
  }
}

// Conteúdo demonstrativo, não validado por revisão clínica independente.
// As URLs são referências editoriais, não provas de revisão da aplicação pela OMS.
export const topics: readonly Topic[] = [
  {
    id: 'agua',
    title: 'Água potável e saúde',
    content: 'Água contaminada pode transmitir doenças. A segurança da água depende da sua origem e do tratamento local. Consulte as autoridades de saúde ou abastecimento da sua região para orientações específicas.',
    keywords: ['água', 'águas', 'potável', 'potáveis', 'hidratação'],
    source: {
      label: 'Organização Mundial da Saúde — Água potável',
      url: 'https://www.who.int/news-room/fact-sheets/detail/drinking-water',
    },
  },
  {
    id: 'vacinacao',
    title: 'Vacinação',
    content: 'As vacinas ajudam a prevenir doenças e protegem pessoas e comunidades. O calendário recomendado varia por país, idade e situação individual. Consulte o programa nacional de vacinação ou um profissional de saúde.',
    keywords: ['vacina', 'vacinas', 'vacinar', 'vacinação', 'vacinações', 'imunização', 'imunizações'],
    source: {
      label: 'Organização Mundial da Saúde — Imunização',
      url: 'https://www.who.int/health-topics/vaccines-and-immunization',
    },
  },
]

function normalize(value: string): string {
  return value.toLocaleLowerCase('pt').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Pesquisa lexical, não compreensão de sintomas, intenção ou negação.
 * Apenas palavras completas e variantes editoriais explícitas: não se
 * deduzem flexões arbitrárias ("aguado", "vacinal" não são aliases).
 */
export function findTopic(query: string): Topic | undefined {
  if (query.length > MAX_QUERY_LENGTH) return undefined
  const tokens = new Set(normalize(query).match(/[\p{L}\p{N}]+/gu) ?? [])
  const matches = topics.filter((topic) =>
    topic.keywords.some((keyword) => tokens.has(normalize(keyword))),
  )
  // Não escolher silenciosamente o primeiro tema de uma consulta ambígua.
  return matches.length === 1 ? matches[0] : undefined
}
