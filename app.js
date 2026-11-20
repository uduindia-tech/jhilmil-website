(function(){
function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
function set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
var root=document.documentElement,mq=window.matchMedia&&matchMedia('(prefers-color-scheme: light)');
function applyTheme(mode){var t=mode==='dark'?'dark':mode==='light'?'light':(mq&&mq.matches?'light':'dark');root.setAttribute('data-theme',t);
 document.querySelectorAll('[data-theme-btn]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.themeBtn===mode)})}
var tm=get('jm_theme')||'dark';applyTheme(tm);
document.querySelectorAll('[data-theme-btn]').forEach(function(b){b.addEventListener('click',function(){tm=b.dataset.themeBtn;set('jm_theme',tm);applyTheme(tm)})});
if(mq&&mq.addEventListener)mq.addEventListener('change',function(){if(tm==='user')applyTheme('user')});
var I=window.JM_I18N;if(!I)return;
var sel=document.getElementById('mylang');
Object.keys(I).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=I[k].name;sel.appendChild(o)});
var AL={ori:'or',od:'or',hin:'hi'};
function detect(){var ls=(navigator.languages&&navigator.languages.length)?navigator.languages:[navigator.language||'hi'];
 for(var i=0;i<ls.length;i++){var b=String(ls[i]).toLowerCase().split('-')[0];b=AL[b]||b;if(I[b])return b}return 'hi'}
var mode=get('jm_langmode')||'auto',my=get('jm_my')||detect();if(!I[my])my='hi';
function cur(){return mode==='hi'?'hi':mode==='en'?'en':mode==='manual'?my:detect()}
function applyLang(){var code=cur(),L=I[code];sel.value=code;
 document.documentElement.lang=(code==='mai')?'hi':code;document.documentElement.dir=code==='ur'?'rtl':'ltr';
 document.querySelectorAll('[data-i]').forEach(function(e){e.textContent=L[e.dataset.i]});
 document.querySelectorAll('[data-lang-btn]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.langBtn===mode)});
 sel.className=mode==='manual'?'on':''}
document.querySelectorAll('[data-lang-btn]').forEach(function(b){b.addEventListener('click',function(){mode=b.dataset.langBtn;set('jm_langmode',mode);applyLang()})});
sel.addEventListener('change',function(){my=sel.value;mode='manual';set('jm_my',my);set('jm_langmode','manual');applyLang()});
applyLang()})();