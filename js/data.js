/* Data + storage. Order of loading: browser storage (admin edits) -> store.json -> built-in seed */
const ROOT = new URL('../', document.currentScript.src).href;
const SEED_ALBUMS = [
  {key:'men',name:{en:'Men',az:'Kişi',ur:'مردانہ'}},
  {key:'women',name:{en:'Women',az:'Qadın',ur:'زنانہ'}},
  {key:'gold',name:{en:'Gold',az:'Qızılı',ur:'سنہری'}},
  {key:'silver',name:{en:'Silver',az:'Gümüşü',ur:'چاندی'}},
  {key:'luxury',name:{en:'Luxury',az:'Lüks',ur:'پرتعیش'}},
  {key:'budget',name:{en:'Budget',az:'Büdcəyə uyğun',ur:'کم قیمت'}}
];
// [brand, model, gender, metal, price in AZN] - sample prices, change them in the admin panel
const SEED = [
 ['Casio','F-91W','men','black',45],['Casio','Vintage A168','men','gold',95],['Casio','Edgy LTP-1130','women','silver',70],
 ['Casio','Collection MTP','men','silver',110],['Orient','Bambino','men','silver',420],['Orient','Star Classic','men','gold',650],
 ['Orient','Contemporary','women','silver',280],['Seiko','5 Sports','men','black',480],['Seiko','Presage','men','silver',890],
 ['Seiko','Lukia','women','gold',720],['Citizen','Eco-Drive','men','black',560],['Citizen','Elegance','women','silver',430],
 ['Citizen','Royal Gold','men','gold',980],['Tissot','PRX','men','silver',1250],['Tissot','Lovely','women','gold',840],
 ['Tissot','Gentleman','men','black',1480],['Fossil','Grant','men','black',260],['Fossil','Carlie','women','gold',230],
 ['Fossil','Neutra','men','silver',240],['Fossil','Jacqueline','women','silver',210],['Daniel Wellington','Classic','men','black',190],
 ['Daniel Wellington','Petite','women','gold',175],['Daniel Wellington','Quadro','women','silver',165],['Skagen','Holst','men','silver',320],
 ['Skagen','Signatur','women','gold',290],['Swatch','Irony','men','silver',140],['Swatch','Skin','women','silver',130],
 ['Rolex Style','Datejust Gold','men','gold',1800],['Rolex Style','Lady Gold','women','gold',1650],['Rolex Style','Oyster Silver','men','silver',1500]
];
function makeWatches(){
  return SEED.map((s,i)=>{
    const tags=[s[2]]; if(s[3]!=='black')tags.push(s[3]);
    if(s[4]>=600)tags.push('luxury'); if(s[4]<=150)tags.push('budget');
    return {id:i+1,brand:s[0],model:s[1],gender:s[2],metal:s[3],price:s[4],stock:100,tags,img:'',desc:''};
  });
}
function watchImg(w){
  if(w.img) return w.img;
  const m={gold:['#c9a24c','#f1e0a8'],silver:['#9aa3ae','#eef1f5'],black:['#1b2027','#4b535e']}[w.metal]||['#9aa3ae','#eef1f5'];
  const strap=w.gender==='women'?'#d9c3b0':'#232830', ink=w.metal==='black'?'#f1f1f1':'#1b2027';
  let ticks='';for(let i=0;i<12;i++){const a=i*Math.PI/6,r1=i%3?44:40,r2=48;
    ticks+=`<line x1="${100+r1*Math.sin(a)}" y1="${100-r1*Math.cos(a)}" x2="${100+r2*Math.sin(a)}" y2="${100-r2*Math.cos(a)}" stroke="${ink}" stroke-width="${i%3?1.5:3}"/>`;}
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#e4e9ee"/><rect x="74" width="52" height="200" fill="${strap}"/><circle cx="100" cy="100" r="64" fill="${m[0]}"/><circle cx="100" cy="100" r="54" fill="${m[1]}"/>${ticks}<line x1="100" y1="100" x2="100" y2="68" stroke="${ink}" stroke-width="4" stroke-linecap="round"/><line x1="100" y1="100" x2="122" y2="108" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="100" r="4" fill="${m[0]}"/></svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
const DB = {
  data:null,
  async load(){await this._l();this.data.settings=this.data.settings||{};},
  async _l(){
    try{const s=localStorage.getItem('tws_data'); if(s){this.data=JSON.parse(s);return;}}catch(e){}
    try{const r=await fetch(ROOT+'store.json',{cache:'no-store'}); if(r.ok){this.data=await r.json();return;}}catch(e){}
    this.data={albums:SEED_ALBUMS,watches:makeWatches()};
  },
  save(){localStorage.setItem('tws_data',JSON.stringify(this.data));}
};

const photo=w=>w.img||ROOT+'images/watches/watch-'+w.id+'.jpg';
const imgTag=(w,alt='')=>`<img src="${String(photo(w)).replace(/"/g,'&quot;')}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src=this.dataset.f" data-f="${watchImg({...w,img:''})}">`;
