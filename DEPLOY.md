# Opções de Deploy - Vivens

Este documento lista as opções disponíveis para realizar o deploy da aplicação Vivenslab.

## 1. Vercel (Recomendado/Automático)

A aplicação está configurada para deploy contínuo na Vercel.

*   **Como funciona:** Qualquer push realizado na branch `main` dispara automaticamente um novo build e deploy na Vercel.
*   **Ação necessária:** Apenas commit e push das alterações.
    ```bash
    git add .
    git commit -m "feat: descrição da alteração"
    git push origin main
    ```
*   **Arquivo de configuração:** `vercel.json` na raiz do projeto.

---

## 2. Deploy Manual (HostGator / cPanel / Apache)

Para hospedagem em servidores tradicionais como HostGator via cPanel.

### Passos para Deploy Manual:

1.  **Build Local:**
    Gere a versão de produção localmente.
    ```bash
    npm run build
    ```
    Isso criará uma pasta `dist/` na raiz do projeto com os arquivos otimizados.

2.  **Upload:**
    Faça o upload do **conteúdo** da pasta `dist/` para a pasta `public_html` (ou subdiretório correspondente) no seu servidor via FTP ou Gerenciador de Arquivos do cPanel.

3.  **Configuração de Rotas (SPA):**
    Como é uma Single Page Application (SPA), o servidor precisa redirecionar todas as requisições para o `index.html`.
    *   Certifique-se de que o arquivo `.htaccess` esteja presente na raiz do servidor (junto com os arquivos do dist).
    *   Exemplo de configuração básica para `.htaccess`:
        ```apache
        <IfModule mod_rewrite.c>
          RewriteEngine On
          RewriteBase /
          RewriteRule ^index\.html$ - [L]
          RewriteCond %{REQUEST_FILENAME} !-f
          RewriteCond %{REQUEST_FILENAME} !-d
          RewriteRule . /index.html [L]
        </IfModule>
        ```

## 3. Rodando Localmente

Para desenvolvimento ou teste antes do deploy:

```bash
npm run dev
```
Acesse: `http://localhost:8080` (ou a porta indicada no terminal).
