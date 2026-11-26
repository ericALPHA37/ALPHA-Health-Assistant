# Replicação e operação

## Reproduzir

Requisitos: Git, Node.js da linha 22 com versão >=22.12 (recomendado via `.nvmrc`) ou 24+, npm >=10. Browser e bibliotecas de sistema para E2E.

```bash
git clone https://github.com/ericALPHA37/ALPHA-Health-Assistant.git
cd ALPHA-Health-Assistant
# Se usar nvm: nvm install && nvm use
npm ci
npm run check
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=moderate
npm run preview
```

Abra `http://localhost:4173/ALPHA-Health-Assistant/`. `npm ci` falha se o manifesto e o lockfile não coincidirem; não contornar isso com `npm install` no CI. Para atualizar dependências deliberadamente, usar `npm install`, rever o diff do lockfile e executar novamente a verificação completa.

O Playwright descarrega browsers além dos pacotes npm; proxies/redes restritas podem bloquear a instalação. Num ambiente com Chromium já instalado, `E2E_CHROMIUM_PATH=/caminho/do/chromium npm run test:e2e` permite indicar o executável. São também necessárias as bibliotecas de sistema desse browser. Os relatórios ficam em `test-results/` e não são versionados.

## GitHub Pages

1. Rever e integrar a branch em `main` por pull request.
2. Em Settings → Pages, escolher **GitHub Actions** como Source.
3. Ativar HTTPS e limitar o ambiente `github-pages` a `main`.
4. O workflow executa auditoria, lint, cobertura >=95%, TypeScript, build e verificação de CSP/recursos/tamanho.
5. Executa E2E Chromium desktop/mobile no caminho Pages e em `/`, incluindo axe-core e CSP real.
6. Restaura o build Pages e só publica se todas as etapas passarem. Pull requests não fazem deploy nem têm permissões de escrita Pages.

Não há segredos de API a configurar. O token efémero do próprio GitHub autoriza o deploy. A existência do workflow não prova que o Pages já foi ativado ou publicado.

## Domínio personalizado ou outro caminho

A base tem de começar e terminar em `/`; exemplos aceites: `/`, `/demo/`, `/equipa/demo/`. URLs externas, `..`, espaços e query strings são rejeitados.

```bash
VITE_BASE_PATH=/ npm run build
VITE_BASE_PATH=/ npm run verify:build
VITE_BASE_PATH=/ npm run test:e2e
VITE_BASE_PATH=/ npm run preview
```

O 404, favicon e recursos são ajustados no build. A aplicação não faz roteamento interno. Num domínio personalizado, configure DNS/Pages e a base na etapa final de publicação do workflow; remova/adapte a etapa que restaura o caminho predefinido. Nunca guardar segredos em variáveis `VITE_*`: estas podem ser incorporadas no browser.

## Atualização, auditoria e recuperação

- Rever os PRs semanais do Dependabot; sem merge automático. Atualizações de Actions devem manter SHA e comentário da versão.
- O workflow periódico de segurança deteta advisories novos mesmo sem alterações de código; acompanhar execuções falhadas e alertas. Não basta agendar sem monitorizar.
- Rever diff, executar testes e verificar manualmente com leitor de ecrã, zoom e browsers adicionais; axe não certifica acessibilidade completa.
- Rever fontes com pessoa qualificada antes de publicar conteúdo novo. Confirmar links manualmente com acesso à Internet.
- Para recuperar um deploy, reverter a alteração problemática por PR na branch de trabalho e integrar em `main`; o workflow reconstrói o artefacto. Não editar `dist` manualmente nem contornar os testes.
- Não utilizar esta demonstração para recolher dados clínicos ou tomar decisões assistenciais.
