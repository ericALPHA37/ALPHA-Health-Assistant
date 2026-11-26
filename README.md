# ALPHA Health Assistant

Demonstração gratuita e auditável de **pesquisa local de informação geral de saúde** em português, construída com React, TypeScript e Vite.

> **Não é um serviço clínico.** Não diagnostica, não prescreve, não interpreta sintomas ou exames e não faz triagem. Em caso de emergência, contacte os serviços locais de urgência. O conteúdo ainda não passou por revisão clínica independente.

## O que existe hoje

- Dois temas demonstrativos: **água potável** e **vacinação**, com referências da OMS.
- Pesquisa por palavras completas e variantes explicitamente definidas, sem IA, sem interpretação de intenção ou negação.
- Consultas com vários temas ou sem correspondência não produzem resposta.
- Sem contas, cookies, analytics, histórico ou armazenamento de consultas. O texto é processado no navegador; não existe backend de aplicação.
- Interface responsiva, região de resultados acessível, navegação por teclado e fontes externas identificadas.
- Build com CSP restritiva, página 404 e caminho de publicação configurável.
- CI para pull requests e publicação no GitHub Pages apenas a partir de `main`, após as verificações.

As referências não significam validação da aplicação pela OMS. O alojamento recebe pedidos dos ficheiros estáticos (e pode registar IP e metadados); ao abrir uma fonte, aplica-se a política do site externo. Não é uma PWA e não garante funcionamento offline numa visita posterior.

## Inicialização rápida

Requisitos: **Node.js 22.12+ na linha 22** (ver `.nvmrc`) ou Node.js 24+, e npm 10+.

```bash
npm ci
npm run dev
```

Abra `http://localhost:5173/ALPHA-Health-Assistant/`. O servidor de desenvolvimento escuta em todas as interfaces para suportar ambientes de preview; não o exponha em redes não confiáveis.

## Verificação

```bash
npm run check                      # lint, cobertura, TypeScript, build e artefactos
npx playwright install --with-deps chromium
npm run test:e2e                    # Chromium desktop + viewport mobile
npm audit --audit-level=moderate
```

O E2E testa o **build de produção**, não o servidor HMR. Execute `npm run build` após alterações antes de voltar a testar. `npm run check` não instala browsers nem executa E2E.

| Script | Finalidade |
| --- | --- |
| `npm run dev` | Desenvolvimento com HMR |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:watch` | Testes unitários e de componentes |
| `npm run test:coverage` | Cobertura V8, mínimo 95% dos módulos incluídos |
| `npm run build` | Verificação TypeScript + produção |
| `npm run verify:build` | CSP, recursos, bases, 404, `.nojekyll` e orçamento JS gzip |
| `npm run preview` | Servir o build localmente; não é servidor de produção |
| `npm run test:e2e` | Pesquisa, privacidade, CSP, acessibilidade automática e 404 |

## Publicação

O caminho predefinido é `/ALPHA-Health-Assistant/`. Para um domínio na raiz:

```bash
VITE_BASE_PATH=/ npm run build
VITE_BASE_PATH=/ npm run verify:build
VITE_BASE_PATH=/ npm run test:e2e
```

A variável é lida na compilação; não é uma chave secreta. O workflow publica o caminho predefinido. Para um domínio personalizado, adapte também o workflow conforme [Replicação](docs/REPLICATION.md).

## Documentação

- [Arquitetura real e limites](docs/ARCHITECTURE.md)
- [Decisões arquiteturais](docs/adr/README.md)
- [Segurança e privacidade](docs/SECURITY.md)
- [Registo de criação e validação](docs/BUILD_LOG.md)
- [Replicação e operação](docs/REPLICATION.md)
- [Critérios para evolução clínica](docs/CLINICAL_SAFETY.md)
- [Contribuição](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

## Licença

MIT. Consulte [LICENSE](LICENSE).
