// ========== ТЕМА (светлая/темная) ==========
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.innerHTML = theme === 'dark' ? '<span>☀️</span><span>Светлая</span>' : '<span>🌙</span><span>Тёмная</span>';
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(systemPrefersDark ? 'dark' : 'light');
    }
    
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// ========== ПАРАЛЛАКС (3D фигуры) ==========
function initParallax() {
    const shapes = document.querySelectorAll('.shape');
    if (!shapes.length) return;
    
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const ease = 0.08;
    
    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    function animateShapes() {
        mouseX += (targetX - mouseX) * ease;
        mouseY += (targetY - mouseY) * ease;
        shapes.forEach(shape => {
            const depth = parseFloat(shape.getAttribute('data-depth') || 0.5);
            const moveX = mouseX * 60 * depth;
            const moveY = mouseY * 60 * depth;
            const rotateY = mouseX * 20 * depth;
            const rotateX = mouseY * 20 * depth;
            const scale = 1 + Math.abs(mouseX * mouseY) * 0.15 * depth;
            shape.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        });
        requestAnimationFrame(animateShapes);
    }
    animateShapes();
    
    document.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
}

// ========== УНИВЕРСАЛЬНАЯ ФУНКЦИЯ КОПИРОВАНИЯ ==========
function initCopyButtons(selector = '.copy-btn, .copy-prompt-btn') {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.getAttribute('data-copy-text') || this.dataset.prompt;
            if (!text) return;
            
            navigator.clipboard.writeText(text).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = '<span>✅</span> Скопировано!';
                this.style.transform = 'scale(0.95)';
                setTimeout(() => { this.style.transform = ''; }, 200);
                setTimeout(() => { this.innerHTML = originalHTML; }, 1500);
            }).catch(() => alert('Не удалось скопировать'));
        });
    });
}

// ========== ЗАПУСК ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initParallax();
    initCopyButtons();
});
