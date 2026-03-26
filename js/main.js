(function() {
    // ========== 1. ДАННЫЕ ==========
    const styleMap = {
        image: ['реализм', 'киберпанк', 'фэнтези', 'импрессионизм', 'минимализм', 'сюрреализм', 'акварель', 'Pixar', 'Мультяшный', 'аниме'],
        text: ['официальный', 'человечный', 'креативный', 'юмористический', 'научный', 'поэтический', 'убедительный'],
        code: ['чистый', 'комментированный', 'оптимизированный', 'ООП', 'функциональный', 'безопасный', 'асинхронный'],
        excel: ['базовый', 'продвинутый', 'с макросами', 'визуализация', 'анализ данных', 'дашборд', 'финансовый'],
        video: ['кинематографичный', 'документальный', 'музыкальный клип', 'обучающий', 'рекламный', 'vlog', 'эпичный'],
        music: ['классический', 'электронный', 'рок', 'джаз', 'хип-хоп', 'lo-fi', 'эмбиент'],
        '3d': ['реалистичный', 'стилизованный', 'low poly', 'voxel', 'сюрреализм', 'киберпанк', 'мультяшный'],
        design: ['минимализм', 'необрутализм', 'киберпанк', 'скандинавский', 'поп-арт', 'ар-деко', 'футуризм', 'аниме', 'мультяшный'],
        marketing: ['убедительный', 'информационный', 'вирусный', 'сторителлинг', 'SEO-оптимизированный', 'лаконичный', 'эмоциональный']
    };
    const tagsMap = {
        code: [
            { id: 'html_css_js', text: 'Один HTML+CSS+JS файл', ru: 'весь код в одном HTML+CSS+JS файле', en: 'all code in one HTML+CSS+JS file' },
            { id: 'responsive', text: 'Адаптивность', ru: 'адаптивный дизайн для всех устройств', en: 'responsive design for all devices' },
            { id: 'comments', text: 'Комментарии', ru: 'подробные комментарии в коде', en: 'detailed comments in code' },
            { id: 'modern', text: 'Современный синтаксис', ru: 'использовать современный синтаксис ES6+', en: 'use modern ES6+ syntax' }
        ],
        excel: [
            { id: 'formula', text: 'Формула', ru: 'создай формулу Excel', en: 'create Excel formula' },
            { id: 'macro', text: 'Макрос VBA', ru: 'напиши макрос VBA', en: 'write VBA macro' },
            { id: 'pivot', text: 'Сводная таблица', ru: 'создай сводную таблицу', en: 'create pivot table' },
            { id: 'chart', text: 'Диаграмма', ru: 'построй диаграмму', en: 'build chart' }
        ],
        marketing: [
            { id: 'seo', text: 'SEO', ru: 'оптимизировать для поисковиков', en: 'optimize for search engines' },
            { id: 'slogan', text: 'Слоган', ru: 'придумай запоминающийся слоган', en: 'create a catchy slogan' },
            { id: 'target', text: 'Целевая аудитория', ru: 'опиши целевую аудиторию', en: 'describe target audience' },
            { id: 'cta', text: 'CTA', ru: 'добавь призыв к действию', en: 'add call to action' }
        ],
        image: [
            { id: '8k', text: '8K', ru: 'разрешение 8K', en: '8K resolution' },
            { id: 'photorealistic', text: 'Фотореализм', ru: 'фотореалистичное качество', en: 'photorealistic quality' },
            { id: 'composition', text: 'Композиция', ru: 'продуманная композиция', en: 'thoughtful composition' }
        ],
        video: [
            { id: '4k', text: '4K', ru: 'разрешение 4K', en: '4K resolution' },
            { id: 'cinematic', text: 'Кинематографичный', ru: 'кинематографичный стиль', en: 'cinematic style' }
        ],
        '3d': [
            { id: 'highpoly', text: 'High poly', ru: 'высокая детализация модели', en: 'high poly count' },
            { id: 'textures', text: 'Текстуры', ru: 'детальные текстуры', en: 'detailed textures' }
        ]
    };
    const visualDirections = ['image', 'video', '3d', 'design'];

    // ========== 2. ЭЛЕМЕНТЫ ==========
    const directionSelect = document.getElementById('direction');
    const styleSelect = document.getElementById('style');
    const rawPrompt = document.getElementById('rawPrompt');
    const contextField = document.getElementById('context');
    const detailSlider = document.getElementById('detailLevel');
    const detailSpan = document.getElementById('detailValue');
    const tagsContainer = document.getElementById('tagsContainer');
    const dynamicTags = document.getElementById('dynamicTags');
    const aspectContainer = document.getElementById('aspectRatioContainer');
    const aspectBtns = document.querySelectorAll('.aspect-btn');
    const aspectHidden = document.getElementById('aspectRatio');
    const enhancedDiv = document.getElementById('enhancedPrompt');
    const enhanceBtn = document.getElementById('enhanceBtn');
    const langToggle = document.getElementById('langToggle');
    const copyBtn = document.getElementById('copyBtn');
    const themeToggle = document.getElementById('themeToggle');

    let currentLang = 'ru';
    let selectedTags = [];

    // ========== 3. ТЕМА ==========
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.innerHTML = theme === 'dark' ? '<span>☀️</span><span>Светлая</span>' : '<span>🌙</span><span>Тёмная</span>';
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);
    else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // ========== 4. ОБНОВЛЕНИЕ СТИЛЕЙ И ТЕГОВ ==========
    function updateStyles() {
        const dir = directionSelect.value;
        const styles = styleMap[dir] || styleMap['image'];
        styleSelect.innerHTML = '';
        styles.forEach(s => {
            const option = document.createElement('option');
            option.value = s;
            option.textContent = s.charAt(0).toUpperCase() + s.slice(1);
            styleSelect.appendChild(option);
        });
        if (tagsMap[dir]) {
            tagsContainer.style.display = 'block';
            dynamicTags.innerHTML = '';
            selectedTags = [];
            tagsMap[dir].forEach(tag => {
                const label = document.createElement('label');
                label.className = 'tag-checkbox';
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.value = tag.id;
                input.addEventListener('change', (e) => {
                    if (e.target.checked) selectedTags.push(tag);
                    else selectedTags = selectedTags.filter(t => t.id !== tag.id);
                });
                label.appendChild(input);
                label.appendChild(document.createTextNode(tag.text));
                dynamicTags.appendChild(label);
            });
        } else {
            tagsContainer.style.display = 'none';
            selectedTags = [];
        }
        if (dir === 'image' || dir === 'video' || dir === '3d' || dir === 'design') {
            aspectContainer.style.display = 'block';
        } else {
            aspectContainer.style.display = 'none';
        }
    }
    updateStyles();
    directionSelect.addEventListener('change', updateStyles);

    // ========== 5. СООТНОШЕНИЕ СТОРОН ==========
    aspectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            aspectBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            aspectHidden.value = btn.dataset.ratio;
        });
    });

    // ========== 6. СЛАЙДЕР ==========
    detailSlider.addEventListener('input', () => {
        detailSpan.textContent = detailSlider.value;
    });

    // ========== 7. ФУНКЦИЯ ГЕНЕРАЦИИ ==========
    function generatePrompt(lang) {
        let idea = rawPrompt.value.trim() || 'придумай что-то интересное';
        const direction = directionSelect.value;
        const style = styleSelect.value;
        const context = contextField.value.trim();
        const detailLevel = parseInt(detailSlider.value);
        const aspect = aspectHidden.value;

        let detailInstruction = '';
        if (lang === 'ru') {
            const levels = {
                1: 'Минимальная детализация, только основные элементы.',
                2: 'Средняя детализация, добавь несколько уточнений.',
                3: 'Детализация выше среднего, опиши ключевые аспекты подробно.',
                4: 'Высокая детализация, включи много конкретных деталей.',
                5: 'Максимальная детализация, опиши мельчайшие нюансы, текстуры, освещение, атмосферу.'
            };
            detailInstruction = levels[detailLevel];
        } else {
            const levels = {
                1: 'Minimal detail, only main elements.',
                2: 'Medium detail, add a few clarifications.',
                3: 'Above average detail, describe key aspects thoroughly.',
                4: 'High detail, include many specific details.',
                5: 'Maximum detail, describe the smallest nuances, textures, lighting, atmosphere.'
            };
            detailInstruction = levels[detailLevel];
        }

        let contextBlock = context ? (lang === 'ru' ? `Дополнительный контекст: ${context}. ` : `Additional context: ${context}. `) : '';
        let aspectBlock = (aspect && (direction === 'image' || direction === 'video' || direction === '3d' || direction === 'design')) 
            ? (lang === 'ru' ? `Соотношение сторон: ${aspect}. ` : `Aspect ratio: ${aspect}. `) : '';

        let tagsBlock = '';
        if (selectedTags.length > 0) {
            tagsBlock = selectedTags.map(tag => tag[lang] || tag.text).join('. ') + '. ';
        }

        let prompt = '';
        if (lang === 'ru') {
            switch (direction) {
                case 'image':
                    prompt = `Создай высококачественное изображение в стиле "${style}" на тему: ${idea}. ${aspectBlock}${contextBlock}${tagsBlock}${detailInstruction} Учти композицию (правило третей, симметрия), цветовую палитру, освещение (естественное, студийное, неоновое), текстуры. Добавь глубину резкости, атмосферные эффекты. Изображение должно быть готово для профессионального использования. Формат: 8K, высокое разрешение.`;
                    break;
                case 'text':
                    prompt = `Напиши текст в стиле "${style}" на тему: ${idea}. ${contextBlock}${tagsBlock}${detailInstruction} Определи целевую аудиторию и цель текста. Используй подходящую лексику, риторические приёмы, структурируй текст: введение, основная часть, заключение. Объём: развёрнутый, но без воды. Добавь примеры, метафоры или аналогии, если уместно. Тон: строго соответствующий стилю (${style}).`;
                    break;
                case 'code':
                    prompt = `Напиши код для задачи: ${idea} в стиле "${style}". ${contextBlock}${tagsBlock}${detailInstruction} Требования: читаемость, модульность, обработка ошибок, комментарии на русском. Добавь примеры использования, опиши входные и выходные данные. Используй современные практики. Код должен быть готов к интеграции.`;
                    break;
                case 'excel':
                    prompt = `Создай формулу/макрос/сводную таблицу Excel для задачи: ${idea}. Стиль: "${style}". ${contextBlock}${tagsBlock}${detailInstruction} Подробно опиши: какие ячейки задействованы, какие функции использованы, как обрабатываются ошибки. Добавь пример данных и результат. Если нужен макрос VBA, приведи код с пояснениями.`;
                    break;
                case 'video':
                    prompt = `Сгенерируй концепцию видео в стиле "${style}" на основе: ${idea}. ${aspectBlock}${contextBlock}${tagsBlock}${detailInstruction} Опиши: хронометраж (рекомендуемая длительность), сюжетную линию, ключевые сцены, раскадровку, визуальные эффекты, цветокоррекцию, музыкальное сопровождение.`;
                    break;
                case 'music':
                    prompt = `Сочини музыкальный фрагмент в жанре "${style}", вдохновлённый: ${idea}. ${contextBlock}${tagsBlock}${detailInstruction} Укажи темп (BPM), тональность, основные инструменты, настроение (мажор/минор), структуру (вступление, куплет, припев, бридж, соло).`;
                    break;
                case '3d':
                    prompt = `Создай 3D-модель в стиле "${style}" для сцены: ${idea}. ${aspectBlock}${contextBlock}${tagsBlock}${detailInstruction} Опиши: топологию (количество полигонов, оптимизация), материалы и текстуры (типы, цвета, отражения), освещение (типы источников, тени), камера (ракурс, фокусное расстояние).`;
                    break;
                case 'design':
                    prompt = `Разработай дизайн-концепцию в стиле "${style}" для: ${idea}. ${aspectBlock}${contextBlock}${tagsBlock}${detailInstruction} Включи: цветовую палитру (основные и дополнительные цвета), типографику (шрифты, размеры, интерлиньяж), компоновку (сетка, отступы), ключевые элементы.`;
                    break;
                case 'marketing':
                    prompt = `Создай маркетинговый текст/кампанию в стиле "${style}" для продукта/услуги: ${idea}. ${contextBlock}${tagsBlock}${detailInstruction} Определи целевую аудиторию, её боли и желания. Сформулируй уникальное торговое предложение. Напиши заголовки, основной текст, призывы к действию. Предложи каналы распространения. Тон: ${style}. Добавь варианты A/B тестирования.`;
                    break;
                default:
                    prompt = `Улучшенный промт (${direction}, стиль: ${style}): ${idea}. ${contextBlock}${tagsBlock}${detailInstruction}`;
            }
        } else {
            switch (direction) {
                case 'image':
                    prompt = `Create a high-quality image in ${style} style based on: ${idea}. ${aspectBlock}${contextBlock}${tagsBlock}${detailInstruction} Consider composition, color palette, lighting, textures. Add depth of field, atmospheric effects. 8K resolution.`;
                    break;
                case 'code':
                    prompt = `Write code for: ${idea} in ${style} style. ${contextBlock}${tagsBlock}${detailInstruction} Requirements: readability, modularity, error handling, comments. Add usage examples. Use modern practices.`;
                    break;
                case 'excel':
                    prompt = `Create Excel formula/macro/pivot for: ${idea}. Style: ${style}. ${contextBlock}${tagsBlock}${detailInstruction} Describe cells, functions, error handling. Add sample data and result.`;
                    break;
                case 'marketing':
                    prompt = `Create marketing text/campaign in ${style} style for: ${idea}. ${contextBlock}${tagsBlock}${detailInstruction} Define target audience, USP, headlines, body text, CTA. Suggest channels. Tone: ${style}.`;
                    break;
                default:
                    prompt = `Enhanced prompt (${direction}, style: ${style}): ${idea}. ${contextBlock}${tagsBlock}${detailInstruction}`;
            }
        }
        return prompt;
    }

    function updatePrompt() {
        enhancedDiv.textContent = generatePrompt(currentLang);
    }

    // ========== 8. ОБРАБОТЧИКИ ==========
    enhanceBtn.addEventListener('click', () => {
        const dir = directionSelect.value;
        currentLang = visualDirections.includes(dir) ? 'en' : 'ru';
        langToggle.textContent = currentLang === 'ru' ? '🇷🇺 / 🇬🇧' : '🇬🇧 / 🇷🇺';
        updatePrompt();
        setTimeout(() => {
            const resultArea = document.querySelector('.result-area');
            if (resultArea) {
                const elementRect = resultArea.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                const windowHeight = window.innerHeight;
                const elementHeight = elementRect.height;
                const offsetPosition = absoluteElementTop - (windowHeight / 2) + (elementHeight / 2);
                smoothScrollToPosition(offsetPosition, 1200);
            }
        }, 100);
    });

    function smoothScrollToPosition(targetPosition, duration = 800) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            window.scrollTo(0, startPosition + (distance * ease));
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                const resultArea = document.querySelector('.result-area');
                if (resultArea) {
                    resultArea.style.transition = 'box-shadow 0.3s';
                    resultArea.style.boxShadow = '0 0 0 3px var(--accent)';
                    setTimeout(() => resultArea.style.boxShadow = '', 800);
                }
            }
        }
        requestAnimationFrame(animation);
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        langToggle.textContent = currentLang === 'ru' ? '🇷🇺 / 🇬🇧' : '🇬🇧 / 🇷🇺';
        updatePrompt();
    });

    // Исправленный обработчик копирования
    if (copyBtn) {
        let copyTimer = null;
        const originalHTML = copyBtn.innerHTML;
        copyBtn.addEventListener('click', function() {
            const text = enhancedDiv.textContent;
            if (text && text !== 'Здесь появится улучшенная версия...') {
                navigator.clipboard.writeText(text).then(() => {
                    if (copyTimer) clearTimeout(copyTimer);
                    this.innerHTML = '<span>✅</span> Скопировано!';
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => { if (this) this.style.transform = ''; }, 200);
                    copyTimer = setTimeout(() => {
                        this.innerHTML = originalHTML;
                        copyTimer = null;
                    }, 1500);
                }).catch(() => alert('Не удалось скопировать'));
            }
        });
    }

    // ========== ОБРАБОТЧИК ПРИМЕРОВ ==========
    document.querySelectorAll('.example-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            rawPrompt.value = chip.getAttribute('data-example');
            enhanceBtn.click();
        });
    });

    window.addEventListener('load', () => {
        updatePrompt();
        if (typeof ym !== 'undefined') ym(107773413, 'reachGoal', 'page_load');
    });

    // ========== 9. ПАРАЛЛАКС ==========
    const shapes = document.querySelectorAll('.shape');
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
})();

fetch('/Promt-Changer/robots.txt')
    .then(response => console.log('robots.txt status:', response.status))
    .catch(err => console.log('robots.txt error:', err.message));
