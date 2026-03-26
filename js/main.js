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
<script type="text/javascript">
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(107773413, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            trackHash:true
        });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/107773413" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-EPZ0CQN5VQ"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-EPZ0CQN5VQ');
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Промт-мастер",
        "description": "Инструмент для улучшения промтов с автоматическим переводом и детализацией. Поддержка Midjourney, ChatGPT, DALL-E, Stable Diffusion.",
        "url": "https://dyshadyshez.github.io/Promt-Changer/",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "All",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "RUB"
        },
        "author": {
            "@type": "Person",
            "name": "dyshadyshez",
            "url": "https://github.com/dyshadyshez"
        },
        "featureList": [
            "Автоматическое улучшение промтов",
            "Улучшить промт",
            "Перевод на английский",
            "Выбор направления и стиля",
            "Дополнительные теги",
            "Соотношение сторон",
            "Тёмная тема"
        ],
        "screenshot": "https://dyshadyshez.github.io/Promt-Changer/screenshot.jpg",
        "softwareVersion": "2.0",
        "releaseNotes": "https://github.com/dyshadyshez/Promt-Changer/releases"
    }
    </script>
    <script type="application/ld+json" id="faqSchema">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Как работает улучшение промтов?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Мы анализируем ваш запрос, определяем направление (изображение, текст, код) и добавляем профессиональные детали, переводим на английский для лучших результатов в нейросетях. Улучшить промт для нейросети ЛЕГКО!"
                }
            },
            {
                "@type": "Question",
                "name": "Почему нужен английский для изображений?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Большинство нейросетей (Midjourney, DALL-E) лучше понимают английские запросы. Мы автоматически переводим и добавляем ключевые слова для качества: 4K, highly detailed, photorealistic и другие."
                }
            },
            {
                "@type": "Question",
                "name": "Это бесплатно?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Да, Промт-мастер полностью бесплатный инструмент с открытым исходным кодом."
                }
            }
        ]
    }
    </script>
