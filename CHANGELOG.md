# Changelog

## Não lançado — melhoria técnica de 2026-11-26

### Segurança e dependências

- Instalação por lockfile/`npm ci`, requisitos Node/npm, atualização de React, Vite, Vitest, ESLint e respetivas ferramentas compatíveis.
- CSP restritiva no build e 404; sem código inline, conexões da aplicação ou referrers para fontes.
- Actions por SHA, permissões Pages apenas no job de deploy de `main`, verificação em pull requests, auditoria periódica e Dependabot semanal.
- Política de segurança na raiz e documentação das limitações de headers do Pages.

### Funcionalidade e acessibilidade

- Pesquisa por palavras completas e aliases explícitos; correção de falsos positivos, ambiguidade e resultados desatualizados.
- Limite de 200 caracteres na UI/domínio, instruções sobre os dois temas e limites clínicos explícitos.
- Região de resultados persistente, contraste/foco melhorados e navegação por teclado testada.
- Favicon, 404 com CSS externo, `.nojekyll` e base configurável também para domínio na raiz.

### Qualidade e documentação

- 39 testes unitários/de componentes, cobertura com gate >=95%, 10 cenários E2E por base em Chromium desktop/mobile e verificações axe-core.
- Contratos de CSP/recursos/404 e orçamento total de JavaScript gzip de 100 KiB.
- Documentação alinhada com o código; critérios para conteúdo clínico, replicação/publicação e registo factual de validação.

## 0.1.0 — base inicial

- Documentação do projeto, arquitetura, ADRs e requisitos de segurança.
- Interface React/Vite, dois temas locais com fontes e workflow inicial de Pages.
- Testes iniciais de pesquisa e fontes.
