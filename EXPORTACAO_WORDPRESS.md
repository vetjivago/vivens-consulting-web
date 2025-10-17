# Guia de Exportação para WordPress

Este projeto Vivens foi desenvolvido em React/Vite e precisa ser adaptado para WordPress. Existem algumas abordagens possíveis:

## Opção 1: Conversão Manual para Tema WordPress (Recomendado para controle total)

### Estrutura de Arquivos WordPress
```
wp-content/
  themes/
    vivens/
      ├── style.css (informações do tema)
      ├── functions.php (funcionalidades)
      ├── header.php
      ├── footer.php
      ├── index.php
      ├── page.php (template de páginas)
      ├── page-home.php (template da Home)
      ├── page-sobre.php
      ├── page-servicos.php
      ├── page-infraestrutura.php
      ├── page-setores.php
      ├── page-equipe.php
      ├── page-contato.php
      ├── page-conteudos.php
      ├── page-politicas.php
      ├── assets/
      │   ├── css/
      │   │   └── styles.css (copiar do Tailwind compilado)
      │   ├── js/
      │   │   └── scripts.js
      │   └── images/
      │       ├── hero-lab.jpg
      │       ├── team-collab.jpg
      │       └── facility.jpg
```

### Passos para Conversão:

#### 1. Criar Tema Base
Crie `style.css` no diretório do tema:
```css
/*
Theme Name: Vivens
Theme URI: https://vivenslab.com
Author: Vivens
Description: Tema institucional da Vivens
Version: 1.0
*/
```

#### 2. Copiar Estilos
- Compile o Tailwind CSS: `npm run build`
- Copie o CSS compilado de `dist/assets/*.css` para `assets/css/styles.css`
- Inclua no `functions.php`:
```php
<?php
function vivens_enqueue_styles() {
    wp_enqueue_style('vivens-styles', get_template_directory_uri() . '/assets/css/styles.css');
}
add_action('wp_enqueue_scripts', 'vivens_enqueue_styles');
?>
```

#### 3. Copiar Imagens
Copie todos os arquivos de `src/assets/` para `assets/images/`

#### 4. Converter Componentes React para PHP

**Header (header.php):**
```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<header class="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
    <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
            <a href="<?php echo home_url(); ?>" class="text-2xl font-bold text-primary">
                VIVENS
            </a>
            <div class="hidden md:flex items-center space-x-6">
                <a href="<?php echo home_url('/sobre'); ?>" class="text-foreground/80 hover:text-primary">Sobre</a>
                <a href="<?php echo home_url('/servicos'); ?>" class="text-foreground/80 hover:text-primary">Serviços</a>
                <a href="<?php echo home_url('/infraestrutura'); ?>" class="text-foreground/80 hover:text-primary">Infraestrutura</a>
                <a href="<?php echo home_url('/setores'); ?>" class="text-foreground/80 hover:text-primary">Setores</a>
                <a href="<?php echo home_url('/conteudos'); ?>" class="text-foreground/80 hover:text-primary">Conteúdos</a>
                <a href="<?php echo home_url('/equipe'); ?>" class="text-foreground/80 hover:text-primary">Equipe</a>
                <a href="<?php echo home_url('/contato'); ?>" class="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg">Contato</a>
            </div>
        </div>
    </nav>
</header>
```

**Footer (footer.php):**
```php
<footer class="bg-primary text-primary-foreground">
    <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 class="text-2xl font-bold mb-4">VIVENS</h3>
                <p class="opacity-90">Excelência em pesquisa pré-clínica</p>
            </div>
            <div>
                <h4 class="font-semibold mb-4">Navegação</h4>
                <ul class="space-y-2 opacity-90">
                    <li><a href="<?php echo home_url('/sobre'); ?>">Sobre</a></li>
                    <li><a href="<?php echo home_url('/servicos'); ?>">Serviços</a></li>
                    <li><a href="<?php echo home_url('/infraestrutura'); ?>">Infraestrutura</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold mb-4">Contato</h4>
                <ul class="space-y-2 opacity-90">
                    <li>vivensconsultoria@gmail.com</li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold mb-4">Legal</h4>
                <ul class="space-y-2 opacity-90">
                    <li><a href="<?php echo home_url('/politicas'); ?>">Políticas de Privacidade</a></li>
                </ul>
            </div>
        </div>
        <div class="border-t border-primary-foreground/20 mt-8 pt-8 text-center opacity-90">
            <p>&copy; <?php echo date('Y'); ?> Vivens. Todos os direitos reservados.</p>
        </div>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
```

#### 5. Criar Templates de Página

Para cada página React, crie um template PHP correspondente (ex: `page-sobre.php`):
```php
<?php
/*
Template Name: Sobre
*/
get_header();
?>

<div class="min-h-screen pt-20">
    <section class="py-20 bg-gradient-to-b from-primary to-accent text-white">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="text-5xl font-bold mb-6">Sobre a Vivens</h1>
                <p class="text-xl opacity-90">
                    Transformando a pesquisa pré-clínica no Brasil
                </p>
            </div>
        </div>
    </section>
    
    <!-- Copie o resto do conteúdo da página React aqui -->
</div>

<?php get_footer(); ?>
```

## Opção 2: WordPress Headless (Mais Moderno)

Use WordPress apenas como CMS e mantenha o frontend React:

### Configuração:
1. Instale WordPress normalmente
2. Ative a REST API
3. Use plugin WPGraphQL (opcional, mas recomendado)
4. Configure CORS no WordPress
5. Conecte o frontend React à API do WordPress

### Vantagens:
- Mantém toda a interatividade do React
- Editor visual no WordPress
- Melhor performance
- Separação clara entre frontend e backend

### No React, use fetch para buscar conteúdo:
```javascript
const fetchPage = async (slug) => {
  const response = await fetch(`https://seusite.com/wp-json/wp/v2/pages?slug=${slug}`);
  const data = await response.json();
  return data[0];
};
```

## Opção 3: Plugin WordPress React (Híbrido)

### Instale um plugin que permite React no WordPress:
- **WP React Plugin** ou
- **Gutenberg Blocks customizados em React**

### Passos:
1. Crie um plugin WordPress
2. Registre os scripts React compilados
3. Use shortcodes para inserir componentes React nas páginas

```php
function vivens_react_app() {
    wp_enqueue_script('vivens-react', get_template_directory_uri() . '/build/static/js/main.js', array(), '1.0', true);
    wp_enqueue_style('vivens-react-css', get_template_directory_uri() . '/build/static/css/main.css');
    return '<div id="root"></div>';
}
add_shortcode('vivens_app', 'vivens_react_app');
```

## Recomendação Final

Para o site institucional da Vivens, recomendo:

**OPÇÃO 1 (Conversão Manual)** se:
- Você quer total controle do WordPress
- Não precisa de muita interatividade
- Quer facilidade de edição para não-desenvolvedores

**OPÇÃO 2 (Headless)** se:
- Quer manter a experiência moderna do React
- Precisa de alta performance
- Tem equipe técnica para manutenção

---

## Arquivos Prontos para Exportação

Todos os arquivos necessários estão organizados neste projeto:

### Estrutura Atual:
```
src/
├── assets/          → Copiar para WordPress theme/assets/images/
├── components/      → Converter para includes PHP ou manter se usar headless
├── pages/          → Converter para page templates PHP
└── index.css       → Compilar e copiar para theme/assets/css/
```

### Checklist de Exportação:
- [ ] Compilar CSS do Tailwind (`npm run build`)
- [ ] Copiar imagens de `src/assets/`
- [ ] Converter componentes Header e Footer
- [ ] Criar templates de página para cada rota
- [ ] Configurar menu de navegação no WordPress
- [ ] Criar páginas no admin do WordPress
- [ ] Aplicar templates às páginas
- [ ] Configurar formulário de contato (Contact Form 7 ou WPForms)
- [ ] Testar todos os links e navegação
- [ ] Configurar SEO (Yoast SEO ou Rank Math)

## Plugins WordPress Recomendados:
- **Contact Form 7** ou **WPForms** - Formulário de contato
- **Yoast SEO** - Otimização SEO
- **Advanced Custom Fields (ACF)** - Campos personalizados
- **WP Fastest Cache** - Cache e performance
- **Wordfence** - Segurança

## Suporte Técnico
Para dúvidas sobre a implementação, consulte:
- Documentação WordPress: https://developer.wordpress.org/
- Tailwind CSS: https://tailwindcss.com/docs
- React to WordPress: https://www.wpbeginner.com/
