document.addEventListener('DOMContentLoaded', () => {

    // == 1. ЗБИРАЄМО ВСІ ПОТРІБНІ ЕЛЕМЕНТИ ==
    const screens = document.querySelectorAll('.screen');
    const showDriverLoginBtn = document.getElementById('show-driver-login');
    const showPassengerLoginBtn = document.getElementById('show-passenger-login');
    const backButtons = document.querySelectorAll('.btn-back');
    const driverLoginScreen = document.getElementById('login-screen-driver');
    const passengerLoginScreen = document.getElementById('login-screen-passenger');
    const driverTelegramLoginBtn = driverLoginScreen.querySelector('.btn-telegram-login');
    const passengerTelegramLoginBtn = passengerLoginScreen.querySelector('.btn-telegram-login');
    const findDriverBtn = document.getElementById('find-driver-btn');
    const showQuickOrderBtn = document.getElementById('show-quick-order-btn');
    const quickOrderForm = document.getElementById('quick-order-form');
    // Нова кнопка для довідки
    const showHelpBtn = document.getElementById('show-help-btn');

    // == 2. ФУНКЦІЯ ДЛЯ НАВІГАЦІЇ ==
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) {
            activeScreen.classList.remove('hidden');
            activeScreen.classList.add('active');
        }
    }

    // == 3. НАВІШУЄМО ОБРОБНИКИ ПОДІЙ (КЛІКИ) ==
    showDriverLoginBtn.addEventListener('click', () => showScreen('login-screen-driver'));
    showPassengerLoginBtn.addEventListener('click', () => showScreen('login-screen-passenger'));

    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetScreen = button.dataset.target || 'home-screen';
            showScreen(targetScreen);
        });
    });
    
    driverTelegramLoginBtn.addEventListener('click', () => showScreen('driver-dashboard'));
    passengerTelegramLoginBtn.addEventListener('click', () => showScreen('passenger-dashboard'));
    
    // ЛОГІКА ДЛЯ МЕНЮ ПАСАЖИРА
    findDriverBtn.addEventListener('click', () => showScreen('passenger-find-driver-screen'));
    showQuickOrderBtn.addEventListener('click', () => showScreen('quick-order-screen'));
    
    // Новий обробник для кнопки довідки
    showHelpBtn.addEventListener('click', () => showScreen('help-screen'));

    // Обробка форми швидкого замовлення
    quickOrderForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        alert('Замовлення створено! Шукаємо вам водія... (це імітація)');
        showScreen('passenger-dashboard');
        quickOrderForm.reset();
    });

    // Ініціалізація
    showScreen('home-screen');
});
