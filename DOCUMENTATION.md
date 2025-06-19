# Documentação Técnica

## Visão Geral

Este projeto é um app que usa a API pública do PokeAPI para mostrar uma lista de pokémons e detalhes de cada um. O objetivo foi criar uma aplicação funcional e fácil de usar.

## Tecnologias Usadas

- Angular com standalone components
- Ionic para componentes visuais
- RxJS para lidar com chamadas assíncronas
- HttpClient para comunicação com a API REST
- Jasmine e Karma para testes unitários

## Organização do Código

- Os componentes estão divididos por função: HomePage para a lista, DetailsPage para os detalhes, FavoritesPage para favoritos e PokemonCardComponent para mostrar os cards.
- Serviço PokeapiService centraliza todas as chamadas HTTP para a API do Pokémon.
- Uso de injeção de dependência para facilitar testes e reutilização.

## Abordagem de Desenvolvimento

- Priorizei código simples e claro, para facilitar manutenção e entendimento.
- Criei uma interface de usuário simples e limpa, com foco na experiência do usuário e facilidade de navegação.  
- Os testes unitários cobrem os principais fluxos de dados e interações.
- Utilizei mocks para testar o comportamento sem depender da API real.

## Padrões de Design Utilizados

- **Service Pattern**  
  Responsabilidade única para comunicação com APIs, isolando chamadas HTTP em classes dedicadas.

- **Dependency Injection**  
  Injeção de dependências para fornecer serviços e facilitar testes, manutenção e reutilização de código.

- **Observer Pattern**  
  Uso de `Observables` do RxJS para tratar fluxos de dados assíncronos e reagir a mudanças de forma reativa.

- **Separation of Concerns**  
  Separação clara entre camadas de apresentação (componentes) e lógica de negócio (serviços).



## Próximos Passos

- Implementar caching para evitar muitas chamadas à API.
- Expandir a cobertura dos testes para componentes visuais.

## Considerações Finais

Este projeto foi uma ótima oportunidade para praticar Angular com Ionic e aprender sobre testes e organização de código. Busquei sempre deixar o código simples e organizado para facilitar o entendimento, principalmente para quem está começando.

---

## Como rodar o projeto

Antes de rodar o projeto, certifique-se de ter instalado globalmente:
Ionic CLI e Angular CLI

```bash
npm install -g @ionic/cli
npm install -g @angular/cli
```

1- Instale as dependências:

```bash
 npm install
```

2- Inicie a aplicação com Ionic:

```bash
 ionic serve
```

3- Para rodar os testes, use:

```bash
 ng test
```
