import { useState, type FormEvent } from 'react'
import { findTopic } from './data/topics'
import './styles.css'

export default function App() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState<ReturnType<typeof findTopic>>(undefined)
  const [searched, setSearched] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearched(true)
    setAnswer(findTopic(query.trim()))
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
              placeholder="Ex.: vacinação, água potável"
              minLength={2}
              required
            />
            <button type="submit">Consultar</button>
          </div>
        </form>

        {answer && (
          <article className="answer" aria-live="polite">
            <span className="badge">Informação local com fonte</span>
            <h2>{answer.title}</h2>
            <p>{answer.content}</p>
            <a href={answer.source.url} target="_blank" rel="noopener noreferrer">
              Consultar: {answer.source.label}
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
