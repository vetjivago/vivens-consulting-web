# Informações de Deploy (Cópia do Processo Automatizado)

Você solicitou um arquivo com as credenciais e o processo exato que utilizei para realizar o deploy.

## Método Utilizado: Deploy Contínuo (Vercel via GitHub)

O deploy que realizei **não utilizou senhas diretas de FTP ou painel de hospedagem**. Ele foi feito através de integração contínua (CI/CD) conectada ao seu repositório GitHub.

### 1. "Credenciais" Necessárias
Para realizar o deploy desta forma ("do jeito que eu faço"), as únicas credenciais necessárias são **suas próprias credenciais do GitHub**, pois o processo é gatilhado por um `git push`.

*   **Autenticação:** O sistema utiliza a autenticação Git já configurada na sua máquina (SSH ou HTTPS).
*   **Repositório Remoto:** `https://github.com/vetjivago/vivens-consulting-web`

### 2. O Processo Executado

O comando exato que dispara o deploy é:

```bash
git push origin main
```

**Onde a mágica acontece:**
1.  A Vercel (plataforma de hospedagem) está "escutando" este repositório.
2.  Quando o código chega na branch `main` do GitHub, a Vercel inicia automaticamente o processo de build.
3.  Ela lê o arquivo `package.json` e `vercel.json`.
4.  Executa `npm run build`.
5.  Publica a nova versão do site.

### 3. Configurações do Projeto
*   **Arquivo de Configuração:** `vercel.json` (Localizado na raiz do projeto).
    *   *Função:* Garante que todas as rotas (ex: `/equipe`) sejam redirecionadas para o `index.html` (SPA), evitando erros 404 ao recarregar a página.

### Resumo
Não há um arquivo de texto com "senha da Vercel" necessário para operar no dia a dia. A segurança é baseada no seu acesso ao repositório GitHub. **Se você tem acesso para dar push na `main`, você tem acesso para dar deploy.**
