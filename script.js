document.addEventListener('DOMContentLoaded', () => {
    // Оптимизация производительности с помощью throttle
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };

    // Защита от копирования
    const preventCopy = (e) => e.preventDefault();
    document.addEventListener('contextmenu', preventCopy);
    document.addEventListener('selectstart', preventCopy);
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && ['c', 'C', 'u', 'U'].includes(e.key)) {
            preventCopy(e);
        }
    });

    // Оптимизированная анимация появления элементов
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .cta-button').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });

    // Оптимизированный эффект свечения
    const cards = document.querySelectorAll('.feature-card');
    const handleMouseMove = throttle((e, card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        requestAnimationFrame(() => {
            const glowSize = '150px';
            card.style.background = `radial-gradient(${glowSize} at ${x}px ${y}px, rgba(255, 255, 255, 0.1), transparent), linear-gradient(145deg, #111111, #000000)`;
        });
    }, 30);

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
        card.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                card.style.background = 'linear-gradient(145deg, #111111, #000000)';
            });
        });
    });

    // Оптимизация для мобильных устройств
    if ('ontouchstart' in window) {
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            button.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }

    // Добавляем поддержку Service Worker если он поддерживается
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }

    // Добавляем красивый консольный текст
    console.log(
        '%cKlyux Bot 🤖',
        'color: #ffffff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(255,255,255,0.5);'
    )
})

/* Закомментированный код капчи
class CaptchaManager {
    constructor() {
        this.captchaModal = document.querySelector('.captcha-modal');
        this.canvas = document.getElementById('captchaCanvas');
        this.input = document.getElementById('captchaInput');
        this.refreshBtn = document.getElementById('refreshCaptcha');
        this.verifyBtn = document.getElementById('verifyCaptcha');
        this.code = '';
        
        this.setupEventListeners();
        this.suspicious = false;
        this.checkSuspiciousActivity();
    }

    setupEventListeners() {
        this.refreshBtn.addEventListener('click', () => this.generateCaptcha());
        this.verifyBtn.addEventListener('click', () => this.verifyCaptcha());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.verifyCaptcha();
        });
    }

    showCaptcha() {
        this.captchaModal.style.display = 'flex';
        setTimeout(() => this.captchaModal.classList.add('visible'), 10);
        this.generateCaptcha();
    }

    hideCaptcha() {
        this.captchaModal.classList.remove('visible');
        setTimeout(() => this.captchaModal.style.display = 'none', 300);
    }

    generateCaptcha() {
        const ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        // Генерация случайного кода
        this.code = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Очистка canvas
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Рисование кода
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Добавление искажений и помех
        for (let i = 0; i < this.code.length; i++) {
            ctx.save();
            ctx.translate(
                this.canvas.width / 2 + (i - 2.5) * 30,
                this.canvas.height / 2
            );
            ctx.rotate((Math.random() - 0.5) * 0.4);
            ctx.fillText(this.code[i], 0, 0);
            ctx.restore();
        }

        // Добавление линий
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            ctx.lineWidth = 2;
            ctx.moveTo(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
            ctx.lineTo(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
            ctx.stroke();
        }

        // Добавление точек
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.arc(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                1,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }

    verifyCaptcha() {
        if (this.input.value.toUpperCase() === this.code) {
            this.hideCaptcha();
            this.suspicious = false;
            localStorage.setItem('captchaVerified', 'true');
            this.input.value = '';
        } else {
            this.input.value = '';
            this.generateCaptcha();
            this.input.classList.add('error');
            setTimeout(() => this.input.classList.remove('error'), 500);
        }
    }

    checkSuspiciousActivity() {
        const isSuspicious = 
            !localStorage.getItem('captchaVerified') &&
            (
                navigator.webdriver ||
                window.callPhantom ||
                window._phantom ||
                window.phantom ||
                navigator.languages.length === 0 ||
                navigator.languages[0].slice(0, 2) !== navigator.language.slice(0, 2)
            );

        if (isSuspicious && !this.suspicious) {
            this.suspicious = true;
            this.showCaptcha();
        }
    }
}
*/

// Управление прелоадером
const hidePreloader = () => {
    const preloader = document.querySelector('.preloader');
    const container = document.querySelector('.container');
    
    setTimeout(() => {
        preloader.classList.add('hidden');
        container.classList.add('visible');
        
        setTimeout(() => {
            preloader.remove();
            // Закомментировано: const captchaManager = new CaptchaManager();
        }, 500);
    }, 1500);
};

// Запускаем после загрузки всего контента
window.addEventListener('load', hidePreloader);