document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos del DOM ---
    const inicioSection = document.getElementById('inicio');
    const startButton = document.getElementById('startButton');
    const contenidoPrincipal = document.getElementById('contenido-principal');
    const backgroundMusic = document.getElementById('background-music');
    const cartaSectionContainer = document.querySelector('#carta-section .carta-container');
    const heartsContainer = document.getElementById('floating-hearts-container');
    const scrollArrow = document.getElementById('scroll-arrow-container'); // Flecha
    const clickBurstContainer = document.getElementById('click-burst-container'); // Contenedor explosión

    // --- Configuración Inicial ---
    let musicStarted = false;
    let typeitInstance = null; // Solo para controlar que TypeIt inicie una vez
    let sliderInitialized = false;

    // --- Función para Crear Corazones Flotantes (sin cambios) ---
    function createHeart() {
        if (!heartsContainer) return;
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        const duration = Math.random() * 5 + 8;
        const delay = Math.random() * 2; // Reducido delay inicial
        heart.style.animationDuration = duration + 's';
        heart.style.animationDelay = delay + 's';
        heart.style.fontSize = Math.random() * 70 + 10 + 'px'; // Ajustado tamaño ligeramente
        heartsContainer.appendChild(heart);
        setTimeout(() => { heart.remove(); }, (duration + delay + 1) * 1000);
    }
    setInterval(createHeart, 400); // Ligeramente más frecuente

    // --- Función para Crear Explosión de Corazones al Hacer Clic ---
    function createClickBurst(event) {
        if (!clickBurstContainer) return;

        const rect = startButton.getBoundingClientRect(); // Posición del botón
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;

        clickBurstContainer.style.top = `${buttonCenterY}px`;
        clickBurstContainer.style.left = `${buttonCenterX}px`;

        const numberOfHearts = 20 + Math.floor(Math.random() * 9); // Entre 10 y 15 corazones

        for (let i = 0; i < numberOfHearts; i++) {
            const burstHeart = document.createElement('div');
            burstHeart.classList.add('burst-heart');

            // Variables CSS para movimiento aleatorio en la animación
            const angle = Math.random() * 360; // Dirección aleatoria
            const distance = 50 + Math.random() * 50; // Distancia aleatoria (50px a 100px)
            const translateX = Math.cos(angle * Math.PI / 180) * distance;
            const translateY = Math.sin(angle * Math.PI / 180) * distance;

            burstHeart.style.setProperty('--translateX', `${translateX}px`);
            burstHeart.style.setProperty('--translateY', `${translateY}px`);

            clickBurstContainer.appendChild(burstHeart);

            // Eliminar después de la animación
            setTimeout(() => {
                burstHeart.remove();
            }, 700); // Duración de la animación burstAnimation
        }
         // Limpiar el contenedor absoluto después de un tiempo por si acaso
        setTimeout(() => {
            clickBurstContainer.innerHTML = '';
        }, 1000);
    }


    // --- Event Listener para el Botón de Inicio ---
    startButton.addEventListener('click', (event) => { // Pasamos el 'event'
        console.log("Botón presionado");

        // 1. Ocultar flecha de scroll
        if (scrollArrow) {
            scrollArrow.classList.add('hidden');
        }

        // 2. Crear explosión de corazones
        createClickBurst(event); // Pasamos el evento para la posición

        // 3. Ocultar pantalla inicial
        inicioSection.classList.add('hidden');

        // 4. Mostrar contenido principal y demás (con delays)
        setTimeout(() => {
            inicioSection.style.display = 'none';
            contenidoPrincipal.style.display = 'block';
            void contenidoPrincipal.offsetWidth;
            contenidoPrincipal.classList.add('visible');

            if (!musicStarted) {
                backgroundMusic.play().then(() => {
                    console.log("Música iniciada");
                    musicStarted = true;
                }).catch(error => {
                    console.error("Error al reproducir música:", error);
                });
            }

            setTimeout(() => {
                if (!sliderInitialized) {
                    inicializarSlider();
                    sliderInitialized = true;
                }
            }, 100);

        }, 600); // Mantener delay para que la explosión se vea antes de que desaparezca del todo
    });

    // --- Función para Inicializar Swiper con Efecto 'Cards' (sin cambios) ---
    function inicializarSlider() {
        const swiper = new Swiper('.mi-slider', {
            effect: 'cards',
            cardsEffect: { perSlideOffset: 8, perSlideRotate: 6, slideShadows: true, },
            grabCursor: true,
            loop: true,
            autoplay: { delay: 2300, disableOnInteraction: false, },
            keyboard: true,
        });
        console.log("Swiper inicializado con efecto 'cards'");
    }

    // --- Efecto TypeIt y aparición ESCALONADA para la Carta ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Un poco antes para que empiece la animación escalonada
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // Solo necesitamos detectar la entrada del CONTENEDOR una vez
            if (entry.isIntersecting) {
                const container = entry.target;
                // Añadir la clase '.visible' al contenedor.
                // CSS se encargará de los delays en los hijos '.carta-content'
                container.classList.add('visible');
                console.log("Contenedor de la carta visible, animaciones CSS iniciadas.");

                // Iniciar TypeIt solo si no se ha iniciado ya
                if (!typeitInstance && container.classList.contains('visible')) {
                    console.log("Iniciando TypeIt...");
                    // Añadimos un PEQUEÑO DELAY para que coincida visualmente
                    // con la aparición del párrafo en la animación escalonada (0.4s)
                    setTimeout(() => {
                         typeitInstance = new TypeIt('#carta-p1', { // Usamos variable para control
                             strings: ["Leah, desde que te vi en la rochicaca, mi mundo se iluminó de una forma única. Cada mirada tuya me enamora más y más. Cada momento que compartimos es algo que jamás quiero olvidar."],
                             speed: 70,
                             waitUntilVisible: true, // TypeIt espera a que el elemento sea visible en DOM
                             cursorChar: "Te Amo",
                             afterComplete: async (instance) => {
                                 instance.destroy(); // Limpiar instancia
                                 startNextParagraph();
                             }
                         }).go();
                    }, 600); // Delay que coincide con 'carta-p1' en CSS

                    function startNextParagraph() {
                         new TypeIt('#carta-p2', {
                             strings: ["Eres la razón por la que cada día es mejor que el anterior. Tu sonrisa me hace feliz y tu presencia me hace sentir completo."],
                             speed: 70,
                             startDelay: 550, // Pausa entre párrafos
                             waitUntilVisible: true,
                             cursorChar: "▋",
                             afterComplete: async (instance) => {
                                 instance.destroy();
                                 startFinalParagraph();
                             }
                         }).go();
                     }

                     
                     function startFinalParagraph() {
                         new TypeIt('#carta-p3', {
                             strings: ["Gracias por este primer mes. Leah, Te amo más de lo que puedo demostrar"],
                             speed: 70,
                             startDelay: 500,
                             waitUntilVisible: true,
                             cursorChar: "▋",
                             afterComplete: async (instance) => {
                                instance.destroy();
                                console.log("TypeIt completado.");
                             }
                         }).go();
                     }
                }


                observer.unobserve(container); // Dejar de observar una vez visible
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    if (cartaSectionContainer) {
        scrollObserver.observe(cartaSectionContainer);
    } else {
        console.error("No se encontró el contenedor de la carta para observar.");
    }

}); // Fin del DOMContentLoaded
