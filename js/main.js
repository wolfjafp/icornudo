// main.js - iCornudo.com - v4 (Colores Suaves, CTAs Mejorados, Contacto Telegram via Copiar+Abrir)

document.addEventListener('DOMContentLoaded', () => {
    const siteName = 'iCornudo'; // Usado para cookie name
    const telegramUsername = 'zapaton69'; // TU USUARIO DE TELEGRAM para contacto

    // --- Quitar clase preload para evitar FOUC ---
    document.body.classList.remove('preload');
    console.log(`${siteName} JS Initialized (v4)`);

    // --- Funcionalidad del Menú Móvil ---
    const mobileMenuButton = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('is-open');
            mobileMenuButton.setAttribute('aria-expanded', isOpen);
            // Cambiar icono hamburguesa/cruz
            mobileMenuButton.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';

            // Opcional: Bloquear scroll del body cuando el menú está abierto
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Cerrar menú si se hace clic en un enlace del menú (para SPAs o navegación normal)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-open')) {
                    mainNav.classList.remove('is-open');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>'; // Restaurar icono
                    document.body.style.overflow = ''; // Restaurar scroll
                }
            });
        });

         // Cerrar menú si se hace clic fuera (opcional pero mejora UX)
        document.addEventListener('click', (event) => {
            if (!mainNav.contains(event.target) && !mobileMenuButton.contains(event.target) && mainNav.classList.contains('is-open')) {
                 mainNav.classList.remove('is-open');
                 mobileMenuButton.setAttribute('aria-expanded', 'false');
                 mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
                 document.body.style.overflow = '';
            }
        });

    } else {
        console.warn('Mobile menu elements (#mobile-menu-toggle or #main-nav) not found.');
    }


    // --- Actualizar Año en Footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn('Element with ID #current-year not found in footer.');
    }

    // --- Efecto Fade-in en Scroll con Intersection Observer ---
    const sectionsToFade = document.querySelectorAll('.fade-in-section');
    if (sectionsToFade.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.15, // % de elemento visible para disparar
            rootMargin: '0px 0px -50px 0px' // Disparar un poco antes de que esté totalmente en viewport
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Añadir clase con pequeño delay basado en transition-delay del CSS si se aplica
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Dejar de observar una vez animado
                }
            });
        }, observerOptions);

        sectionsToFade.forEach(section => {
            sectionObserver.observe(section);
        });
    } else {
        // Fallback para navegadores viejos o si no hay elementos
        sectionsToFade.forEach(section => section.classList.add('is-visible'));
        if (sectionsToFade.length > 0) {
            console.log('IntersectionObserver not fully supported, showing all .fade-in-section elements.');
        }
    }

    // --- Gestión del Banner de Cookies ---
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const cookieName = `${siteName.toLowerCase().replace(/ /g, '_')}_cookie_consent`; // Nombre seguro para la cookie

    // Función para leer cookies (más robusta)
    const getCookie = (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };

    // Función para escribir cookies
    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        // Buenas prácticas: SameSite=Lax. Añadir Secure si siempre usas HTTPS.
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
         // document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure"; // <-- Usar si HTTPS
    };

    if (cookieBanner && acceptButton) {
        // Mostrar banner solo si la cookie no existe o no está aceptada
        const consentValue = getCookie(cookieName);
        if (!consentValue || consentValue !== 'accepted') {
            cookieBanner.hidden = false;
            // Retrasar la animación para que no aparezca bruscamente
             setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 500); // Medio segundo de delay
        }

        acceptButton.addEventListener('click', () => {
            setCookie(cookieName, 'accepted', 365); // Guardar consentimiento por 1 año
            cookieBanner.classList.remove('show');
             // Esperar a que termine la animación antes de ocultar con hidden
            setTimeout(() => {
                 cookieBanner.hidden = true;
            }, 500); // Debe coincidir con la duración de la transición CSS
            console.log('Cookie consent accepted.');
        });

    } else {
        console.warn('Cookie banner elements (#cookie-consent-banner or #accept-cookies) not found.');
    }

    // --- Gestión del Formulario de Contacto (Copiar + Abrir Telegram) ---
    const contactFormTelegram = document.getElementById('contact-form');
    const submitTelegramButton = document.getElementById('submit-contact-telegram');
    const copyConfirmModal = document.getElementById('copy-confirm-modal');

    if (contactFormTelegram && submitTelegramButton) {
        contactFormTelegram.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevenir envío normal

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const countryInput = document.getElementById('country');
            const messageInput = document.getElementById('message');

            // Validar campos (aunque 'required' ayuda)
            if (!nameInput.value.trim() || !emailInput.value.trim() || !countryInput.value.trim() || !messageInput.value.trim()) {
                alert('Por favor, completa todos los campos requeridos.');
                // Podríamos añadir lógica para resaltar campos vacíos
                return;
            }

            // 1. Formatear el mensaje para copiar
            const formattedMessage = `Consulta desde iCornudo.com:\n-----------------------------\nNombre: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\nPaís: ${countryInput.value.trim()}\n-----------------------------\nMensaje:\n${messageInput.value.trim()}\n-----------------------------`;

            // 2. Intentar copiar al portapapeles usando la API moderna (Clipboard)
            if (navigator.clipboard && window.isSecureContext) { // Requiere HTTPS o localhost
                try {
                    await navigator.clipboard.writeText(formattedMessage);
                    console.log('Message copied to clipboard via modern API');
                    showCopyConfirmationAndOpenTelegram();
                } catch (err) {
                    console.error('Modern Clipboard API failed: ', err);
                    // Fallback a método obsoleto (execCommand) o alerta
                    fallbackCopyTextToClipboard(formattedMessage);
                }
            } else {
                 // Fallback si la API no está disponible (HTTP o navegador antiguo)
                 console.warn('Clipboard API not available. Using fallback.');
                 fallbackCopyTextToClipboard(formattedMessage);
            }
        });
    } else {
         console.warn('Contact form (Telegram version) elements not found.');
    }

    // Función para mostrar confirmación y abrir Telegram
    function showCopyConfirmationAndOpenTelegram() {
        // Mostrar modal de confirmación
        if (copyConfirmModal) {
            copyConfirmModal.classList.add('visible');
            setTimeout(() => {
                copyConfirmModal.classList.remove('visible');
            }, 3500); // Ocultar después de 3.5 segundos
        } else {
            alert('¡Mensaje copiado! Abre Telegram y pégalo en el chat con @' + telegramUsername); // Alerta si no hay modal
        }

         // Abrir enlace a Telegram después de un breve retraso
        setTimeout(() => {
            const telegramLink = `https://t.me/${telegramUsername}`;
            window.open(telegramLink, '_blank');
            console.log('Opening Telegram link:', telegramLink);
        }, 500);

        // Opcional: Limpiar formulario
        // if (contactFormTelegram) setTimeout(() => contactFormTelegram.reset(), 1000);
    }

     // Fallback para copiar (menos fiable, puede requerir interacción del usuario)
     function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; // Evitar scroll
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.opacity = "0"; // Hacerlo invisible
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback copy command was ' + msg);
            if (successful) {
                 showCopyConfirmationAndOpenTelegram();
            } else {
                throw new Error('Fallback copy failed');
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
            // Si todo falla, mostrar el texto para copiar manualmente
            alert('No se pudo copiar automáticamente.\nPor favor, copia el siguiente texto y pégalo en Telegram (@' + telegramUsername + '):\n\n' + text);
        }
        document.body.removeChild(textArea);
    }


}); // Fin DOMContentLoaded