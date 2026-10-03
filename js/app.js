const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let L=localStorage.getItem('tws_lang');
const t=k=>(T[L]||T.en)[k]??T.en[k]??k;
const an=a=>a.name[L]||a.name.en;
const LANGS=[['en','English'],['az','Azərbaycanca'],['ur','اردو']];
function setLang(l){localStorage.setItem('tws_lang',l);location.reload();}
const card=w=>`<a class="card" href="watch.html?id=${w.id}">${imgTag(w,esc(w.brand+' '+w.model))}<div class="ci"><span>${esc(w.brand)} ${esc(w.model)}</span><b>₼${esc(w.price)}</b></div></a>`;
const inAlbum=(w,k)=>k==='all'||(w.tags||[]).includes(k);

function chrome(page){
  document.documentElement.lang=L||'en'; document.documentElement.dir=L==='ur'?'rtl':'ltr';
  const nav=[['index','index.html','home'],['watches','watches.html','watches'],['albums','albums.html','albums'],['contact','contact.html','contact']];
  $('#hdr').innerHTML=`<div class="bar"><a class="logo" href="index.html">Topdan Saat</a>
   <button class="burger" aria-label="Menu" onclick="document.body.classList.toggle('open')">☰</button>
   <nav>${nav.map(n=>`<a href="${n[1]}" class="${page===n[0]?'on':''}">${t(n[2])}</a>`).join('')}</nav>
   <select class="lang" aria-label="Language" onchange="setLang(this.value)">${LANGS.map(l=>`<option value="${l[0]}" ${l[0]===L?'selected':''}>${l[1]}</option>`).join('')}</select></div>`;
  $('#ftr').innerHTML=`© ${new Date().getFullYear()} Topdan Saat. ${t('rights')}`;
}
function langGate(){
  const d=document.createElement('div');d.className='gate';
  d.innerHTML=`<div class="gbox"><h2>Topdan Saat</h2><p>Choose your language · Dil seçin · زبان منتخب کریں</p>${LANGS.map(l=>`<button onclick="setLang('${l[0]}')">${l[1]}</button>`).join('')}</div>`;
  document.body.appendChild(d);
}
function albumCard(a){
  const ws=DB.data.watches.filter(w=>inAlbum(w,a.key)),cover=ws[0];
  return `<a class="card album" href="watches.html?album=${encodeURIComponent(a.key)}">${cover?imgTag(cover):`<img src="${watchImg({metal:'silver'})}" alt="">`}<div class="ci"><span>${esc(an(a))}</span><b>${ws.length} ${t('count')}</b></div></a>`;
}
function clockSVG(){let k='';for(let i=0;i<60;i++){const a=i*Math.PI/30,b=i%5===0,r=b?76:84;
  k+=`<line x1="${100+r*Math.sin(a)}" y1="${100-r*Math.cos(a)}" x2="${100+88*Math.sin(a)}" y2="${100-88*Math.cos(a)}" stroke="#e6c777" stroke-width="${b?3:1}"/>`;}
  return `<svg class="clock" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="98" fill="#c3a15a"/><circle cx="100" cy="100" r="92" fill="#0d2327"/>${k}
  <line id="hh" x1="100" y1="100" x2="100" y2="58" stroke="#fff" stroke-width="5" stroke-linecap="round"/><line id="mh" x1="100" y1="100" x2="100" y2="36" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
  <line id="sh" x1="100" y1="112" x2="100" y2="28" stroke="#e6c777" stroke-width="1.6"/><circle cx="100" cy="100" r="5" fill="#e6c777"/></svg>`;}
function tick(){const d=new Date(),s=d.getSeconds(),m=d.getMinutes()+s/60,h=d.getHours()%12+m/60;
  [['hh',h*30],['mh',m*6],['sh',s*6]].forEach(([i,a])=>{const e=$('#'+i);if(e)e.setAttribute('transform',`rotate(${a} 100 100)`);});}
const pages={
 index(){
  const D=DB.data, f=D.watches.slice().sort((a,b)=>b.price-a.price).filter((_,i)=>i%4===0).slice(0,8);
  const brands=[...new Set(D.watches.map(w=>w.brand))];
  const m=((D.settings.youtube||'').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)||[])[1];
  const vid=m?`<iframe src="https://www.youtube.com/embed/${m}" allowfullscreen title="Video" loading="lazy"></iframe>`
   :`<video controls playsinline preload="metadata"><source src="videos/store.mp4" type="video/mp4" onerror="this.closest('section').remove()"></video>`;
  $('#main').innerHTML=`<section class="hero"><div class="hcopy"><h1>${t('heroT')}</h1><p>${t('heroS')}</p>
   <a class="btn" href="watches.html">${t('shopNow')}</a> <a class="btn ghost" href="albums.html">${t('browse')}</a></div>${clockSVG()}</section>
   <div class="strip"><b>${t('brandsT')}</b>${brands.map(b=>`<span>${esc(b)}</span>`).join('')}</div>
   <section class="wrap"><h2>${t('albums')}</h2><div class="grid">${D.albums.map(albumCard).join('')}</div></section>
   <section class="vid"><div class="wrap"><h2>${t('videoT')}</h2><div class="vbox">${vid}</div></div></section>
   <section class="wrap"><h2>${t('featured')}</h2><div class="grid">${f.map(card).join('')}</div></section>
   <section class="wrap"><h2>${t('whyT')}</h2><div class="why"><div><h3>${t('w1')}</h3><p>${t('w1d')}</p></div><div><h3>${t('w2')}</h3><p>${t('w2d')}</p></div><div><h3>${t('w3')}</h3><p>${t('w3d')}</p></div></div></section>
   <section class="cta"><h2>${t('w3')}</h2><p>${t('w3d')}</p><a class="btn" href="contact.html">${t('contact')}</a></section>`;
  tick();setInterval(tick,1000);
 },
 albums(){$('#main').innerHTML=`<section class="wrap"><h1>${t('albums')}</h1><div class="grid">${DB.data.albums.map(albumCard).join('')}</div>
   <p><a class="btn" href="watches.html">${t('allWatches')}</a></p></section>`;},
 watches(){
  const D=DB.data,p=new URLSearchParams(location.search);let k=p.get('album')||'all',sort='';
  const draw=()=>{let l=D.watches.filter(w=>inAlbum(w,k));
   if(sort==='lo')l.sort((a,b)=>a.price-b.price);if(sort==='hi')l.sort((a,b)=>b.price-a.price);
   $('#list').innerHTML=l.length?l.map(card).join(''):`<p>${t('none')}</p>`;
   $('#chips').innerHTML=[{key:'all',name:{en:t('all'),az:t('all'),ur:t('all')}},...D.albums].map(a=>`<button class="chip ${a.key===k?'on':''}" data-k="${esc(a.key)}">${esc(an(a))}</button>`).join('');
   document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw();});};
  $('#main').innerHTML=`<section class="wrap"><h1>${t('allWatches')}</h1><div class="tools"><div id="chips"></div>
   <select id="sort"><option value="">${t('price')}</option><option value="lo">${t('sortLow')}</option><option value="hi">${t('sortHigh')}</option></select></div><div id="list" class="grid"></div></section>`;
  $('#sort').onchange=e=>{sort=e.target.value;draw();};draw();
 },
 watch(){
  const id=+new URLSearchParams(location.search).get('id'),w=DB.data.watches.find(x=>x.id===id);
  if(!w){$('#main').innerHTML=`<section class="wrap"><p>${t('notFound')}</p><a class="btn" href="watches.html">${t('back')}</a></section>`;return;}
  const row=(a,b)=>`<tr><th>${a}</th><td>${b}</td></tr>`;
  $('#main').innerHTML=`<section class="wrap detail">${imgTag(w,esc(w.brand+' '+w.model))}<div>
   <h1>${esc(w.brand)} ${esc(w.model)}</h1><p class="big">₼${esc(w.price)}</p>
   <p class="stock ${w.stock>0?'ok':'no'}">${t('inStock')}: ${esc(w.stock)} ${t('pcs')}</p>
   <p>${esc(w.desc)||t('desc')}</p>
   <table>${row(t('brand'),esc(w.brand))}${row(t('gender'),t(w.gender))}${row(t('material'),t(w.metal))}${row(t('movement'),t('quartz'))}${w.caseSize?row(t('caseSize'),esc(w.caseSize)):''}${w.strap?row(t('strap'),esc(w.strap)):''}${w.water?row(t('water'),esc(w.water)):''}${row(t('price'),'₼'+esc(w.price))}</table>
   <a class="btn" href="watches.html">${t('back')}</a></div></section>`;
 },
 contact(){
  $('#main').innerHTML=`<section class="wrap"><h1>${t('contact')}</h1><div class="info">
   <p><b>${t('phone')}</b><br><a dir="ltr" href="tel:+994513707190">+994 51 370 71 90</a></p>
   <p><b>${t('address')}</b><br>Sədərək ticarət mərkəzi, Yeni şirniyyat, sıra 6 mağaza 12<br>
   <a href="https://maps.app.goo.gl/fXUojGNgyWGTjiW16" target="_blank" rel="noopener">https://maps.app.goo.gl/fXUojGNgyWGTjiW16</a></p>
   <p><a class="btn" href="https://maps.app.goo.gl/fXUojGNgyWGTjiW16" target="_blank" rel="noopener">${t('openMap')}</a></p></div>
   <iframe class="map" title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=S%C9%99d%C9%99r%C9%99k+Ticar%C9%99t+M%C9%99rk%C9%99zi+Baku&output=embed"></iframe>
   <h2>${t('follow')}</h2><p><a class="btn" href="https://www.instagram.com/topdan_saat_/" target="_blank" rel="noopener">Instagram</a>
   <a class="btn ghost" href="https://www.tiktok.com/@trend__cosmetics?_r=1&_t=ZS-9AFaMqBDZTj" target="_blank" rel="noopener">TikTok</a></p></section>`;
 }
};
(async()=>{
  const page=document.body.dataset.page;
  await DB.load(); chrome(page);
  if(!L){langGate();return;}
  (pages[page]||(()=>{}))();
})();
