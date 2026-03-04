# Projeto Rifas - Frontend

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)

Este é o frontend da plataforma de rifas online, desenvolvido com tecnologias modernas para garantir alta performance, responsividade e uma excelente experiência de usuário.

> 📋 **Novidades da v1.3.0**: Veja o [CHANGELOG.md](CHANGELOG.md) para detalhes sobre as últimas melhorias.

## 🚀 Tecnologias Utilizadas

- **React 19**: Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript**: Superset de JavaScript com tipagem estática para maior segurança e escalabilidade.
- **Vite**: Build tool de próxima geração para desenvolvimento rápido.
- **React Router DOM**: Gerenciamento de rotas e navegação.
- **Lucide React**: Biblioteca de ícones leve e flexível.
- **CSS3**: Estilização moderna e responsiva.

## ✨ Funcionalidades

### Para Usuários
- **Visualização de Campanhas**: Listagem de rifas ativas, detalhes completos e prêmios.
- **Participação**: Compra de títulos/números da sorte.
- **Autenticação**:
  - Cadastro de novos usuários.
  - Login seguro.
  - Recuperação de senha (fluxo preparado).
- **Painel do Usuário**: Visualização de "Meus títulos".
- **Design Responsivo**: Experiência otimizada para dispositivos móveis (Mobile-first).
- **Área de Ganhadores**: Hall da fama dos vencedores de rifas anteriores.
- **FAQ e Suporte**: Seções dedicadas para tirar dúvidas.

### Para Administradores
- **Painel Administrativo**: Acesso restrito para gestão da plataforma.
- **Gestão de Campanhas**:
  - Criação de novas rifas.
  - Edição de detalhes (preços, datas, prêmios).
  - Visualização de status.
- **Controle de Acesso**: Rotas protegidas baseadas em perfil de usuário.

## 🛠️ Pré-requisitos

Para rodar este projeto localmente, você precisará ter instalado:

- **Node.js** (Versão 18 ou superior recomendada)
- **npm** (Gerenciador de pacotes padrão do Node)

## 📦 Instalação e Execução

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Pedro001brzzx/projeto-rifa-front-end.git
   cd projeto-rifa-front-end
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   
   O projeto estará rodando em `http://localhost:5173` (ou outra porta indicada no terminal).

## 🏗️ Build para Produção

Para gerar a versão otimizada para produção:

```bash
npm run build
```

Os arquivos estáticos serão gerados na pasta `dist/`. Para visualizar o build localmente:

```bash
npm run preview
```

## 📂 Estrutura do Projeto

- `src/components`: Componentes reutilizáveis (Header, Footer, Cards, etc).
- `src/pages`: Páginas principais da aplicação (Home, Login, Detalhes).
- `src/services`: Integração com API backend.
- `src/context`: Gerenciamento de estado global (AuthContext).
- `src/models`: Definições de tipos e interfaces TypeScript.

## 🔧 Manutenção

Para orientações sobre como manter, expandir e corrigir o código, consulte o arquivo `MAINTENANCE.md` incluído neste repositório.
