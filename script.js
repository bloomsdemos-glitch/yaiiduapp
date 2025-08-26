document.addEventListener('DOMContentLoaded', () => {
    const clickableElements = document.querySelectorAll('[data-target]');
    let navigationHistory = ['splash-screen'];
    
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) { activeScreen.classList.add('active'); }
    }

    clickableElements.forEach(element => {
        element.addEventListener('click', (event) => {
            event.stopPropagation(); 
            const targetScreenId = element.dataset.target;
            if (!targetScreenId) return;
            if (targetScreenId === 'PREVIOUS_SCREEN_PLACEHOLDER') {
                navigationHistory.pop();
                const previousScreen = navigationHistory[navigationHistory.length - 1];
                showScreen(previousScreen);
                return;
            }
            if (targetScreenId !== navigationHistory[navigationHistory.length - 1]) {
                navigationHistory.push(targetScreenId);
            }
            showScreen(targetScreenId);
            const notificationScreen = document.getElementById('notifications');
            if(notificationScreen) {
                const backButton = notificationScreen.querySelector('.back-btn');
                backButton.dataset.target = navigationHistory[navigationHistory.length - 2] || 'splash-screen';
            }
        });
    });
    
    // Функціонал для зміни фону поки що видалимо, щоб не було помилок
    // Повернемо його, коли додамо екран налаштувань

    showScreen('splash-screen');
});
