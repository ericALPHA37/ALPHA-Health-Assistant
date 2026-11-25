# ADR 0003 — Integração de IA posterior

## Estado

Proposto.

## Contexto

Uma integração futura pode melhorar a interatividade, mas não pode expor chaves nem produzir conclusões clínicas não verificadas.

## Decisão

Definir uma interface de serviço única no front-end. Toda integração deverá:

- exigir chave em servidor dedicado, nunca no navegador;
- validar cada resposta;
- indicar claramente que o texto foi gerado;
- permitir desativação;
- manter origem e revisão da informação;
- passar por avaliação clínica antes de produção.

## Consequências

Esta interface não será ativada nesta etapa.
