// main.js - iCornudo.com - Versión optimizada

document.addEventListener('DOMContentLoaded', () => {
    const siteName = 'iCornudo';

    // --- Quitar clase preload para evitar FOUC (Flash of Unstyled Content) ---
    document.body.classList.remove('preload');
    console.log(`${siteName} JS Initialized (Versión optimizada)`);

    // --- Funcionalidad del Menú Móvil ---
    const mobileMenuButton = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('is-open');
            mobileMenuButton.setAttribute('aria-expanded', isOpen);
            mobileMenuButton.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        
        // Cerrar menú al hacer clic en enlaces
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-open')) {
                    mainNav.classList.remove('is-open');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (event) => {
            if (!mainNav.contains(event.target) && !mobileMenuButton.contains(event.target) && mainNav.classList.contains('is-open')) {
                mainNav.classList.remove('is-open');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            }
        });
    }

    // --- Actualizar Año en Footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) { 
        currentYearSpan.textContent = new Date().getFullYear(); 
    }

    // --- Efecto Fade-in en Scroll ---
    const sectionsToFade = document.querySelectorAll('.fade-in-section');
    if (sectionsToFade.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = { 
            threshold: 0.15, 
            rootMargin: '0px 0px -50px 0px' 
        };
        
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        sectionsToFade.forEach(section => { 
            sectionObserver.observe(section); 
        });
    } else if (sectionsToFade.length > 0) { 
        // Fallback para navegadores sin soporte para IntersectionObserver
        sectionsToFade.forEach(section => section.classList.add('is-visible'));
    }

    // --- Gestión del Banner de Cookies ---
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptButton = document.getElementById('accept-cookies');
    
    if (cookieBanner && acceptButton) {
        const cookieName = `${siteName.toLowerCase()}_cookie_consent`;
        
        // Funciones auxiliares para cookies
        const getCookie = (name) => {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        };
        
        const setCookie = (name, value, days) => {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
        };
        
        // Mostrar banner si no hay consentimiento
        const consentValue = getCookie(cookieName);
        if (!consentValue || consentValue !== 'accepted') {
            cookieBanner.hidden = false;
            setTimeout(() => { 
                cookieBanner.classList.add('show'); 
            }, 500);
        }
        
        // Manejar clic en botón de aceptar
        acceptButton.addEventListener('click', () => {
            setCookie(cookieName, 'accepted', 365);
            cookieBanner.classList.remove('show');
            setTimeout(() => { 
                cookieBanner.hidden = true; 
            }, 500);
        });
    }

    // --- Animación de elementos al cargar la página ---
    const animateElements = document.querySelectorAll('.fade-in');
    if (animateElements.length > 0) {
        setTimeout(() => {
            animateElements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * 100);
            });
        }, 300);
    }

    // --- Cargar imágenes de fondo dinámicamente ---
    const lazyBackgrounds = document.querySelectorAll('.hero-bg');
    if (lazyBackgrounds.length > 0) {
        lazyBackgrounds.forEach(bg => {
            if (bg.style.backgroundImage) {
                const img = new Image();
                const bgSrc = bg.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (bgSrc && bgSrc[1]) {
                    img.src = bgSrc[1];
                    img.onload = () => {
                        bg.classList.add('loaded');
                    };
                }
            }
        });
    }

}); // Fin DOMContentLoaded