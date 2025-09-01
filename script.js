document.addEventListener('DOMContentLoaded', () => {

    // == 1. КОНСТАНТИ, ЗМІННІ І НАЛАШТУВАННЯ ==
    let rideState = 'idle';

    // == 2. ЗБИРАЄМО ВСІ ПОТРІБНІ ЕЛЕМЕНТИ ==
    const screens = document.querySelectorAll('.screen');
    const backButtons = document.querySelectorAll('.btn-back');
    // -- Навігація --
    const showDriverLoginBtn = document.getElementById('show-driver-login');
    const showPassengerLoginBtn = document.getElementById('show-passenger-login');
    const driverTelegramLoginBtn = document.querySelector('#login-screen-driver .btn-telegram-login');
    const passengerTelegramLoginBtn = document.querySelector('#login-screen-passenger .btn-telegram-login');
    const showMyOrdersBtn = document.getElementById('show-my-orders-btn');
    const findDriverBtn = document.getElementById('find-driver-btn');
    const showQuickOrderBtn = document.getElementById('show-quick-order-btn');
    const showHelpBtn = document.getElementById('show-help-btn');
    const goToMyOrdersBtn = document.getElementById('go-to-my-orders-btn');
    const showFindPassengersBtn = document.getElementById('show-find-passengers-btn');

    // == 3. ОСНОВНІ ФУНКЦІЇ ==

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

    function runActiveTripSimulation() {
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

    // == 4. ЛОГІКА ДЛЯ ЕКРАНУ "ШВИДКЕ ЗАМОВЛЕННЯ" ==
    const quickOrderForm = document.getElementById('quick-order-form');
    const timeOptionButtons = document.querySelectorAll('.btn-segment[data-time-option]');
    const nowTimeBlock = document.getElementById('now-time-block');
    const laterOptionsContainer = document.getElementById('later-options-container');
    const timeHoursInput = document.getElementById('time-hours');
    const timeMinutesInput = document.getElementById('time-minutes');
    const driverSelectInfo = document.getElementById('driver-select-info');
    const driverSelectNote = document.getElementById('driver-select-note');

    function initQuickOrderScreen() {
        const now = new Date();
        timeHoursInput.value = now.getHours().toString().padStart(2, '0');
        timeMinutesInput.value = now.getMinutes().toString().padStart(2, '0');
        timeHoursInput.addEventListener('input', () => { if (timeHoursInput.value.length >= 2) timeMinutesInput.focus(); });
        [timeHoursInput, timeMinutesInput].forEach(input => {
            input.addEventListener('input', () => {
                const laterButton = document.querySelector('.btn-segment[data-time-option="later"]');
                if (!laterButton.classList.contains('active')) laterButton.click();
            });
        });
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

    driverSelectInfo?.addEventListener('click', (e) => {
        e.stopPropagation();
        driverSelectNote.classList.remove('hidden');
        setTimeout(() => { driverSelectNote.classList.add('hidden'); }, 5000);
    });

    quickOrderForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        showScreen('order-confirmation-screen');
    });

    // == 5. ГОЛОВНІ ОБРОБНИКИ ПОДІЙ (ПОВНІСТЮ ВИПРАВЛЕНА ВЕРСІЯ) ==
    showDriverLoginBtn?.addEventListener('click', () => showScreen('login-screen-driver'));
    showPassengerLoginBtn?.addEventListener('click', () => showScreen('login-screen-passenger'));
    driverTelegramLoginBtn?.addEventListener('click', () => showScreen('driver-dashboard'));
    passengerTelegramLoginBtn?.addEventListener('click', () => showScreen('passenger-dashboard'));
    
    // -- Меню Пасажира --
    showMyOrdersBtn?.addEventListener('click', () => {
        showScreen('passenger-orders-screen');
        runActiveTripSimulation();
        updatePassengerOrderCardListeners();
    });
    findDriverBtn?.addEventListener('click', () => showScreen('passenger-find-driver-screen'));
    showQuickOrderBtn?.addEventListener('click', () => {
        showScreen('quick-order-screen');
        initQuickOrderScreen();
    });
    showHelpBtn?.addEventListener('click', () => showScreen('help-screen'));
    
    // -- Меню Водія --
    showFindPassengersBtn?.addEventListener('click', () => showScreen('driver-find-passengers-screen'));

    // -- Інші кнопки --
    goToMyOrdersBtn?.addEventListener('click', () => showMyOrdersBtn.click());
    
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target || 'home-screen';
            showScreen(target);
        });
    });

    // == 6. ІНІЦІАЛІЗАЦІЯ ДОДАТКУ ==
    showScreen('home-screen');
    
});
