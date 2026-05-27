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

// Настройка тихой громкости звука (0.15 — это 15% от максимума)
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

// Обновление текста на экране
function updateUI() {
    scoreDisplay.textContent = score;
    statsDisplay.textContent = `Сила клика: ${clickPower} | В секунду: ${autoClicksPerSecond}`;
    document.getElementById('click-cost').textContent = upgradeClickCost;
    document.getElementById('auto-cost').textContent = upgradeAutoCost;
}

// Функция включения музыки при взаимодействии
function startMusic() {
    if (!musicStarted && bgMusic) {
        bgMusic.play().then(() => {
            musicStarted = true;
            musicToggle.textContent = "🔊 Звук: Вкл";
        }).catch(err => console.log("Браузер ожидает клика пользователя...", err));
    }
}

// Клик по главной кнопке
clickBtn.addEventListener('click', () => {
    score += clickPower;
    startMusic(); // Включает музыку при самом первом клике в игре
    updateUI();
    saveGame();
});

// Покупка сильного клика
upgradeClickBtn.addEventListener('click', () => {
    if (score >= upgradeClickCost) {
        score -= upgradeClickCost;
        clickPower += 1;
        upgradeClickCost = Math.round(upgradeClickCost * 1.5);
        updateUI();
        saveGame();
    }
});

// Покупка автокликера
upgradeAutoBtn.addEventListener('click', () => {
    if (score >= upgradeAutoCost) {
        score -= upgradeAutoCost;
        autoClicksPerSecond += 1;
        upgradeAutoCost = Math.round(upgradeAutoCost * 1.5);
        updateUI();
        saveGame();
    }
});

// Сброс прогресса
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

// Кнопка управления музыкой Вкл/Выкл
musicToggle.addEventListener('click', () => {
    if (!bgMusic) return;
    
    if (!musicStarted) {
        startMusic();
        return;
    }

    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = "🔊 Звук: Вкл";
    } else {
        bgMusic.pause();
        musicToggle.textContent = "🔇 Звук: Выкл";
    }
});

// Работа автокликера раз в секунду
setInterval(() => {
    if (autoClicksPerSecond > 0) {
        score += autoClicksPerSecond;
        updateUI();
        saveGame();
    }
}, 1000);

// Инициализация игры при старте страницы
loadGame();
