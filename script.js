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

    // == 3. ОСНОВНІ ФУНКЦІЇ ==

    function showScreen(screenId) {
        // Зупиняємо симуляцію поїздки, якщо вона активна, при зміні екрана
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
        
        const carIcon = activeCard.querySelector('#car-icon');
        if (!carIcon) return; // Додаємо перевірку, бо на інших картках іконки може не бути

        const statusIcon = activeCard.querySelector('#status-icon');
        const statusText = activeCard.querySelector('#status-text');
        const endPoint = activeCard.querySelector('#progress-end-point');
        const totalDurationSeconds = 15;
        let progress = 0;
        
        // Скидання до початкового стану
        statusIcon.className = 'fa-solid fa-spinner fa-spin'; 
        statusText.textContent = 'Водій прямує до вас';
        endPoint.className = 'fa-solid fa-circle-dot progress-end-point'; 
        carIcon.style.left = '0%';

        window.tripInterval = setInterval(() => {
            progress += 1;
            const percentage = (progress / totalDurationSeconds) * 100;

            if (percentage >= 100) {
                clearInterval(window.tripInterval);
                carIcon.style.left = '100%';
                statusIcon.className = 'fa-solid fa-circle-check'; 
                statusText.textContent = 'Водій прибув';
                endPoint.className = 'fa-solid fa-location-pin progress-end-point arrived';
                return;
            }
            carIcon.style.left = `${percentage}%`;
        }, 1000);
    }
    
    // == 4. ЛОГІКА ДЛЯ ЕКРАНУ "ШВИДКЕ ЗАМОВЛЕННЯ" ==

    const quickOrderForm = document.getElementById('quick-order-form');
    const timeOptionButtons = document.querySelectorAll('.btn-segment[data-time-option]');
    const nowTimeBlock = document.getElementById('now-time-block');
    const laterOptionsContainer = document.getElementById('later-options-container');
    const dateTiles = document.querySelectorAll('.date-tile');
    const scheduleConfirmBlock = document.getElementById('schedule-confirm-block');
    const scheduleResultText = document.getElementById('schedule-result-text');
    const selectDateBtn = document.querySelector('.btn-segment[data-schedule="date"]');
    const fromAddressInput = document.getElementById('from-address');
    const toAddressInput = document.getElementById('to-address');
    const submitOrderBtn = document.getElementById('submit-order-btn');

    function checkFormCompleteness() {
        // Кнопка активна, тільки якщо ОБИДВА поля заповнені
        const isAddressFilled = fromAddressInput.value.trim() !== '' && toAddressInput.value.trim() !== '';
        if (isAddressFilled) {
            submitOrderBtn.classList.remove('disabled');
        } else {
            submitOrderBtn.classList.add('disabled');
        }
    }

    function initQuickOrderScreen() {
        const hoursEl = document.getElementById('time-display-hours');
        const minutesEl = document.getElementById('time-display-minutes');
        
        if (hoursEl && minutesEl) {
            const now = new Date();
            hoursEl.textContent = now.getHours().toString().padStart(2, '0');
            minutesEl.textContent = now.getMinutes().toString().padStart(2, '0');
        }
        
        // Перевіряємо стан кнопки при завантаженні екрана
        checkFormCompleteness();
    }
    // Обробник для кнопок "Зараз" / "На інший час"
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

    // Обробник для плиток "Сьогодні" / "Завтра"
    dateTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            dateTiles.forEach(t => t.classList.remove('active'));
            tile.parentElement.classList.add('active'); // Робимо активною обгортку
            
            tile.closest('.date-tiles-container').classList.add('hidden');
            selectDateBtn.classList.add('hidden');
            
            scheduleConfirmBlock.classList.remove('hidden');
            
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
    });

    showQuickOrderBtn?.addEventListener('click', () => {
        showScreen('quick-order-screen');
        initQuickOrderScreen();
    });
    
    findDriverBtn?.addEventListener('click', () => showScreen('passenger-find-driver-screen'));
    showHelpBtn?.addEventListener('click', () => showScreen('help-screen'));
    showFindPassengersBtn?.addEventListener('click', () => showScreen('driver-find-passengers-screen'));
    showDriverOrdersBtn?.addEventListener('click', () => alert('Цей екран ще в розробці :)'));
    
    goToMyOrdersBtn?.addEventListener('click', () => showMyOrdersBtn.click());
    
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target || (document.body.classList.contains('driver-mode') ? 'driver-dashboard' : 'passenger-dashboard');
            if (!document.getElementById(target)) {
                showScreen('home-screen');
            } else {
                showScreen(target);
            }
        });
    });

    // == 6. ІНІЦІАЛІЗАЦІЯ ДОДАТКУ ==
    showScreen('home-screen');
    
});
