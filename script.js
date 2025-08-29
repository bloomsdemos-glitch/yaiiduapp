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

    function startCarAnimation() {
        if (!carProgressIcon) return;
        let progress = 0;
        carProgressIcon.style.left = '0%';
        if (carAnimationInterval) clearInterval(carAnimationInterval);
        carAnimationInterval = setInterval(() => {
            progress += 10;
            if (progress > 90) {
                progress = 90;
                clearInterval(carAnimationInterval);
                carAnimationInterval = null;
            }
            carProgressIcon.style.left = `${progress}%`;
        }, 1500);
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
    
    function runActiveTripSimulation() {
    const activeCard = document.querySelector('.order-card.active');
    if (!activeCard) return;

    const dotsRow = activeCard.querySelector('.dots-row');
    const carIcon = activeCard.querySelector('#car-progress-icon');
    const progressStart = activeCard.querySelector('.progress-start');
    const progressEnd = activeCard.querySelector('.progress-end');
    const statusTextSpan = activeCard.querySelector('.trip-status span');
    const statusIcon = activeCard.querySelector('.trip-status i');

    // Зупиняємо старі анімації, якщо вони є
    if (window.dotInterval) clearInterval(window.dotInterval);
    if (window.carInterval) clearInterval(window.carInterval);

    // Скидання стану
    dotsRow.innerHTML = '';
    const totalDots = 10;
    for (let i = 0; i < totalDots; i++) {
        dotsRow.innerHTML += '<i class="fa-solid fa-circle dot"></i>';
    }
    const dots = dotsRow.querySelectorAll('.dot');
    progressStart.style.color = 'var(--danger-color)';
    progressEnd.style.color = 'var(--muted)';
    carIcon.style.left = '0%';
    statusTextSpan.textContent = 'Водій прямує до вас';
    statusIcon.className = 'fa-solid fa-spinner fa-spin';

    // Запуск анімації
    let currentDot = 0;
    window.dotInterval = setInterval(() => {
        if (currentDot < dots.length) {
            dots[currentDot].classList.add('filled');
            currentDot++;
        }
    }, 800);

    let carProgress = 0;
    window.carInterval = setInterval(() => {
        carProgress += 1;
        carIcon.style.left = `${carProgress}%`;
        if (carProgress >= 100) {
            clearInterval(window.dotInterval);
            clearInterval(window.carInterval);
            // Стан "Прибув"
            progressStart.style.color = 'var(--muted)';
            progressEnd.style.color = 'var(--success-color)';
            statusTextSpan.textContent = 'Водій прибув';
            statusIcon.className = 'fa-solid fa-circle-check';
            dots.forEach(dot => dot.classList.add('filled'));
        }
    }, 90);
}


    // ======= Симуляція поїздки пасажира (оновлено для Dots прогрес-бару) =======
function simulatePassengerOrderCard() {
    // 1. Знаходимо всі потрібні елементи всередині активної картки
    const activeCard = document.querySelector('.order-card.active');
    if (!activeCard) return;

    // Прогрес-бар (нова структура)
    const dots = [...activeCard.querySelectorAll('.dot')];
    const carIcon = activeCard.querySelector('#car-progress-icon');
    const progressStart = activeCard.querySelector('.progress-start');
    const progressEnd = activeCard.querySelector('.progress-end');
    const statusRow = activeCard.querySelector('.status-row .trip-status');

    // Скидаємо початковий стан
    dots.forEach(dot => dot.classList.remove('dot-filled'));
    if (progressStart) progressStart.classList.remove('arrived');
    if (progressEnd) {
        progressEnd.classList.remove('arrived', 'fa-map-pin');
        progressEnd.classList.add('fa-circle-dot');
        progressEnd.classList.remove('pulsing-green');
        progressEnd.classList.add('progress-end');
        progressEnd.style.color = '#ffc700';
        progressEnd.style.animation = 'pulse 1.5s infinite';
    }
    if (carIcon) carIcon.style.left = '0%';
    if (statusRow) {
        statusRow.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Водій прямує до вас';
        statusRow.classList.remove('success');
    }

    // Анімація dots + машинки
    let step = 0;
    let totalSteps = dots.length;
    let carPositions = [0, 14, 28, 42, 56, 70, 84, 92]; // у %
    if (carIcon) carIcon.style.left = `${carPositions[0]}%`;

    // Крок анімації dots/машинки кожну ~900мс
    let carAnim = setInterval(() => {
        if (step < totalSteps) {
            dots[step].classList.add('dot-filled');
            if (carIcon) carIcon.style.left = `${carPositions[step + 1]}%`;
        }
        step++;
        if (step === totalSteps) {
            // Прибуття водія
            setTimeout(() => {
                if (progressStart) progressStart.classList.add('arrived');
                if (progressEnd) {
                    progressEnd.classList.remove('fa-circle-dot');
                    progressEnd.classList.add('fa-map-pin', 'arrived');
                    progressEnd.style.color = 'var(--success-color)';
                    progressEnd.style.animation = 'none';
                }
                if (carIcon) carIcon.style.left = `${carPositions[carPositions.length-1]}%`;
                if (statusRow) {
                    statusRow.innerHTML = '<i class="fa-solid fa-circle-check"></i> Водій на місці';
                    statusRow.classList.add('success');
                }
            }, 600); // невелика пауза після останньої крапки
            clearInterval(carAnim);
        }
    }, 900);
}

// === СТАТУС АКТИВНОГО ЗАМОВЛЕННЯ ДЛЯ ПАСАЖИРА (залишити як було, якщо потрібно для таймеру) ===
function updateActiveOrderStatus() {
    const statusText = document.getElementById('status-text');
    const statusTimerEl = document.getElementById('status-timer');
    const progressStart = document.querySelector('.progress-start');
    const progressEnd = document.querySelector('.progress-end');
    if (!statusText || !statusTimerEl) return;
    if (!driverArrived) {
        statusText.textContent = 'В дорозі';
        statusText.classList.remove('arrived');
        const mins = Math.floor(statusTimer / 60);
        const secs = statusTimer % 60;
        statusTimerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        statusTimer++;
    } else {
        statusText.textContent = 'Водій прибув';
        statusText.classList.add('arrived');
        if (progressEnd) {
            progressEnd.classList.remove('pulsing-green');
            progressEnd.classList.add('arrived');
        }
        if (progressStart) progressStart.classList.add('arrived');
        const waitMins = Math.floor(statusTimer / 60);
        const waitSecs = statusTimer % 60;
        statusTimerEl.textContent = `Очікує ${waitMins}:${waitSecs.toString().padStart(2, '0')}`;
        statusTimer++;
    }
}

// === ETA блок (залишити як було) ===
function updateETA() {
    const etaBlock = document.querySelector('.eta-block span');
    if (!etaBlock) return;
    if (!driverArrived) {
        const mins = Math.max(1, 4 - Math.floor(statusTimer / 60));
        etaBlock.textContent = `Прибуде приблизно через ${mins} ${mins === 1 ? 'хвилину' : 'хвилини'}. Очікуйте.`;
    } else {
        etaBlock.textContent = 'Водій на місці. Виходьте!';
        etaBlock.parentElement.style.background = 'rgba(122, 255, 201, 0.2)';
    }
}

    // === ДЕТАЛІ ЗАМОВЛЕННЯ ===
    window.callDriver = function() {
        if (confirm('Подзвонити водію Андрію?')) {
            alert('Дзвінок...\n📞 +380XX XXX XX XX');
        }
    };

    window.sendWaitingNotification = function() {
        if (confirm('Відправити водію сповіщення "Я вже чекаю"?\n\nВикористовуйте цю функцію тільки у крайньому випадку.')) {
            alert('✅ Сповіщення надіслано!\n\nВодій отримає варіанти швидкої відповіді.');
            setTimeout(() => {
                alert('💬 Відповідь від водія:\n"Я їду, буду через 2 хвилини"');
            }, 3000);
        }
    };

    // == СТАРТОВИЙ ЕКРАН ==
    showScreen('home-screen');
});