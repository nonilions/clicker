// Используем абсолютно новые уникальные ключи памяти, чтобы старый сломанный кэш не стирал игру
const SAVE_KEY_SCORE = "clicker_v2_score";
const SAVE_KEY_POWER = "clicker_v2_power";
const SAVE_KEY_AUTO  = "clicker_v2_auto_val";
const SAVE_KEY_CCOST = "clicker_v2_click_cost";
const SAVE_KEY_ACOST = "clicker_v2_auto_cost";
const SAVE_KEY_CUPG  = "clicker_v2_click_upg_lvl";
const SAVE_KEY_AUPG  = "clicker_v2_auto_upg_lvl";
const SAVE_KEY_REB   = "clicker_v2_rebirth_lvl";
const SAVE_KEY_MULT  = "clicker_v2_score_mult";
const SAVE_KEY_X2    = "clicker_v2_has_x2";
const SAVE_KEY_X5    = "clicker_v2_has_x5";
const SAVE_KEY_X10   = "clicker_v2_has_x10";

let score = 0, clickPower = 1, autoClicksPerSecond = 0, upgradeClickCost = 15, upgradeAutoCost = 50, clickUpgradeLevel = 1, autoUpgradeLevel = 1, rebirthLevel = 0, scoreMultiplier = 1.0, musicStarted = false, hasX2 = false, hasX5 = false, hasX10 = false, shopMultiplier = 1.0;
const rebirthCosts = [100000, 500000, 1000000, 2000000, 3500000, 5000000, 7500000, 10000000, 15000000, 25000000];
let achs = { firstSteps: false, clickMaster: false, autoTycoon: false, luckySeven: false, millionaire: false };

const sDisp = document.getElementById('score-display'), stDisp = document.getElementById('stats-display'), mDisp = document.getElementById('multiplier-display');
const cBtn = document.getElementById('click-btn'), upCBtn = document.getElementById('upgrade-click'), upABtn = document.getElementById('upgrade-auto');
const rBtn = document.getElementById('rebirth-btn'), rCostEl = document.getElementById('rebirth-cost'), rstBtn = document.getElementById('reset-btn'), gCont = document.getElementById('game-container');
const cTxt = document.getElementById('click-text'), cCost = document.getElementById('click-cost'), aCost = document.getElementById('auto-cost');
const achTgl = document.getElementById('achievements-toggle'), achPnl = document.getElementById('achievements-panel'), toast = document.getElementById('toast-notification'), tTxt = document.getElementById('toast-text');
const bgM = document.getElementById('bg-music'), mMute = document.getElementById('music-toggle'), btnX2 = document.getElementById('buy-x2'), btnX5 = document.getElementById('buy-x5'), btnX10 = document.getElementById('buy-x10');
if (bgM) bgM.volume = 0.15;

function loadGame() {
    if (localStorage.getItem(SAVE_KEY_SCORE) !== null) {
        score = parseFloat(localStorage.getItem(SAVE_KEY_SCORE) || 0); 
        clickPower = parseInt(localStorage.getItem(SAVE_KEY_POWER) || 1);
        autoClicksPerSecond = parseInt(localStorage.getItem(SAVE_KEY_AUTO) || 0); 
        upgradeClickCost = parseInt(localStorage.getItem(SAVE_KEY_CCOST) || 15);
        upgradeAutoCost = parseInt(localStorage.getItem(SAVE_KEY_ACOST) || 50); 
        clickUpgradeLevel = parseInt(localStorage.getItem(SAVE_KEY_CUPG) || 1);
        autoUpgradeLevel = parseInt(localStorage.getItem(SAVE_KEY_AUPG) || 1); 
        rebirthLevel = parseInt(localStorage.getItem(SAVE_KEY_REB) || 0);
        scoreMultiplier = parseFloat(localStorage.getItem(SAVE_KEY_MULT) || 1.0); 
        hasX2 = localStorage.getItem(SAVE_KEY_X2) === 'true';
        hasX5 = localStorage.getItem(SAVE_KEY_X5) === 'true'; 
        hasX10 = localStorage.getItem(SAVE_KEY_X10) === 'true';
        achs.firstSteps = localStorage.getItem('ach_firstSteps') === 'true'; 
        achs.clickMaster = localStorage.getItem('ach_clickMaster') === 'true';
        achs.autoTycoon = localStorage.getItem('ach_autoTycoon') === 'true'; 
        achs.luckySeven = localStorage.getItem('ach_luckySeven') === 'true'; 
        achs.millionaire = localStorage.getItem('ach_millionaire') === 'true';
    }
    recalcMultipliers(); 
    updateUI(true);
}

function saveGame() {
    localStorage.setItem(SAVE_KEY_SCORE, score); 
    localStorage.setItem(SAVE_KEY_POWER, clickPower);
    localStorage.setItem(SAVE_KEY_AUTO, autoClicksPerSecond); 
    localStorage.setItem(SAVE_KEY_CCOST, upgradeClickCost); 
    localStorage.setItem(SAVE_KEY_ACOST, upgradeAutoCost); 
    localStorage.setItem('clicker_auto_cost', upgradeAutoCost); // Дублируем для совместимости со старым HTML
    localStorage.setItem(SAVE_KEY_CUPG, clickUpgradeLevel);
    localStorage.setItem(SAVE_KEY_AUPG, autoUpgradeLevel); 
    localStorage.setItem(SAVE_KEY_REB, rebirthLevel); 
    localStorage.setItem(SAVE_KEY_MULT, scoreMultiplier);
    localStorage.setItem(SAVE_KEY_X2, hasX2); 
    localStorage.setItem(SAVE_KEY_X5, hasX5); 
    localStorage.setItem(SAVE_KEY_X10, hasX10);
    localStorage.setItem('ach_firstSteps', achs.firstSteps); 
    localStorage.setItem('ach_clickMaster', achs.clickMaster); 
    localStorage.setItem('ach_autoTycoon', achs.autoTycoon);
    localStorage.setItem('ach_luckySeven', achs.luckySeven); 
    localStorage.setItem('ach_millionaire', achs.millionaire);
}

function recalcMultipliers() { shopMultiplier = 1.0; if (hasX2) shopMultiplier = 2.0; if (hasX5) shopMultiplier = 5.0; if (hasX10) shopMultiplier = 10.0; }
function showToast(t) { if (toast && tTxt) { tTxt.textContent = t; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); } }

function checkAchs(init = false) {
    if (!achs.firstSteps && score >= 10) { achs.firstSteps = true; if (!init) showToast("Первые шаги (10 очков!)"); }
    if (!achs.clickMaster && clickPower >= 5) { achs.clickMaster = true; if (!init) showToast("Клик-мастер (Сила клика 5)"); }
    if (!achs.autoTycoon && autoClicksPerSecond >= 1) { achs.autoTycoon = true; if (!init) showToast("Авто-магнат (Куплен автокликер)"); }
    if (!achs.luckySeven && Math.floor(score) === 777) { achs.luckySeven = true; if (!init) showToast("Счастливая семерка (Ровно 777!)"); }
    if (!achs.millionaire && score >= 1000000) { achs.millionaire = true; if (!init) showToast("Миллионер (1,000,000 очков!)"); }
    upAch('ach-first-steps', 'badge-first-steps', achs.firstSteps); upAch('ach-click-master', 'badge-click-master', achs.clickMaster);
    upAch('ach-auto-tycoon', 'badge-auto-tycoon', achs.autoTycoon); upAch('ach-lucky-seven', 'badge-lucky-seven', achs.luckySeven); upAch('ach-millionaire', 'badge-millionaire', achs.millionaire);
}

function upAch(rId, bId, open) { const r = document.getElementById(rId), b = document.getElementById(bId); if (r && b) { r.classList.toggle('unlocked', open); b.textContent = open ? 'Открыто!' : 'Закрыто'; } }

function updateUI(init = false) {
    if (sDisp) sDisp.textContent = Math.floor(score).toLocaleString();
    let totalMult = scoreMultiplier * shopMultiplier;
    if (stDisp) stDisp.textContent = `Сила клика: ${(clickPower * totalMult).toFixed(2)} | В секунду: ${(autoClicksPerSecond * totalMult).toFixed(2)}`;
    if (mDisp) mDisp.textContent = `Множитель: x${scoreMultiplier.toFixed(2)} (Престиж Ур. ${rebirthLevel}) | Магазин: x${shopMultiplier}`;
    if (cTxt) cTxt.textContent = `🚀 Сильный клик (+${clickUpgradeLevel} за нажатие)`;
    if (upABtn) upABtn.innerHTML = `🤖 Автокликер (+${autoUpgradeLevel} в сек.) <span id="auto-cost">${upgradeAutoCost}</span> очков`;
    if (cCost) cCost.textContent = upgradeClickCost;
    
    if (upCBtn) upCBtn.classList.toggle('disabled', score < upgradeClickCost);
    if (upABtn) upABtn.classList.toggle('disabled', score < upgradeAutoCost);
    
    if (btnX2) { if (hasX5 || hasX10) btnX2.innerHTML = "⚡ Умножение X2<br>ЗАМЕНЕНО"; else if (hasX2) btnX2.innerHTML = "⚡ Умножение X2<br>АКТИВНО"; btnX2.classList.toggle('disabled', hasX2 || hasX5 || hasX10 || score < 500000); }
    if (btnX5) { if (hasX10) btnX5.innerHTML = "🔥 Умножение X5<br>ЗАМЕНЕНО"; else if (hasX5) btnX5.innerHTML = "🔥 Умножение X5<br>АКТИВНО"; btnX5.classList.toggle('disabled', hasX10 || hasX5 || score < 2500000); }
    if (btnX10) { if (hasX10) btnX10.innerHTML = "👑 Умножение X10<br>АКТИВНО"; btnX10.classList.toggle('disabled', hasX10 || score < 10000000); }
    if (rBtn && rCostEl) { if (rebirthLevel >= 10) { rBtn.classList.add('disabled'); rCostEl.textContent = "МАКСИМУМ (Ур. 10)"; } else { rCostEl.textContent = rebirthCosts[rebirthLevel].toLocaleString() + " "; rBtn.classList.toggle('disabled', score < rebirthCosts[rebirthLevel]); } }
    checkAchs(init);
}

if (cBtn) {
    cBtn.onclick = function(e) {
        score += clickPower * scoreMultiplier * shopMultiplier;
        if (!musicStarted && bgM) { bgM.play().then(() => { musicStarted = true; if (mMute) mMute.textContent = "🔊 Звук: Вкл"; }).catch(err => console.log(err)); }
        updateUI(); saveGame();
        if (gCont) {
            const f = document.createElement('div'); f.className = 'floating-number'; f.textContent = `+${(clickPower * scoreMultiplier * shopMultiplier).toFixed(1)}`;
            const rect = gCont.getBoundingClientRect(); f.style.left = `${e.clientX - rect.left}px`; f.style.top = `${e.clientY - rect.top}px`;
            gCont.appendChild(f); setTimeout(() => f.remove(), 800);
        }
        cBtn.classList.add('active-click'); setTimeout(() => cBtn.classList.remove('active-click'), 80);
    };
}

if (upCBtn) { upCBtn.onclick = function() { if (score >= upgradeClickCost) { score -= upgradeClickCost; clickPower += clickUpgradeLevel; clickUpgradeLevel += 1; upgradeClickCost = Math.round(upgradeClickCost * 1.6); updateUI(); saveGame(); } }; }
if (upABtn) { upABtn.onclick = function() { if (score >= upgradeAutoCost) { score -= upgradeAutoCost; autoClicksPerSecond += autoUpgradeLevel; autoUpgradeLevel += 1; upgradeAutoCost = Math.round(upgradeAutoCost * 1.6); updateUI(); saveGame(); } }; }
if (btnX2) { btnX2.onclick = function() { if (!hasX2 && !hasX5 && !hasX10 && score >= 500000) { score -= 500000; hasX2 = true; recalcMultipliers(); updateUI(); saveGame(); alert("Активирован множитель X2!"); } }; }
