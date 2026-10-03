/* NOTE: this login runs in the browser only. It keeps casual visitors out but is NOT real security. */
const USER='mehdi', CODE='1234raet';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function login(e){e.preventDefault();
  if($('#u').value.trim()===USER&&$('#p').value===CODE){sessionStorage.setItem('tws_admin','1');start();}
  else $('#err').textContent='Wrong username or code.';return false;}
function logout(){sessionStorage.removeItem('tws_admin');location.reload();}
async function start(){
  $('#login').hidden=true;$('#app').hidden=false;await DB.load();render();
  document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x===b));
    ['w','a','d'].forEach(k=>$('#tab-'+k).hidden=k!==b.dataset.t);});
}
if(sessionStorage.getItem('tws_admin'))start();
const D=()=>DB.data;
function render(){renderW();renderA();renderD();}
let q='';
function renderW(){
  const list=D().watches.filter(w=>(w.brand+' '+w.model).toLowerCase().includes(q.toLowerCase()));
  $('#tab-w').innerHTML=`<div class="bar2"><input id="q" placeholder="Search watches" value="${esc(q)}"><button class="b g" onclick="editW()">+ Add watch</button></div>
   <p>${D().watches.length} watches. Change price or stock and it saves automatically.</p>`+
   list.map(w=>`<div class="row">${imgTag(w)}<div><b>${esc(w.brand)} ${esc(w.model)}</b><small>${esc((w.tags||[]).join(', '))}</small></div>
    <label>Price ₼<input type="number" min="0" step="any" value="${w.price}" onchange="upd(${w.id},'price',this.value)"></label>
    <label>Stock<input type="number" min="0" step="1" value="${w.stock}" onchange="upd(${w.id},'stock',this.value)"></label>
    <div class="acts"><button class="b s" onclick="editW(${w.id})">Edit</button><button class="b s r" onclick="delW(${w.id})">Delete</button></div></div>`).join('');
  const qi=$('#q');qi.oninput=()=>{q=qi.value;renderW();const n=$('#q');n.focus();n.setSelectionRange(q.length,q.length);};
}
function upd(id,f,v){const w=D().watches.find(x=>x.id===id);w[f]=Math.max(0,+v||0);DB.save();}
function delW(id){const w=D().watches.find(x=>x.id===id);
  if(confirm(`Delete ${w.brand} ${w.model}?`)){D().watches=D().watches.filter(x=>x.id!==id);DB.save();renderW();}}
function editW(id){
  const w=id?D().watches.find(x=>x.id===id):{brand:'',model:'',price:100,stock:100,gender:'men',metal:'silver',tags:[],img:'',desc:''};
  $('#wf').innerHTML=`<h2>${id?'Edit':'Add'} watch</h2>
   <div class="two"><label>Brand<input name="brand" required value="${esc(w.brand)}"></label><label>Model<input name="model" required value="${esc(w.model)}"></label>
   <label>Price ₼<input name="price" type="number" min="0" step="any" required value="${w.price}"></label><label>Stock<input name="stock" type="number" min="0" required value="${w.stock}"></label>
   <label>For<select name="gender"><option value="men" ${w.gender==='men'?'selected':''}>Men</option><option value="women" ${w.gender==='women'?'selected':''}>Women</option></select></label>
   <label>Color<select name="metal">${['gold','silver','black'].map(m=>`<option value="${m}" ${w.metal===m?'selected':''}>${m}</option>`).join('')}</select></label></div>
   <label>Image URL (or put the file in images/watches/ as watch-ID.jpg)<input name="img" value="${w.img&&!w.img.startsWith('data:')?esc(w.img):''}" placeholder="https://..."></label>
   <label>Or upload a photo<input type="file" id="file" accept="image/*"></label>
   <label>Description (optional, shown in every language)<textarea name="desc" rows="2">${esc(w.desc)}</textarea></label>
   <div class="two"><label>Case size<input name="caseSize" value="${esc(w.caseSize)}" placeholder="40 mm"></label><label>Strap<input name="strap" value="${esc(w.strap)}" placeholder="Leather"></label><label>Water resistance<input name="water" value="${esc(w.water)}" placeholder="50 m"></label></div>
   <div class="chk"><b>Albums</b><br>${D().albums.map(a=>`<label><input type="checkbox" name="tag" value="${esc(a.key)}" ${(w.tags||[]).includes(a.key)?'checked':''}> ${esc(a.name.en)}</label>`).join('')}</div>
   <p class="acts"><button class="b" value="save">Save</button><button class="b s r" value="cancel" formnovalidate>Cancel</button></p>`;
  let photo=w.img&&w.img.startsWith('data:')?w.img:'';
  $('#file').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{
    const s=Math.min(1,500/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;
    c.getContext('2d').drawImage(im,0,0,c.width,c.height);photo=c.toDataURL('image/jpeg',.8);};im.src=r.result;};r.readAsDataURL(f);};
  $('#wf').onsubmit=e=>{
    if(e.submitter&&e.submitter.value!=='save')return;
    const f=new FormData($('#wf')),o=id?w:{id:Math.max(0,...D().watches.map(x=>x.id))+1};
    Object.assign(o,{brand:f.get('brand').trim(),model:f.get('model').trim(),price:+f.get('price'),stock:+f.get('stock'),gender:f.get('gender'),metal:f.get('metal'),
      img:f.get('img').trim()||photo,desc:f.get('desc').trim(),caseSize:f.get('caseSize').trim(),strap:f.get('strap').trim(),water:f.get('water').trim(),tags:f.getAll('tag')});
    if(!id)D().watches.push(o);DB.save();renderW();renderA();};
  $('#dlg').showModal();
}
function renderA(){
  $('#tab-a').innerHTML=`<form class="box" style="max-width:none" onsubmit="addA(event)"><b>New album</b><div class="two">
   <label>Name (English)<input id="a_en" required></label><label>Name (Azərbaycanca)<input id="a_az" required></label>
   <label>Name (اردو)<input id="a_ur" required dir="rtl"></label></div><button class="b">Add album</button></form>`+
   D().albums.map(a=>`<div class="row" style="grid-template-columns:1fr auto"><div><b>${esc(a.name.en)}</b> · ${esc(a.name.az)} · ${esc(a.name.ur)}
   <small>${D().watches.filter(w=>(w.tags||[]).includes(a.key)).length} watches · key: ${esc(a.key)}</small></div><button class="b s r" onclick="delA('${esc(a.key)}')">Delete</button></div>`).join('');
}
function addA(e){e.preventDefault();let key=$('#a_en').value.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-')||'album';
  while(D().albums.some(a=>a.key===key))key+='-2';
  D().albums.push({key,name:{en:$('#a_en').value.trim(),az:$('#a_az').value.trim(),ur:$('#a_ur').value.trim()}});DB.save();render();}
function delA(k){if(!confirm('Delete this album? The watches stay on the website.'))return;
  D().albums=D().albums.filter(a=>a.key!==k);D().watches.forEach(w=>w.tags=(w.tags||[]).filter(x=>x!==k));DB.save();render();}
function renderD(){
  $('#tab-d').innerHTML=`<div class="box" style="max-width:none"><h2>Home page video</h2><label>YouTube link<input id="yt" value="${esc(D().settings.youtube||'')}" placeholder="https://www.youtube.com/watch?v=..."></label><p><button class="b" onclick="saveYt()">Save video</button></p></div><br><div class="box" style="max-width:none"><h2>Publish your changes</h2>
   <p>Changes are saved in <b>this browser</b>. To show them to all visitors: click <b>Download store.json</b>, then upload that file to the main folder of your GitHub repository (replace the old one).</p>
   <p><button class="b g" onclick="exp()">Download store.json</button></p>
   <label>Import a store.json file<input type="file" accept=".json" onchange="imp(this.files[0])"></label>
   <p><button class="b s r" onclick="reset()">Reset to the 30 sample watches</button></p><p id="msg" class="ok"></p></div>`;
}
function exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(D(),null,1)],{type:'application/json'}));a.download='store.json';a.click();}
function imp(f){if(!f)return;f.text().then(s=>{try{const d=JSON.parse(s);if(!d.albums||!d.watches)throw 0;DB.data=d;DB.save();render();$('#msg').textContent='Imported.';}catch(e){alert('This is not a valid store.json file.');}});}
function reset(){if(confirm('Remove all your changes and go back to the sample data?')){DB.data={albums:SEED_ALBUMS,watches:makeWatches(),settings:{}};DB.save();render();}}

function saveYt(){D().settings.youtube=$('#yt').value.trim();DB.save();alert('Saved.');}
