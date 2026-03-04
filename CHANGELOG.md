# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).


## [1.3.0] - 2026-03-04

### Adicionado
- **Recuperação de Senha**: Fluxo completo de recuperação e redefinição de senha com tokens seguros e expiração.
- **Detalhes de Ganhadores**: Nova seção na página de detalhes da campanha para exibir ganhador (nome, prêmio, número, data e telefone mascarado) para campanhas finalizadas.
- **Políticas e Termos**: Adição de pop-ups e páginas para Termos de Uso, Política de Privacidade e Política de Cookies.

### Melhorado
- **Segurança Reforçada**: Migração de IDs internos para UUIDs públicos, mascaramento de dados sensíveis e ofuscação da rota de administração.
- **Exibição de Campanhas**: Melhorias na ordenação, remoção de textos obsoletos e badges de "Disponível" e "Últimas unidades" dinâmicos.
- **Detalhes do Título**: Interface refinada da página de detalhes dos títulos, com números em verde e melhor disposição de layout.
- **Meus Títulos**: Ordenação de compras (Pendente > Aprovado > Expirado).
- **Restrição de Compra Mínima**: Input agora assume restrições automáticas de compra mínima.

### Corrigido
- **Fluxo de Pagamento**: Correção de erros 404 (compraId nulo), suporte a UUIDs, ajuste no CORS, e refinamento da integração do Axios.

## [1.2.0] - 2026-01-23

### Adicionado
- **Tipografia Premium**: Implementada fonte Montserrat em todo o projeto para visual moderno e profissional
- **Sistema de Timer de Pagamento**: Timer de 10 minutos para completar pagamentos PIX
- **Validação de Expiração**: Sistema robusto que expira pagamentos automaticamente após 10 minutos
- **Redirecionamento Inteligente**: Compras antigas (>2 min) redirecionam para "Meus Títulos" automaticamente
- **Feedback Visual de Status**: Alertas claros para pagamentos expirados, pendentes e aprovados

### Melhorado
- **Botões de Pacotes**: Redesenhados com cores verde vibrante (#10b981), tamanhos maiores e melhor hierarquia visual
- **Tamanhos de Fonte**: Aumentados significativamente para elementos críticos (+40% em números de pacotes)
- **Seção Títulos Premiados**: Compactada com redução de 60% no espaço vertical, especialmente em mobile
- **Layout Mobile**: Grid responsivo para pacotes e títulos premiados mantém informações lado a lado
- **Harmonia Visual**: Ajustes finos de padding, gaps e bordas para visual mais limpo e profissional
- **Checkout Page**: Informações dinâmicas da campanha e quantidade de títulos
- **My Tickets Details**: Melhor tratamento de status de pagamento (pendente/expirado/aprovado)

### Corrigido
- **Preços Redundantes**: Removidos valores duplicados dos cards de pacotes para layout mais limpo
- **Empilhamento Mobile**: Corrigido empilhamento vertical excessivo em telas pequenas
- **Timer de Compras Antigas**: Fallback para compras sem campo `expira_em` (calcula a partir de `criado_em + 10min`)
- **Loop de Expiração**: Prevenido loop infinito ao expirar pagamentos automaticamente

### Técnico
- Refatoração completa do layout de `CampaignDetailsPage.tsx`
- Novos estilos responsivos com media queries otimizadas (< 480px)
- Sistema de validação de tempo em múltiplas camadas (frontend + fallback)
- Melhorias no componente `PrizeTitles` com props tipadas
- Atualização de tipos TypeScript para incluir `status_pagamento` e `expira_em`

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
