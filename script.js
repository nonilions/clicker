let score = 0;
let clickPower = 1;
let autoClicksPerSecond = 0;
let upgradeClickCost = 15;
let upgradeAutoCost = 50;
let clickUpgradeLevel = 1;
let autoUpgradeLevel = 1;
let rebirthLevel = 0;
let scoreMultiplier = 1.0;
let musicStarted = false;
let hasX2 = false;
let hasX5 = false;
let hasX10 = false;
let shopMultiplier = 1.0;

let achs = { 
    firstSteps: false, 
    clickMaster: false, 
    autoTycoon: false, 
    luckySeven: false, 
    millionaire: false 
};

function getRebirthCost(lvl) {
    if (lvl === 0) return 100000;
    if (lvl === 1) return 500000;
    if (lvl === 2) return 1000000;
    if (lvl === 3) return 2000000;
    if (lvl === 4) return 3500000;
    if (lvl === 5) return 5000000;
    if (lvl === 6) return 7500000;
    if (lvl === 7) return 10000000;
    if (lvl === 8) return 15000000;
    return 25000000;
}

const sDisp = document.getElementById('score-display');
const stDisp = document.getElementById('stats-display');
const mDisp = document.getElementById('multiplier-display');
const cBtn = document.getElementById('click-btn');
const upCBtn = document.getElementById('upgrade-click');
const upABtn = document.getElementById('upgrade-auto');
const rBtn = document.getElementById('rebirth-btn');
const rCostEl = document.getElementById('rebirth-cost');
const rstBtn = document.getElementById('reset-btn');
const gCont = document.getElementById('game-container');
const rProg = document.getElementById('rebirth-progress');
const pTxt = document.getElementById('progress-text');
const btnX2 = document.getElementById('buy-x2');
const btnX5 = document.getElementById('buy-x5');
const btnX10 = document.getElementById('buy-x10');
const toast = document.getElementById('toast-notification');
const tTxt = document.getElementById('toast-text');
const bgM = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

if (bgM) bgM.volume = 0.15;

function loadGame() {
    if (localStorage.getItem('mega_score_v4') !== null) {
        score = parseFloat(localStorage.getItem('mega_score_v4') || 0);
        clickPower = parseInt(localStorage.getItem('mega_power_v4') || 1);
        autoClicksPerSecond = parseInt(localStorage.getItem('mega_auto_v4') || 0);
        upgradeClickCost = parseInt(localStorage.getItem('mega_ccost_v4') || 15);
        upgradeAutoCost = parseInt(localStorage.getItem('mega_acost_v4') || 50);
        clickUpgradeLevel = parseInt(localStorage.getItem('mega_clvl_v4') || 1);
        autoUpgradeLevel = parseInt(localStorage.getItem('mega_alvl_v4') || 1);
        rebirthLevel = parseInt(localStorage.getItem('mega_rlvl_v4') || 0);
        scoreMultiplier = parseFloat(localStorage.getItem('mega_mult_v4') || 1.0);
        hasX2 = localStorage.getItem('mega_x2_v4') === 'true';
        hasX5 = localStorage.getItem('mega_x5_v4') === 'true';
        hasX10 = localStorage.getItem('mega_x10_v4') === 'true';
        achs.firstSteps = localStorage.getItem('mega_ach1_v4') === 'true';
        achs.clickMaster = localStorage.getItem('mega_ach2_v4') === 'true';
        achs.autoTycoon = localStorage.getItem('mega_ach3_v4') === 'true';
        achs.luckySeven = localStorage.getItem('mega_ach4_v4') === 'true';
        achs.millionaire = localStorage.getItem('mega_ach5_v4') === 'true';
    }
    recalcMultipliers();
    updateUI(true);
}

function saveGame() {
    localStorage.setItem('mega_score_v4', score);
    localStorage.setItem('mega_power_v4', clickPower);
    localStorage.setItem('mega_auto_v4', autoClicksPerSecond);
    localStorage.setItem('mega_ccost_v4', upgradeClickCost);
    localStorage.setItem('mega_acost_v4', upgradeAutoCost);
    localStorage.setItem('mega_clvl_v4', clickUpgradeLevel);
    localStorage.setItem('mega_alvl_v4', autoUpgradeLevel);
    localStorage.setItem('mega_rlvl_v4', rebirthLevel);
    localStorage.setItem('mega_mult_v4', scoreMultiplier);
    localStorage.setItem('mega_x2_v4', hasX2);
    localStorage.setItem('mega_x5_v4', hasX5);
    localStorage.setItem('mega_x10_v4', hasX10);
    localStorage.setItem('mega_ach1_v4', achs.firstSteps);
    localStorage.setItem('mega_ach2_v4', achs.clickMaster);
    localStorage.setItem('mega_ach3_v4', achs.autoTycoon);
    localStorage.setItem('mega_ach4_v4', achs.luckySeven);
    localStorage.setItem('mega_ach5_v4', achs.millionaire);
}

function recalcMultipliers() {
    shopMultiplier = 1.0;
    if (hasX2) shopMultiplier = 2.0;
    if (hasX5) shopMultiplier = 5.0;
    if (hasX10) shopMultiplier = 10.0;
}

function showToast(t) {
    if (toast && tTxt) {
        tTxt.textContent = t;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

function checkAchs(init = false) {
    if (!achs.firstSteps && score >= 10) {
        achs.firstSteps = true;
        if (!init) showToast("First Steps!");
    }
    if (!achs.clickMaster && clickPower >= 5) {
        achs.clickMaster = true;
        if (!init) showToast("Click Master!");
    }
    if (!achs.autoTycoon && autoClicksPerSecond >= 1) {
        achs.autoTycoon = true;
        if (!init) showToast("Auto Tycoon!");
    }
    if (!achs.luckySeven && Math.floor(score) === 777) {
        achs.luckySeven = true;
        if (!init) showToast("Lucky 777!");
    }
    if (!achs.millionaire && score >= 1000000) {
        achs.millionaire = true;
        if (!init) showToast("Millionaire!");
    }
    upAch('ach-first-steps', 'badge-first-steps', achs.firstSteps);
    upAch('ach-click-master', 'badge-click-master', achs.clickMaster);
    upAch('ach-auto-tycoon', 'badge-auto-tycoon', achs.autoTycoon);
    upAch('ach-lucky-seven', 'badge-lucky-seven', achs.luckySeven);
    upAch('ach-millionaire', 'badge-millionaire', achs.millionaire);
}

function upAch(rId, bId, open) {
    const r = document.getElementById(rId);
    const b = document.getElementById(bId);
    if (r && b) {
        r.classList.toggle('unlocked', open);
        b.textContent = open ? 'Открыто!' : 'Закрыто';
    }
}

function updateUI(init = false) {
    if (sDisp) sDisp.textContent = Math.floor(score).toLocaleString();
    let totalMult = scoreMultiplier * shopMultiplier;
    
    if (stDisp) {
        let cPowerText = (clickPower * totalMult).toFixed(2);
        let aPowerText = (autoClicksPerSecond * totalMult).toFixed(2);
        stDisp.textContent = "Сила клика: " + cPowerText + " | В секунду: " + aPowerText;
    }
    
    if (mDisp) {
        let rText = scoreMultiplier.toFixed(2);
        mDisp.textContent = "Множитель: x" + rText + " (Престиж Ур. " + rebirthLevel + ") | Магазин: x" + shopMultiplier;
    }
    
    if (clickTextEl) {
        clickTextEl.textContent = "🚀 Сильный клик (+" + clickUpgradeLevel + " за нажатие)";
    }
    
    if (upABtn) {
        upABtn.innerHTML = "🤖 Автокликер (+" + autoUpgradeLevel + " в сек.) <span id='auto-cost'>" + upgradeAutoCost + "</span> очков";
    }
    
    if (clickCostEl) clickCostEl.textContent = upgradeClickCost;
    if (upCBtn) upCBtn.classList.toggle('disabled', score < upgradeClickCost);
    if (upABtn) upABtn.classList.toggle('disabled', score < upgradeAutoCost);

    if (btnX2) {
        if (hasX5 || hasX10) btnX2.innerHTML = "⚡ Умножение X2<br>ЗАМЕНЕНО";
        else if (hasX2) btnX2.innerHTML = "⚡ Умножение X2<br>АКТИВНО";
        else btnX2.innerHTML = "⚡ Умножение X2 <br><span>500 000</span> очков";
        btnX2.classList.toggle('disabled', hasX2 || hasX5 || hasX10 || score < 500000);
    }
    if (btnX5) {
        if (hasX10) btnX5.innerHTML = "🔥 Умножение X5<br>ЗАМЕНЕНО";
        else if (hasX5) btnX5.innerHTML = "🔥 Умножение X5<br>АКТИВНО";
        else btnX5.innerHTML = "🔥 Умножение X5 <br><span>2 500 000</span> очков";
        btnX5.classList.toggle('disabled', hasX10 || hasX5 || score < 2500000);
    }
    if (btnX10) {
        if (hasX10) btnX10.innerHTML = "👑 Умножение X10<br>АКТИВНО";
        else btnX10.innerHTML = "👑 Умножение X10 <br><span>10 000 000</span> очков";
        btnX10.classList.toggle('disabled', hasX10 || score < 10000000);
    }

    let currentCost = getRebirthCost(rebirthLevel);
    if (rBtn && rCostEl) {
        if (rebirthLevel > 9) {
            rBtn.classList.add('disabled');
            rCostEl.textContent = "МАКСИМУМ (Ур. 10)";
        } else {
            rCostEl.textContent = currentCost.toLocaleString() + " ";
            rBtn.classList.toggle('disabled', score < currentCost);
        }
    }
    if (rProg && pTxt) {
        if (rebirthLevel > 9) {
            rProg.style.width = "100%";
            pTxt.textContent = "Достигнут макс. уровень!";
        } else {
            let pct = Math.min(100, Math.floor((score / currentCost) * 100));
            rProg.style.width = pct + "%";
            pTxt.textContent = "До перерождения: " + pct + "%";
        }
    }
    checkAchs(init);
}

if (cBtn) {
    cBtn.onclick = function(e) {
        score += clickPower * scoreMultiplier * shopMultiplier;
        if (!musicStarted && bgM) {
            bgM.play().then(() => {
                musicStarted = true;
                if (musicToggle) musicToggle.textContent = "🔊 Звук: Вкл";
            }).catch(err => console.log(err));
        }
        updateUI();
        saveGame();
        if (gCont) {
            const f = document.createElement('div');
            f.className = 'floating-number';
            f.textContent = "+" + (clickPower * scoreMultiplier * shopMultiplier).toFixed(1);
            const rect = gCont.getBoundingClientRect();
f.style.left = (e.clientX - rect.left) + "px";
            f.style.top = (e.clientY - rect.top) + "px";
            gCont.appendChild(f);
            setTimeout(() => f.remove(), 800);
        }
        cBtn.classList.add('active-click');
        setTimeout(() => cBtn.classList.remove('active-click'), 80);
        };
}
if (upCBtn) {
    upCBtn.onclick = function() {
        if (score >= upgradeClickCost) {
            score -= upgradeClickCost;
            clickPower += clickUpgradeLevel;
            clickUpgradeLevel += 1;
            upgradeClickCost = Math.round(upgradeClickCost * 1.6);
            updateUI();
            saveGame();
        }
    };
}

if (btnX2) {
    btnX2.onclick = function() {
        if (!hasX2 && !hasX5 && !hasX10 && score >= 500000) {
            score -= 500000;
            hasX2 = true;
            recalcMultipliers();
            updateUI();
            saveGame();
            alert("M_X2");
            }
    };
}

if (btnX5) {
    btnX5.onclick = function() {
        if (!hasX5 && !hasX10 && score >= 2500000) {
            score -= 2500000;
            hasX5 = true;
            recalcMultipliers();
            updateUI();
            saveGame();
            alert("M_X5");
            }
    };
}

if (btnX10) {
    btnX10.onclick = function() {
        if (!hasX10 && score >= 10000000) {
            score -= 10000000;
            hasX10 = true;
            recalcMultipliers();
            updateUI();
            saveGame();
            alert("M_X10");
        }
    };
}

if (rBtn) {
    rBtn.onclick = function() {
        if (rebirthLevel < 10 && score >= getRebirthCost(rebirthLevel)) {
            score = 0;
            clickPower = 1;
            clickUpgradeLevel = 1;
            autoUpgradeLevel = 1;
            autoClicksPerSecond = 0;
            upgradeClickCost = 15;
            upgradeAutoCost = 50;
            hasX2 = false;
            hasX5 = false;
            hasX10 = false;
            recalcMultipliers();
            rebirthLevel++;
            scoreMultiplier += 0.25;
            alert("Rebirth Completed!");
            updateUI();
            saveGame();
            }
    };
}

if (achTgl && achPnl) {
    achTgl.onclick = function() {
        achPnl.classList.toggle('open');
    };
}

if (rstBtn) {
    rstBtn.onclick = function() {
        if (confirm("Reset Game?")) {
            localStorage.clear();
            score = 0;
            clickPower = 1;
            clickUpgradeLevel = 1;
            autoUpgradeLevel = 1;
            autoClicksPerSecond = 0;
            upgradeClickCost = 15;
            upgradeAutoCost = 50;
            rebirthLevel = 0;
            scoreMultiplier = 1.0;
            hasX2 = false;
            hasX5 = false;
            hasX10 = false;
            recalcMultipliers();
            achs = { firstSteps: false, clickMaster: false, autoTycoon: false, luckySeven: false, millionaire: false };
            updateUI(true);
        }
    };
}

if (musicToggle) {
    musicToggle.onclick = function() {
        if (!bgM) return;
        if (bgM.paused) {
            bgM.play().then(() => {
                musicStarted = true;
                musicToggle.textContent = "🔊 Звук: Вкл";
            }).catch(() => alert("Click game first!"));
        } else {
            bgM.pause();
            musicToggle.textContent = "🔇 Звук: Выкл";
        }
    };
}

let inputBuffer = "";
let clearTimer = null;

window.addEventListener('keydown', (e) => {
    clearTimeout(clearTimer);
    inputBuffer += e.key.toLowerCase();
    if (inputBuffer.includes("cheat")) {
        score += 500000;
        showToast("Cheat OK: +500,000!");
        updateUI();
        saveGame();
        inputBuffer = "";
    }
    clearTimer = setTimeout(() => { inputBuffer = ""; }, 2000);
});

setInterval(() => {
    if (autoClicksPerSecond > 0) {
        score += autoClicksPerSecond * scoreMultiplier * shopMultiplier;
        updateUI();
        saveGame();
    }
}, 1000);
loadGame();
