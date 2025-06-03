/**
 * ICORNUDO - Validación de formularios
 * Funciones para validar y procesar formularios en el sitio
 */

document.addEventListener('DOMContentLoaded', () => {
    // Cargar utilidades
    const utils = window.ICORNUDO && window.ICORNUDO.utils;
    // Validación de formulario de contacto
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
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
            
            // Validar asunto
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
});

// Funciones de utilidad para formularios
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
