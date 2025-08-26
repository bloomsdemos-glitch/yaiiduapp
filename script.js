document.addEventListener('DOMContentLoaded', () => {
    // --- ВСЯ ПОПЕРЕДНЯ ЛОГІКА НАВІГАЦІЇ ЗАЛИШАЄТЬСЯ ТУТ ---
    const clickableElements = document.querySelectorAll('[data-target]');
    let navigationHistory = ['splash-screen'];
    
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) { activeScreen.classList.add('active'); }
    }

    clickableElements.forEach(element => {
        element.addEventListener('click', (event) => {
            event.stopPropagation(); 
            const targetScreenId = element.dataset.target;
            if (!targetScreenId) return;
            if (targetScreenId === 'PREVIOUS_SCREEN_PLACEHOLDER') {
                navigationHistory.pop();
                const previousScreen = navigationHistory[navigationHistory.length - 1];
                showScreen(previousScreen);
                return;
            }
            if (targetScreenId !== navigationHistory[navigationHistory.length - 1]) {
                navigationHistory.push(targetScreenId);
            }
            showScreen(targetScreenId);
            const notificationScreen = document.getElementById('notifications');
            if(notificationScreen) {
                const backButton = notificationScreen.querySelector('.back-btn');
                backButton.dataset.target = navigationHistory[navigationHistory.length - 2] || 'splash-screen';
            }
        });
    });

    // ========== ОСЬ НАША НОВА ЛОГІКА ДЛЯ ФОНУ ==========

    const backgroundUrlInput = document.getElementById('background-url-input');
    const saveBackgroundBtn = document.getElementById('save-background-btn');
    const bodyElement = document.body;

    // 1. Функція для застосування фону
    function applyBackground(url) {
        if (url) {
            bodyElement.style.backgroundImage = `url('${url}')`;
        } else {
            bodyElement.style.backgroundImage = 'none';
        }
    }

    // 2. Функція для завантаження збереженого фону при старті
    function loadBackground() {
        const savedUrl = localStorage.getItem('yaYiduAppBackground');
        if (savedUrl) {
            applyBackground(savedUrl);
            backgroundUrlInput.value = savedUrl; // Показуємо збережений URL в полі
        }
    }

    // 3. Обробник кліку на кнопку "Зберегти"
    saveBackgroundBtn.addEventListener('click', () => {
        const newUrl = backgroundUrlInput.value.trim(); // Беремо URL з поля
        if (newUrl) {
            localStorage.setItem('yaYiduAppBackground', newUrl); // Зберігаємо в пам'ять браузера
            applyBackground(newUrl); // Миттєво застосовуємо новий фон
            alert('Фон оновлено!');
        } else {
            // Якщо поле пусте, видаляємо фон
            localStorage.removeItem('yaYiduAppBackground');
            applyBackground(null);
            alert('Фон видалено.');
        }
    });

    // Завантажуємо фон, як тільки додаток відкрився
    loadBackground();
    showScreen('splash-screen');
});
