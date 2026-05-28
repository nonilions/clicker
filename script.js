let s=0,cp=1,aps=0,cc=15,ac=50,cul=1,aul=1,rl=0,sm=1.0,ms=false,x2=false,x5=false,x10=false,shm=1.0;
let acs={f:false,cm:false,at:false,l7:false,m:false};
function grc(l){return l===0?100k:l===1?500k:l===2?1M:l===3?2M:l===4?3.5M:l===5?5M:l===6?7.5M:l===7?10M:l===8?15M:25M;}
const sd=document.getElementById('score-display'),std=document.getElementById('stats-display'),md=document.getElementById('multiplier-display'),cb=document.getElementById('click-btn'),uc=document.getElementById('upgrade-click'),ua=document.getElementById('upgrade-auto'),rb=document.getElementById('rebirth-btn'),rce=document.getElementById('rebirth-cost'),rst=document.getElementById('reset-btn'),gc=document.getElementById('game-container'),rp=document.getElementById('rebirth-progress'),pt=document.getElementById('progress-text'),b2=document.getElementById('buy-x2'),b5=document.getElementById('buy-x5'),b10=document.getElementById('buy-x10'),toast=document.getElementById('toast-notification'),tt=document.getElementById('toast-text'),bgm=document.getElementById('bg-music'),mt=document.getElementById('music-toggle');
if(bgm)bgm.volume=0.15;
function loadGame(){
    if(localStorage.getItem('mega_score_v4')!==null){
        s=parseFloat(localStorage.getItem('mega_score_v4')||0);cp=parseInt(localStorage.getItem('mega_power_v4')||1);aps=parseInt(localStorage.getItem('mega_auto_v4')||0);cc=parseInt(localStorage.getItem('mega_ccost_v4')||15);ac=parseInt(localStorage.getItem('mega_acost_v4')||50);cul=parseInt(localStorage.getItem('mega_clvl_v4')||1);aul=parseInt(localStorage.getItem('mega_alvl_v4')||1);rl=parseInt(localStorage.getItem('mega_rlvl_v4')||0);sm=parseFloat(localStorage.getItem('mega_mult_v4')||1.0);x2=localStorage.getItem('mega_x2_v4')==='true';x5=localStorage.getItem('mega_x5_v4')==='true';x10=localStorage.getItem('mega_x10_v4')==='true';acs.f=localStorage.getItem('mega_ach1_v4')==='true';acs.cm=localStorage.getItem('mega_ach2_v4')==='true';acs.at=localStorage.getItem('mega_ach3_v4')==='true';acs.l7=localStorage.getItem('mega_ach4_v4')==='true';acs.m=localStorage.getItem('mega_ach5_v4')==='true';
    }
    rcm();uui(true);
}
function saveGame(){
    localStorage.setItem('mega_score_v4',s);localStorage.setItem('mega_power_v4',cp);localStorage.setItem('mega_auto_v4',aps);localStorage.setItem('mega_ccost_v4',cc);localStorage.setItem('mega_acost_v4',ac);localStorage.setItem('mega_clvl_v4',cul);localStorage.setItem('mega_alvl_v4',aul);localStorage.setItem('mega_rlvl_v4',rl);localStorage.setItem('mega_mult_v4',sm);localStorage.setItem('mega_x2_v4',x2);localStorage.setItem('mega_x5_v4',x5);localStorage.setItem('mega_x10_v4',x10);localStorage.setItem('mega_ach1_v4',acs.f);localStorage.setItem('mega_ach2_v4',acs.cm);localStorage.setItem('mega_ach3_v4',acs.at);localStorage.setItem('mega_ach4_v4',acs.l7);localStorage.setItem('mega_ach5_v4',acs.m);
}
function rcm(){shm=1.0;if(x2)shm=2.0;if(x5)shm=5.0;if(x10)shm=10.0;}
function st(t){if(toast&&tt){tt.textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000);}}
function cac(init=false){
    if(!acs.f&&s>=10){acs.f=true;if(!init)st("Первые шаги (10 очков!)");}if(!acs.cm&&cp>=5){acs.cm=true;if(!init)st("Клик-мастер (Сила клика 5)");}if(!acs.at&&aps>=1){acs.at=true;if(!init)st("Авто-магнат (Куплен автокликер)");}if(!acs.l7&&Math.floor(s)===777){acs.l7=true;if(!init)st("Счастливая семерка (Ровно 777!)");}if(!acs.m&&s>=1000000){acs.m=true;if(!init)st("Миллионер (1,000,000 очков!)");}
    ua('ach-first-steps','badge-first-steps',acs.f);ua('ach-click-master','badge-click-master',acs.cm);ua('ach-auto-tycoon','badge-auto-tycoon',acs.at);ua('ach-lucky-seven','badge-lucky-seven',acs.l7);ua('ach-millionaire','badge-millionaire',acs.m);
}
function ua(rId,bId,o){const r=document.getElementById(rId),b=document.getElementById(bId);if(r&&b){r.classList.toggle('unlocked',o);b.textContent=o?'Открыто!':'Закрыто';}}
function uui(init=false){
    if(sd)sd.textContent=Math.floor(s).toLocaleString();let tm=sm*shm;if(std)std.textContent=`Сила клика: ${(cp*tm).toFixed(2)} | В секунду: ${(aps*tm).toFixed(2)}`;if(md)md.textContent=`Множитель: x${sm.toFixed(2)} (Престиж Ур. ${rl}) | Магазин: x${shm}`;
    const clt=document.getElementById('click-text'),clc=document.getElementById('click-cost'),auc=document.getElementById('auto-cost');if(clt)clt.textContent=`🚀 Сильный клик (+${cul} за нажатие)`;if(clc)clc.textContent=cc;if(auc)auc.textContent=ac;if(uc)uc.classList.toggle('disabled',s<cc);if(ua)ua.classList.toggle('disabled',s<ac);
    if(b2){if(x5||x10)b2.innerHTML="⚡ Умножение X2<br>ЗАМЕНЕНО";else if(x2)b2.innerHTML="⚡ Умножение X2<br>АКТИВНО";else b2.innerHTML="⚡ Умножение X2 <br><span>500 000</span> очков";b2.classList.toggle('disabled',x2||x5||x10||s<500000);}
    if(b5){if(x10)b5.innerHTML="🔥 Умножение X5<br>ЗАМЕНЕНО";else if(x5)b5.innerHTML="🔥 Умножение X5<br>АКТИВНО";else b5.innerHTML="🔥 Умножение X5 <br><span>2 500 000</span> очков";b5.classList.toggle('disabled',x10||x5||s<2500000);}
    if(b10){if(x10)b10.innerHTML="👑 Умножение X10<br>АКТИВНО";else b10.innerHTML="👑 Умножение X10 <br><span>10 000 000</span> очков";b10.classList.toggle('disabled',x10||s<10000000);}
    let cur=grc(rl);if(rb&&rce){if(rl>9){rb.classList.add('disabled');rce.textContent="МАКСИМУМ (Ур. 10)";}else{rce.textContent=cur.toLocaleString()+" ";rb.classList.toggle('disabled',s<cur);}}
    if(rp&&pt){if(rl>9){rp.style.width="100%";pt.textContent="Достигнут макс. уровень!";}else{let pct=Math.min(100,Math.floor((s/cur)*100));rp.style.width=pct+"%";pt.textContent="До перерождения: "+pct+"%";}}
    cac(init);
}
if(cb){
    cb.onclick=function(e){
        s+=cp*sm*shm;if(!ms&&bgm){bgm.play().then(()=>{ms=true;if(mt)mt.textContent="🔊 Звук: Вкл";}).catch(err=>console.log(err));}uui();saveGame();
        if(gc){const f=document.createElement('div');f.className='floating-number';f.textContent=`+${(cp*sm*shm).toFixed(1)}`;const r=gc.getBoundingClientRect();f.style.left=`${e.clientX-r.left}px`;f.style.top=`${e.clientY-r.top}px`;gc.appendChild(f);setTimeout(()=>f.remove(),800);}
        cb.classList.add('active-click');setTimeout(()=>cb.classList.remove('active-click'),80);
    };
}
if(uc){uc.onclick=function(){if(s>=cc){s-=cc;cp+=cul;cul+=1;cc=Math.round(cc*1.6);uui();saveGame();}};}
if(ua){ua.onclick=function(){if(s>=ac){s-=ac;aps+=aul;aul+=1;ac=Math.round(ac*1.6);uui();saveGame();}};}
if(b2){b2.onclick=function(){if(!x2&&!x5&&!x10&&s>=500000){s-=500000;x2=true;rcm();uui();saveGame();alert("Активирован множитель X2!");}};}
if(b5){b5.onclick=function(){if(!x5&&!x10&&s>=2500000){s-=2500000;x5=true;rcm();uui();saveGame();alert("Множитель заменен на X5!");}};}
if(b10){b10.onclick=function(){if(!x10&&s>=10000000){s-=10000000;x10=true;rcm();uui();saveGame();alert("Множитель заменен на X10!");}};}
if(rb){rb.onclick=function(){if(rl<10&&s>=grc(rl)){s=0;cp=1;cul=1;aul=1;aps=0;cc=15;ac=50;x2=false;x5=false;x10=false;rcm();rl++;sm+=0.25;alert(`Перерождение совершено! Множитель престижа: х${sm.toFixed(2)}\nСупер-множители сброшены!`);uui();saveGame();}};}
if(achTgl&&achPnl)achTgl.onclick=function(){achPnl.classList.toggle('open');};
if(rst){rst.onclick=function(){if(confirm("Вы уверены, что хотите полностью стереть игру?")){localStorage.clear();s=0;cp=1;cul=1;aul=1;aps=0;cc=15;ac=50;rl=0;sm=1.0;x2=false;x5=false;x10=false;rcm();acs={f:false,cm:false,at:false,l7:false,m:false};uui(true);}};}
if(mt){mt.onclick=function(){if(!bgm)return;if(bgm.paused){bgm.play().then(()=>{ms=true;mt.textContent="🔊 Звук: Вкл";}).catch(()=>alert("Сначала кликните по игре!"));}else{bgm.pause();mt.textContent="🔇 Звук: Выкл";}};}
let ib="",ct=null;window.addEventListener('keydown',(e)=>{clearTimeout(ct);ib+=e.key.toLowerCase();if(ib.includes("cheat")){s+=500000;st("Чит-код активирован: +500,000 очков!");uui();saveGame();ib="";}ct=setTimeout(()=>{ib="";},2000);});
setInterval(()=>{if(aps>0){s+=aps*sm*shm;uui();saveGame();}},1000);
loadGame();
