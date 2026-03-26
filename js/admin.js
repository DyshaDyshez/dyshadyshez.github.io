// ========== НАСТРОЙКИ SUPABASE ==========
const SUPABASE_URL = 'https://ligmsihssbvolgdogaqm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gC9UkfH2xkJGqGlnIgd-YA_7Ksa09Xb';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Состояние
let allPrompts = [];
let editingPrompt = null;
let currentTags = [];

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.background = isError ? '#e53e3e' : '#4f6af5';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== ПРОВЕРКА АВТОРИЗАЦИИ ==========
async function checkAuth() {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const loginTime = localStorage.getItem('admin_login_time');
    
    if (isLoggedIn === 'true' && loginTime) {
        // Проверяем, не прошло ли больше 24 часов
        const hoursPassed = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
        if (hoursPassed < 24) {
            return true;
        }
    }
    return false;
}

async function login(password) {
    try {
        // Вызываем функцию проверки пароля в Supabase
        const { data, error } = await supabase.rpc('check_admin_password', {
            input_password: password
        });
        
        if (error) throw error;
        
        if (data === true) {
            localStorage.setItem('admin_logged_in', 'true');
            localStorage.setItem('admin_login_time', Date.now().toString());
            showToast('✅ Вход выполнен успешно!');
            return true;
        } else {
            showToast('❌ Неверный пароль', true);
            return false;
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        showToast('❌ Ошибка при проверке пароля', true);
        return false;
    }
}

function logout() {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_login_time');
    showToast('👋 Выход выполнен');
    renderLoginPage();
}

// ========== ЗАГРУЗКА ДАННЫХ ==========
async function loadPrompts() {
    try {
        const { data, error } = await supabase
            .from('prompts')
            .select('*')
            .order('id', { ascending: false });
        
        if (error) throw error;
        
        allPrompts = data || [];
        renderAdminPanel();
        return allPrompts;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showToast('❌ Не удалось загрузить промты', true);
        return [];
    }
}

async function loadStats() {
    try {
        const { data, error } = await supabase
            .from('prompts')
            .select('copies');
        
        if (error) throw error;
        
        const totalCopies = data.reduce((sum, p) => sum + (p.copies || 0), 0);
        const topPrompts = [...allPrompts].sort((a, b) => (b.copies || 0) - (a.copies || 0)).slice(0, 5);
        
        return {
            total: allPrompts.length,
            totalCopies: totalCopies,
            avgCopies: allPrompts.length ? (totalCopies / allPrompts.length).toFixed(1) : 0,
            topPrompts: topPrompts
        };
    } catch (error) {
        console.error('Ошибка статистики:', error);
        return { total: 0, totalCopies: 0, avgCopies: 0, topPrompts: [] };
    }
}

// ========== CRUD ОПЕРАЦИИ ==========
async function savePrompt(promptData, isEdit = false) {
    try {
        let result;
        
        if (isEdit && editingPrompt) {
            result = await supabase
                .from('prompts')
                .update({
                    title: promptData.title,
                    category: promptData.category,
                    prompt: promptData.prompt,
                    description: promptData.description,
                    tags: promptData.tags,
                    image_url: promptData.image_url
                })
                .eq('id', editingPrompt.id);
        } else {
            result = await supabase
                .from('prompts')
                .insert([{
                    title: promptData.title,
                    category: promptData.category,
                    prompt: promptData.prompt,
                    description: promptData.description,
                    tags: promptData.tags,
                    image_url: promptData.image_url,
                    copies: 0
                }]);
        }
        
        if (result.error) throw result.error;
        
        showToast(isEdit ? '✅ Промт обновлён!' : '✅ Промт добавлен!');
        closeModal();
        await loadPrompts();
        
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        showToast('❌ Ошибка при сохранении', true);
    }
}

async function deletePrompt(id) {
    if (!confirm('Вы уверены, что хотите удалить этот промт?')) return;
    
    try {
        const { error } = await supabase
            .from('prompts')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        showToast('🗑️ Промт удалён');
        await loadPrompts();
        
    } catch (error) {
        console.error('Ошибка удаления:', error);
        showToast('❌ Ошибка при удалении', true);
    }
}

async function duplicatePrompt(prompt) {
    try {
        const { error } = await supabase
            .from('prompts')
            .insert([{
                title: `${prompt.title} (копия)`,
                category: prompt.category,
                prompt: prompt.prompt,
                description: prompt.description,
                tags: prompt.tags,
                image_url: prompt.image_url,
                copies: 0
            }]);
        
        if (error) throw error;
        
        showToast('📋 Промт скопирован!');
        await loadPrompts();
        
    } catch (error) {
        console.error('Ошибка копирования:', error);
        showToast('❌ Ошибка при копировании', true);
    }
}

// ========== РЕНДЕРИНГ ==========
function renderLoginPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <h2>🔐 Админ-панель</h2>
                <input type="password" id="adminPassword" placeholder="Введите пароль">
                <button class="login-btn" id="loginBtn">Войти</button>
                <div id="loginError" class="error-msg"></div>
            </div>
        </div>
    `;
    
    document.getElementById('loginBtn').addEventListener('click', async () => {
        const password = document.getElementById('adminPassword').value;
        const success = await login(password);
        if (success) {
            await loadPrompts();
        }
    });
    
    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('loginBtn').click();
        }
    });
}

async function renderAdminPanel() {
    const stats = await loadStats();
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="admin-container">
            <div class="admin-header">
                <div class="admin-title">⚡ Админ-панель Промт-мастер</div>
                <button class="logout-btn" id="logoutBtn">🚪 Выйти</button>
            </div>
            
            <!-- Статистика -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">Всего промтов</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalCopies}</div>
                    <div class="stat-label">Всего копирований</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.avgCopies}</div>
                    <div class="stat-label">Среднее на промт</div>
                </div>
            </div>
            
            <!-- Панель управления -->
            <div class="admin-panel">
                <div class="panel-header">
                    <h3>📝 Управление промтами</h3>
                    <button class="add-btn" id="addPromptBtn">+ Добавить промт</button>
                </div>
                
                <div class="prompts-table">
                    ${renderPromptsTable()}
                </div>
            </div>
            
            <!-- Топ промтов -->
            <div class="admin-panel">
                <h3>🏆 Топ-5 популярных промтов</h3>
                <div class="prompts-table">
                    ${renderTopPrompts(stats.topPrompts)}
                </div>
            </div>
        </div>
    `;
    
    // Обработчики
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('addPromptBtn').addEventListener('click', () => openModal());
    
    // Обработчики для кнопок в таблице
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const prompt = allPrompts.find(p => p.id === id);
            if (prompt) openModal(prompt);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            deletePrompt(id);
        });
    });
    
    document.querySelectorAll('.duplicate-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const prompt = allPrompts.find(p => p.id === id);
            if (prompt) duplicatePrompt(prompt);
        });
    });
}

function renderPromptsTable() {
    if (allPrompts.length === 0) {
        return '<div class="loading">📭 Нет промтов. Добавьте первый!</div>';
    }
    
    return `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Категория</th>
                    <th>Промт</th>
                    <th>Копирования</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                ${allPrompts.map(prompt => `
                    <tr>
                        <td>${prompt.id}</td>
                        <td><strong>${escapeHtml(prompt.title)}</strong></td>
                        <td>${getCategoryIcon(prompt.category)} ${prompt.category}</td>
                        <td class="prompt-preview" title="${escapeHtml(prompt.prompt)}">${escapeHtml(prompt.prompt.substring(0, 50))}...</td>
                        <td>${prompt.copies || 0}</td>
                        <td class="action-buttons">
                            <button class="edit-btn" data-id="${prompt.id}">✏️</button>
                            <button class="duplicate-btn" data-id="${prompt.id}">📋</button>
                            <button class="delete-btn" data-id="${prompt.id}">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderTopPrompts(topPrompts) {
    if (topPrompts.length === 0) {
        return '<div class="loading">📊 Нет данных</div>';
    }
    
    return `
        <table>
            <thead>
                <tr><th>#</th><th>Название</th><th>Категория</th><th>Копирования</th></tr>
            </thead>
            <tbody>
                ${topPrompts.map((prompt, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${escapeHtml(prompt.title)}</td>
                        <td>${getCategoryIcon(prompt.category)} ${prompt.category}</td>
                        <td>🏆 ${prompt.copies || 0}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function getCategoryIcon(category) {
    const icons = {
        midjourney: "🎨",
        chatgpt: "💬",
        business: "💼",
        creative: "✨"
    };
    return icons[category] || "📌";
}

// ========== МОДАЛЬНОЕ ОКНО ==========
function openModal(prompt = null) {
    editingPrompt = prompt;
    currentTags = prompt?.tags || [];
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editModal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${prompt ? '✏️ Редактировать промт' : '➕ Новый промт'}</h3>
            
            <input type="text" id="promptTitle" placeholder="Название промта" value="${escapeHtml(prompt?.title || '')}">
            
            <select id="promptCategory">
                <option value="midjourney" ${prompt?.category === 'midjourney' ? 'selected' : ''}>🎨 Midjourney</option>
                <option value="chatgpt" ${prompt?.category === 'chatgpt' ? 'selected' : ''}>💬 ChatGPT</option>
                <option value="business" ${prompt?.category === 'business' ? 'selected' : ''}>💼 Бизнес</option>
                <option value="creative" ${prompt?.category === 'creative' ? 'selected' : ''}>✨ Креатив</option>
            </select>
            
            <textarea id="promptDescription" placeholder="Краткое описание">${escapeHtml(prompt?.description || '')}</textarea>
            
            <textarea id="promptText" placeholder="Текст промта (обязательно)">${escapeHtml(prompt?.prompt || '')}</textarea>
            
            <div class="tags-input">
                <input type="text" id="tagInput" placeholder="Добавить тег (нажмите Enter)">
                <div class="tag-list" id="tagList"></div>
            </div>
            
            <input type="text" id="promptImage" placeholder="Ссылка на картинку (необязательно)" value="${escapeHtml(prompt?.image_url || '')}">
            <div id="imagePreview"></div>
            
            <div class="modal-buttons">
                <button class="save-btn" id="savePromptBtn">💾 Сохранить</button>
                <button class="cancel-btn" id="cancelModalBtn">Отмена</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Рендерим теги
    const tagList = document.getElementById('tagList');
    const tagInput = document.getElementById('tagInput');
    
    function renderTags() {
        tagList.innerHTML = currentTags.map(tag => `
            <span class="tag-item">
                #${escapeHtml(tag)}
                <span class="remove-tag" data-tag="${escapeHtml(tag)}">×</span>
            </span>
        `).join('');
        
        document.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', () => {
                const tagToRemove = btn.dataset.tag;
                currentTags = currentTags.filter(t => t !== tagToRemove);
                renderTags();
            });
        });
    }
    
    renderTags();
    
    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = tagInput.value.trim();
            if (newTag && !currentTags.includes(newTag)) {
                currentTags.push(newTag);
                renderTags();
                tagInput.value = '';
            }
        }
    });
    
    // Предпросмотр картинки
    const imageUrlInput = document.getElementById('promptImage');
    const imagePreview = document.getElementById('imagePreview');
    
    function updateImagePreview() {
        const url = imageUrlInput.value;
        if (url) {
            imagePreview.innerHTML = `<img class="image-preview" src="${escapeHtml(url)}" alt="Preview">`;
        } else {
            imagePreview.innerHTML = '';
        }
    }
    
    imageUrlInput.addEventListener('input', updateImagePreview);
    if (prompt?.image_url) updateImagePreview();
    
    // Сохранение
    document.getElementById('savePromptBtn').addEventListener('click', async () => {
        const title = document.getElementById('promptTitle').value.trim();
        const category = document.getElementById('promptCategory').value;
        const description = document.getElementById('promptDescription').value.trim();
        const promptText = document.getElementById('promptText').value.trim();
        const imageUrl = document.getElementById('promptImage').value.trim();
        
        if (!title) {
            showToast('❌ Введите название', true);
            return;
        }
        if (!promptText) {
            showToast('❌ Введите текст промта', true);
            return;
        }
        
        await savePrompt({
            title,
            category,
            description,
            prompt: promptText,
            tags: currentTags,
            image_url: imageUrl || null
        }, !!prompt);
    });
    
    // Отмена
    document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
    
    // Закрытие по клику вне модалки
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.remove();
    editingPrompt = null;
    currentTags = [];
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
(async function init() {
    const isLoggedIn = await checkAuth();
    if (isLoggedIn) {
        await loadPrompts();
    } else {
        renderLoginPage();
    }
})();
