/**
 * ICORNUDO - Script principal
 * Funcionalidades interactivas para mejorar la experiencia de usuario
 */

document.addEventListener('DOMContentLoaded', function() {
    // Cargar utilidades
    const utils = window.ICORNUDO && window.ICORNUDO.utils;
    // Navegación responsive
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Inicializar animaciones al hacer scroll
    if (utils && utils.initScrollAnimations) {
        utils.initScrollAnimations();
    } else {
        // Fallback si no se cargaron las utilidades
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        
        function checkScroll() {
            const triggerBottom = window.innerHeight * 0.8;
            
            animateElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                
                if (elementTop < triggerBottom) {
                    element.classList.add('visible');
                }
            });
        }
        
        // Verificar elementos al cargar la página
        checkScroll();
        
        // Verificar elementos al hacer scroll
        window.addEventListener('scroll', checkScroll);
    }

    // Contador para estadísticas
    const counters = document.querySelectorAll('.counter');
    
    if (utils && utils.initCounters) {
        utils.initCounters(counters);
    } else {
        // Fallback si no se cargaron las utilidades
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // ms
            const step = target / (duration / 16); // 60fps
            
            let count = 0;
            const updateCounter = () => {
                count += step;
                
                if (count < target) {
                    counter.textContent = Math.floor(count);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Iniciar contador cuando sea visible
            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });
            
            observer.observe(counter);
        });
    }

    // Validación de formulario de contacto
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const subjectInput = document.getElementById('subject'); // Opcional, puede no existir en todos los formularios
            
            let isValid = true;
            
            // Funciones de utilidad para validación
            const showErrorFunc = utils && utils.showError ? utils.showError : showError;
            const removeErrorFunc = utils && utils.removeError ? utils.removeError : removeError;
            const isValidEmailFunc = utils && utils.isValidEmail ? utils.isValidEmail : isValidEmail;
            
            // Validar nombre
            if (nameInput.value.trim() === '') {
                showErrorFunc(nameInput, 'Por favor, introduce tu nombre');
                isValid = false;
            } else {
                removeErrorFunc(nameInput);
            }
            
            // Validar email
            if (emailInput.value.trim() === '') {
                showErrorFunc(emailInput, 'Por favor, introduce tu email');
                isValid = false;
            } else if (!isValidEmailFunc(emailInput.value)) {
                showErrorFunc(emailInput, 'Por favor, introduce un email válido');
                isValid = false;
            } else {
                removeErrorFunc(emailInput);
            }
            
            // Validar asunto (si existe)
            if (subjectInput && subjectInput.value === '') {
                showErrorFunc(subjectInput, 'Por favor, selecciona un asunto');
                isValid = false;
            } else if (subjectInput) {
                removeErrorFunc(subjectInput);
            }
            
            // Validar mensaje
            if (messageInput.value.trim() === '') {
                showErrorFunc(messageInput, 'Por favor, introduce tu mensaje');
                isValid = false;
            } else {
                removeErrorFunc(messageInput);
            }
            
            // Si todo es válido, mostrar mensaje de éxito
            if (isValid) {
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
                
                contactForm.reset();
                contactForm.appendChild(successMessage);
                
                // Eliminar mensaje después de 5 segundos
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
    
    // Funciones de utilidad locales (fallback si no se carga utils.js)
    function showError(input, message) {
        const formControl = input.parentElement;
        const errorMessage = formControl.querySelector('.error-message') || document.createElement('div');
        
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        if (!formControl.querySelector('.error-message')) {
            formControl.appendChild(errorMessage);
        }
        
        formControl.className = 'form-control error';
    }
    
    function removeError(input) {
        const formControl = input.parentElement;
        const errorMessage = formControl.querySelector('.error-message');
        
        if (errorMessage) {
            errorMessage.remove();
        }
        
        formControl.className = 'form-control';
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Botón de "Volver arriba"
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Efecto de resaltado para botones CTA
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.classList.add('pulse');
        });
        
        button.addEventListener('mouseout', function() {
            this.classList.remove('pulse');
        });
    });

    // Lazy loading para imágenes
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Importar el polyfill de lazy loading
        const script = document.createElement('script');
        script.src = 'js/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // Optimizar analytics
    const sendAnalytics = (eventName, eventData) => {
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/analytics', JSON.stringify({
                event: eventName,
                data: eventData,
                timestamp: Date.now()
            }));
        }
    };

    // Mejora en el tracking de analytics
    const trackSocialClick = (platform, url) => {
        console.log(`Click en ${platform}:`, url);
        // Aquí puedes añadir tu código de analytics
    };

    document.querySelectorAll('a[href*="x.com"]').forEach(link => {
        link.addEventListener('click', () => trackSocialClick('X', link.href));
    });
});
            const thankYou = document.createElement('div');
            thankYou.className = 'thank-you-popup';
            thankYou.innerHTML = '<p>¡Gracias por unirte! Te esperamos en Telegram.</p>';
            document.body.appendChild(thankYou);
            
            setTimeout(() => {
                thankYou.remove();
            }, 3000);
        });
    });

    // Tracking de clics en enlaces de redes sociales
    const socialLinks = document.querySelectorAll('a[href*="x.com"]');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // En un entorno real, aquí se enviaría un evento de analytics
            console.log('Clic en enlace de X:', this.href);
            
            // Añadir clase para efecto visual
            this.classList.add('clicked');
            
            // Opcional: Mostrar mensaje de agradecimiento
            const thankYou = document.createElement('div');
            thankYou.className = 'thank-you-popup';
            thankYou.innerHTML = '<p>¡Gracias por unirte! Te esperamos en X.</p>';
            document.body.appendChild(thankYou);
            
            setTimeout(() => {
                thankYou.remove();
            }, 3000);
        });
    });
});
