# ADR 0004 — Pesquisa conservadora e publicação verificada

## Estado

Aceite em 2026-11-26.

## Contexto

A auditoria encontrou builds sem lockfile, vulnerabilidades em ferramentas de teste, Actions com tags mutáveis e pesquisa por substring com falsos positivos. O âmbito clínico demonstrativo deve permanecer explícito.

## Decisão

- Versionar `package-lock.json`, usar `npm ci` e declarar ambiente Node/npm.
- Atualizar o conjunto compatível de dependências e fixar Actions por SHA, com revisão semanal via Dependabot e auditoria periódica.
- Comparar palavras Unicode completas, normalizadas sem acentos, com aliases explícitos. Não inferir flexões por comprimento do sufixo; consultas com vários temas não escolhem silenciosamente o primeiro.
- Limitar input no domínio e UI; eliminar resultados desatualizados durante a edição.
- CSP apenas em produção, antes dos recursos; sem código inline nem conexões de aplicação. Não simular headers que o Pages não consegue configurar.
- Testes unitários/componentes, cobertura mínima 95% dos módulos incluídos, verificação dos artefactos e E2E sobre produção nas bases Pages e raiz.
- Verificar automaticamente acessibilidade em estados inicial/sucesso/vazio sem alegar certificação WCAG.
- Não aumentar conteúdo clínico nem adicionar IA sem avaliação e revisão próprias.

## Consequências

Maior previsibilidade e segurança técnica; menos falsos positivos, com menor tolerância a variantes não cadastradas. A pesquisa continua lexical, não semântica. O CI necessita descarregar Chromium e bibliotecas. A auditoria pode bloquear PRs quando surgirem advisories novos. A aplicação mantém apenas dois temas e não se torna uma ferramenta clínica validada.
