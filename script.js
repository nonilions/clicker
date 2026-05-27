// Переменные игры
let score = 0;
let clickPower = 1;
let autoClicksPerSecond = 0;
let upgradeClickCost = 15;
let upgradeAutoCost = 50;

// Элементы DOM
const scoreDisplay = document.getElementById('score-display');
const statsDisplay = document.getElementById('stats-display');
const clickBtn = document.getElementById('click-btn');
const upgradeClickBtn = document.getElementById('upgrade-click');
const upgradeAutoBtn = document.getElementById('upgrade-auto');
const resetBtn = document.getElementById('reset-btn');

// Элементы музыки
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let musicStarted = false;

// Настройка тихой громкости звука (15% от максимума)
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
}

// Обновление интерфейса
function updateUI() {
    if (scoreDisplay) scoreDisplay.textContent = score;
    if (statsDisplay) statsDisplay.textContent = `Сила клика: ${clickPower} | В секунду: ${autoClicksPerSecond}`;
    
    const clickCostEl = document.getElementById('click-cost');
    const autoCostEl = document.getElementById('auto-cost');
    if (clickCostEl) clickCostEl.textContent = upgradeClickCost;
    if (autoCostEl) autoCostEl.textContent = upgradeAutoCost;
}

// Безопасный запуск музыки
function startMusic() {
    if (!musicStarted && bgMusic) {
        bgMusic.play().then(() => {
            musicStarted = true;
            if (musicToggle) musicToggle.textContent = "🔊 Звук: Вкл";
        }).catch(err => console.log("Браузер заблокировал музыку до первого клика", err));
    }
}

// Главный клик по игре
if (clickBtn) {
    clickBtn.addEventListener('click', () => {
        score += clickPower;
        startMusic(); // Включает музыку автоматически при клике на игру
        updateUI();
        saveGame();
    });
}

// Покупка клика
if (upgradeClickBtn) {
    upgradeClickBtn.addEventListener('click', () => {
        if (score >= upgradeClickCost) {
            score -= upgradeClickCost;
            clickPower += 1;
            upgradeClickCost = Math.round(upgradeClickCost * 1.5);
            updateUI();
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
            updateUI();
            saveGame();
        }
    });
}

// Сброс
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (confirm("Вы уверены, что хотите сбросить весь прогресс?")) {
            localStorage.clear();
            score = 0;
            clickPower = 1;
            autoClicksPerSecond = 0;
            upgradeClickCost = 15;
            upgradeAutoCost = 50;
            updateUI();
        }
    });
}

// Надежный обработчик для кнопки звука
if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        if (!bgMusic) return;

        if (bgMusic.paused) {
            bgMusic.play()
                .then(() => {
                    musicStarted = true;
                    musicToggle.textContent = "🔊 Звук: Вкл";
                })
                .catch(err => {
                    alert("Сначала сделайте хотя бы один клик по большой синей кнопке игры!");
                    console.log(err);
                });
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
        updateUI();
        saveGame();
    }
}, 1000);

loadGame();
