# Guia de Manutenção e Desenvolvimento

Este documento serve como guia para desenvolvedores que irão manter ou expandir o projeto **Projeto Rifas**.

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura baseada em componentes e serviços, utilizando o padrão **MVC (Model-View-Controller)** adaptado para React:

- **Model**: Definido em `src/models` e interfaces dentro dos serviços/componentes.
- **View**: Componentes em `src/components` e páginas em `src/pages`.
- **Controller**: Lógica de negócios em `src/services` e Hooks customizados.

### Estrutura de Pastas

```
src/
├── components/      # Componentes de UI reutilizáveis (botões, modais, cards)
│   ├── AdminPanel/  # Componentes exclusivos da área administrativa
│   └── ...
├── context/         # Context API (ex: AuthContext para sessão do usuário)
├── models/          # Interfaces e tipos TypeScript compartilhados
├── pages/           # Componentes de página (rotas completas)
├── services/        # Camada de comunicação com API (Axios/Fetch)
├── utils/           # Funções utilitárias (formatadores, máscaras)
└── App.tsx          # Componente raiz e configuração de rotas principais
```

## 🚀 Adicionando Novas Funcionalidades

### 1. Criar um Novo Componente
Crie uma pasta em `src/components/NomeDoComponente` com:
- `index.tsx`: Lógica e JSX do componente.
- `styles.css` (opcional): Estilos específicos se não usar classes globais.

### 2. Adicionar uma Nova Página
1. Crie o arquivo em `src/pages/NomeDaPagina.tsx`.
2. Adicione a rota em `src/route.tsx` (ou `App.tsx` dependendo da estrutura de roteamento).

### 3. Integração com API
1. Adicione os métodos necessários em `src/services/` (ex: `campaignService.ts`).
2. Utilize tipos definidos ou crie novos para garantir a segurança de tipos.
3. Chame o serviço dentro do componente usando `useEffect` ou event handlers.

## 🎨 Estilização

O projeto utiliza **CSS Vanilla** com uma estrutura organizada.
- Variáveis globais (cores, fontes) devem ser mantidas em `src/index.css` ou arquivo de variáveis.
- Evite estilos inline; prefira classes CSS.
- Mantenha a consistência com o design system existente (Mobile-first, cores vibrantes).

## 🔒 Autenticação e Segurança

- A autenticação é gerenciada pelo `AuthContext`.
- Para proteger uma rota, verifique o estado de autenticação antes de renderizar o componente ou redirecione para o login.
- Tokens JWT devem ser armazenados de forma segura (atualmente implementado via serviço).

## 🐛 Debugging Comum

- **Erro de CORS**: ✅ **RESOLVIDO v1.1** - Configurado proxy Vite em `vite.config.ts`. Durante desenvolvimento, certifique-se de que `VITE_API_URL` não esteja definido no `.env` para permitir que o proxy funcione corretamente.
- **Erro 401 no Login**: ✅ **RESOLVIDO v1.1** - O sistema agora remove automaticamente a formatação do telefone antes de enviar para autenticação.
- **Admin não reconhecido**: ✅ **RESOLVIDO v1.1** - O `AuthContext` agora carrega o perfil completo e verifica tanto `is_admin` quanto `role` para compatibilidade com diferentes formatos de backend.
- **Erro 400 ao criar campanha**: ✅ **RESOLVIDO v1.1** - O sistema agora gera slugs automaticamente a partir do título.
- **Rotas 404**: Certifique-se de que o servidor web (em produção) esteja configurado para redirecionar todas as requisições para `index.html` (SPA routing).

## 🔄 Atualizações da Versão 1.2

### 🏆 Gestão de Ganhadores e Premiados
- **Gerenciamento de Títulos**: Títulos agora podem ser criados e gerenciados via Painel Admin (com valores e números específicos).
- **Seleção de Ganhadores**: Admin pode buscar compradores e definir o ganhador de uma campanha.
- **Página de Ganhadores**: Exibe histórico real de ganhadores (`/ganhadores`).
- **Upload de Imagens**: Novo componente `ImageUpload` para formulários de campanha.

### 🔐 Segurança e Melhorias
- **UUIDs Públicos**: Implementação em andamento para substituir IDs sequenciais.
- **Máscara de Dados**: Proteção de CPF e Email nas respostas da API.
- **Obfuscação de Admin**: Rotas de admin configuráveis via `.env`.
- **Layout**: Padronização de background e refinamentos visuais na Homepage e Detalhes.

## 🔄 Atualizações da Versão 1.1

### Configurações Importantes

**Proxy de Desenvolvimento (vite.config.ts)**:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

**Variáveis de Ambiente (.env)**:
- Se estiver usando o proxy, **comente** a linha `VITE_API_URL` para permitir requisições relativas.
- Para builds de produção, defina `VITE_API_URL` com a URL completa da API.

### Segurança e Validações

- **Registro de Usuário**: Validação de senha (mínimo 6 caracteres e confirmação).
- **Exclusão de Campanhas**: Bloqueio automático para campanhas com vendas associadas para manter integridade de dados.
- **Autenticação**: Token JWT armazenado via `localStorage` e automáticamente anexado aos headers via interceptor Axios.

## 📦 Dependências

Para atualizar dependências:
```bash
npm update
```

Novas bibliotecas devem ser instaladas apenas se estritamente necessário para manter o *bundle* leve. Preze por bibliotecas pequenas e tree-shakable.
