(function(){
function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
function set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function sget(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
function sset(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}
var $=function(i){return document.getElementById(i)};
var root=document.documentElement,mq=window.matchMedia&&matchMedia('(prefers-color-scheme: light)');
/* theme */
function applyTheme(mode){var t=mode==='dark'?'dark':mode==='light'?'light':(mq&&mq.matches?'light':'dark');root.setAttribute('data-theme',t);
 document.querySelectorAll('[data-theme-btn]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.themeBtn===mode)})}
var tm=get('jm_theme')||'dark';applyTheme(tm);
document.querySelectorAll('[data-theme-btn]').forEach(function(b){b.addEventListener('click',function(){tm=b.dataset.themeBtn;set('jm_theme',tm);applyTheme(tm)})});
if(mq&&mq.addEventListener)mq.addEventListener('change',function(){if(tm==='user')applyTheme('user')});
/* language */
var I=window.JM_I18N||{hi:{},en:{}};
var sel=$('mylang');
if(sel)Object.keys(I).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=I[k].name;sel.appendChild(o)});
var AL={ori:'or',od:'or',hin:'hi'};
function detect(){var ls=(navigator.languages&&navigator.languages.length)?navigator.languages:[navigator.language||'hi'];
 for(var i=0;i<ls.length;i++){var b=String(ls[i]).toLowerCase().split('-')[0];b=AL[b]||b;if(I[b])return b}return 'hi'}
var mode=get('jm_langmode')||'auto',my=get('jm_my')||detect();if(!I[my])my='hi';
function cur(){return mode==='hi'?'hi':mode==='en'?'en':mode==='manual'?my:detect()}
function T(k){var L=I[cur()]||{};return L[k]||(I.hi&&I.hi[k])||''}
function applyLang(){var code=cur();if(sel)sel.value=code;
 root.lang=(code==='mai')?'hi':code;root.dir=code==='ur'?'rtl':'ltr';
 document.querySelectorAll('[data-i]').forEach(function(e){var v=T(e.dataset.i);if(v)e.textContent=v});
 document.querySelectorAll('[data-lang-btn]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.langBtn===mode)});
 if(sel)sel.className=mode==='manual'?'on':'';
 var ru=$('ru'),rn=$('rn');if(ru){ru.placeholder=T('req_u');rn.placeholder=T('req_n');$('nm').placeholder=T('m_opt_t')}
 if(isHome&&typeof renderAll==='function')renderAll()}
document.querySelectorAll('[data-lang-btn]').forEach(function(b){b.addEventListener('click',function(){mode=b.dataset.langBtn;set('jm_langmode',mode);applyLang()})});
if(sel)sel.addEventListener('change',function(){my=sel.value;mode='manual';set('jm_my',my);set('jm_langmode','manual');applyLang()});
/* toast */
var tt;function toast(m){var t=$('toast');if(!t)return;t.textContent=m;t.className='on';clearTimeout(tt);tt=setTimeout(function(){t.className=''},2600)}
/* Back / Forward: always work like the browser arrows; hidden when nothing to go to */
var nv=$('nv'),bk=$('bk'),fw=$('fw'),isHome=!!$('up');
function navState(){var cb=true,cf=true;
 if(window.navigation&&typeof navigation.canGoBack==='boolean'){cb=navigation.canGoBack;cf=navigation.canGoForward}
 else{var nt=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0]||{}).type;cb=history.length>1;cf=true;if(isHome&&nt!=='back_forward'){cb=false;cf=false}}
 bk.disabled=!cb;fw.disabled=!cf;
 if(isHome){nv.hidden=!(cb||cf)} }
if(bk){bk.addEventListener('click',function(){history.back()});fw.addEventListener('click',function(){history.forward()});navState();
 window.addEventListener('pageshow',navState);if(window.navigation&&navigation.addEventListener)navigation.addEventListener('currententrychange',navState)}
/* keep typed data so Back/Forward never loses it */
document.querySelectorAll('[data-keep]').forEach(function(e){var k='jm_k_'+e.dataset.keep,v=sget(k);
 if(v!==null){if(e.type==='checkbox')e.checked=v==='1';else e.value=v}
 e.addEventListener('input',function(){sset(k,e.type==='checkbox'?(e.checked?'1':'0'):e.value);if(e.id==='ru'||e.id==='rn')rbtn()});
 e.addEventListener('change',function(){sset(k,e.type==='checkbox'?(e.checked?'1':'0'):e.value)})});
if(!isHome){applyLang();return}
/* ---- home only ---- */
var user=get('jm_user');var conn={};try{conn=JSON.parse(get('jm_conn')||'{}')}catch(e){}var reqs=[];try{reqs=JSON.parse(get('jm_reqs')||'[]')}catch(e){}
function saveC(){set('jm_conn',JSON.stringify(conn))}
function renderAll(){
 var li=!!user;$('bl').hidden=li;$('bs').hidden=li;$('bo').hidden=!li;$('who').textContent=li?'👤 '+T('demo_user'):'';
 $('lock').hidden=li;
 document.querySelectorAll('.pl').forEach(function(r){var n=r.dataset.pl,on=!!conn[n];
  r.querySelector('.pa').disabled=!li||on;r.querySelector('.pr').disabled=!li||!on;r.querySelector('i').hidden=!on});
 $('rl').innerHTML=reqs.map(function(x){return '<p class="pend"><b>'+esc(x.n)+'</b> · '+esc(x.u)+'<em>'+T('pend')+'</em></p>'}).join('');rbtn()}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function rbtn(){$('rb').disabled=!($('ru').value.trim()&&$('rn').value.trim())}
document.querySelectorAll('.pl').forEach(function(r){var n=r.dataset.pl;
 r.querySelector('.pa').addEventListener('click',function(){conn[n]=1;saveC();renderAll();toast(n+': '+T('t_conn'))});
 r.querySelector('.pr').addEventListener('click',function(){delete conn[n];saveC();renderAll();toast(n+': '+T('t_disc'))})});
document.querySelectorAll('[data-ed]').forEach(function(b){b.addEventListener('click',function(){toast(T('t_demo'))})});
$('rb').addEventListener('click',function(){var u=$('ru').value.trim(),n=$('rn').value.trim();
 if(!/^(https?:\/\/)?[^\s\/]+\.[^\s]{2,}$/i.test(u)){$('re').textContent=T('req_bad');return}
 $('re').textContent='';reqs.push({u:u,n:n});set('jm_reqs',JSON.stringify(reqs));$('ru').value='';$('rn').value='';sset('jm_k_ru','');sset('jm_k_rn','');renderAll();toast(T('t_req'))});
/* upload card */
var vf=$('vf');function pick(){vf.click()}
$('up').addEventListener('click',pick);$('up').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick()}});
vf.addEventListener('change',function(){if(vf.files&&vf.files[0]){var n=Object.keys(conn).length;$('upmsg').textContent=T('t_file')+' '+vf.files[0].name+(n?' → '+n+' platforms':'')+' ('+T('t_demo')+')'}});
/* login / signup dialog */
var dg=$('dg'),kind='login';
function openD(k){kind=k;$('dt').textContent=T(k==='signup'?'m_signup':'m_login');var su=k==='signup';$('lc').hidden=!su;$('ll').hidden=!su;$('ln').hidden=!su;gate();
 if(dg.showModal)dg.showModal();else dg.setAttribute('open','')}
function gate(){$('dgo').disabled=(kind==='signup'&&!$('c1').checked)}
$('c1').addEventListener('change',gate);
$('bl').addEventListener('click',function(){openD('login')});$('bs').addEventListener('click',function(){openD('signup')});
$('dc').addEventListener('click',function(){dg.close?dg.close():dg.removeAttribute('open')});
$('dgo').addEventListener('click',function(){user='demo';set('jm_user',user);dg.close?dg.close():dg.removeAttribute('open');renderAll()});
$('bo').addEventListener('click',function(){user=null;try{localStorage.removeItem('jm_user')}catch(e){}renderAll()});
applyLang()})();
