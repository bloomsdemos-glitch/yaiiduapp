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
        // ...і кожній даємо команду повертатись на головний екран при кліку
        button.addEventListener('click', () => {
            showScreen('home-screen');
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
    

    // Ініціалізація: при першому завантаженні показуємо головний екран
    showScreen('home-screen');
});

