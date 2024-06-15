**Cidade Alta Front End**

-- IMAGENS DO PROJETO
![login](https://github.com/Uude1/cidade-alta-front/assets/89144716/599bab72-1518-4eba-ac86-d648d03d0082)
![dashboard](https://github.com/Uude1/cidade-alta-front/assets/89144716/62c2d474-effc-4ebe-b88c-eb4c1228d3e0)
![config](https://github.com/Uude1/cidade-alta-front/assets/89144716/9fa970a2-0de0-43a7-8258-cf933bba78b4)

Sistema desenvolvido para:

- Login:
  - Realização de Login para o usuário de forma simples.
  - Utiliza-se Token para manter usuario logado com segurança.
    
- Tela de dashboard:
  - Visualização do usuário para todos os emblemas já resgatados (separados por cores de categoria).
  - Botão para o usuário resgatar novos emblemas.
  - Filtro por categoria, caso o usuário queira visualizar somente emblemas de tal categoria resgatados.
  - Filtro de pesquisa, filtrando pelo nome do emblema.
  - Exportação via Excel, podendo exportar os emblemas já resgatados, se caso utilizar algum dos filtros e exportar, ele respeita os filtros utilizados.
    
- Tela de configuração de usuário:
  - Liberado para a troca de nome, email ou senha do próprio usuário.
    
---

## Bando de dados

-- Criação da database

CREATE DATABASE cda_teste;

-- Uso da database

USE cda_teste;

-- Tabela emblems

CREATE TABLE emblems (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL
);

-- Tabela users

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabela emblemsuser

CREATE TABLE emblemsuser (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    emblem_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (emblem_id) REFERENCES emblems(id)
);

-- INSERTS

-- Inserção de dados na tabela emblems

INSERT INTO emblems (id, slug, name, image, category) VALUES
(1, 'cda', 'Cidade Alta', 'https://cidadealtarp.com/imagens/challenge/cidade-alta.png', 'gold'),
(2, 'cda-valley', 'Cidade Alta Valley', 'https://cidadealtarp.com/imagens/challenge/cidade-alta-valley.png', 'gold'),
(3, 'policia', 'Policia do Cidade Alta', 'https://cidadealtarp.com/imagens/challenge/policia.png', 'silver'),
(4, 'hospital', 'Hospital do Cidade Alta', 'https://cidadealtarp.com/imagens/challenge/hospital.png', 'silver'),
(5, 'mecanica', 'Mecânica do Cidade Alta', 'https://cidadealtarp.com/imagens/challenge/mecanica.png', 'silver'),
(6, 'taxi', 'Taxi do Cidade Alta', 'https://cidadealtarp.com/imagens/challenge/taxi.png', 'silver'),
(7, 'curuja', 'Coruja', 'https://cidadealtarp.com/imagens/challenge/coruja.png', 'bronze'),
(8, 'hiena', 'Hiena', 'https://cidadealtarp.com/imagens/challenge/hiena.png', 'bronze'),
(9, 'gato', 'Gato', 'https://cidadealtarp.com/imagens/challenge/gato.png', 'bronze'),
(10, 'urso', 'Urso', 'https://cidadealtarp.com/imagens/challenge/urso.png', 'bronze');

INSERT INTO users (id, name, email, password) VALUES
(1, 'Admin', 'admin@cda.com.br', 'admin');


