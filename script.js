document.addEventListener('DOMContentLoaded', () => {

    // == 1. КОНСТАНТИ, ЗМІННІ І НАЛАШТУВАННЯ ==
    const BASE_FARE = 40;
    const PRICE_PER_KM = 15;
    const PAYMENT_OPTIONS = ['Готівка', 'Картка'];
    const DRIVER_CAR_COLOR = '#ffffff';
    let rideState = 'idle';
    let progressInterval = null;

    // Таймери та статуси для пасажира
    let driverArrived = false;
    let statusTimer = 0;
    let activeOrderInterval = null;
    let etaInterval = null;
    let carAnimationInterval = null;

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
    const rideMapPlaceholder = document.getElementById('ride-map-placeholder')?.querySelector('p');
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
    showDriverLoginBtn?.addEventListener('click', () => showScreen('login-screen-driver'));
    showPassengerLoginBtn?.addEventListener('click', () => showScreen('login-screen-passenger'));
    backButtons.forEach(button => button.addEventListener('click', () => showScreen(button.dataset.target || 'home-screen')));
    driverTelegramLoginBtn?.addEventListener('click', () => showScreen('driver-dashboard'));
    passengerTelegramLoginBtn?.addEventListener('click', () => showScreen('passenger-dashboard'));

    // ========== ЛОГІКА ПАСАЖИРА ==========
showMyOrdersBtn?.addEventListener('click', () => {
    showScreen('passenger-orders-screen');
    runActiveTripSimulation(); 
});


    findDriverBtn?.addEventListener('click', () => showScreen('passenger-find-driver-screen'));
    showQuickOrderBtn?.addEventListener('click', () => showScreen('quick-order-screen'));
    showHelpBtn?.addEventListener('click', () => showScreen('help-screen'));
    quickOrderForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Замовлення створено!');
        showScreen('passenger-dashboard');
        quickOrderForm.reset();
    });
    passengerCancelRideBtn?.addEventListener('click', () => {
        if (confirm('Ви впевнені, що хочете скасувати поїздку?')) {
            alert('Поїздку скасовано.');
            showScreen('passenger-dashboard');
        }
    });

    // ========== ЛОГІКА ВОДІЯ ==========
    showDriverOrdersBtn?.addEventListener('click', () => alert('Цей екран ще в розробці :)'));
    showFindPassengersBtn?.addEventListener('click', () => { updateDriverOrderCardListeners(); showScreen('driver-find-passengers-screen'); });
    acceptOrderBtn?.addEventListener('click', () => { setupActiveRide(); showScreen('driver-active-ride-screen'); });
    cancelRideBtn?.addEventListener('click', () => { if (confirm('Скасувати поїздку? Це може вплинути на ваш рейтинг.')) { rideState = 'idle'; showScreen('driver-dashboard'); } });
    rideActionBtn?.addEventListener('click', handleRideAction);

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
        document.querySelectorAll('#passenger-orders-screen .order-card .details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showScreen('passenger-order-details-screen');
            });
        });
        document.querySelectorAll('#passenger-orders-screen .order-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Якщо клікнули по details-btn, не відкривати
                if (e.target.closest('.details-btn')) return;
                showScreen('passenger-order-details-screen');
            });
        });
    }

    function calculateAndDisplayTripDetails() {
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
    }

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
        if (!rideActionBtn) return;
        rideActionBtn.classList.remove('start-ride', 'end-ride');
        switch (rideState) {
            case 'driving_to_client':
                rideStatusHeader.textContent = 'Поїздка до пасажира';
                if (rideMapPlaceholder) rideMapPlaceholder.textContent = 'Їдьте до пасажира';
                if (rideAddressDetails) rideAddressDetails.innerHTML = '<span><strong>Адреса:</strong> вул. Весняна, 15</span>';
                rideActionBtn.innerHTML = '✅ Я на місці';
                break;
            case 'waiting_for_client':
                rideStatusHeader.textContent = 'Очікування пасажира';
                rideActionBtn.innerHTML = '🚀 Почати поїздку';
                rideActionBtn.classList.add('start-ride');
                break;
            case 'in_progress':
                rideStatusHeader.textContent = 'В дорозі';
                if (rideMapPlaceholder) rideMapPlaceholder.textContent = 'Їдьте до точки призначення';
                if (rideAddressDetails) rideAddressDetails.innerHTML = '<span><strong>Пункт призначення:</strong> вул. Музейна, 4</span>';
                rideActionBtn.innerHTML = '🏁 Завершити поїздку';
                rideActionBtn.classList.add('end-ride');
                break;
        }
    }
    
    // === ГОЛОВНА ФУНКЦІЯ СИМУЛЯЦІЇ (версія для нової картки) ===
function runActiveTripSimulation() {
    // Зупиняємо будь-які старі анімації, якщо вони є
    if (window.tripInterval) clearInterval(window.tripInterval);

    // --- 1. Знаходимо всі наші елементи на картці ---
    const activeCard = document.querySelector('.order-card.active');
    if (!activeCard) return; // Якщо картки нема, нічого не робимо

    const statusIcon = activeCard.querySelector('#status-icon');
    const statusText = activeCard.querySelector('#status-text');
    const carIcon = activeCard.querySelector('#car-icon');
    const dotsContainer = activeCard.querySelector('.dots-container');
    const endPoint = activeCard.querySelector('#progress-end-point');

    // --- 2. Налаштування анімації ---
    const totalDurationSeconds = 15; // Загальна тривалість поїздки в секундах
    const totalDots = 18; // Скільки крапок-індикаторів на шляху
    let progress = 0; // Поточний прогрес від 0 до 100

    // --- 3. Скидаємо все до початкового стану ---
    statusIcon.className = 'fa-solid fa-spinner fa-spin';
    statusText.textContent = 'Водій прямує до вас';
    endPoint.classList.remove('arrived');
    endPoint.className = 'fa-solid fa-circle-dot progress-end-point';
    carIcon.style.left = '0%';
    
    // Генеруємо крапки
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotsContainer.appendChild(dot);
    }
    const allDots = dotsContainer.querySelectorAll('.dot');

    // --- 4. Запускаємо "двигун" анімації ---
    // Ця функція буде виконуватись кожні півсекунди
    window.tripInterval = setInterval(() => {
        progress += (100 / (totalDurationSeconds * 2)); // Розраховуємо, на скільки просунутись за раз

        if (progress >= 100) {
            // --- 5. ФІНАЛ: Поїздку завершено ---
            clearInterval(window.tripInterval); // Зупиняємо двигун
            
            carIcon.style.left = '100%';
            allDots.forEach(d => d.classList.add('passed'));
            
            // Оновлюємо статус на "Прибув"
            statusIcon.className = 'fa-solid fa-circle-check';
            statusIcon.classList.add('arrived');
            statusText.textContent = 'Водій прибув';
            
            // Міняємо іконку кінцевої точки на "пін"
            endPoint.classList.add('arrived');
            endPoint.className = 'fa-solid fa-location-pin progress-end-point arrived';
            return;
        }

        // --- 6. В ДОРОЗІ: Оновлюємо позицію машини і крапок ---
        carIcon.style.left = `${progress}%`;
        const passedDotsCount = Math.floor(allDots.length * (progress / 100));
        allDots.forEach((dot, index) => {
            if (index < passedDotsCount) {
                dot.classList.add('passed');
            } else {
                dot.classList.remove('passed');
            }
        });

    }, 500); // 500 мілісекунд = півсекунди
}

    // == СТАРТОВИЙ ЕКРАН ==
    showScreen('home-screen');
});
