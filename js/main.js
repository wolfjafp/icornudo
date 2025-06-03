/**
 * ICORNUDO - Script principal
 * Funcionalidades interactivas para mejorar la experiencia de usuario
 */

document.addEventListener('DOMContentLoaded', function() {
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

    // Animación de aparición al hacer scroll
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

    // Contador para estadísticas (simulado)
    const counters = document.querySelectorAll('.counter');
    
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

    // Validación de formulario de contacto
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            // Validar nombre
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Por favor, introduce tu nombre');
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            // Validar email
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Por favor, introduce tu email');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Por favor, introduce un email válido');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            // Validar mensaje
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Por favor, introduce tu mensaje');
                isValid = false;
            } else {
                removeError(messageInput);
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

    // Tracking de clics en enlaces de Telegram (para análisis)
    const telegramLinks = document.querySelectorAll('a[href*="t.me"]');
    
    telegramLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // En un entorno real, aquí se enviaría un evento de analytics
            console.log('Clic en enlace de Telegram:', this.href);
            
            // Añadir clase para efecto visual
            this.classList.add('clicked');
            
            // Opcional: Mostrar mensaje de agradecimiento
            const thankYou = document.createElement('div');
            thankYou.className = 'thank-you-popup';
            thankYou.innerHTML = '<p>¡Gracias por unirte! Te esperamos en Telegram.</p>';
            document.body.appendChild(thankYou);
            
            setTimeout(() => {
                thankYou.remove();
            }, 3000);
        });
    });
});
