class Camera {
 constructor(view,world,w,h){this.view=view;this.world=world;this.w=w;this.h=h;this.scale=1;this.x=0;this.y=0;this.pointerMap=new Map();this.gesture=null;this.start=null;this.onTap=null;this.onChange=null;this.attach();this.fit();}
 get size(){return {w:this.view.clientWidth,h:this.view.clientHeight}}
 paint(){this.world.style.transform=`translate3d(${this.x}px,${this.y}px,0) scale(${this.scale})`;this.onChange?.()}
 clamp(){let {w,h}=this.size;let min=Math.min(w/this.w,h/this.h)*.65;this.scale=Math.min(5,Math.max(min,this.scale));this.x=this.scale*this.w<=w?(w-this.scale*this.w)/2:Math.max(w-this.scale*this.w,Math.min(0,this.x));this.y=this.scale*this.h<=h?(h-this.scale*this.h)/2:Math.max(h-this.scale*this.h,Math.min(0,this.y));this.paint()}
 fit(){let {w,h}=this.size;if(!w||!h)return;this.scale=Math.min(w/this.w,h/this.h);this.x=(w-this.scale*this.w)/2;this.y=(h-this.scale*this.h)/2;this.clamp()}
 zoom(f,cx=this.size.w/2,cy=this.size.h/2){let old=this.scale;this.scale*=f;let ratio=this.scale/old;this.x=cx-(cx-this.x)*ratio;this.y=cy-(cy-this.y)*ratio;this.clamp()}
 centerOn(px,py,minScale=.9){let {w,h}=this.size;this.scale=Math.max(this.scale,minScale);this.x=w/2-px*this.scale;this.y=h/2-py*this.scale;this.clamp()}
 toWorld(clientX,clientY){const r=this.view.getBoundingClientRect();return {x:(clientX-r.left-this.x)/this.scale,y:(clientY-r.top-this.y)/this.scale}}
 toScreen(x,y){return {x:this.x+x*this.scale,y:this.y+y*this.scale}}
 attach(){const v=this.view;
 v.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;v.setPointerCapture(e.pointerId);this.pointerMap.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY});if(this.pointerMap.size===1)this.start={x:e.clientX,y:e.clientY,moved:false,multitouch:false};if(this.pointerMap.size===2){const a=[...this.pointerMap.values()],r=v.getBoundingClientRect(),cx=(a[0].x+a[1].x)/2-r.left,cy=(a[0].y+a[1].y)/2-r.top;this.start.multitouch=true;this.gesture={distance:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),scale:this.scale,wx:(cx-this.x)/this.scale,wy:(cy-this.y)/this.scale}}});
 v.addEventListener('pointermove',e=>{const p=this.pointerMap.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;if(this.start&&Math.hypot(e.clientX-p.sx,e.clientY-p.sy)>9)this.start.moved=true;if(this.pointerMap.size===2&&this.gesture){const a=[...this.pointerMap.values()],r=v.getBoundingClientRect(),cx=(a[0].x+a[1].x)/2-r.left,cy=(a[0].y+a[1].y)/2-r.top;this.scale=this.gesture.scale*Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)/Math.max(1,this.gesture.distance);this.x=cx-this.gesture.wx*this.scale;this.y=cy-this.gesture.wy*this.scale}else if(this.pointerMap.size===1){this.x+=dx;this.y+=dy}this.clamp()});
 const end=(e,cancel=false)=>{const p=this.pointerMap.get(e.pointerId);if(!p)return;const single=this.pointerMap.size===1;const moved=Math.hypot(e.clientX-p.sx,e.clientY-p.sy)>10;const doTap=!cancel&&single&&!moved&&!this.start?.moved&&!this.start?.multitouch;this.pointerMap.delete(e.pointerId);if(this.pointerMap.size<2)this.gesture=null;if(doTap)this.onTap?.(this.toWorld(e.clientX,e.clientY));if(this.pointerMap.size===0)this.start=null};
 v.addEventListener('pointerup',e=>end(e));v.addEventListener('pointercancel',e=>end(e,true));v.addEventListener('wheel',e=>{e.preventDefault();const r=v.getBoundingClientRect();this.zoom(e.deltaY<0?1.18:1/1.18,e.clientX-r.left,e.clientY-r.top)},{passive:false});
 v.addEventListener('dblclick',e=>{const r=v.getBoundingClientRect();this.zoom(1.5,e.clientX-r.left,e.clientY-r.top)});
 this.observer=new ResizeObserver(()=>this.clamp());this.observer.observe(v)
 }
}

// Object coordinates are measured against the 1672×685 illustration, not screen pixels.
// Each additional illustrated level can be registered here as an independent data module.
const levels = [
  {id:1,title:'Blossom Village',season:'Spring',chapter:1,image:'assets/blossom-village.jpg',width:1672,height:685,
   objects:[
    {name:'Owl',icon:'🦉',x:315,y:60,radius:38},
    {name:'Sword',icon:'⚔️',x:114,y:422,radius:36},
    {name:'Red mushroom',icon:'🍄',x:169,y:491,radius:36},
    {name:'Lute',icon:'🎻',x:454,y:453,radius:40},
    {name:'Cat',icon:'🐈',x:722,y:427,radius:39},
    {name:'Sleeping dog',icon:'🐕',x:533,y:550,radius:42},
    {name:'Golden shield',icon:'🛡️',x:772,y:534,radius:40},
    {name:'Fox',icon:'🦊',x:1453,y:460,radius:40},
    {name:'Deer',icon:'🦌',x:1562,y:326,radius:40},
    {name:'Lantern',icon:'🏮',x:1595,y:564,radius:38}
   ]}
];
const levelPlan = Array.from({length:100},(_,i)=>({level:i+1,season:['Spring','Summer','Autumn','Winter'][Math.floor(i/25)],objects:10+5*Math.floor(i/10),seasonIntensity:1-Math.abs(i%25-12)/12}));
const getLevel = (n)=>levels.find(l=>l.id===n);


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
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
