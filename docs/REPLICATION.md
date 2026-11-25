# Replicação

## Pré-requisitos

- Git
- Node.js 22 LTS
- npm 10 ou superior

## Passos

```bash
git clone https://github.com/ericALPHA37/ALPHA-Health-Assistant.git
cd ALPHA-Health-Assistant
npm ci
npm run lint
npm run test
npm run build
npm run preview
```

## Publicação

O deploy será feito pelo GitHub Actions para GitHub Pages após a configuração do workflow. Nenhuma chave secreta será necessária para a versão local.

## Auditoria

Antes de aceitar alterações:

1. Verifique o diff completo.
2. Execute lint e testes.
3. Execute a aplicação localmente.
4. Revise textos clínicos com pessoa qualificada.
5. Confirme que nenhuma chave ou dado pessoal foi introduzido.
