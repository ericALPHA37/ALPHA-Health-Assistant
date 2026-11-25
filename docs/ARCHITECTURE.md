# Arquitetura

## Versão 1

```text
navegador
  ├─ interface React
  ├─ validação de formulários
  ├─ respostas demonstrativas locais
  └─ histórico local opcional

GitHub Actions
  ├─ npm ci
  ├─ npm run lint
  ├─ npm run test
  ├─ npm run build
  └─ GitHub Pages
```

## Princípios

- Privacidade por defeito: nenhuma consulta é enviada para um servidor de aplicação.
- Segurança de conteúdo: resposta local estática e evitada geração não verificada.
- Separação de responsabilidades: UI, regras de segurança e conteúdo local são módulos separados.
- Provedor de IA substituível: a integração futura deve passar por uma interface explícita.
- Reprodutibilidade: locks de dependências e documentação de todas as versões.

## Estrutura planeada

```text
src/
  components/
  data/
  domain/
  hooks/
  pages/
  services/
  styles/
tests/
docs/
.github/workflows/
