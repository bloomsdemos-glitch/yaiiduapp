document.addEventListener('DOMContentLoaded', () => {

    // == 1. КОНСТАНТИ, ЗМІННІ І НАЛАШТУВАННЯ ==
    const BASE_FARE = 40;
    const PRICE_PER_KM = 15;
    const PAYMENT_OPTIONS = ['Готівка', 'Картка'];
    const DRIVER_CAR_COLOR = '#ffffff'; // За замовчуванням білий
    let rideState = 'idle';
    let progressInterval = null;

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
    const passengerCancelRideBtn = document.getElementById('passenger-cancel-ride-btn');

    // Елементи водія
    const showDriverOrdersBtn = document.getElementById('show-driver-orders-btn');
    const showFindPassengersBtn = document.getElementById('show-find-passengers-btn');
    const acceptOrderBtn = document.getElementById('accept-order-btn');
    const tripDistanceEl = document.getElementById('trip-distance');
    const tripFareEl = document.getElementById('trip-fare');
    const paymentMethodEl = document.getElementById('payment-method');
    const cancelRideBtn = document.getElementById('cancel-ride-btn');
    const rideActionBtn = document.getElementById('ride-action-btn');
    const rideStatusHeader = document.getElementById('ride-status-header');
    const rideMapPlaceholder = document.getElementById('ride-map-placeholder').querySelector('p');
    const rideAddressDetails = document.getElementById('ride-address-details');

    // == 3. ФУНКЦІЯ ДЛЯ НАВІГАЦІЇ ==
    function showScreen(screenId) {
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

    // --- НОВА, ПОКРАЩЕНА СИМУЛЯЦІЯ ПОЇЗДКИ ---

    // 1. Знаходимо всі потрібні елементи всередині активної картки
    const activeCard = document.querySelector('.order-card.active');
    if (!activeCard) return; // Якщо активної картки немає, нічого не робимо

    const startIcon = activeCard.querySelector('.start-point-icon');
    const endIcon = activeCard.querySelector('.end-point-icon');
    const carIcon = activeCard.querySelector('#car-progress-icon');
    const statusText = activeCard.querySelector('.order-status');
    const arrivalTime = activeCard.querySelector('#arrival-time-status');

    // 2. Встановлюємо початковий стан "Водій в дорозі"
    startIcon.style.color = 'var(--danger-color)'; // Червоний
    endIcon.style.color = 'var(--success-color)';
    endIcon.classList.add('pulsing');
    if (carIcon) carIcon.style.left = '10%'; // Починаємо рух машинки
    if (statusText) statusText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> В дорозі';
    if (arrivalTime) arrivalTime.textContent = 'Прибуде приблизно через 5 хв.';

    // 3. Симулюємо прибуття водія через 4 секунди
    setTimeout(() => {
        startIcon.style.color = 'var(--text-secondary)'; // Сірий
        endIcon.classList.remove('pulsing');
        if (carIcon) carIcon.style.left = '90%'; // Машинка майже приїхала
        if (statusText) {
            statusText.innerHTML = '<i class="fa-solid fa-check"></i> Водій прибув';
            statusText.style.color = 'var(--success-color)';
        }
        if (arrivalTime) arrivalTime.textContent = 'Водій очікує';
    }, 4000); // 4000 мілісекунд = 4 секунди

    updatePassengerOrderCardListeners();
});


    findDriverBtn.addEventListener('click', () => showScreen('passenger-find-driver-screen'));
    showQuickOrderBtn.addEventListener('click', () => showScreen('quick-order-screen'));
    showHelpBtn.addEventListener('click', () => showScreen('help-screen'));
    quickOrderForm.addEventListener('submit', (e) => { e.preventDefault(); alert('Замовлення створено!'); showScreen('passenger-dashboard'); quickOrderForm.reset(); });
    passengerCancelRideBtn.addEventListener('click', () => {
        if (confirm('Ви впевнені, що хочете скасувати поїздку?')) {
            alert('Поїздку скасовано.');
            showScreen('passenger-dashboard');
        }
    });

    // ЛОГІКА ВОДІЯ
    showDriverOrdersBtn.addEventListener('click', () => alert('Цей екран ще в розробці :)'));
    showFindPassengersBtn.addEventListener('click', () => { updateDriverOrderCardListeners(); showScreen('driver-find-passengers-screen'); });
    acceptOrderBtn.addEventListener('click', () => { setupActiveRide(); showScreen('driver-active-ride-screen'); });
    cancelRideBtn.addEventListener('click', () => { if (confirm('Скасувати поїздку? Це може вплинути на ваш рейтинг.')) { rideState = 'idle'; showScreen('driver-dashboard'); } });
    rideActionBtn.addEventListener('click', handleRideAction);
    
// == 5. ДОДАТКОВІ ФУНКЦІЇ ==
function updateDriverOrderCardListeners() {
    document.querySelectorAll('#driver-find-passengers-screen .order-card').forEach(card => {
        card.addEventListener('click', () => {
            calculateAndDisplayTripDetails();
            showScreen('driver-order-details-screen');
        });
    });
}

function updatePassengerOrderCardListeners() {
    document.querySelectorAll('#passenger-orders-screen .order-card').forEach(card => {
        card.addEventListener('click', () => showScreen('passenger-order-details-screen'));
    });
}

function startCarAnimation() {
    if (!carProgressIcon) return;
    // carProgressIcon.style.color = DRIVER_CAR_COLOR; // Ця змінна не визначена, поки що ховаємо
    let progress = 0;
    carProgressIcon.style.left = '0%';
    progressInterval = setInterval(() => {
        progress += 10;
        if (progress > 90) {
            progress = 90;
            clearInterval(progressInterval);
            progressInterval = null;
        }
        carProgressIcon.style.left = `${progress}%`;
    }, 1500);
}

function calculateAndDisplayTripDetails() {
    // Перевіряємо, чи існують елементи, перед тим як їх використовувати
    if (!tripDistanceEl || !tripFareEl || !paymentMethodEl) return;

    const distance = (Math.random() * (10 - 1.5) + 1.5).toFixed(1);
    const fare = Math.round(BASE_FARE + (distance * PRICE_PER_KM));
    const paymentMethod = PAYMENT_OPTIONS[Math.floor(Math.random() * PAYMENT_OPTIONS.length)];
    
    tripDistanceEl.textContent = `~ ${distance} км`;
    tripFareEl.textContent = `~ ${fare} грн`;
    paymentMethodEl.textContent = paymentMethod;
}

function setupActiveRide() {
    rideState = 'driving_to_client';
    updateRideScreenUI();
} // <--- ОСЬ ВОНА, ВАЖЛИВА ДУЖКА!

function handleRideAction() {
    switch (rideState) {
        case 'driving_to_client':
            alert('Пасажиру надіслано сповіщення, що ви на місці!');
            rideState = 'waiting_for_client';
            break;
        case 'waiting_for_client':
            rideState = 'in_progress';
            break;
        case 'in_progress':
            alert('Поїздку завершено!');
            rideState = 'idle';
            showScreen('driver-dashboard');
            break;
    }
    updateRideScreenUI();
}

function updateRideScreenUI() {
    if (!rideActionBtn) return; // Додаємо перевірку на існування кнопки
    rideActionBtn.classList.remove('start-ride', 'end-ride');
    switch (rideState) {
        case 'driving_to_client':
            rideStatusHeader.textContent = 'Поїздка до пасажира';
            rideMapPlaceholder.textContent = 'Їдьте до пасажира';
            rideAddressDetails.innerHTML = '<span><strong>Адреса:</strong> вул. Весняна, 15</span>';
            rideActionBtn.innerHTML = '✅ Я на місці';
            break;
        case 'waiting_for_client':
            rideStatusHeader.textContent = 'Очікування пасажира';
            rideActionBtn.innerHTML = '🚀 Почати поїздку';
            rideActionBtn.classList.add('start-ride');
            break;
        case 'in_progress':
            rideStatusHeader.textContent = 'В дорозі';
            rideMapPlaceholder.textContent = 'Їдьте до точки призначення';
            rideAddressDetails.innerHTML = '<span><strong>Пункт призначення:</strong> вул. Музейна, 4</span>';
            rideActionBtn.innerHTML = '🏁 Завершити поїздку';
            rideActionBtn.classList.add('end-ride');
            break;
    }
}

function simulateActivePassengerTrip() {
    const startIcon = document.querySelector('#passenger-orders-screen .start-point-icon');
    const endIcon = document.querySelector('#passenger-orders-screen .end-point-icon');

    if (startIcon && endIcon) {
        startIcon.classList.add('active-state'); // Робимо червоною
        endIcon.classList.add('pulsing');     // Робимо пульсуючою зеленою
    }
}

// === НОВА ЛОГІКА ДЛЯ АКТИВНОГО ЗАМОВЛЕННЯ ===

let driverArrived = false;
let statusTimer = 323; // секунди

function updateActiveOrderStatus() {
    const statusText = document.getElementById('status-text');
    const statusTimerEl = document.getElementById('status-timer');
    const destinationIcon = document.getElementById('destination-icon');
    const progressStart = document.querySelector('.progress-start');
    
    if (!driverArrived) {
        // Водій ще їде
        statusText.textContent = 'В дорозі';
        statusText.classList.remove('arrived');
        
        // Форматуємо таймер
        const mins = Math.floor(statusTimer / 60);
        const secs = statusTimer % 60;
        statusTimerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        statusTimer++;
    } else {
        // Водій прибув
        statusText.textContent = 'Водій прибув';
        statusText.classList.add('arrived');
        
        // Змінюємо іконки
        destinationIcon.classList.remove('pulsing-green');
        destinationIcon.classList.add('arrived');
        progressStart.classList.add('arrived');
        
        // Таймер очікування
        const waitMins = Math.floor(statusTimer / 60);
        const waitSecs = statusTimer % 60;
        statusTimerEl.textContent = `Очікує ${waitMins}:${waitSecs.toString().padStart(2, '0')}`;
        
        statusTimer++;
    }
}

function showOrderDetails() {
    showScreen('passenger-order-details-screen');
}

// Імітація прибуття водія через 10 секунд
setTimeout(() => {
    driverArrived = true;
    statusTimer = 0; // Скидаємо таймер для очікування
}, 10000);

// Оновлюємо статус кожну секунду
setInterval(updateActiveOrderStatus, 1000);
// Ініціалізація (запускає головний екран при старті)
showScreen('home-screen');
    
}); // <-- ОСЬ ЦІЄЇ ЧАСТИНИ НЕ ВИСТАЧАЛО
