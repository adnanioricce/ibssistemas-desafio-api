## Desafio IBS sistemas

O projeto nesse repositório trata-se de um desafio de contração da IBS sistemas. Esse repositório contem a API que com a lógica de servidor da aplicação.

Segue abaixo instruções para rodar e testar o projeto.
## Rodando
Requisitos
* nodejs 18+
* mongodb 6+
* docker e docker-compose(opcional)

### Localmente

Para executar o projeto localmente

#### Instale as dependências

```bash
$ npm install
```

#### Inicie o projeto

```bash
# desenvolvimento
$ npm run start

# watch mode, reinicia a cada alteração 
$ npm run start:dev

# modo de produção
$ npm run start:prod
```

#### Teste o projeto

No momento isso só pode ser feito localmente.


```bash
# testes de unidade
$ npm run test

# testes de ponta a ponta
$ npm run test:e2e

# cobertura de testes
$ npm run test:cov
```

### Docker

```bash
$ docker build . -t sua-tag:latest
$ docker run -d --name ibs-api -p 8184 -e SECRET_JWT=... sua-tag:latest
```

