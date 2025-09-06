document.addEventListener('DOMContentLoaded', () => {

    // == 1. ОСНОВНІ НАЛАШТУВАННЯ ==
    let rideState = 'idle';

    // == 2. ЗБІР ЕЛЕМЕНТІВ DOM ==
    const screens = document.querySelectorAll('.screen');
    const backButtons = document.querySelectorAll('.btn-back');
    // -- Навігація --
    const showDriverLoginBtn = document.getElementById('show-driver-login');
    const showPassengerLoginBtn = document.getElementById('show-passenger-login');
    const showMyOrdersBtn = document.getElementById('show-my-orders-btn');
    const findDriverBtn = document.getElementById('find-driver-btn');
    const showQuickOrderBtn = document.getElementById('show-quick-order-btn');
    const showHelpBtn = document.getElementById('show-help-btn');
    const goToMyOrdersBtn = document.getElementById('go-to-my-orders-btn');
    const showFindPassengersBtn = document.getElementById('show-find-passengers-btn');
    const driverTelegramLoginBtn = document.querySelector('#login-screen-driver .btn-telegram-login');
    const passengerTelegramLoginBtn = document.querySelector('#login-screen-passenger .btn-telegram-login');

    // Елементи водія
    const showDriverOrdersBtn = document.getElementById('show-driver-orders-btn');
    const acceptOrderBtn = document.getElementById('accept-order-btn');
    const tripDistanceEl = document.getElementById('trip-distance');
    const tripFareEl = document.getElementById('trip-fare');
    const paymentMethodEl = document.getElementById('payment-method');
    const cancelRideBtn = document.getElementById('cancel-ride-btn');
    const rideActionBtn = document.getElementById('ride-action-btn');
    const rideStatusHeader = document.getElementById('ride-status-header');
    const rideMapPlaceholder = document.getElementById('ride-map-placeholder')?.querySelector('p');
    const rideAddressDetails = document.getElementById('ride-address-details');

    // == 3. ОСНОВНІ ФУНКЦІЇ ==

// ЗАМІНИ НА ЦЕЙ ПРАВИЛЬНИЙ БЛОК:
function showScreen(screenId) {
    if (window.tripInterval) clearInterval(window.tripInterval);

    screens.forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.remove('active'); // ВАЖЛИВО: Повертаємо цей рядок
    });
    const activeScreen = document.getElementById(screenId);
    if (activeScreen) {
        activeScreen.classList.remove('hidden');
        activeScreen.classList.add('active'); // ВАЖЛИВО: І цей теж
    }
}


    function runActiveTripSimulation() {
        // ... (код симуляції залишаємо як є)
        if (window.tripInterval) clearInterval(window.tripInterval);
        const activeCard = document.querySelector('#passenger-orders-screen .order-card.active');
        if (!activeCard) return;
        const statusIcon = activeCard.querySelector('#status-icon');
        const statusText = activeCard.querySelector('#status-text');
        const carIcon = activeCard.querySelector('#car-icon');
        const dotsContainer = activeCard.querySelector('.dots-container');
        const endPoint = activeCard.querySelector('#progress-end-point');
        const totalDurationSeconds = 15, totalDots = 18; let progress = 0;
        statusIcon.className = 'fa-solid fa-spinner fa-spin'; statusText.textContent = 'Водій прямує до вас';
        endPoint.className = 'fa-solid fa-circle-dot progress-end-point'; endPoint.classList.remove('arrived');
        carIcon.style.left = '0%';
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) { const dot = document.createElement('div'); dot.className = 'dot'; dotsContainer.appendChild(dot); }
        const allDots = dotsContainer.querySelectorAll('.dot');
        window.tripInterval = setInterval(() => {
            progress += (100 / (totalDurationSeconds * 2));
            if (progress >= 100) {
                clearInterval(window.tripInterval); carIcon.style.left = '100%';
                allDots.forEach(d => d.classList.add('passed'));
                statusIcon.className = 'fa-solid fa-circle-check arrived'; statusText.textContent = 'Водій прибув';
                endPoint.className = 'fa-solid fa-location-pin progress-end-point arrived';
                return;
            }
            carIcon.style.left = `${progress}%`;
            const passedDotsCount = Math.floor(allDots.length * (progress / 100));
            allDots.forEach((dot, index) => { dot.classList[index < passedDotsCount ? 'add' : 'remove']('passed'); });
        }, 500);
    }
    
    function updatePassengerOrderCardListeners() {
        document.querySelectorAll('#passenger-orders-screen .details-btn-arrow').forEach(button => {
            button.addEventListener('click', () => showScreen('passenger-order-details-screen'));
        });
    }

    // == 4. ЛОГІКА ДЛЯ ЕКРАНУ "ШВИДКЕ ЗАМОВЛЕННЯ" (ФАЗА 3) ==

    const quickOrderForm = document.getElementById('quick-order-form');
    const timeOptionButtons = document.querySelectorAll('.btn-segment[data-time-option]');
    const nowTimeBlock = document.getElementById('now-time-block');
    const laterOptionsContainer = document.getElementById('later-options-wrapper');
    const timeHoursSelect = document.getElementById('time-hours');
    const timeMinutesSelect = document.getElementById('time-minutes');
    const dateTiles = document.querySelectorAll('.date-tile');
    const scheduleConfirmBlock = document.getElementById('schedule-confirm-block');
    const scheduleResultText = document.getElementById('schedule-result-text');
    const confirmCheckmark = document.querySelector('.confirm-checkmark');
    const selectDateBtn = document.querySelector('.btn-segment.full-width[data-schedule="date"]');
    const fromAddressInput = document.getElementById('from-address');
    const toAddressInput = document.getElementById('to-address');
    const submitOrderBtn = document.getElementById('submit-order-btn');

    function populateTimeSelectors() {
        if (timeHoursSelect.options.length > 1) return;
        for (let i = 0; i < 24; i++) {
            const option = document.createElement('option');
            const hour = i.toString().padStart(2, '0');
            option.value = hour; option.textContent = hour;
            timeHoursSelect.appendChild(option);
        }
        for (let i = 0; i < 60; i++) {
            const option = document.createElement('option');
            const minute = i.toString().padStart(2, '0');
            option.value = minute; option.textContent = minute;
            timeMinutesSelect.appendChild(option);
        }
    }

    function checkFormCompleteness() {
        const isAddressFilled = fromAddressInput.value.trim() !== '' && toAddressInput.value.trim() !== '';
        if (isAddressFilled) {
            submitOrderBtn.classList.remove('disabled');
        } else {
            submitOrderBtn.classList.add('disabled');
        }
    }

function initQuickOrderScreen() {
    // populateTimeSelectors(); // Ця функція нам поки не потрібна
    const hoursEl = document.getElementById('time-display-hours');
    const minutesEl = document.getElementById('time-display-minutes');
    
    if (hoursEl && minutesEl) {
        const now = new Date();
        hoursEl.textContent = now.getHours().toString().padStart(2, '0');
        minutesEl.textContent = now.getMinutes().toString().padStart(2, '0');
    }
    
    checkFormCompleteness();
}


    timeOptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeOptionButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (button.dataset.timeOption === 'later') {
                laterOptionsContainer.classList.remove('hidden');
                nowTimeBlock.classList.add('hidden');
            } else {
                laterOptionsContainer.classList.add('hidden');
                nowTimeBlock.classList.remove('hidden');
            }
        });
    });

dateTiles.forEach(tile => {
    tile.addEventListener('click', () => {
        // Логіка вибору активної плитки
        dateTiles.forEach(t => t.classList.remove('active'));
        tile.classList.add('active');
        
        // Ховаємо контейнер з плитками і кнопку "Вибрати дату"
        tile.closest('.date-tiles-container').classList.add('hidden');
        selectDateBtn.classList.add('hidden');
        
        // Показуємо блок підтвердження
        scheduleConfirmBlock.classList.remove('hidden');
        
        // Формуємо текст для результату
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        
        let dayText = 'Сьогодні';
        if (tile.dataset.schedule === 'tomorrow') {
            dayText = 'Завтра';
        }
        
        scheduleResultText.textContent = `${dayText} • ${hours}:${minutes}`;
    });
});

// Додамо логіку для кнопки "На інший час"
timeOptionButtons.forEach(button => {
    button.addEventListener('click', () => {
        timeOptionButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Скидаємо вибір дати, якщо користувач переключається
        scheduleConfirmBlock.classList.add('hidden');
        document.querySelector('.date-tiles-container').classList.remove('hidden');
        selectDateBtn.classList.remove('hidden');
        dateTiles.forEach(t => t.classList.remove('active'));

        if (button.dataset.timeOption === 'later') {
            laterOptionsContainer.classList.remove('hidden');
            nowTimeBlock.classList.add('hidden');
        } else {
            laterOptionsContainer.classList.add('hidden');
            nowTimeBlock.classList.remove('hidden');
        }
    });
});


    [fromAddressInput, toAddressInput].forEach(input => {
        input.addEventListener('input', checkFormCompleteness);
    });

    quickOrderForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!submitOrderBtn.classList.contains('disabled')) {
            showScreen('order-confirmation-screen');
        }
    });

    // == 5. ГОЛОВНІ ОБРОБНИКИ ПОДІЙ ==
    showDriverLoginBtn?.addEventListener('click', () => showScreen('login-screen-driver'));
    showPassengerLoginBtn?.addEventListener('click', () => showScreen('login-screen-passenger'));
    driverTelegramLoginBtn?.addEventListener('click', () => showScreen('driver-dashboard'));
    passengerTelegramLoginBtn?.addEventListener('click', () => showScreen('passenger-dashboard'));

    showMyOrdersBtn?.addEventListener('click', () => {
        showScreen('passenger-orders-screen');
        runActiveTripSimulation();
        updatePassengerOrderCardListeners();
    });

    function updateDriverOrderCardListeners() {
        document.querySelectorAll('#driver-find-passengers-screen .order-card').forEach(card => {
            card.addEventListener('click', () => {
                calculateAndDisplayTripDetails();
                showScreen('driver-order-details-screen');
            });
        });
    }

    function calculateAndDisplayTripDetails() {
        const BASE_FARE = 40;
        const PRICE_PER_KM = 15;
        const PAYMENT_OPTIONS = ['Готівка', 'Картка'];
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
                if(rideStatusHeader) rideStatusHeader.textContent = 'Поїздка до пасажира';
                if (rideMapPlaceholder) rideMapPlaceholder.textContent = 'Їдьте до пасажира';
                if (rideAddressDetails) rideAddressDetails.innerHTML = '<span><strong>Адреса:</strong> вул. Весняна, 15</span>';
                rideActionBtn.innerHTML = '✅ Я на місці';
                break;
            case 'waiting_for_client':
                if(rideStatusHeader) rideStatusHeader.textContent = 'Очікування пасажира';
                rideActionBtn.innerHTML = '🚀 Почати поїздку';
                rideActionBtn.classList.add('start-ride');
                break;
            case 'in_progress':
                if(rideStatusHeader) rideStatusHeader.textContent = 'В дорозі';
                if (rideMapPlaceholder) rideMapPlaceholder.textContent = 'Їдьте до точки призначення';
                if (rideAddressDetails) rideAddressDetails.innerHTML = '<span><strong>Пункт призначення:</strong> вул. Музейна, 4</span>';
                rideActionBtn.innerHTML = '🏁 Завершити поїздку';
                rideActionBtn.classList.add('end-ride');
                break;
        }
    }
    
    showQuickOrderBtn?.addEventListener('click', () => {
        showScreen('quick-order-screen');
        initQuickOrderScreen();
    });
    
    findDriverBtn?.addEventListener('click', () => showScreen('passenger-find-driver-screen'));
    showHelpBtn?.addEventListener('click', () => showScreen('help-screen'));
    showFindPassengersBtn?.addEventListener('click', () => showScreen('driver-find-passengers-screen'));
    showDriverOrdersBtn?.addEventListener('click', () => alert('Цей екран ще в розробці :)'));
acceptOrderBtn?.addEventListener('click', () => {
    setupActiveRide();
    showScreen('driver-active-ride-screen');
});
cancelRideBtn?.addEventListener('click', () => {
    if (confirm('Скасувати поїздку? Це може вплинути на ваш рейтинг.')) {
        rideState = 'idle';
        showScreen('driver-dashboard');
    }
});
rideActionBtn?.addEventListener('click', handleRideAction);

    goToMyOrdersBtn?.addEventListener('click', () => showMyOrdersBtn.click());
    
    backButtons.forEach(button => {
        button.addEventListener('click', () => showScreen(button.dataset.target || 'home-screen'));
    });

    // == 6. ІНІЦІАЛІЗАЦІЯ ДОДАТКУ ==
    showScreen('home-screen');
    
});
