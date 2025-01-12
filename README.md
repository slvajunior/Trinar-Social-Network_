# Trinar - Rede Social Open Source

![Trinar Logo](caminho/para/logo.png)

O **Trinar** é uma rede social open source criada para oferecer uma alternativa transparente e segura às grandes plataformas centralizadas. Nosso objetivo é empoderar os usuários, dando a eles controle total sobre seus dados e a liberdade de personalizar a plataforma de acordo com suas necessidades.

## Funcionalidades

### 1. **Autenticação de Usuários**
   - Registro de novos usuários com validação de e-mail.
   - Login seguro utilizando tokens JWT.
   - Recuperação de senha via e-mail.

### 2. **CRUD de Posts**
   - Criação de posts com suporte a texto, hashtags e menções.
   - Edição e exclusão de posts pelo autor.
   - Repost de posts com a possibilidade de adicionar comentários.

### 3. **Interação Social**
   - Seguir e deixar de seguir outros usuários.
   - Ver os posts de pessoas seguidas.

### 4. **Interface Administrativa**
   - Tela de administração para gerenciar posts, usuários e comentários.
   - Sistema de permissões, permitindo ao administrador gerenciar o sistema com eficiência.

## Tecnologias Utilizadas

- **Backend**: Django + Django REST Framework (DRF)
- **Banco de Dados**: MySQL
- **Autenticação**: JSON Web Tokens (JWT)
- **Frontend**: (a ser definido conforme desenvolvimento; pode ser React ou outro framework de preferência)
- **Controle de Versão**: Git e GitHub
- **Docker**: Contêinerização para ambiente isolado de desenvolvimento

## Como Rodar o Projeto Localmente

### Pré-requisitos

- Python 3.8+
- MySQL
- Docker (opcional)

### Passos para Execução

## Como Contribuir

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Envie para o repositório remoto (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

**Dicas**:
- Certifique-se de que seus commits seguem o padrão do projeto.
- Adicione testes para novas funcionalidades.
- Documente suas alterações no README.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

- **GitHub**: [slvajunior](https://github.com/slvajunior)
- **E-mail**: johnf.foto@gmail.com

1. Clone o repositório:
   ```bash
   git clone git@github.com:slvajunior/Trinar-Social-Network_.git
   cd Trinar-Social-Network_