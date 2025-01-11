# Trinar Social Network - Open Source

## O que é o Trinar?

O **Trinar Social Network** é uma rede social voltada para a interação de usuários com foco em **simplicidade**, **segurança** e **open-source**. Criada para aqueles que buscam uma plataforma que pode ser personalizada de acordo com as necessidades, sendo também uma excelente opção para desenvolvedores que querem colaborar e contribuir para uma rede social que leva a sério a privacidade e a transparência.

## Objetivo do Projeto

O Trinar Social Network visa fornecer uma solução open-source para aqueles que desejam:

- Uma plataforma de rede social sem as limitações e problemas das grandes plataformas centralizadas.
- Controle completo sobre seus dados.
- Customização e escalabilidade conforme suas necessidades.
- Colaboração da comunidade para a melhoria contínua do sistema.

## Funcionalidades

O projeto está sendo desenvolvido para ter uma série de funcionalidades essenciais para uma rede social, com a capacidade de expandir com o tempo. As principais funcionalidades até o momento são:

### 1. **Autenticação de Usuários**
   - Registro de novos usuários.
   - Login via username e senha.
   - Autenticação utilizando token JWT para APIs.

### 2. **CRUD de Posts**
   - Criação, leitura, atualização e deleção de posts.
   - Repost de posts.
   - Interações com posts (comentários, curtidas, reposts).

### 3. **Interação Social**
   - Seguir e deixar de seguir outros usuários.
   - Ver os posts de pessoas seguidas.

### 4. **Interface Administrativa**
   - Tela de administração para gerenciar posts, usuários e comentários.
   - Sistema de permissões, permitindo ao administrador gerenciar o sistema com eficiência.

### 5. **Endpoints de API**
   - **POST** para criar, listar e editar posts.
   - **GET** para visualizar posts e perfis de usuários.
   - **PATCH** para atualização de informações do usuário.
   - **DELETE** para exclusão de conteúdo (posts, comentários).

## Tecnologias Utilizadas

- **Backend**: Django + Django REST Framework (DRF)
- **Banco de Dados**: MySQL
- **Autenticação**: JSON Web Tokens (JWT)
- **Frontend**: (a ser definido conforme desenvolvimento; pode ser React ou outro framework de preferência)
- **Controle de Versão**: Git e GitHub
- **Docker**: Contêinerização para ambiente isolado de desenvolvimento

## Como Rodar o Projeto Locamente

Siga os passos abaixo para rodar o **Trinar Social Network** localmente:

1. **Clone o Repositório**

```bash
git clone git@github.com:slvajunior/Trinar-Social-Network_.git
cd Trinar-Social-Network_