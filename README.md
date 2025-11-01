# Brain Ag - Backend

> Backend para gerenciamento de Produtores, Fazendas e Culturas — construído com NestJS + TypeORM.

## Visão geral
Este repositório contém a aplicação backend para o projeto Brain Ag. A API implementa três entidades principais:
- Produtor (Producer)
- Fazenda (Farm)
- Cultura (Crop)

Tecnologias principais:
- NestJS (v11)
- TypeORM
- PostgreSQL (em produção/desenvolvimento via Docker)
- SQLite (in-memory usado nos testes e2e)
- Jest + ts-jest para testes

O projeto já inclui testes unitários e um teste e2e exemplo para `Producer` que roda usando SQLite em memória.

---

## Estrutura do projeto
- `src/` - código fonte
  - `src/producer/` - controller, service, entity, DTOs do Produtor
  - `src/farm/` - controller, service, entity, DTOs da Fazenda
  - `src/crop/` - controller, service, entity, DTOs da Cultura
  - `src/database/` - configuração do TypeORM / DatabaseModule
  - `src/mocks/mock-data.ts` - dados mock reutilizáveis para testes e seeds
  - `main.ts` - bootstrap da aplicação
- `test/` - testes e2e (ex.: `test/producer.e2e-spec.ts`)
- `package.json` - scripts e dependências
- `Dockerfile*` e `docker-compose*.yml` - dockerização

---

## Rotas principais (resumo)
Produtor (`/producer`)
- POST /producer — criar produtor { name, taxId }
- GET /producer — listar produtores ativos
- GET /producer/:id — obter produtor (com farms)
- PATCH /producer/:id — atualizar
- DELETE /producer/:id — exclusão lógica (active=false)

Fazenda (`/farm`)
- POST /farm — criar fazenda { name, state, city, totalArea, cultivableArea, vegetationArea, producerId }
- GET /farm, GET /farm/:id, PATCH /farm/:id, DELETE /farm/:id

Cultura (`/crop`)
- POST /crop — criar cultura { year, food, farmId }
- GET /crop, GET /crop/:id, PATCH /crop/:id, DELETE /crop/:id
- GET /crop/recent/:years — safras recentes (últimos N anos)

---

## Regras e validações (implementadas)
- Criação de produtor com `taxId` duplicado gera ConflictException (409).
- Busca por id inexistente gera NotFoundException (404).
- Atualização de `taxId` para um já existente gera ConflictException.
- Exclusão de produtor é feita de forma lógica (campo `active` + `deletedAt`).

---

## Instalação local
1. Instale dependências:

```bash
npm install
```

2. (Opcional) Driver sqlite para testes e2e em memória já está em devDependencies, mas se precisar instalar manualmente:

```bash
npm install --save-dev sqlite3
```

---

## Como rodar
- Rodar em desenvolvimento (hot-reload):

```bash
npm run start:dev
```

- Build + rodar versão produção local (após build):

```bash
npm run build
npm run start:prod
```

- Usando Docker (dev):

```bash
npm run docker:dev
# ou
docker-compose -f docker-compose.dev.yml up --build
```

---

## Testes
Testes unitários (Jest + ts-jest):

```bash
# rodar todos os testes unitários
npx jest --runInBand
```

Testes e2e (exemplo Producer usando sqlite in-memory):

```bash
npm run test:e2e
```

Observações:
- O projeto configurou `--runInBand` nas execuções de teste para evitar problemas de autodetecção de workers em alguns ambientes.
- Há mocks reutilizáveis em `src/mocks/mock-data.ts`.

---

## Dados mock / seeds
Arquivo disponível: `src/mocks/mock-data.ts`.
Ele exporta objetos e arrays:
- `sampleProducer`, `sampleFarm`, `sampleCrop`
- `producers`, `farms`, `crops`

Posso adicionar um script `scripts/seed.ts` que injete esses mocks em um banco Postgres local via TypeORM caso queira popular um ambiente de desenvolvimento.

---

## Boas práticas e recomendações para produção
- Não use `synchronize: true` em produção. Use migrations.
- Ative `ValidationPipe` global e adicione `class-validator` aos DTOs para reforçar validação de entrada.
- Proteja credenciais com variáveis de ambiente e secrets manager.

---

## Próximos passos recomendados
- Criar migrations e remover `synchronize: true`.
- Habilitar validação global (ValidationPipe) e decorar DTOs com `class-validator`.
- Adicionar testes e2e para `Farm` e `Crop`.
- Criar script de seed para popular bancos de dev com `src/mocks/mock-data.ts`.

---

## Como posso ajudar agora
Escolha uma ação e eu executo:
1. Ajustar `package.json` para que `npm test` rode toda a suíte automaticamente.
2. Criar um `scripts/seed.ts` que use `src/mocks/mock-data.ts` para popular um Postgres local.
3. Habilitar ValidationPipe global e adicionar validações básicas nos DTOs.
4. Criar testes e2e adicionais para Farm e Crop.


---

README gerado automaticamente por ajuda de pair programming — me diga se deseja que eu commite o arquivo, altere o tom, ou adicione seções específicas (ex.: API docs com exemplos request/response).
