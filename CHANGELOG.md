# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2026-01-11

### Adicionado
- **Campos de Senha no Registro**: Usuários agora definem sua própria senha durante o cadastro (campos "Senha" e "Confirmar Senha" com validação).
- **Link Admin no Rodapé**: Acesso discreto à área administrativa via link no rodapé para usuários admin.
- **Geração Automática de Slug**: Campanhas agora geram slugs automaticamente a partir do título para URLs amigáveis.
- **Proxy Vite para API**: Configuração de proxy no `vite.config.ts` para resolver problemas de CORS durante desenvolvimento.

### Corrigido
- **Erro 401 no Login**: Correção na formatação do número de telefone (remoção de máscara) antes de enviar para autenticação.
- **Verificação de Admin**: Suporte para múltiplos formatos de resposta da API (`is_admin` e `role`).
- **Carregamento de Perfil Completo**: Login agora carrega perfil completo do usuário imediatamente após autenticação para garantir que campos como `is_admin` estejam presentes.
- **Erro 400 ao Criar Campanha**: Adicionado campo `slug` obrigatório na criação de campanhas.

### Melhorado
- **Tratamento de Erros na Exclusão**: Mensagens de erro específicas ao tentar excluir campanhas com vendas (agora exibe: "🔒 Bloqueado: Não é possível excluir campanhas que já possuem vendas").
- **Segurança de Dados**: Bloqueio de exclusão de campanhas com transações para preservar integridade do histórico financeiro.
- **Feedback ao Usuário**: Mensagens de erro mais claras e específicas em operações administrativas.

### Técnico
- Atualização do `AuthContext` para sanitizar entrada de telefone e buscar perfil completo
- Configuração de CORS via proxy reverso no Vite
- Remoção de logs de debug do código de produção
- Validação de formulários aprimorada na página de registro

## [1.0.0] - 2026-01-XX

### Inicial
- Lançamento inicial do sistema de rifas online
- Autenticação de usuários
- Listagem e visualização de campanhas
- Compra de títulos
- Painel administrativo básico
- Design responsivo mobile-first
