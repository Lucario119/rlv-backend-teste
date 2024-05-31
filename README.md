# Desafio Backend da RLV Tecnologia - Visão Geral do Projeto

Este é o meu desafio Backend da RLV Tecnologia. Este projeto é uma API RESTful para gerenciar e consultar feriados no Brasil. Suporta feriados nacionais, estaduais e municipais, incluindo feriados com data fixa e feriados móveis calculados com base na data da Páscoa. O projeto utiliza NestJS para o backend e SQLite como banco de dados.

## Começando

### Executando o Projeto

1. Instale os módulos necessários do node: `yarn`
2. Inicie o servidor do projeto (a porta padrão é 8000): `yarn dev` ou `yarn start`

### Testando o Projeto

1. Se você tiver a ferramenta de teste k6 instaladas em sua máquina, utilize o arquivo tests-open.js fornecido pela avaliação, execute: `k6 run -e API_BASE=http://localhost:8000 tests-open.js`, enquanto estiver executando o projeto.
2. Para usar testes e2e: `yarn test:e2e`