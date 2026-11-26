# Contribuição

## Regras

- Alterações pequenas e revisáveis, sem dados pessoais ou clínicos reais.
- Não introduzir IA, backend, analytics ou persistência sem ADR e avaliação de segurança específicos.
- Conteúdo de saúde requer fonte verificável e revisão qualificada: [critérios clínicos](docs/CLINICAL_SAFETY.md).
- Manter descrições honestas: não confundir teste automatizado com revisão clínica ou certificação de segurança/acessibilidade.
- Não registar credenciais, tokens ou dados sensíveis em código, logs, issues ou relatórios de testes.

## Preparação e verificação

Usar Node conforme `.nvmrc` e npm 10+. A instalação normal usa o lockfile:

```bash
npm ci
npm run check
npx playwright install --with-deps chromium
npm run test:e2e
VITE_BASE_PATH=/ npm run build
VITE_BASE_PATH=/ npm run verify:build
VITE_BASE_PATH=/ npm run test:e2e
npm audit --audit-level=moderate
```

O E2E deve usar o mesmo `VITE_BASE_PATH` do build que está a testar. Para voltar ao caminho predefinido, executar `npm run build`. Testes automáticos não substituem inspeção visual, leitor de ecrã ou revisão dos textos.

## Pull requests

Explicar problema, solução, impacto em privacidade/segurança e comandos executados com resultados. Incluir regressão automatizada para correções. Não versionar `dist/`, `node_modules/`, cobertura, traces ou imagens de dados reais. Versionar sempre alterações deliberadas a `package.json` e `package-lock.json` em conjunto.

Dependências e Actions são propostas pelo Dependabot mas requerem revisão humana. Não reduzir limiares nem ignorar uma auditoria falhada sem decisão explícita e justificação documentada. O mantenedor deve configurar proteção de `main` e exigir `Quality gates`.

## Commits

Usar `tipo: descrição curta`, em português ou inglês. Ex.: `fix: reject ambiguous topic searches`. Não reescrever o histórico para ocultar falhas; corrigir por alterações auditáveis. Se um segredo for publicado, revogá-lo imediatamente e coordenar a remoção.
