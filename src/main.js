import './style.css';
import {Camera} from './camera.js';
import {getLevel,levelPlan} from './levels.js';

const $=id=>document.getElementById(id);
const level=getLevel(1);
const storageKey=`hidden-realms-level-${level.id}-found`;
let found=new Set();
try{found=new Set(JSON.parse(localStorage.getItem(storageKey)||'[]'))}catch{}
const camera=new Camera($('viewport'),$('world'),level.width,level.height);
let toastTimeout;
function toast(s){const e=$('toast');e.textContent=s;e.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>e.classList.remove('visible'),1900)}
function render(){let container=$('treasure-list');container.replaceChildren();level.objects.forEach((item,i)=>{let card=document.createElement('button');card.type='button';card.className='treasure-card'+(found.has(i)?' completed':'');card.setAttribute('aria-label',item.name+(found.has(i)?', found':''));card.innerHTML=`<span class="treasure-icon"></span><span class="treasure-name"></span><span class="treasure-check">✦</span>`;card.querySelector('.treasure-icon').textContent=item.icon;card.querySelector('.treasure-name').textContent=item.name;card.addEventListener('click',()=>{if(found.has(i))return;toast('Look for '+item.name+' in the picture')});container.append(card)});$('found-count').textContent=`${found.size} / ${level.objects.length}`;$('progress-label').textContent=`${found.size} of ${level.objects.length}`}
function sparkle(x,y){const pos=camera.toScreen(x,y),layer=$('fx-layer');const glow=document.createElement('div');glow.className='magic-flash';glow.style.left=pos.x+'px';glow.style.top=pos.y+'px';layer.append(glow);setTimeout(()=>glow.remove(),950);for(let i=0;i<46;i++){const a=i*2.399+Math.random()*.55,d=28+Math.random()*110,star=document.createElement('i');star.className='fairy-particle';star.style.left=pos.x+'px';star.style.top=pos.y+'px';star.style.setProperty('--dx',Math.cos(a)*d+'px');star.style.setProperty('--dy',(Math.sin(a)*d-25)+'px');star.style.setProperty('--t',(650+Math.random()*800)+'ms');star.style.width=star.style.height=(2+Math.random()*5)+'px';layer.append(star);setTimeout(()=>star.remove(),1550)}}
function onTap(p){let closest=-1,dist=Infinity;level.objects.forEach((o,i)=>{const d=Math.hypot(o.x-p.x,o.y-p.y);if(!found.has(i)&&d<o.radius&&d<dist){dist=d;closest=i}});if(closest<0)return;const obj=level.objects[closest];found.add(closest);try{localStorage.setItem(storageKey,JSON.stringify([...found]))}catch{}sparkle(obj.x,obj.y);render();toast(`✦ ${obj.name} discovered`);if(found.size===level.objects.length)setTimeout(()=>modal('The Village Remembers','All ten treasures discovered! Level 1 is complete. Additional illustrated worlds are in development.','Keep exploring',closeModal),950)}
camera.onTap=onTap;
$('zoom-in').onclick=()=>camera.zoom(1.45);$('zoom-out').onclick=()=>camera.zoom(1/1.45);$('fit').onclick=()=>camera.fit();
$('hint').onclick=()=>{const obj=level.objects.find((o,i)=>!found.has(i));if(!obj){toast('Every treasure discovered!');return}camera.centerOn(obj.x,obj.y,Math.max(.9,camera.scale));toast(`Look carefully near the center for the ${obj.name}`)};
function modal(title,body,action,onClick){$('modal-title').textContent=title;$('modal-body').textContent=body;$('modal-actions').replaceChildren();let b=document.createElement('button');b.className='primary-button';b.textContent=action;b.onclick=onClick;$('modal-actions').append(b);$('modal').hidden=false}
function closeModal(){$('modal').hidden=true}
$('menu').onclick=()=>modal('100 Levels · Four Seasons',`The full journey is planned: ${levelPlan.length} levels, 25 per season, ranging from 10 to 55 objects per level. The illustrated playable build currently includes Blossom Village, Level 1.`,`Return to Blossom Village`,closeModal);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const scene=$('scene');scene.addEventListener('error',()=>modal('Artwork unavailable','The illustration did not load. Check that the assets folder was uploaded with the app.','Close',closeModal));
render();camera.fit();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js').catch(()=>{}));
