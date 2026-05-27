// Переменные игры
let score = 0;
let clickPower = 1;
let autoClicksPerSecond = 0;
let upgradeClickCost = 15;
let upgradeAutoCost = 50;

// Структура ачивок (расширена)
let achievements = {
    firstSteps: false,
    clickMaster: false,
    autoTycoon: false,
    luckySeven: false,
    millionaire: false
};

// Элементы DOM игры
const scoreDisplay = document.getElementById('score-display');
const statsDisplay = document.getElementById('stats-display');
const clickBtn = document.getElementById('click-btn');
const upgradeClickBtn = document.getElementById('upgrade-click');
const upgradeAutoBtn = document.getElementById('upgrade-auto');
const resetBtn = document.getElementById('reset-btn');
const gameContainer = document.getElementById('game-container');

// Элементы ачивок
const achievementsToggle = document.getElementById('achievements-toggle');
const achievementsPanel = document.getElementById('achievements-panel');
const toastNotification = document.getElementById('toast-notification');
const toastText = document.getElementById('toast-text');

// Элементы музыки
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let musicStarted = false;

if (bgMusic) {
    bgMusic.volume = 0.15;
}

// Загрузка сохранений
function loadGame() {
    const savedScore = localStorage.getItem('clicker_score');
    if (savedScore !== null) {
        score = parseInt(savedScore);
        clickPower = parseInt(localStorage.getItem('clicker_power') || 1);
        autoClicksPerSecond = parseInt(localStorage.getItem('clicker_auto') || 0);
        upgradeClickCost = parseInt(localStorage.getItem('clicker_click_cost') || 15);
        upgradeAutoCost = parseInt(localStorage.getItem('clicker_auto_cost') || 50);
        
        achievements.firstSteps = localStorage.getItem('ach_firstSteps') === 'true';
        achievements.clickMaster = localStorage.getItem('ach_clickMaster') === 'true';
        achievements.autoTycoon = localStorage.getItem('ach_autoTycoon') === 'true';
        achievements.luckySeven = localStorage.getItem('ach_luckySeven') === 'true';
        achievements.millionaire = localStorage.getItem('ach_millionaire') === 'true';
    }
    updateUI();
}

// Сохранение прогресса
function saveGame() {
    localStorage.setItem('clicker_score', score);
    localStorage.setItem('clicker_power', clickPower);
    localStorage.setItem('clicker_auto', autoClicksPerSecond);
    localStorage.setItem('clicker_click_cost', upgradeClickCost);
    localStorage.setItem('clicker_auto_cost', upgradeAutoCost);
    
    localStorage.setItem('ach_firstSteps', achievements.firstSteps);
    localStorage.setItem('ach_clickMaster', achievements.clickMaster);
    localStorage.setItem('ach_autoTycoon', achievements.autoTycoon);
    localStorage.setItem('ach_luckySeven', achievements.luckySeven);
    localStorage.setItem('ach_millionaire', achievements.millionaire);
}

// Функция для вылетания ачивки снизу экрана
function showToast(title) {
    if (!toastNotification || !toastText) return;
    toastText.textContent = title;
    toastNotification.classList.add('show');
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

// Проверка условий всех достижений
function checkAchievements(isInitialLoad = false) {
    // 1. Ачивка "Первые шаги"
    if (!achievements.firstSteps && score >= 10) {
        achievements.firstSteps = true;
        if (!isInitialLoad) showToast("Первые шаги (10 очков!)");
    }
    // 2. Ачивка "Клик-мастер"
    if (!achievements.clickMaster && clickPower >= 5) {
        achievements.clickMaster = true;
        if (!isInitialLoad) showToast("Клик-мастер (Сила клика 5)");
    }
    // 3. Ачивка "Авто-магнат"
    if (!achievements.autoTycoon && autoClicksPerSecond >= 1) {
        achievements.autoTycoon = true;
        if (!isInitialLoad) showToast("Авто-магнат (Куплен автокликер)");
    }
    // 4. Секретная ачивка "Счастливая семерка" (строго равенство)
    if (!achievements.luckySeven && score === 777) {
        achievements.luckySeven = true;
        if (!isInitialLoad) showToast("Счастливая семерка (Ровно 777!)");
    }
    // 5. Ачивка "Миллионер"
    if (!achievements.millionaire && score >= 1000000) {
        achievements.millionaire = true;
        if (!isInitialLoad) showToast("Миллионер (1,000,000 очков!)");
    }

    // Обновление интерфейса списка ачивок
    updateAchievementUI('ach-first-steps', 'badge-first-steps', achievements.firstSteps);
    updateAchievementUI('ach-click-master', 'badge-click-master', achievements.clickMaster);
    updateAchievementUI('ach-auto-tycoon', 'badge-auto-tycoon', achievements.autoTycoon);
    updateAchievementUI('ach-lucky-seven', 'badge-lucky-seven', achievements.luckySeven);
    updateAchievementUI('ach-millionaire', 'badge-millionaire', achievements.millionaire);
}

function updateAchievementUI(rowId, badgeId, isUnlocked) {
    const row = document.getElementById(rowId);
    const badge = document.getElementById(badgeId);
    if (row && badge && isUnlocked) {
        row.classList.add('unlocked');
        badge.textContent = 'Открыто!';
    } else if (row && badge) {
        row.classList.remove('unlocked');
        badge.textContent = 'Закрыто';
    }
}

// Проверка баланса магазина
function checkButtons() {
    if (upgradeClickBtn) {
        if (score >= upgradeClickCost) {
            upgradeClickBtn.classList.remove('disabled');
        } else {
            upgradeClickBtn.classList.add('disabled');
        }
    }
    if (upgradeAutoBtn) {
        if (score >= upgradeAutoCost) {
            upgradeAutoBtn.classList.remove('disabled');
        } else {
            upgradeAutoBtn.classList.add('disabled');
        }
    }
}

// Обновление интерфейса
function updateUI(isInitialLoad = false) {
    if (scoreDisplay) scoreDisplay.textContent = score;
    if (statsDisplay) statsDisplay.textContent = `Сила клика: ${clickPower} | В секунду: ${autoClicksPerSecond}`;
    
    const clickCostEl = document.getElementById('click-cost');
    const autoCostEl = document.getElementById('auto-cost');
    if (clickCostEl) clickCostEl.textContent = upgradeClickCost;
    if (autoCostEl) autoCostEl.textContent = upgradeAutoCost;
    
    checkButtons();
    checkAchievements(isInitialLoad); 
}

// Музыка
function startMusic() {
    if (!musicStarted && bgMusic) {
        bgMusic.play().then(() => {
            musicStarted = true;
            if (musicToggle) musicToggle.textContent = "🔊 Звук: Вкл";
        }).catch(err => console.log("Браузер заблокировал автозвук", err));
    }
}

// Летающие цифры
function createFloatingNumber(event) {
    if (!gameContainer) return;
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-number';
    floatEl.textContent = `+${clickPower}`;
    const rect = gameContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;
    gameContainer.appendChild(floatEl);
    setTimeout(() => { floatEl.remove(); }, 800);
}

// Клик по главной кнопке
if (clickBtn) {
    clickBtn.onclick = function(event) {
        score += clickPower;
        startMusic();
        updateUI(false); 
        saveGame();
        createFloatingNumber(event);

        clickBtn.classList.add('active-click');
        setTimeout(() => { clickBtn.classList.remove('active-click'); }, 80);
    };
}

// Покупка клика
if (upgradeClickBtn) {
    upgradeClickBtn.addEventListener('click', () => {
        if (score >= upgradeClickCost) {
            score -= upgradeClickCost;
            clickPower += 1;
            upgradeClickCost = Math.round(upgradeClickCost * 1.5);
            updateUI(false);
            saveGame();
        }
    });
}

// Покупка автокликера
if (upgradeAutoBtn) {
    upgradeAutoBtn.addEventListener('click', () => {
        if (score >= upgradeAutoCost) {
            score -= upgradeAutoCost;
            autoClicksPerSecond += 1;
            upgradeAutoCost = Math.round(upgradeAutoCost * 1.5);
            updateUI(false);
            saveGame();
        }
    });
}

// Кнопка достижений
if (achievementsToggle && achievementsPanel) {
    achievementsToggle.addEventListener('click', () => {
        achievementsPanel.classList.toggle('open');
    });
}

// Сброс прогресса
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (confirm("Вы уверены, что хотите сбросить весь прогресс и ачивки?")) {
            localStorage.clear();
            score = 0;
            clickPower = 1;
            autoClicksPerSecond = 0;
            upgradeClickCost = 15;
            upgradeAutoCost = 50;
            achievements.firstSteps = false;
            achievements.clickMaster = false;
            achievements.autoTycoon = false;
            achievements.luckySeven = false;
            achievements.millionaire = false;
            updateUI(true); 
        }
    });
}

// Кнопка звука
if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        if (!bgMusic) return;
        if (bgMusic.paused) {
            bgMusic.play().then(() => { musicStarted = true; musicToggle.textContent = "🔊 Звук: Вкл"; })
                .catch(err => alert("Сначала сделайте клик по синей кнопке игры!"));
        } else {
            bgMusic.pause();
            musicToggle.textContent = "🔇 Звук: Выкл";
        }
    });
}

// Автокликер раз в секунду
setInterval(() => {
    if (autoClicksPerSecond > 0) {
        score += autoClicksPerSecond;
        updateUI(false);
        saveGame();
    }
}, 1000);

loadGame();
checkAchievements(true); 

