document.addEventListener('DOMContentLoaded', () => {

    // == 1. КОНСТАНТИ, ЗМІННІ І НАЛАШТУВАННЯ ==
    const BASE_FARE = 40;
    const PRICE_PER_KM = 15;
    const PAYMENT_OPTIONS = ['Готівка', 'Картка'];
    let rideState = 'idle';
    let progressInterval = null; // Змінна для нашого таймера-аніматора

    // == 2. ЗБИРАЄМО ВСІ ПОТРІБНІ ЕЛЕМЕНТИ ==
    const screens = document.querySelectorAll('.screen');
    const backButtons = document.querySelectorAll('.btn-back');
    const showDriverLoginBtn = document.getElementById('show-driver-login');
    const showPassengerLoginBtn = document.getElementById('show-passenger-login');
    const driverTelegramLoginBtn = document.querySelector('#login-screen-driver .btn-telegram-login');
    const passengerTelegramLoginBtn = document.querySelector('#login-screen-passenger .btn-telegram-login');
    
    // Елементи пасажира
    const showMyOrdersBtn = document.getElementById('show-my-orders-btn');
    const findDriverBtn = document.getElementById('find-driver-btn');
    const showQuickOrderBtn = document.getElementById('show-quick-order-btn');
    const quickOrderForm = document.getElementById('quick-order-form');
    const showHelpBtn = document.getElementById('show-help-btn');
    const carProgressIcon = document.getElementById('car-progress-icon');

    // Елементи водія
    const showFindPassengersBtn = document.getElementById('show-find-passengers-btn');
    const acceptOrderBtn = document.getElementById('accept-order-btn');
    const rideActionBtn = document.getElementById('ride-action-btn');

    // == 3. ФУНКЦІЯ ДЛЯ НАВІГАЦІЇ ==
    function showScreen(screenId) {
        // Зупиняємо анімацію машинки, коли йдемо з будь-якого екрану
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }

        screens.forEach(screen => { screen.classList.add('hidden'); screen.classList.remove('active'); });
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) { activeScreen.classList.remove('hidden'); activeScreen.classList.add('active'); }
    }

    // == 4. НАВІШУЄМО ОБРОБНИКИ ПОДІЙ (КЛІКИ) ==
    showDriverLoginBtn.addEventListener('click', () => showScreen('login-screen-driver'));
    showPassengerLoginBtn.addEventListener('click', () => showScreen('login-screen-passenger'));
    backButtons.forEach(button => button.addEventListener('click', () => showScreen(button.dataset.target || 'home-screen')));
    driverTelegramLoginBtn.addEventListener('click', () => showScreen('driver-dashboard'));
    passengerTelegramLoginBtn.addEventListener('click', () => showScreen('passenger-dashboard'));
    
    // ЛОГІКА ПАСАЖИРА
    showMyOrdersBtn.addEventListener('click', () => {
        showScreen('passenger-orders-screen');
        startCarAnimation(); // Запускаємо анімацію, коли відкрили екран
        updatePassengerOrderCardListeners();
    });
    findDriverBtn.addEventListener('click', () => showScreen('passenger-find-driver-screen'));
    showQuickOrderBtn.addEventListener('click', () => showScreen('quick-order-screen'));
    showHelpBtn.addEventListener('click', () => showScreen('help-screen'));
    quickOrderForm.addEventListener('submit', (e) => { e.preventDefault(); alert('Замовлення створено!'); showScreen('passenger-dashboard'); quickOrderForm.reset(); });

    // ЛОГІКА ВОДІЯ
    showFindPassengersBtn.addEventListener('click', () => { updateDriverOrderCardListeners(); showScreen('driver-find-passengers-screen'); });
    acceptOrderBtn.addEventListener('click', () => { setupActiveRide(); showScreen('driver-active-ride-screen'); });
    rideActionBtn.addEventListener('click', handleRideAction);
    
    // == 5. ДОДАТКОВІ ФУНКЦІЇ ==
    function updateDriverOrderCardListeners() { /* ... код без змін ... */ }
    function updatePassengerOrderCardListeners() {
        document.querySelectorAll('#passenger-orders-screen .order-card').forEach(card => card.addEventListener('click', () => showScreen('passenger-order-details-screen')));
    }
    
    // НОВА ФУНКЦІЯ АНІМАЦІЇ МАШИНКИ
    function startCarAnimation() {
        let progress = 0;
        carProgressIcon.style.left = '0%'; // Скидаємо позицію на початок

        progressInterval = setInterval(() => {
            progress += 15; // Кожні 2 секунди додаємо 15% прогресу
            if (progress > 90) { // 90% щоб машинка не вилазила за прапорець
                progress = 90;
                clearInterval(progressInterval); // Зупиняємо, коли доїхали
                progressInterval = null;
            }
            carProgressIcon.style.left = `${progress}%`;
        }, 2000); // Оновлюємо кожні 2 секунди
    }

    // Інші функції без змін...
    function calculateAndDisplayTripDetails() { /* ... */ }
    function setupActiveRide() { /* ... */ }
    function handleRideAction() { /* ... */ }
    function updateRideScreenUI() { /* ... */ }

    // Ініціалізація
    showScreen('home-screen');
});
