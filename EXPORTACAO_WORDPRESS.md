# Guia Completo de Exportação para WordPress

Este guia fornece instruções detalhadas para converter o projeto Vivens (React/Vite) em um tema WordPress funcional.

## 📋 Visão Geral

O projeto atual usa:
- **Frontend**: React 18 + Vite + TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Roteamento**: React Router DOM v6

Para WordPress, você precisará:
- Converter componentes React para PHP
- Compilar CSS do Tailwind
- Adaptar a estrutura de navegação
- Criar templates de página personalizados

---

## 🎯 Método Recomendado: Tema WordPress Personalizado

### Estrutura do Tema

```
wp-content/themes/vivens/
├── style.css                 # Informações do tema
├── functions.php             # Funcionalidades e hooks
├── header.php                # Cabeçalho global
├── footer.php                # Rodapé global
├── index.php                 # Template padrão
├── front-page.php            # Template da Home
├── page.php                  # Template genérico de páginas
├── page-sobre.php            # Template personalizado: Sobre
├── page-servicos.php         # Template personalizado: Serviços (hub)
├── page-consultoria.php      # Serviço: Consultoria
├── page-toxicologia.php      # Serviço: Toxicologia
├── page-educacao.php         # Serviço: Educação
├── page-bem-estar.php        # Serviço: Bem-estar Animal
├── page-veterinaria.php      # Serviço: Veterinária
├── page-infraestrutura.php   # Template: Infraestrutura
├── page-setores.php          # Template: Setores
├── page-equipe.php           # Template: Equipe
├── page-contato.php          # Template: Contato
├── page-conteudos.php        # Template: Conteúdos
├── page-politicas.php        # Template: Políticas
├── 404.php                   # Página não encontrada
├── screenshot.png            # Screenshot do tema (1200x900px)
└── assets/
    ├── css/
    │   └── main.css          # CSS compilado do Tailwind
    ├── js/
    │   └── main.js           # JavaScript (se necessário)
    └── images/
        ├── hero-lab.jpg
        ├── team-collab.jpg
        └── facility.jpg
```

---

## 🚀 Passo 1: Preparar os Arquivos

### 1.1 Compilar CSS do Tailwind

No projeto React atual, execute:

```bash
npm run build
```

Os arquivos compilados estarão em `dist/`. Procure por:
- `dist/assets/*.css` → Este é seu CSS compilado

### 1.2 Copiar Imagens

Copie todas as imagens de `src/assets/` para `wp-content/themes/vivens/assets/images/`

---

## 🎨 Passo 2: Criar Arquivos Base do Tema

### 2.1 `style.css`

```css
/*
Theme Name: Vivens
Theme URI: https://vivenslab.com
Author: Vivens Lab
Author URI: https://vivenslab.com
Description: Tema institucional moderno da Vivens - Excelência em pesquisa pré-clínica
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: vivens
Tags: clean, modern, business, corporate, science

Vivens Theme - Desenvolvido com React e convertido para WordPress
*/
```

### 2.2 `functions.php`

```php
<?php
/**
 * Vivens Theme Functions
 */

// Enfileirar estilos e scripts
function vivens_enqueue_assets() {
    // CSS principal (Tailwind compilado)
    wp_enqueue_style(
        'vivens-main-style',
        get_template_directory_uri() . '/assets/css/main.css',
        array(),
        '1.0.0'
    );
    
    // JavaScript (se necessário)
    wp_enqueue_script(
        'vivens-main-script',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'vivens_enqueue_assets');

// Suporte a recursos do tema
function vivens_theme_support() {
    // Título dinâmico
    add_theme_support('title-tag');
    
    // Logo personalizado
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    
    // Imagem destacada
    add_theme_support('post-thumbnails');
    
    // HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
}
add_action('after_setup_theme', 'vivens_theme_support');

// Registrar menus
function vivens_register_menus() {
    register_nav_menus(array(
        'primary' => __('Menu Principal', 'vivens'),
        'footer'  => __('Menu Rodapé', 'vivens'),
    ));
}
add_action('init', 'vivens_register_menus');

// Remover emojis (performance)
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

// Limpar wp_head
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
?>
```

---

## 📄 Passo 3: Criar Templates PHP Completos

Agora vou fornecer os templates PHP completos prontos para uso. Copie cada código para os respectivos arquivos no tema WordPress.

### 3.1 `header.php`

```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php bloginfo('description'); ?>">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
    <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="text-2xl font-bold text-primary">
                <?php 
                if (has_custom_logo()) {
                    the_custom_logo();
                } else {
                    echo 'VIVENS';
                }
                ?>
            </a>
            
            <!-- Menu Desktop -->
            <div class="hidden md:flex items-center space-x-6">
                <a href="<?php echo esc_url(home_url('/sobre')); ?>" class="text-foreground/80 hover:text-primary transition-colors">Sobre</a>
                <a href="<?php echo esc_url(home_url('/servicos')); ?>" class="text-foreground/80 hover:text-primary transition-colors">Serviços</a>
                <a href="<?php echo esc_url(home_url('/infraestrutura')); ?>" class="text-foreground/80 hover:text-primary transition-colors">Infraestrutura</a>
                <a href="<?php echo esc_url(home_url('/setores')); ?>" class="text-foreground/80 hover:text-primary transition-colors">Setores</a>
                <a href="<?php echo esc_url(home_url('/conteudos')); ?>" class="text-foreground/80 hover:text-primary transition-colors">Conteúdos</a>
                <a href="<?php echo esc_url(home_url('/equipe')); ?>" class="text-foreground/80 hover:text-primary transition-colors">Equipe</a>
                <a href="<?php echo esc_url(home_url('/contato')); ?>" class="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors">Contato</a>
            </div>
            
            <!-- Menu Mobile -->
            <button class="md:hidden p-2" id="mobile-menu-button" aria-label="Menu">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
        
        <!-- Menu Mobile (oculto por padrão) -->
        <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4">
            <div class="flex flex-col space-y-3">
                <a href="<?php echo esc_url(home_url('/sobre')); ?>" class="text-foreground/80 hover:text-primary">Sobre</a>
                <a href="<?php echo esc_url(home_url('/servicos')); ?>" class="text-foreground/80 hover:text-primary">Serviços</a>
                <a href="<?php echo esc_url(home_url('/infraestrutura')); ?>" class="text-foreground/80 hover:text-primary">Infraestrutura</a>
                <a href="<?php echo esc_url(home_url('/setores')); ?>" class="text-foreground/80 hover:text-primary">Setores</a>
                <a href="<?php echo esc_url(home_url('/conteudos')); ?>" class="text-foreground/80 hover:text-primary">Conteúdos</a>
                <a href="<?php echo esc_url(home_url('/equipe')); ?>" class="text-foreground/80 hover:text-primary">Equipe</a>
                <a href="<?php echo esc_url(home_url('/contato')); ?>" class="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg inline-block text-center">Contato</a>
            </div>
        </div>
    </nav>
</header>

<!-- Espaçamento para o header fixo -->
<div class="h-20"></div>
```

### 3.2 `footer.php`

```php
<footer class="bg-primary text-primary-foreground">
    <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Coluna 1: Sobre -->
            <div>
                <h3 class="text-2xl font-bold mb-4">VIVENS</h3>
                <p class="opacity-90 mb-4">
                    Excelência em pesquisa pré-clínica com compromisso ético e científico
                </p>
            </div>
            
            <!-- Coluna 2: Navegação -->
            <div>
                <h4 class="font-semibold mb-4">Navegação</h4>
                <ul class="space-y-2 opacity-90">
                    <li><a href="<?php echo esc_url(home_url('/sobre')); ?>" class="hover:text-secondary transition-colors">Sobre</a></li>
                    <li><a href="<?php echo esc_url(home_url('/servicos')); ?>" class="hover:text-secondary transition-colors">Serviços</a></li>
                    <li><a href="<?php echo esc_url(home_url('/infraestrutura')); ?>" class="hover:text-secondary transition-colors">Infraestrutura</a></li>
                    <li><a href="<?php echo esc_url(home_url('/setores')); ?>" class="hover:text-secondary transition-colors">Setores</a></li>
                    <li><a href="<?php echo esc_url(home_url('/equipe')); ?>" class="hover:text-secondary transition-colors">Equipe</a></li>
                </ul>
            </div>
            
            <!-- Coluna 3: Contato -->
            <div>
                <h4 class="font-semibold mb-4">Contato</h4>
                <ul class="space-y-2 opacity-90">
                    <li>📧 vivensconsultoria@gmail.com</li>
                    <li>📍 Brasília - DF</li>
                    <li><a href="<?php echo esc_url(home_url('/contato')); ?>" class="hover:text-secondary transition-colors">Formulário de Contato</a></li>
                </ul>
            </div>
            
            <!-- Coluna 4: Legal -->
            <div>
                <h4 class="font-semibold mb-4">Legal</h4>
                <ul class="space-y-2 opacity-90">
                    <li><a href="<?php echo esc_url(home_url('/politicas')); ?>" class="hover:text-secondary transition-colors">Políticas de Privacidade</a></li>
                    <li><a href="<?php echo esc_url(home_url('/conteudos')); ?>" class="hover:text-secondary transition-colors">Conteúdos</a></li>
                </ul>
            </div>
        </div>
        
        <div class="border-t border-primary-foreground/20 mt-8 pt-8 text-center opacity-90">
            <p>&copy; <?php echo date('Y'); ?> Vivens. Todos os direitos reservados.</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
<script>
// Menu mobile toggle
document.getElementById('mobile-menu-button')?.addEventListener('click', function() {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
});
</script>
</body>
</html>
```

### 3.3 `front-page.php` (Página Inicial/Home)

```php
<?php
/*
Template Name: Home
*/
get_header();
?>

<!-- Hero Section -->
<section class="relative h-[600px] flex items-center justify-center bg-gradient-to-b from-primary to-accent text-white">
    <div class="absolute inset-0 opacity-20">
        <img 
            src="<?php echo get_template_directory_uri(); ?>/assets/images/hero-lab.jpg" 
            alt="Laboratório Vivens" 
            class="w-full h-full object-cover"
        />
    </div>
    <div class="relative container mx-auto px-4 text-center z-10">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
            Excelência em Pesquisa Pré-clínica
        </h1>
        <p class="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Combinamos ciência de ponta com práticas éticas, oferecendo soluções completas 
            para estudos in vivo e consultoria regulatória
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
            <a href="<?php echo esc_url(home_url('/servicos')); ?>" 
               class="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:bg-secondary/90 transition-colors">
                Nossos Serviços
            </a>
            <a href="<?php echo esc_url(home_url('/contato')); ?>" 
               class="bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/90 transition-colors">
                Solicitar Orçamento
            </a>
        </div>
    </div>
</section>

<!-- Serviços Section -->
<section class="py-20 bg-gradient-to-b from-background to-muted/30">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-4">Nossos Serviços</h2>
            <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
                Soluções completas em ciência pré-clínica com foco em qualidade e ética
            </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Card 1 - Testes Pré-clínicos -->
            <a href="<?php echo esc_url(home_url('/toxicologia')); ?>" class="block">
                <div class="bg-card rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 h-full">
                    <svg class="w-12 h-12 text-secondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <h3 class="text-xl font-semibold mb-3">Testes Pré-clínicos</h3>
                    <p class="text-muted-foreground">
                        Estudos toxicológicos de doses repetidas, MTD e protocolos customizados
                    </p>
                </div>
            </a>
            
            <!-- Card 2 - Consultoria -->
            <a href="<?php echo esc_url(home_url('/consultoria')); ?>" class="block">
                <div class="bg-card rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 h-full">
                    <svg class="w-12 h-12 text-secondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h3 class="text-xl font-semibold mb-3">Consultoria Científica</h3>
                    <p class="text-muted-foreground">
                        Soluções personalizadas em pesquisa e conformidade regulatória CONCEA/ANVISA
                    </p>
                </div>
            </a>
            
            <!-- Card 3 - Educação -->
            <a href="<?php echo esc_url(home_url('/educacao')); ?>" class="block">
                <div class="bg-card rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 h-full">
                    <svg class="w-12 h-12 text-secondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                    </svg>
                    <h3 class="text-xl font-semibold mb-3">Educação e Treinamento</h3>
                    <p class="text-muted-foreground">
                        Cursos em Ciência de Animais de Laboratório e Gestão da Qualidade
                    </p>
                </div>
            </a>
            
            <!-- Card 4 - Bem-estar -->
            <a href="<?php echo esc_url(home_url('/bem-estar')); ?>" class="block">
                <div class="bg-card rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 h-full">
                    <svg class="w-12 h-12 text-secondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <h3 class="text-xl font-semibold mb-3">Bem-estar Animal</h3>
                    <p class="text-muted-foreground">
                        Foco em ética e práticas 3Rs para garantir o bem-estar dos animais
                    </p>
                </div>
            </a>
        </div>
        
        <div class="text-center mt-12">
            <a href="<?php echo esc_url(home_url('/servicos')); ?>" 
               class="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:bg-secondary/90 transition-colors">
                Ver Todos os Serviços
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
            </a>
        </div>
    </div>
</section>

<!-- Números Section -->
<section class="py-20 bg-primary text-primary-foreground">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-4xl font-bold mb-4">Vivens em Números</h2>
            <p class="text-xl opacity-90">Dados que refletem nosso compromisso com a excelência</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div class="text-center">
                <div class="text-5xl font-bold mb-2">1.500</div>
                <div class="opacity-90">m² de instalações</div>
            </div>
            <div class="text-center">
                <div class="text-5xl font-bold mb-2">80</div>
                <div class="opacity-90">Racks ventilados SPF</div>
            </div>
            <div class="text-center">
                <div class="text-5xl font-bold mb-2">100%</div>
                <div class="opacity-90">Conformidade CONCEA</div>
            </div>
            <div class="text-center">
                <div class="text-5xl font-bold mb-2">3Rs</div>
                <div class="opacity-90">Práticas éticas</div>
            </div>
        </div>
    </div>
</section>

<!-- CTA Final -->
<section class="py-20 bg-accent text-white">
    <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-6">Pronto para começar seu projeto?</h2>
        <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar sua pesquisa a alcançar 
            novos patamares com ética e excelência.
        </p>
        <a href="<?php echo esc_url(home_url('/contato')); ?>" 
           class="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-10 py-4 rounded-lg text-xl font-semibold hover:bg-secondary/90 transition-colors">
            Solicitar Orçamento
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
        </a>
    </div>
</section>

<?php get_footer(); ?>
```

---

## ✅ Checklist Completo de Implementação

### Preparação (Local)
- [ ] Executar `npm run build` no projeto React
- [ ] Copiar `dist/assets/*.css` → renomear para `main.css`
- [ ] Copiar imagens de `src/assets/` → preparar para upload
- [ ] Criar `screenshot.png` do tema (1200x900px)

### Criação do Tema
- [ ] Criar pasta `vivens` em `wp-content/themes/`
- [ ] Criar `style.css` com informações do tema
- [ ] Criar `functions.php` completo
- [ ] Criar pasta `assets/` com subpastas `css/`, `js/`, `images/`
- [ ] Fazer upload do `main.css` para `assets/css/`
- [ ] Fazer upload das imagens para `assets/images/`

### Templates
- [ ] Criar `header.php`
- [ ] Criar `footer.php`
- [ ] Criar `index.php` (pode copiar de `front-page.php`)
- [ ] Criar `front-page.php`
- [ ] Criar `page.php` (template genérico)
- [ ] Criar `page-contato.php` (com formulário)
- [ ] Criar `404.php`
- [ ] Criar demais templates de páginas conforme necessário

### Configuração WordPress
- [ ] Ativar tema no painel WordPress
- [ ] Definir "Leitura" → "Uma página estática" como Home
- [ ] Criar todas as páginas necessárias
- [ ] Atribuir templates personalizados às páginas
- [ ] Configurar permalinks ("Nome do post")
- [ ] Criar menus de navegação

### Testes e Otimizações
- [ ] Testar todas as páginas
- [ ] Testar responsividade (mobile/tablet/desktop)
- [ ] Instalar plugin de cache
- [ ] Instalar plugin de SEO
- [ ] Configurar formulário de contato
- [ ] Otimizar imagens
- [ ] Testar velocidade (PageSpeed Insights)

---

## 🔌 Plugins Recomendados

1. **Contact Form 7** - Formulário de contato
2. **Yoast SEO** ou **Rank Math** - SEO
3. **WP Fastest Cache** - Performance
4. **Wordfence Security** - Segurança
5. **Smush** - Otimização de imagens

---

## 📚 Recursos Úteis

- WordPress Codex: https://codex.wordpress.org/
- Developer Docs: https://developer.wordpress.org/
- Tailwind CSS: https://tailwindcss.com/docs

---

✨ **Tema completo e pronto para implementação no WordPress!**
