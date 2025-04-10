// main.js - iCornudo.com - Versión optimizada

document.addEventListener('DOMContentLoaded', () => {
    // Config global
    const CONFIG = {
        mobileBreakpoint: 768,
        scrollOffset: 100,
        animationDelay: 100,
    };

    // Inicialización de componentes
    initializeComponents();

    function initializeComponents() {
        initNavigation();
        initScrollAnimations();
        initButtonEffects();
        initLazyLoading();
        initCTAEnhancements();
        removePreloadState();
    }

    // Sistema de navegación mejorado
    function initNavigation() {
        const header = document.querySelector('.main-header');
        const menuButton = document.getElementById('mobile-menu-toggle');
        const mainNav = document.getElementById('main-nav');
        let isAnimating = false;

        // Manejo del menú móvil
        const toggleMenu = (force) => {
            if (isAnimating) return;
            isAnimating = true;

            const isOpen = force ?? !mainNav.classList.contains('is-open');
            mainNav.classList.toggle('is-open', isOpen);
            menuButton.setAttribute('aria-expanded', String(isOpen));
            menuButton.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            
            if (isOpen) {
                document.body.style.overflow = 'hidden';
                animateMenuItems(true);
            } else {
                document.body.style.overflow = '';
                animateMenuItems(false);
            }

            setTimeout(() => isAnimating = false, 400);
        };

        // Animación de items del menú
        const animateMenuItems = (show) => {
            const items = mainNav.getElementsByTagName('li');
            Array.from(items).forEach((item, index) => {
                item.style.transitionDelay = show ? `${index * 50}ms` : '0ms';
                item.style.transform = show ? 'translateX(0)' : 'translateX(-20px)';
                item.style.opacity = show ? '1' : '0';
            });
        };

        // Event Listeners
        if (menuButton && mainNav) {
            menuButton.addEventListener('click', (e) => {
                e.preventDefault();
                toggleMenu();
            });

            // Cerrar menú al hacer click fuera
            document.addEventListener('click', (e) => {
                if (mainNav.classList.contains('is-open') && 
                    !mainNav.contains(e.target) && 
                    !menuButton.contains(e.target)) {
                    toggleMenu(false);
                }
            });

            // Soporte para gestos táctiles
            let touchStartX = 0;
            mainNav.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });

            mainNav.addEventListener('touchmove', (e) => {
                if (mainNav.classList.contains('is-open')) {
                    const touchEndX = e.touches[0].clientX;
                    const diff = touchStartX - touchEndX;
                    
                    if (diff > 50) {
                        toggleMenu(false);
                    }
                }
            });
        }

        // Manejo del scroll
        let lastScroll = 0;
        window.addEventListener('scroll', throttle(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > CONFIG.scrollOffset) {
                header.classList.add('scrolled');
                if (currentScroll > lastScroll) {
                    header.classList.add('header-hidden');
                } else {
                    header.classList.remove('header-hidden');
                }
            } else {
                header.classList.remove('scrolled', 'header-hidden');
            }
            
            lastScroll = currentScroll;
        }, 100));
    }

    // Animaciones al hacer scroll
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.dataset.delay) {
                        entry.target.style.transitionDelay = `${entry.target.dataset.delay}ms`;
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // Mejoras en efectos de botones
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.btn, .social-btn');
        
        buttons.forEach(button => {
            // Efecto de ripple al click
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                
                ripple.className = 'ripple';
                ripple.style.left = `${e.clientX - rect.left}px`;
                ripple.style.top = `${e.clientY - rect.top}px`;
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 1000);
            });

            // Efecto hover mejorado
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.style.setProperty('--x', `${x}px`);
                this.style.setProperty('--y', `${y}px`);
            });
        });
    }

    // Sistema de carga perezosa de imágenes
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Mejoras en llamadas a la acción
    function initCTAEnhancements() {
        const ctaButtons = document.querySelectorAll('.social-btn, .btn-primary');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Añadir efecto de click
                button.classList.add('clicked');
                setTimeout(() => button.classList.remove('clicked'), 300);

                // Tracking de eventos (si se implementa Analytics)
                trackButtonClick(button);
            });

            // Añadir atributos de accesibilidad
            if (!button.getAttribute('aria-label')) {
                const text = button.textContent.trim();
                button.setAttribute('aria-label', text);
            }
        });
    }

    // Función para trackear clicks (placeholder)
    function trackButtonClick(button) {
        const buttonText = button.textContent.trim();
        const buttonType = button.classList.contains('social-btn') ? 'social' : 'primary';
        
        // Aquí se implementaría la lógica de tracking
        console.log(`Button clicked: ${buttonText} (${buttonType})`);
    }

    // Remover estado de precarga
    function removePreloadState() {
        setTimeout(() => {
            document.body.classList.remove('preload');
        }, 100);
    }

    // Utilidad para throttle
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
});