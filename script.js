document.addEventListener('DOMContentLoaded', () => {

    // == 1. КОНСТАНТИ І НАЛАШТУВАННЯ ==
    const BASE_FARE = 40;
    const PRICE_PER_KM = 15;
    const PAYMENT_OPTIONS = ['Готівка', 'Картка'];

    // == 2. ЗБИРАЄМО ВСІ ПОТРІБНІ ЕЛЕМЕНТИ ==
    const screens = document.querySelectorAll('.screen');
    const backButtons = document.querySelectorAll('.btn-back');
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
    const tripDistanceEl = document.getElementById('trip-distance');
    const tripFareEl = document.getElementById('trip-fare');
    const paymentMethodEl = document.getElementById('payment-method');
    // Нові кнопки
    const arrivedBtn = document.getElementById('arrived-btn');
    const cancelRideBtn = document.getElementById('cancel-ride-btn');

    // == 3. ФУНКЦІЯ ДЛЯ НАВІГАЦІЇ ==
    function showScreen(screenId) {
        screens.forEach(screen => { screen.classList.add('hidden'); screen.classList.remove('active'); });
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) { activeScreen.classList.remove('hidden'); activeScreen.classList.add('active'); }
    }

    // == 4. НАВІШУЄМО ОБРОБНИКИ ПОДІЙ (КЛІКИ) ==
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
    
    // ЛОГІКА ПАСАЖИРА
    findDriverBtn.addEventListener('click', () => showScreen('passenger-find-driver-screen'));
    showQuickOrderBtn.addEventListener('click', () => showScreen('quick-order-screen'));
    showHelpBtn.addEventListener('click', () => showScreen('help-screen'));
    quickOrderForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        alert('Замовлення створено! (імітація)');
        showScreen('passenger-dashboard');
        quickOrderForm.reset();
    });

    // ЛОГІКА ВОДІЯ
    showFindPassengersBtn.addEventListener('click', () => {
        updateOrderCardListeners();
        showScreen('driver-find-passengers-screen');
    });
    
    // Змінюємо логіку кнопки "Прийняти"
    acceptOrderBtn.addEventListener('click', () => {
        // Замість alert тепер переходимо на екран активної поїздки
        showScreen('driver-active-ride-screen');
    });

    // Нові обробники для екрану активної поїздки
    arrivedBtn.addEventListener('click', () => {
        alert('Пасажиру надіслано сповіщення, що ви на місці! (імітація)');
        // В майбутньому тут може змінюватись інтерфейс на "Почати поїздку"
    });

    cancelRideBtn.addEventListener('click', () => {
        if (confirm('Ви впевнені, що хочете скасувати поїздку? Це може вплинути на ваш рейтинг.')) {
            alert('Поїздку скасовано.');
            showScreen('driver-dashboard');
        }
    });
    
    // == 5. ДОДАТКОВІ ФУНКЦІЇ ==
    function updateOrderCardListeners() {
        const orderCards = document.querySelectorAll('.order-card');
        orderCards.forEach(card => {
            card.addEventListener('click', () => {
                calculateAndDisplayTripDetails();
                showScreen('driver-order-details-screen');
            });
        });
    }

    function calculateAndDisplayTripDetails() {
        const distance = (Math.random() * (10 - 1.5) + 1.5).toFixed(1);
        const fare = Math.round(BASE_FARE + (distance * PRICE_PER_KM));
        const paymentMethod = PAYMENT_OPTIONS[Math.floor(Math.random() * PAYMENT_OPTIONS.length)];
        
        tripDistanceEl.textContent = `~ ${distance} км`;
        tripFareEl.textContent = `~ ${fare} грн`;
        paymentMethodEl.textContent = paymentMethod;
    }

    // Ініціалізація
    showScreen('home-screen');
});
