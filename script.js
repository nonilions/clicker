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
    if (localStorage.getItem('clicker_score') !== null) {
        score = parseFloat(localStorage.getItem('clicker_score')); clickPower = parseInt(localStorage.getItem('clicker_power') || 1);
        autoClicksPerSecond = parseInt(localStorage.getItem('clicker_auto') || 0); upgradeClickCost = parseInt(localStorage.getItem('clicker_click_cost') || 15);
        upgradeAutoCost = parseInt(localStorage.getItem('clicker_auto_cost') || 50); clickUpgradeLevel = parseInt(localStorage.getItem('clicker_click_level') || 1);
        autoUpgradeLevel = parseInt(localStorage.getItem('clicker_auto_level') || 1); rebirthLevel = parseInt(localStorage.getItem('clicker_rebirth_level') || 0);
        scoreMultiplier = parseFloat(localStorage.getItem('clicker_multiplier') || 1.0); hasX2 = localStorage.getItem('clicker_hasX2') === 'true';
        hasX5 = localStorage.getItem('clicker_hasX5') === 'true'; hasX10 = localStorage.getItem('clicker_hasX10') === 'true';
        achs.firstSteps = localStorage.getItem('ach_firstSteps') === 'true'; achs.clickMaster = localStorage.getItem('ach_clickMaster') === 'true';
        achs.autoTycoon = localStorage.getItem('ach_autoTycoon') === 'true'; achs.luckySeven = localStorage.getItem('ach_luckySeven') === 'true'; achs.millionaire = localStorage.getItem('ach_millionaire') === 'true';
    }
    recalcMultipliers(); updateUI(true);
}

function saveGame() {
    localStorage.setItem('clicker_score', score); localStorage.setItem('clicker_power', clickPower); localStorage.setItem('clicker_auto', autoClicksPerSecond);
    localStorage.setItem('clicker_click_cost', upgradeClickCost); localStorage.setItem('clicker_auto_cost', upgradeAutoCost); localStorage.setItem('clicker_click_level', clickUpgradeLevel);
    localStorage.setItem('clicker_auto_level', autoUpgradeLevel); localStorage.setItem('clicker_rebirth_level', rebirthLevel); localStorage.setItem('clicker_multiplier', scoreMultiplier);
    localStorage.setItem('clicker_hasX2', hasX2); localStorage.setItem('clicker_hasX5', hasX5); localStorage.setItem('clicker_hasX10', hasX10);
    localStorage.setItem('ach_firstSteps', achs.firstSteps); localStorage.setItem('ach_clickMaster', achs.clickMaster); localStorage.setItem('ach_autoTycoon', achs.autoTycoon);
    localStorage.setItem('ach_luckySeven', achs.luckySeven); localStorage.setItem('ach_millionaire', achs.millionaire);
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
    if (stDisp) stDisp.textContent = `Сила клика: ${(clickPower * scoreMultiplier * shopMultiplier).toFixed(2)} | В секунду: ${(autoClicksPerSecond * scoreMultiplier * shopMultiplier).toFixed(2)}`;
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
if (btnX5) { btnX5.onclick = function() { if (!hasX5 && !hasX10 && score >= 2500000) { score -= 2500000; hasX5 = true; recalcMultipliers(); updateUI(); saveGame(); alert("Множитель заменен на X5!"); } }; }
if (btnX10) { btnX10.onclick = function() { if (!hasX10 && score >= 10000000) { score -= 10000000; hasX10 = true; recalcMultipliers(); updateUI(); saveGame(); alert("Множитель заменен на X10!"); } }; }
if (rBtn) { rBtn.onclick = function() { if (rebirthLevel < 10 && score >= rebirthCosts[rebirthLevel]) { rebirthLevel++; scoreMultiplier += 0.25; score = 0; clickPower = 1; clickUpgradeLevel = 1; autoUpgradeLevel = 1; autoClicksPerSecond = 0; upgradeClickCost = 15; upgradeAutoCost = 50; alert(`Перерождение совершенно! Множитель: х${scoreMultiplier.toFixed(2)}`); updateUI(); saveGame(); } }; }
if (achTgl && achPnl) achTgl.onclick = function() { achPnl.classList.toggle('open'); };

if (rstBtn) {
    rstBtn.onclick = function() {
        if (confirm("Вы уверены, что хотите полностью стереть игру?")) {
