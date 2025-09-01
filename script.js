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
        populateTimeSelectors();
        const now = new Date();
        timeHoursSelect.value = now.getHours().toString().padStart(2, '0');
        timeMinutesSelect.value = now.getMinutes().toString().padStart(2, '0');
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
            dateTiles.forEach(t => t.classList.remove('active'));
            tile.classList.add('active');
            selectDateBtn.classList.add('hidden');
            scheduleConfirmBlock.classList.remove('hidden');
            
            const day = tile.dataset.schedule === 'today' ? 'Сьогодні' : 'Завтра';
            scheduleResultText.textContent = `${day} • ${timeHoursSelect.value}:${timeMinutesSelect.value}`;
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
    
    showMyOrdersBtn?.addEventListener('click', () => {
        showScreen('passenger-orders-screen');
        runActiveTripSimulation();
        updatePassengerOrderCardListeners();
    });
    
    showQuickOrderBtn?.addEventListener('click', () => {
        showScreen('quick-order-screen');
        initQuickOrderScreen();
    });
    
    findDriverBtn?.addEventListener('click', () => showScreen('passenger-find-driver-screen'));
    showHelpBtn?.addEventListener('click', () => showScreen('help-screen'));
    showFindPassengersBtn?.addEventListener('click', () => showScreen('driver-find-passengers-screen'));
    goToMyOrdersBtn?.addEventListener('click', () => showMyOrdersBtn.click());
    
    backButtons.forEach(button => {
        button.addEventListener('click', () => showScreen(button.dataset.target || 'home-screen'));
    });

    // == 6. ІНІЦІАЛІЗАЦІЯ ДОДАТКУ ==
    showScreen('home-screen');
    
});
