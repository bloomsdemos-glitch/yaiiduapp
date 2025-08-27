document.addEventListener('DOMContentLoaded', () => {

    // == 1. ЗБИРАЄМО ВСІ ПОТРІБНІ ЕЛЕМЕНТИ ==
    const screens = document.querySelectorAll('.screen');
    const backButtons = document.querySelectorAll('.btn-back');
    
    // Елементи входу
    const showDriverLoginBtn = document.getElementById('show-driver-login');
    const showPassengerLoginBtn = document.getElementById('show-passenger-login');
    const driverLoginScreen = document.getElementById('login-screen-driver');
    const passengerLoginScreen = document.getElementById('login-screen-passenger');
    const driverTelegramLoginBtn = driverLoginScreen.querySelector('.btn-telegram-login');
    const passengerTelegramLoginBtn = passengerLoginScreen.querySelector('.btn-telegram-login');
    
    // Елементи пасажира
    const findDriverBtn = document.getElementById('find-driver-btn');
    const showQuickOrderBtn = document.getElementById('show-quick-order-btn');
    const quickOrderForm = document.getElementById('quick-order-form');
    const showHelpBtn = document.getElementById('show-help-btn');

    // Елементи водія
    const showFindPassengersBtn = document.getElementById('show-find-passengers-btn');
    const acceptOrderBtn = document.getElementById('accept-order-btn');

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
    showHelpBtn.addEventListener('click', () => showScreen('help-screen'));
    quickOrderForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        alert('Замовлення створено! Шукаємо вам водія... (це імітація)');
        showScreen('passenger-dashboard');
        quickOrderForm.reset();
    });

    // ЛОГІКА ДЛЯ МЕНЮ ВОДІЯ
    showFindPassengersBtn.addEventListener('click', () => {
        // Оновлюємо слухачі на картках замовлень кожного разу, як відкриваємо екран
        updateOrderCardListeners();
        showScreen('driver-find-passengers-screen');
    });

    acceptOrderBtn.addEventListener('click', () => {
        alert('Замовлення прийнято! (імітація)');
        showScreen('driver-dashboard'); // Повертаємо водія на головне меню
    });
    
    // == 4. ДОДАТКОВІ ФУНКЦІЇ ==
    function updateOrderCardListeners() {
        const orderCards = document.querySelectorAll('.order-card');
        orderCards.forEach(card => {
            card.addEventListener('click', () => {
                // В реальному додатку тут ми б передавали дані цього замовлення
                // А поки просто показуємо екран з деталями
                showScreen('driver-order-details-screen');
            });
        });
    }

    // Ініціалізація
    showScreen('home-screen');
});
