document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       CONFIGURACIÓN DEL EVENTO
    ========================================= */
    const CONFIG = {
        eventDate: "2026-06-13T16:00:00", 
        whatsappPhone: "525543622188",    
        whatsappMessage: "¡Hola! Confirmo mi asistencia a los XV de Joselin Paola. Muchas gracias.",
        audioVolume: 0.4
    };

    /* =========================================
       INICIALIZAR LIBRERÍAS
    ========================================= */
    if (typeof Fireworks !== "undefined") {
        const container = document.getElementById("fireworks-container");
        const fireworks = new Fireworks.default(container, {
            autoresize: true,
            opacity: 0.4,       
            acceleration: 1.05,
            friction: 0.97,
            gravity: 1.5,
            particles: 60,      
            traceLength: 3,
            traceSpeed: 10,
            explosion: 5,
            intensity: 25,      
            flickering: 50,
            lineStyle: 'round',
            hue: { min: 310, max: 360 },
            delay: { min: 40, max: 80 },
            rocketsPoint: { min: 20, max: 80 },
            lineWidth: { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 2 } },
            brightness: { min: 50, max: 80 },
            decay: { min: 0.015, max: 0.03 },
            mouse: { click: false, move: false, max: 1 }
        });
        fireworks.start();
    }

    if (typeof AOS !== "undefined") {
        AOS.init({ once: true, offset: 100, duration: 1000, easing: 'ease-out-cubic' });
    }

    /* =========================================
       LÓGICA DEL SOBRE Y AUDIO
    ========================================= */
    const envelopeWrapper = document.getElementById("envelope-wrapper");
    const envelopeScreen = document.getElementById("envelope-screen");
    const mainContent = document.getElementById("main-content");
    const audio = document.getElementById("bg-music");
    const musicIcon = document.getElementById("music-icon");
    
    let isPlaying = false;

    if (audio) { audio.volume = CONFIG.audioVolume; }

    function openEnvelope() {
        if (!envelopeWrapper || envelopeWrapper.classList.contains("open")) return;
        
        envelopeWrapper.classList.add("open");

        if (audio) {
            audio.play().then(() => {
                isPlaying = true;
                updateMusicIcon(true);
            }).catch(e => {
                console.log("Autoplay bloqueado.", e);
                updateMusicIcon(false);
            });
        }

        setTimeout(() => {
            envelopeScreen.style.opacity = "0";
            envelopeScreen.style.visibility = "hidden";
            mainContent.classList.remove("hidden-content");
            
            if (typeof AOS !== "undefined") AOS.refresh();

            setTimeout(() => {
                mainContent.classList.add("visible");
                document.body.style.overflow = "auto"; 
                setTimeout(() => { envelopeScreen.style.display = "none"; }, 1000);
            }, 100);

        }, 1400); 
    }

    if (envelopeWrapper) {
        document.body.style.overflow = "hidden";
        envelopeWrapper.addEventListener("click", openEnvelope);
        envelopeWrapper.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
        });
    }

    /* =========================================
       CONTROL DE MÚSICA
    ========================================= */
    function updateMusicIcon(playing) {
        if (!musicIcon) return;
        if (playing) {
            musicIcon.className = "fa-solid fa-compact-disc fa-spin"; 
            musicIcon.style.color = "#FF85A2"; 
        } else {
            musicIcon.className = "fa-solid fa-music"; 
            musicIcon.style.color = "#d4af37"; 
        }
    }

    window.toggleMusic = function() {
        if (!audio) return;
        if (isPlaying) { audio.pause(); isPlaying = false; } 
        else { audio.play().catch(e => console.log(e)); isPlaying = true; }
        updateMusicIcon(isPlaying);
    };

    /* =========================================
       CUENTA REGRESIVA
    ========================================= */
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function startCountdown() {
        const targetTarget = new Date(CONFIG.eventDate).getTime();
        update();
        const interval = setInterval(update, 1000);
        
        function update() {
            const now = new Date().getTime();
            const difference = targetTarget - now;

            if (difference < 0) {
                clearInterval(interval);
                const countdownGrid = document.querySelector(".countdown-grid");
                if(countdownGrid) { countdownGrid.innerHTML = "<h3 class='golden-text' style='font-size: 2.5rem; width:100%; text-align:center;'>¡Llegó el día!</h3>"; }
                return;
            }

            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((difference % (1000 * 60)) / 1000);

            if (daysEl) daysEl.innerText = String(d).padStart(2, '0');
            if (hoursEl) hoursEl.innerText = String(h).padStart(2, '0');
            if (minutesEl) minutesEl.innerText = String(m).padStart(2, '0');
            if (secondsEl) secondsEl.innerText = String(s).padStart(2, '0');
        }
    }

    startCountdown();

    /* =========================================
       WHATSAPP RSVP
    ========================================= */
    window.confirmWhatsApp = function() {
        const btn = document.querySelector(".rsvp-btn");
        const originalContent = btn.innerHTML;
        
        btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Conectando...";
        btn.style.opacity = "0.8";
        btn.disabled = true;
        
        const url = `https://wa.me/${CONFIG.whatsappPhone}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
        
        setTimeout(() => {
            window.open(url, "_blank");
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.style.opacity = "1";
                btn.disabled = false;
            }, 500);
        }, 800);
    };
});