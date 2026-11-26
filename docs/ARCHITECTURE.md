# Arquitetura atual

## Fluxo

```text
Formulário React → estado volátil do navegador → findTopic → conteúdo estático
                                                        ↘ sem resultado único
Fonte OMS → apenas navegação externa por iniciativa do utilizador

GitHub Actions → npm ci → audit → lint → cobertura → tsc → build
               → validação de artefactos → E2E em duas bases → Pages (main)
```

Não existem API, base de dados, adaptador de IA, histórico, autenticação, service worker ou armazenamento local. As propostas de integração futura não são funcionalidade implementada.

## Estrutura implementada

```text
src/
  App.tsx                 # formulário, avisos, resultado e estado vazio
  data/topics.ts          # tipos, dois temas e pesquisa lexical pura
  styles.css              # layout responsivo e foco
  main.tsx                # arranque React
  App.test.ts             # pesquisa e integridade estrutural do conteúdo
  App.component.test.tsx  # interações e prevenção de resultados obsoletos
  test-setup.ts           # matchers DOM e limpeza explícita por teste
public/                   # ícone, robots e modelo 404 com CSS externo
scripts/verify-build.mjs   # contratos de segurança e tamanho do build
vite.config.ts            # base, CSP de produção, .nojekyll e 404
vitest.config.ts           # jsdom e cobertura com limiares
playwright.config.ts      # Chromium desktop e viewport mobile
e2e/                     # testes sobre produção com axe-core
.github/workflows/        # verificação, deploy e auditoria periódica
```

## Pesquisa

1. Rejeita consultas acima de 200 caracteres, inclusive fora da UI.
2. Converte para minúsculas em português e remove acentos por NFD.
3. Extrai palavras Unicode; pontuação e espaços são separadores.
4. Compara palavras completas com aliases editoriais explícitos. Não usa substrings nem infere sufixos.
5. Devolve um tema apenas se a correspondência for única. A edição do input apaga resultados anteriores.

`vacinas`, `vacinar` e `vacinações` são aliases de vacinação; `aguaceiro`, `aguado`, `hidratante` e `antivacina` não correspondem. Uma frase que contenha uma palavra suportada continua a poder devolver informação geral: não há compreensão de negação, sintomas ou intenção. A interface explica esta limitação.

## Produção

- `VITE_BASE_PATH`: caminho absoluto local com barra final; predefinido para o repositório Pages.
- CSP em meta antes dos recursos; scripts e CSS apenas do próprio domínio, sem código inline nem conexões da aplicação (`connect-src 'none'`). Só aplicada no build: o HMR exige capacidades adicionais.
- 404 com recursos e ligação inicial ajustados à mesma base. Não é um fallback SPA: a aplicação não tem rotas internas.
- `.nojekyll` gerado para publicação estática direta.
- Verificador impõe até 100 KiB de JavaScript gzip no total. Não se envia runtime de testes, browsers ou relatórios para `dist`.

## Decisões conscientes

Mantém-se uma arquitetura pequena: separar em serviços/componentes vazios não acrescentaria isolamento útil aos dois temas atuais. Node, dependências e Actions são revistos via lockfile, auditoria e Dependabot. Uma infraestrutura ou IA futura exige novo ADR e avaliação de risco; não está implicitamente autorizada por esta arquitetura.
