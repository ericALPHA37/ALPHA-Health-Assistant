# Segurança e privacidade

## Âmbito

Projeto demonstrativo de informação geral, não validado para uso clínico. Uma referência da OMS não certifica o conteúdo, a aplicação ou a implementação. Ver [segurança clínica](CLINICAL_SAFETY.md).

## Modelo de dados

- Consultas apenas em estado React, descartadas ao recarregar ou fechar a página.
- Sem contas, cookies de aplicação, analytics, armazenamento local, pedidos de pesquisa, API, segredos ou dados clínicos integrados.
- Não inserir dados pessoais: extensões, dispositivos partilhados e software comprometido estão fora do controlo da aplicação.
- O alojamento pode observar IP, agente do navegador e caminhos dos ficheiros pedidos. «Local» não significa navegação anónima.
- Abrir uma referência transfere o utilizador para um terceiro. As ligações usam `noopener noreferrer` e `no-referrer`; não incluem a consulta.
- Não se deve implementar cache offline de dados pessoais sem nova avaliação.

## Controlos implementados

- React renderiza apenas texto estático; não há `dangerouslySetInnerHTML`, avaliação dinâmica ou inserção de HTML da consulta.
- Input limitado a 200 caracteres na interface e na função de pesquisa.
- Build de produção injeta CSP **antes** dos recursos, tanto no índice como no 404:

```text
default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'
```

- Não permite scripts/styles inline ou conexões via fetch/WebSocket. Isto não bloqueia navegação normal aos links das fontes nem tráfego do próprio browser.
- Não se aplica CSP restritiva em desenvolvimento, para permitir HMR. Não publicar o servidor de desenvolvimento.
- `npm ci` e lockfile versionado; Actions fixadas por SHA, checkout sem credenciais persistidas, CI sem permissões de escrita, deploy com permissões Pages limitadas ao seu job em `main`.
- Dependabot semanal e auditoria `npm audit --audit-level=moderate` no CI e em workflow periódico. Dependabot não garante revisão nem ativação automática dos alertas de segurança nas definições do repositório.
- Testes de injeção, política CSP real no navegador e ausência de pedidos na interação normal de pesquisa.

## Limitações do alojamento estático

A meta CSP não suporta `frame-ancestors` e não substitui headers HTTP. GitHub Pages não permite definir livremente estes headers por ficheiro; um ficheiro `_headers` ali não teria efeito. Não se afirma proteção completa contra clickjacking.

Num alojamento que suporte headers, configurar HTTPS e, após validação:

```text
Content-Security-Policy: [política acima]; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

HSTS deve ser configurado apenas pelo operador que controle o domínio e os seus requisitos HTTPS. Não há defesa absoluta contra comprometimento do alojamento, dependências maliciosas permitidas pela mesma origem, extensões ou browser comprometido. `npm audit` identifica apenas vulnerabilidades conhecidas no momento, não é uma certificação.

## Reportar uma vulnerabilidade

Ainda não há endereço de segurança ou canal privado confirmado; por isso não se publica um `security.txt` com contacto inventado. O mantenedor deve ativar **Private vulnerability reporting** em GitHub → Settings → Code security antes de solicitar relatórios confidenciais.

Quando ativo, usar **Security → Advisories → Report a vulnerability** no repositório. Se essa opção não existir, abrir apenas uma notificação genérica numa issue, sem PoC, segredos, dados pessoais ou detalhes exploráveis, pedindo um canal privado. Nunca enviar dados clínicos reais. Não se promete SLA de resposta nesta demonstração.

## Operação recomendada ao mantenedor

Ativar Dependabot alerts/security updates e proteção de `main` com revisão humana e o check `Quality gates` obrigatório. Configurar Pages com Source **GitHub Actions**, ambiente `github-pages` restrito a `main` e HTTPS. Estas definições de conta não são ativadas pelo código deste PR/branch.
