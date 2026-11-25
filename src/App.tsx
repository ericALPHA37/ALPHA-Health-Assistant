import { useState } from 'react'

interface Topic {
  title: string
  content: string
  source: string
}

const topics: Topic[] = [
  {
    title: 'Hidratação',
    content: 'A água ajuda a manter funções normais do organismo. As necessidades variam com idade, atividade, clima e condições de saúde. Bebidas açucaradas não substituem uma alimentação equilibrada.',
    source: 'OMS — Água segura e saneamento: https://www.who.int/health-topics/water-sanitation-and-hygiene-wash',
  },
  {
    title: 'Sono',
    content: 'Horários regulares e um ambiente escuro e silencioso podem favorecer o sono. Sono persistente insuficiente ou sonolência diurna merece avaliação profissional.',
    source: 'OMS — Saúde mental: https://www.who.int/health-topics/mental-health',
  },
  {
    title: 'Vacinação',
    content: 'O calendário vacinal depende do país, da idade e das condições individuais. Consulte o programa nacional ou um profissional antes de tomar decisões.',
    source: 'OMS — Vacinas e imunização: https://www.who.int/health-topics/vaccines-and-immunization',
  },
]

function findTopic(query: string): Topic | undefined {
  const normalized = query.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
  return topics.find((topic) => {
    const haystack = `${topic.title} ${topic.content}`.toLower
  
      ()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
    return haystack.includes(normalized) || normalized.split(' ').some((word) => haystack.includes(word))
  })
}

export default function App() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState<Topic | null>(null)
  const [searched, setSearched] = useState(false)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearched(true)
    setAnswer(findTopic(query.trim())) ?? null
  }

  return (
    <main>
      <section className="shell" aria-labelledby="title">
        <header>
          <p className="eyebrow">ALPHA CODE</p>
          <h1 id="title">Health Assistant</h1>
          <p className="subtitle">Informação geral de saúde, estruturada e auditável.</p>
        </header>

        <aside className="notice" role="alert">
          <strong>Aviso importante</strong>
          <p>Esta demonstração não diagnostica, não prescreve e não substitui um profissional de saúde. Em caso de emergência, contacte os serviços locais de urgência.</p>
        </aside>

        <form onSubmit={submit}>
          <label htmlFor="question">Sobre que tema geral deseja informação?</label>
          <div className="search-row">
            <input
              id="question"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: sono, vacinação, hidratação"
              minLength={2}
              required
            />
            <button type="submit">Consultar</button>
          </div>
        </form>

        {answer && (
          <article className="answer" aria-live="polite">
            <span className="badge">Informação local verificada</span>
            <h2>{answer.title}</h2>
            <p>{answer.content}</p>
            <a href={answer.source.split(' — ')[1] || '#'} target="_blank" rel="noreferrer">
              Consultar fonte de referência
            </a>
          </article>
        )}

        {searched && !answer && (
          <p className="empty" role="status">
            Nenhum tema local corresponde à consulta. Este MVP não usa IA nem inventa respostas.
          </p>
        )}

        <footer>Versão 0.1.0 · Sem conta · Sem dados enviados a servidor</footer>
      </section>
    </main>
  )
}
