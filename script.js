document.addEventListener('DOMContentLoaded', () => {

    // == 1. КОНСТАНТИ, ЗМІННІ І НАЛАШТУВАННЯ ==
    const BASE_FARE = 40;
    const PRICE_PER_KM = 15;
    const PAYMENT_OPTIONS = ['Готівка', 'Картка'];
    let rideState = 'idle';

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
    const showHelpBtn = document.getElementById('show-help-btn');
    
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
        if (window.tripInterval) clearInterval(window.tripInterval);
        
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

    // == 4. НАВІШУЄМО ОБРОБНИКИ ПОДІЙ (КЛІКИ) ==
    showDriverLoginBtn?.addEventListener('click', () => showScreen('login-screen-driver'));
    showPassengerLoginBtn?.addEventListener('click', () => showScreen('login-screen-passenger'));
    backButtons.forEach(button => button.addEventListener('click', () => showScreen(button.dataset.target || 'home-screen')));
    driverTelegramLoginBtn?.addEventListener('click', () => showScreen('driver-dashboard'));
    passengerTelegramLoginBtn?.addEventListener('click', () => showScreen('passenger-dashboard'));
    
    // ЛОГІКА ПАСАЖИРА
    showMyOrdersBtn?.addEventListener('click', () => {
        showScreen('passenger-orders-screen');
        runActiveTripSimulation();
        updatePassengerOrderCardListeners();
    });
    findDriverBtn?.addEventListener('click', () => showScreen('passenger-find-driver-screen'));
    showQuickOrderBtn?.addEventListener('click', () => showScreen('quick-order-screen'));
    showHelpBtn?.addEventListener('click', () => showScreen('help-screen'));

    // ЛОГІКА ВОДІЯ
    showDriverOrdersBtn?.addEventListener('click', () => alert('Цей екран ще в розробці :)'));
    showFindPassengersBtn?.addEventListener('click', () => {
        updateDriverOrderCardListeners();
        showScreen('driver-find-passengers-screen');
    });
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
    
    // == 5. ДОДАТКОВІ ФУНКЦІЇ ==

    function updatePassengerOrderCardListeners() {
        const allDetailButtons = document.querySelectorAll('#passenger-orders-screen .details-btn-arrow');
        allDetailButtons.forEach(button => {
            button.addEventListener('click', () => {
                showScreen('passenger-order-details-screen');
            });
        });
    }

    function updateDriverOrderCardListeners() {
        document.querySelectorAll('#driver-find-passengers-screen .order-card').forEach(card => {
            card.addEventListener('click', () => {
                calculateAndDisplayTripDetails();
                showScreen('driver-order-details-screen');
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

    function runActiveTripSimulation() {
        if (window.tripInterval) clearInterval(window.tripInterval);
        const activeCard = document.querySelector('.order-card.active');
        if (!activeCard) return;

        const statusIcon = activeCard.querySelector('#status-icon');
        const statusText = activeCard.querySelector('#status-text');
        const carIcon = activeCard.querySelector('#car-icon');
        const dotsContainer = activeCard.querySelector('.dots-container');
        const endPoint = activeCard.querySelector('#progress-end-point');

        const totalDurationSeconds = 15;
        const totalDots = 18;
        let progress = 0;

        statusIcon.className = 'fa-solid fa-spinner fa-spin';
        statusText.textContent = 'Водій прямує до вас';
        endPoint.classList.remove('arrived');
        endPoint.className = 'fa-solid fa-circle-dot progress-end-point';
        carIcon.style.left = '0%';
        
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dotsContainer.appendChild(dot);
        }
        const allDots = dotsContainer.querySelectorAll('.dot');

        window.tripInterval = setInterval(() => {
            progress += (100 / (totalDurationSeconds * 2));

            if (progress >= 100) {
                clearInterval(window.tripInterval);
                carIcon.style.left = '100%';
                allDots.forEach(d => d.classList.add('passed'));
                statusIcon.className = 'fa-solid fa-circle-check';
                statusIcon.classList.add('arrived');
                statusText.textContent = 'Водій прибув';
                endPoint.classList.add('arrived');
                endPoint.className = 'fa-solid fa-location-pin progress-end-point arrived';
                return;
            }

            carIcon.style.left = `${progress}%`;
            const passedDotsCount = Math.floor(allDots.length * (progress / 100));
            allDots.forEach((dot, index) => {
                if (index < passedDotsCount) {
                    dot.classList.add('passed');
                } else {
                    dot.classList.remove('passed');
                }
            });

        }, 500);
    }
    
    // =============================================== //
    // == ЛОГІКА ДЛЯ ЕКРАНУ "ШВИДКЕ ЗАМОВЛЕННЯ" v2 == //
    // =============================================== //
    
    const quickOrderFormV2 = document.getElementById('quick-order-form');
    const confirmationBlock = document.getElementById('confirmation-block');
    const timeOptionButtons = document.querySelectorAll('.btn-segment[data-time-option]');
    const nowTimeBlock = document.getElementById('now-time-block');
    const editableTimeNow = document.getElementById('editable-time');
    const laterOptionsContainer = document.getElementById('later-options-container');
    const scheduleButtons = document.querySelectorAll('.btn-segment-secondary[data-schedule]');
    const scheduleDateDisplay = document.getElementById('schedule-date-display');
    const scheduleTime = document.getElementById('schedule-time');
    const confirmScheduleBtn = document.getElementById('confirm-schedule-btn');
    const nowInfoIcon = document.getElementById('now-info-icon');
    const driverSelectInfo = document.getElementById('driver-select-info');

    function updateLiveClocks() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTimeString = `${hours}:${minutes}`;
        
        if (document.activeElement !== editableTimeNow) {
            editableTimeNow.textContent = currentTimeString;
        }
        if (document.activeElement !== scheduleTime) {
            scheduleTime.textContent = currentTimeString;
        }
    }

    timeOptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeOptionButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const option = button.dataset.timeOption;
            if (option === 'later') {
                nowTimeBlock.classList.add('hidden');
                laterOptionsContainer.classList.remove('hidden');
            } else {
                nowTimeBlock.classList.remove('hidden');
                laterOptionsContainer.classList.add('hidden');
            }
        });
    });

    editableTimeNow.addEventListener('input', () => {
        const laterButton = document.querySelector('.btn-segment[data-time-option="later"]');
        if(laterButton) laterButton.click();
        scheduleTime.textContent = editableTimeNow.textContent;
    });

    scheduleButtons.forEach(button => {
        button.addEventListener('click', () => {
            scheduleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const scheduleType = button.dataset.schedule;
            if (scheduleType === 'today') {
                scheduleDateDisplay.textContent = new Date().toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' });
            } else if (scheduleType === 'tomorrow') {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                scheduleDateDisplay.textContent = tomorrow.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' });
            }
        });
    });

    nowInfoIcon?.addEventListener('click', (e) => {
        e.stopPropagation();
        alert("Враховуйте, що водію знадобиться час, щоб підтвердити замовлення і прибути на місце.");
    });

    driverSelectInfo?.addEventListener('click', (e) => {
        e.stopPropagation();
        alert("Ви можете обрати конкретного водія зі списку...");
    });

    setInterval(updateLiveClocks, 1000);
    updateLiveClocks();

    // == СТАРТОВИЙ ЕКРАН ==
    showScreen('home-screen');
    
});
