/**
 * ICORNUDO - Utilidades JavaScript
 * Funciones de utilidad reutilizables para todo el sitio
 */

/**
 * Valida si un email tiene formato correcto
 * @param {string} email - El email a validar
 * @return {boolean} - Verdadero si el email es válido
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Muestra un mensaje de error en un campo de formulario
 * @param {HTMLElement} input - El elemento input con error
 * @param {string} message - El mensaje de error a mostrar
 */
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

/**
 * Elimina un mensaje de error de un campo de formulario
 * @param {HTMLElement} input - El elemento input del que eliminar el error
 */
function removeError(input) {
    const formControl = input.parentElement;
    const errorMessage = formControl.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    
    formControl.className = 'form-control';
}

/**
 * Inicializa contadores animados
 * @param {NodeList} counters - Lista de elementos contador
 */
function initCounters(counters) {
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

/**
 * Inicializa animaciones al hacer scroll
 */
function initScrollAnimations() {
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

// Exportar funciones para uso global
window.ICORNUDO = window.ICORNUDO || {};
window.ICORNUDO.utils = {
    isValidEmail,
    showError,
    removeError,
    initCounters,
    initScrollAnimations
};
