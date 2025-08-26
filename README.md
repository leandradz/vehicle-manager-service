[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=leandradz_vehicle-manager-service&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=leandradz_vehicle-manager-service)

# Gerenciador de Veículos

[Vídeo de Apresentação]()

## Descrição do Projeto

Uma empresa de revenda de veículos automotores nos contratou pois quer implantar uma
plataforma que funcione na internet, sendo assim, temos que criar a plataforma. O time de UX já está criando os designs, e ficou sob sua responsabilidade criar a API, para que posteriormente o time de frontend integre a solução. O desenho da solução envolve as seguintes necessidades do negócio.

## Estrutura do Projeto

-   **Backend**: Microsserviço utilizando arquitetura hexagonal.
-   **APIs Implementadas**:
    • Cadastrar um veículo para venda (Marca, modelo, ano, cor, preço);
    • Editar os dados do veículo;
    • Listagem de veículos à venda, ordenada por preço, do mais barato para o mais caro.
    • Listagem de veículos vendidos, ordenada por preço, do mais barato para o mais caro.
-   **Banco de Dados**: DynamoDB (simulado localmente com LocalStack).

## Como Rodar o Projeto Localmente

Para rodar testar a aplicação completa, você precisará clonar e iniciar também o repositório vehicle-orchestration, além do vehicle-sales-service. Siga os passos:

1. Clone ambos os repositórios:

```bash
git clone https://github.com/leandradz/vehicle-orchestration.git
git clone https://github.com/leandradz/vehicle-manager-service.git
git clone https://github.com/leandradz/vehicle-sales-service.git
```

2. Inicie o vehicle-orchestration:

```bash
cd vehicle-orchestration
docker-compose up -d ngrok
bash set-ngrok-webhook.sh
```

3. Acesse as aplicações:
- vehicle-manager-service: http://localhost:3002
- vehicle-sales-service: http://localhost:3001

## Observações
- Sempre execute o script `set-ngrok-webhook.sh` após subir o ngrok para garantir que o endpoint do webhook esteja atualizado.
- Para reiniciar todos os serviços com o novo endpoint, basta rodar novamente o script.

## Documentação
- Acesse a documentação das APIs via Swagger:
  - [Vehicle Manager](http://localhost:3002/api-docs)
  - [Vehicle Sales](http://localhost:3001/api-docs)

## Diagrama dos fluxos presentes no Manager Service

<img src='./assets/fiap-cadastrar-veiculo.png'/>
<img src='./assets/fiap-listagem-veiculo.png'/>