# Registo de criação e validação

## 2026-11-25 — criação inicial

1. Repositório público, licença MIT e arquitetura React + Vite + TypeScript.
2. Decisão de modo local-first e documentação de limites de diagnóstico/prescrição.
3. Interface local com dois tópicos, fontes e testes iniciais.

O registo original indicava que não tinha havido execução local nessa sessão. Essa limitação histórica não deve ser confundida com a validação abaixo.

## 2026-11-26 — auditoria e melhoria técnica

### Problemas confirmados antes das correções

- Ausência de lockfile e uso de `npm install` no CI.
- `npm audit` com três vulnerabilidades no conjunto anterior de ferramentas de teste.
- Pesquisa por substring com falsos positivos; três testes iniciais apenas.
- Ausência de CSP/favicon/404 e Actions dependentes de tags mutáveis.
- Documentação com estrutura apenas planeada, histórico não implementado e instruções inconsistentes.

### Correções implementadas

- Lockfile, `npm ci`, ambiente Node declarado, configuração editorial e dependências atualizadas em conjunto.
- Pesquisa por palavras completas/aliases explícitos, limite de 200 caracteres, rejeição de consultas ambíguas e remoção de resultado obsoleto ao editar.
- Avisos de segurança clínica, limites do catálogo, privacidade descrita sem prometer anonimato, fontes externas com referrer suprimido.
- Região de resultados persistente para tecnologia assistiva, contraste/foco melhorados e layout responsivo.
- CSP de produção no índice e 404, CSS externo, favicon, `.nojekyll`, base configurável e verificador de artefactos/orçamento JS.
- Testes de componentes e navegador, limiares de cobertura, Actions fixadas por SHA, permissões mínimas, gates em PRs, auditoria semanal e Dependabot.
- Documentação atualizada para separar implementação, propostas futuras e requisitos clínicos ainda por cumprir. Links relativos do índice ADR corrigidos.
- Não se publicou `security.txt` com contacto não confirmado.

### Validação executada neste ambiente

Node **22.22.3**, npm **10.9.8**; instalação limpa com `npm ci` bem-sucedida.

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | Passou |
| `npm run test:coverage` | 39/39 testes; 100% statements/branches/functions/lines em `App.tsx` e `data/topics.ts` |
| `npm run build` | TypeScript e Vite passaram |
| `npm run verify:build` | CSP antes dos recursos, ficheiros presentes, 404/base corretos, `.nojekyll` presente |
| JavaScript comprimido pelo verificador | 69 614 bytes gzip; abaixo do orçamento de 100 KiB |
| E2E em `/ALPHA-Health-Assistant/` | 10/10: Chromium desktop e viewport mobile |
| E2E em `/` | 10/10; build Pages restaurado no fim |
| axe-core | Sem violações detetadas nos estados inicial, resultado e vazio nos dois viewports/bases |
| CSP real no browser | Injeção de script inline e fetch bloqueados |
| Pesquisa no browser | Sem erros JS/CSP na utilização normal e sem pedidos de rede causados pela consulta |
| `npm audit --audit-level=moderate` | 0 vulnerabilidades conhecidas no momento da execução |

A cobertura exclui o ponto de arranque `main.tsx` e o setup de testes; não mede correção clínica nem todos os cenários possíveis. Mobile é emulação Chromium, não um dispositivo físico. Os testes não substituem avaliação manual com tecnologias assistivas, Firefox/Safari ou revisão clínica.

### Particularidades e pendências externas

O ambiente tem acesso de rede restrito. Para os testes locais usou-se Chromium distribuído via pacote npm `@sparticuz/chromium`, com bibliotecas extraídas em caminhos ignorados e `E2E_CHROMIUM_PATH`/`LD_LIBRARY_PATH`. Isto não faz parte das dependências da aplicação nem do lockfile; o CI instala o Chromium oficial do Playwright.

Não se confirmou disponibilidade/atualização das páginas OMS, revisão clínica, configuração efetiva de Pages, regras de proteção, reporting privado ou execução remota dos novos workflows. Estes itens requerem acesso às fontes e/ou configuração pelo mantenedor; não são garantidos por testes locais.
