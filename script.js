// Переменные игры
let score = 0;
let clickPower = 1;
let autoClicksPerSecond = 0;
let upgradeClickCost = 15;
let upgradeAutoCost = 50;
let clickUpgradeLevel = 1; 

// Переменные перерождений
let rebirthLevel = 0;
let scoreMultiplier = 1.0;

// Список стоимостей перерождений
const rebirthCosts = [
    100000,   // 1
    500000,   // 2
    1000000,  // 3
    2000000,  // 4
    3500000,  // 5
    5000000,  // 6
    7500000,  // 7
    10000000, // 8
    15000000, // 9
    25000000  // 10
];

// Структура ачивок
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
const multiplierDisplay = document.getElementById('multiplier-display');
const clickBtn = document.getElementById('click-btn');
const upgradeClickBtn = document.getElementById('upgrade-click');
const upgradeAutoBtn = document.getElementById('upgrade-auto');
const rebirthBtn = document.getElementById('rebirth-btn');
const rebirthCostEl = document.getElementById('rebirth-cost');
const resetBtn = document.getElementById('reset-btn');
const gameContainer = document.getElementById('game-container');

const clickTextEl = document.getElementById('click-text');
const clickCostEl = document.getElementById('click-cost');
const autoCostEl = document.getElementById('auto-cost');

const achievementsToggle = document.getElementById('achievements-toggle');
const achievementsPanel = document.getElementById('achievements-panel');
const toastNotification = document.getElementById('toast-notification');
const toastText = document.getElementById('toast-text');

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
        score = parseFloat(localStorage.getItem('clicker_score'));
        clickPower = parseInt(localStorage.getItem('clicker_power') || 1);
        autoClicksPerSecond = parseInt(localStorage.getItem('clicker_auto') || 0);
        upgradeClickCost = parseInt(localStorage.getItem('clicker_click_cost') || 15);
        upgradeAutoCost = parseInt(localStorage.getItem('clicker_auto_cost') || 50);
        clickUpgradeLevel = parseInt(localStorage.getItem('clicker_click_level') || 1);
        rebirthLevel = parseInt(localStorage.getItem('clicker_rebirth_level') || 0);
        scoreMultiplier = parseFloat(localStorage.getItem('clicker_multiplier') || 1.0);

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
    localStorage.setItem('clicker_click_level', clickUpgradeLevel);
    localStorage.setItem('clicker_rebirth_level', rebirthLevel);
    localStorage.setItem('clicker_multiplier', scoreMultiplier);

    localStorage.setItem('ach_firstSteps', achievements.firstSteps);
    localStorage.setItem('ach_clickMaster', achievements.clickMaster);
    localStorage.setItem('ach_autoTycoon', achievements.autoTycoon);
    localStorage.setItem('ach_luckySeven', achievements.luckySeven);
    localStorage.setItem('ach_millionaire', achievements.millionaire);
}

function showToast(title) {
    if (!toastNotification || !toastText) return;
    toastText.textContent = title;
    toastNotification.classList.add('show');
    setTimeout(() => { toastNotification.classList.remove('show'); }, 3000);
}

function checkAchievements(isInitialLoad = false) {
    if (!achievements.firstSteps && score >= 10) {
        achievements.firstSteps = true;
        if (!isInitialLoad) showToast("Первые шаги (10 очков!)");
    }
    if (!achievements.clickMaster && clickPower >= 5) {
        achievements.clickMaster = true;
        if (!isInitialLoad) showToast("Клик-мастер (Сила клика 5)");
    }
    if (!achievements.autoTycoon && autoClicksPerSecond >= 1) {
        achievements.autoTycoon = true;
        if (!isInitialLoad) showToast("Авто-магнат (Куплен автокликер)");
    }
    if (!achievements.luckySeven && Math.floor(score) === 777) {
        achievements.luckySeven = true;
        if (!isInitialLoad) showToast("Счастливая семерка (Ровно 777!)");
    }
    if (!achievements.millionaire && score >= 1000000) {
        achievements.millionaire = true;
        if (!isInitialLoad) showToast("Миллионер (1,000,000 очков!)");
    }

    updateAchievementUI('ach-first-steps', 'badge-first-steps', achievements.firstSteps);
    updateAchievementUI('ach-click-master', 'badge-click-master', achievements.clickMaster);
    updateAchievementUI('ach-auto-tycoon', 'badge-auto-tycoon', achievements.autoTycoon);
    updateAchievementUI('ach-lucky-seven', 'badge-lucky-seven', achievements.luckySeven);
    updateAchievementUI('ach-millionaire', 'badge-millionaire', achievements.millionaire);
}

function updateAchievementUI(rowId, badgeId, isUnlocked) {
    const row = document.getElementById(rowId);
    const badge = document.getElementById(badgeId);
    if (row && badge && isUnlocked) { row.classList.add('unlocked'); badge.textContent = 'Открыто!'; }
    else if (row && badge) { row.classList.remove('unlocked'); badge.textContent = 'Закрыто'; }
}

function checkButtons() {
    if (upgradeClickBtn) {
        if (score >= upgradeClickCost) upgradeClickBtn.classList.remove('disabled');
        else upgradeClickBtn.classList.add('disabled');
    }
    if (upgradeAutoBtn) {
        if (score >= upgradeAutoCost) upgradeAutoBtn.classList.remove('disabled');
        else upgradeAutoBtn.classList.add('disabled');
    }

    if (rebirthBtn && rebirthCostEl) {
        if (rebirthLevel >= 10) {
            rebirthBtn.classList.add('disabled');
            rebirthCostEl.textContent = "МАКСИМУМ (Ур. 10)";
        } else {
            let currentCost = rebirthCosts[rebirthLevel];
            rebirthCostEl.textContent = currentCost.toLocaleString() + " ";
            if (score >= currentCost) rebirthBtn.classList.remove('disabled');
            else rebirthBtn.classList.add('disabled');
        }
    }
}

function updateUI(isInitialLoad = false) {
    if (scoreDisplay) scoreDisplay.textContent = Math.floor(score).toLocaleString();
    
    let actualClickValue = (clickPower * scoreMultiplier).toFixed(2);
    let actualAutoValue = (autoClicksPerSecond * scoreMultiplier).toFixed(2);
    if (statsDisplay) statsDisplay.textContent = `Сила клика: ${actualClickValue} | В секунду: ${actualAutoValue}`;
    
    if (multiplierDisplay) {
        multiplierDisplay.textContent = `Множитель перерождения: x${scoreMultiplier.toFixed(2)} (Уровень ${rebirthLevel})`;
    }
    
    if (clickTextEl) clickTextEl.textContent = `🚀 Сильный клик (+${clickUpgradeLevel} за нажатие)`;
    if (clickCostEl) clickCostEl.textContent = upgradeClickCost;
    if (autoCostEl) autoCostEl.textContent = upgradeAutoCost;
    
    checkButtons();
    checkAchievements(isInitialLoad); 
}

function startMusic() {
    if (!musicStarted && bgMusic) {
        bgMusic.play().then(() => { musicStarted = true; if (musicToggle) musicToggle.textContent = "🔊 Звук: Вкл"; })
            .catch(err => console.log(err));
    }
}

function createFloatingNumber(event) {
    if (!gameContainer) return;
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-number';
    let addedValue = (clickPower * scoreMultiplier).toFixed(1);
    floatEl.textContent = `+${addedValue}`;
    const rect = gameContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;
    gameContainer.appendChild(floatEl);
    setTimeout(() => { floatEl.remove(); }, 800);
}

if (clickBtn) {
    clickBtn.onclick = function(event) {
        score += clickPower * scoreMultiplier; 
        startMusic();
        updateUI(false); 
        saveGame();
        createFloatingNumber(event);

        clickBtn.classList.add('active-click');
        setTimeout(() => { clickBtn.classList.remove('active-click'); }, 80);
    };
}

if (upgradeClickBtn) {
    upgradeClickBtn.addEventListener('click', () => {
        if (score >= upgradeClickCost) {
            score -= upgradeClickCost;
            clickPower += clickUpgradeLevel; 
            clickUpgradeLevel += 1;          
            upgradeClickCost = Math.round(upgradeClickCost * 1.6); 
            updateUI(false);
            saveGame();
        }
    });
}

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

if (rebirthBtn) {
    rebirthBtn.addEventListener('click', () => {
        if (rebirthLevel >= 10) return;
        let currentCost = rebirthCosts[rebirthLevel];
        if (score >= currentCost) {
            rebirthLevel += 1;
            scoreMultiplier += 0.25;
            score = 0;
