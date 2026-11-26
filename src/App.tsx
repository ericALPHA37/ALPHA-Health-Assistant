import { useState, type FormEvent } from 'react'
import { findTopic, MAX_QUERY_LENGTH } from './data/topics'
import './styles.css'

export default function App() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState<ReturnType<typeof findTopic>>(undefined)
  const [searched, setSearched] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAnswer(findTopic(query.trim()))
    setSearched(true)
  }

  return (
    <main>
      <section className="shell" aria-labelledby="title">
        <header>
          <p className="eyebrow">ALPHA CODE · DEMONSTRAÇÃO</p>
          <h1 id="title">Health Assistant</h1>
          <p className="subtitle">Informação geral de saúde, estruturada e auditável.</p>
        </header>

        <aside className="notice" role="note" aria-label="Aviso importante">
          <strong>Aviso importante</strong>
          <p>Esta demonstração não diagnostica, não prescreve e não substitui um profissional de saúde. Em caso de emergência, contacte os serviços locais de urgência.</p>
          <p>Não interpreta sintomas nem avalia urgências. Conteúdo demonstrativo sem revisão clínica independente.</p>
        </aside>

        <form onSubmit={submit} role="search" aria-label="Temas gerais de saúde">
          <label htmlFor="question">Sobre que tema geral deseja informação?</label>
          <div className="search-row">
            <input
              id="question"
              name="question"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setSearched(false)
                setAnswer(undefined)
              }}
              placeholder="Ex.: vacinação, água potável"
              minLength={2}
              maxLength={MAX_QUERY_LENGTH}
              required
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="search"
              aria-describedby="question-hint"
            />
            <button type="submit">Consultar</button>
          </div>
          <p id="question-hint" className="hint">
            Temas disponíveis: água potável e vacinação. Pesquise um tema de cada vez, até 200 caracteres.
            Pesquisa por palavras-chave, sem interpretação da pergunta. Não introduza dados pessoais ou sintomas.
          </p>
        </form>

        <div role="status" aria-live="polite" aria-atomic="true">
          {answer && (
            <article className="answer" aria-labelledby="answer-title">
              <span className="badge">Informação geral · não personalizada</span>
              <h2 id="answer-title">{answer.title}</h2>
              <p>{answer.content}</p>
              <a href={answer.source.url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
                Consultar: {answer.source.label} (abre noutro separador)
              </a>
            </article>
          )}

          {searched && !answer && (
            <p className="empty">
              Nenhum tema único corresponde à consulta. Experimente «água potável» ou «vacinação», separadamente.
              Esta demonstração não usa IA nem inventa respostas.
            </p>
          )}
        </div>

        <footer>
          Versão 0.1.0 · Sem conta · Sem armazenamento de consultas
          <p>O texto da pesquisa é processado apenas neste navegador. O alojamento e os links externos têm as suas próprias políticas de privacidade.</p>
        </footer>
      </section>
    </main>
  )
}
