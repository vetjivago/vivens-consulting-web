# AI Context & Project Overview

Este arquivo serve como um ponto de entrada para agentes de IA entenderem o contexto, arquitetura e estado atual do projeto **Vivens**.

## 1. Visão Geral do Projeto
**Nome:** Vivens (Consultoria e Pesquisa Pré-clínica)
**Tipo:** Web Application / Site Institucional
**Tech Stack:**
- **Frontend:** React 18, TypeScript, Vite
- **Estilização:** Tailwind CSS, Shadcn/UI
- **Roteamento:** React Router DOM v6
- **Gerenciamento de Estado:** React Query (@tanstack/react-query)
- **Ícones:** Lucide React

## 2. Estrutura de Diretórios
- **/src/pages**: Componentes de página (Home, Sobre, Serviços, etc.)
- **/src/components**: Componentes reutilizáveis (Header, Footer, UI shadcn)
- **/src/lib**: Utilitários (utils.ts)
- **/public**: Arquivos estáticos
- **DEPLOY.md**: Instruções de deploy (Vercel e HostGator)
- **CREDENTIALS.md**: (Novo) Template para senhas e acessos importantes (preencha este arquivo!)
- **EXPORTACAO_WORDPRESS.md**: Guia para futura migração/exportação para WordPress

## 3. Comandos Principais
- `npm run dev`: Inicia servidor de desenvolvimento
- `npm run build`: Gera build de produção na pasta `dist/`
- `npm run lint`: Verifica erros de linting
- `npm run preview`: Visualiza o build localmente

## 4. Estado Atual e Histórico Recente
- **Backup:** Um backup completo foi realizado para `/Volumes/SSD2/Vivens` (vivens_backup_20260219.zip) em 12/03/2026.
- **Credenciais:** Criado template `CREDENTIALS.md` para armazenar acessos seguros.
- **Funcionalidades Recentes:**
    - Página de Parcerias criada.
    - Separação de Clientes e Parceiros na Home.
    - Ajustes visuais no Login.
    - Correção de exibição de projetos.

## 5. Regras e Convenções
- **Estilo:** Priorizar design premium, moderno e responsivo.
- **Código:** TypeScript estrito. Componentes funcionais.
- **Commits:** Mensagens descritivas (feat, fix, docs, style).
- **Implantação:** Vercel é automática (push na main). HostGator requer build manual e upload via FTP.

## 6. Próximos Passos (Sugestões)
- Preencher `CREDENTIALS.md` com as senhas reais.
- Verificar se o backup no SSD externo está acessível em outro PC.
- Continuar o desenvolvimento conforme novas demandas (ex: migração WordPress se decidido).

---
*Gerado por Antigravity em 21/01/2026*
