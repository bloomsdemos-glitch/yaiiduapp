// Запускаємо наш код тільки після того, як вся сторінка (HTML) завантажилась
document.addEventListener('DOMContentLoaded', () => {

    // =======================================
    // == 1. ЗБИРАЄМО ВСІ ПОТРІБНІ ЕЛЕМЕНТИ ==
    // =======================================
    
    // Знаходимо всі наші "екрани"
    const screens = document.querySelectorAll('.screen');
    const homeScreen = document.getElementById('home-screen');
    const driverLoginScreen = document.getElementById('login-screen-driver');
    const passengerLoginScreen = document.getElementById('login-screen-passenger');
    const driverDashboard = document.getElementById('driver-dashboard');
    const passengerDashboard = document.getElementById('passenger-dashboard');

    // Знаходимо всі кнопки, які будуть переключати екрани
    const showDriverLoginBtn = document.getElementById('show-driver-login');
    const showPassengerLoginBtn = document.getElementById('show-passenger-login');
    
    // Кнопки "Назад" (ми знаходимо всі одразу)
    const backButtons = document.querySelectorAll('.btn-back');

    // Кнопки входу через Telegram
    // Поки що вони будуть вести просто на відповідні дешборди
    const driverTelegramLoginBtn = driverLoginScreen.querySelector('.btn-telegram-login');
    const passengerTelegramLoginBtn = passengerLoginScreen.querySelector('.btn-telegram-login');


    // =======================================
    // == 2. ФУНКЦІЯ ДЛЯ НАВІГАЦІЇ ==
    // =======================================

    // Це наша головна функція, яка керує тим, який екран показувати.
    // Вона приймає ID екрану, який ми хочемо активувати.
    function showScreen(screenId) {
        // Проходимось по всіх екранах...
        screens.forEach(screen => {
            // ...і ховаємо кожен з них, додаючи клас 'hidden' і забираючи 'active'
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });

        // Знаходимо потрібний нам екран по його ID...
        const activeScreen = document.getElementById(screenId);
        // ...і робимо його видимим, забираючи клас 'hidden' і додаючи 'active'
        if (activeScreen) {
            activeScreen.classList.remove('hidden');
            activeScreen.classList.add('active');
        }
    }


    // =======================================
    // == 3. НАВІШУЄМО ОБРОБНИКИ ПОДІЙ (КЛІКИ) ==
    // =======================================
    
    // Коли клікаємо на кнопку "Я водій" -> показуємо екран входу для водія
    showDriverLoginBtn.addEventListener('click', () => {
        showScreen('login-screen-driver');
    });

    // Коли клікаємо на кнопку "Я пасажир" -> показуємо екран входу для пасажира
    showPassengerLoginBtn.addEventListener('click', () => {
        showScreen('login-screen-passenger');
    });

    // Проходимось по всіх кнопках "Назад"...
    backButtons.forEach(button => {
        // ...і кожній даємо команду повертатись на вказаний екран
        button.addEventListener('click', () => {
            // Беремо ціль з атрибута data-target, якщо він є, інакше - на головний
            const targetScreen = button.dataset.target || 'home-screen';
            showScreen(targetScreen);
        });
    });
    
    // Тимчасова логіка для кнопок "Увійти через Telegram"
    // Клік на вхід водія -> показуємо меню водія
    driverTelegramLoginBtn.addEventListener('click', () => {
        showScreen('driver-dashboard');
    });
    
    // Клік на вхід пасажира -> показуємо меню пасажира
    passengerTelegramLoginBtn.addEventListener('click', () => {
        showScreen('passenger-dashboard');
    });
    
    // === ЛОГІКА ДЛЯ МЕНЮ ПАСАЖИРА ===

    // Знаходимо кнопку "Знайти водія" по її новому ID
    const findDriverBtn = document.getElementById('find-driver-btn');
    
    // При кліку на неї показуємо екран зі списком водіїв
    findDriverBtn.addEventListener('click', () => {
        showScreen('passenger-find-driver-screen');
    });

    // Знаходимо кнопку, яка показує екран швидкого замовлення
    const showQuickOrderBtn = document.getElementById('show-quick-order-btn');
    
    // Вішаємо на неї клік, щоб показати наш новий екран
    showQuickOrderBtn.addEventListener('click', () => {
        showScreen('quick-order-screen');
    });

    // Знаходимо саму форму і її кнопку відправки
    const quickOrderForm = document.getElementById('quick-order-form');
    
    // Обробляємо відправку форми
    quickOrderForm.addEventListener('submit', (event) => {
        // Забороняємо сторінці перезавантажуватись (стандартна поведінка форми)
        event.preventDefault(); 
        
        // Імітуємо успіх
        alert('Замовлення створено! Шукаємо вам водія... (це імітація)');
        
        // Повертаємо пасажира на його головне меню
        showScreen('passenger-dashboard');
        
        // Очищуємо форму для наступного разу
        quickOrderForm.reset();
    });



