export interface Topic {
  title: string
  content: string
  keywords: string[]
  source: {
    label: string
    url: string
  }
}

export const topics: Topic[] = [
  {
    title: 'Água potável e saúde',
    content: 'Água contaminada pode transmitir doenças. A segurança da água depende da sua origem e do tratamento local. Consulte as autoridades de saúde ou abastecimento da sua região para orientações específicas.',
    keywords: ['água', 'agua', 'potável', 'potavel', 'hidratação', 'hidratacao'],
    source: {
      label: 'Organização Mundial da Saúde — Água potável',
      url: 'https://www.who.int/news-room/fact-sheets/detail/drinking-water',
    },
  },
  {
    title: 'Vacinação',
    content: 'As vacinas ajudam a prevenir doenças e protegem pessoas e comunidades. O calendário recomendado varia por país, idade e situação individual. Consulte o programa nacional de vacinação ou um profissional de saúde.',
    keywords: ['vacina', 'vacinação', 'vacinacao', 'vacinas', 'imunização', 'imunizacao'],
    source: {
      label: 'Organização Mundial da Saúde — Imunização',
      url: 'https://www.who.int/health-topics/vaccines-and-immunization',
    },
  },
]

function normalize(value: string): string {
  return value.toLocaleLowerCase('pt').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function findTopic(query: string): Topic | undefined {
  const normalizedQuery = normalize(query.trim())
  if (normalizedQuery.length < 2) return undefined

  return topics.find((topic) =>
    topic.keywords.some((keyword) => normalizedQuery.includes(normalize(keyword))),
  )
}
