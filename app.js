(()=>{'use strict';
const $=id=>document.getElementById(id);
const W=1672,H=678,sceneURL='./assets/blossom-village.webp';
const objects=[
 {id:'owl',name:'Owl',awakened:'Moonwatcher',icon:'🦉',x:313,y:62,r:37,box:68},
 {id:'sword',name:'Ancient sword',awakened:'Starlight Blade',icon:'⚔️',x:116,y:422,r:36,box:65},
 {id:'mushroom',name:'Red mushroom',awakened:'Embercap',icon:'🍄',x:160,y:491,r:37,box:60},
 {id:'lute',name:'Lute',awakened:'Songweaver',icon:'🎻',x:452,y:451,r:43,box:67},
 {id:'cat',name:'Village cat',awakened:'Fierce Feline',icon:'🐈',x:721,y:432,r:40,box:85,beast:true},
 {id:'dog',name:'Sleeping dog',awakened:'Mystical Hound',icon:'🐕',x:531,y:553,r:63,box:116,beast:true},
 {id:'shield',name:'Golden shield',awakened:'Aegis of Dawn',icon:'🛡️',x:772,y:535,r:40,box:74},
 {id:'fox',name:'Fox',awakened:'Spirit Fox',icon:'🦊',x:1451,y:462,r:43,box:77,beast:true},
 {id:'deer',name:'Forest deer',awakened:'Stag of Stars',icon:'🦌',x:1563,y:332,r:42,box:79,beast:true},
 {id:'lantern',name:'Lantern',awakened:'Everflame',icon:'🏮',x:1596,y:562,r:43,box:70}
];
const storeKey='hidden-realms-deluxe-1',v=$('viewport'),world=$('world'),effectLayer=$('effects'),magicLayer=$('transform-layer');
let found=new Set();try{found=new Set(JSON.parse(localStorage.getItem(storeKey)||'[]'))}catch(e){}
let pointers=new Map(),gesture=null,moved=false,pointerMoved=0,tapStart=null,lastTap=null,pendingTapTimer=null,lensEnabled=false,animation=0,noticeTimer=0;
const camera={s:1,x:0,y:0,vx:0,vy:0,lastMove:0,momentum:0};
const viewSize=()=>({w:v.clientWidth,h:v.clientHeight});
const minZoom=()=>{const {w,h}=viewSize();return Math.max(w/W,h/H)};
const maxZoom=()=>Math.max(minZoom(),Math.min(2.3,minZoom()*4));
function paint(){world.style.transform=`translate3d(${camera.x}px,${camera.y}px,0) scale(${camera.s})`}
function clamp(){const {w,h}=viewSize();camera.s=Math.min(maxZoom(),Math.max(minZoom(),camera.s));let sw=W*camera.s,sh=H*camera.s;camera.x=sw<=w?(w-sw)/2:Math.max(w-sw,Math.min(0,camera.x));camera.y=sh<=h?(h-sh)/2:Math.max(h-sh,Math.min(0,camera.y));paint()}
function fit(){stopMotion();camera.s=minZoom();camera.x=(v.clientWidth-W*camera.s)/2;camera.y=(v.clientHeight-H*camera.s)/2;clamp()}
function stopMotion(){cancelAnimationFrame(camera.momentum);cancelAnimationFrame(animation);camera.vx=camera.vy=0}
function worldPoint(cx,cy){let b=v.getBoundingClientRect();return{x:(cx-b.left-camera.x)/camera.s,y:(cy-b.top-camera.y)/camera.s}}
function screenPoint(o){return{x:camera.x+o.x*camera.s,y:camera.y+o.y*camera.s}}
function setZoom(ns,cx=v.clientWidth/2,cy=v.clientHeight/2){let old=camera.s;ns=Math.min(maxZoom(),Math.max(minZoom(),ns));camera.s=ns;camera.x=cx-(cx-camera.x)*ns/old;camera.y=cy-(cy-camera.y)*ns/old;clamp()}
function animateTo(ns,nx,ny,duration=430){stopMotion();const init={s:camera.s,x:camera.x,y:camera.y},start=performance.now();function step(now){let t=Math.min(1,(now-start)/duration),e=1-Math.pow(1-t,4);camera.s=init.s+(ns-init.s)*e;camera.x=init.x+(nx-init.x)*e;camera.y=init.y+(ny-init.y)*e;clamp();if(t<1)animation=requestAnimationFrame(step)}animation=requestAnimationFrame(step)}
function zoomAnimated(f,cx=v.clientWidth/2,cy=v.clientHeight/2){const ns=Math.max(minZoom(),Math.min(maxZoom(),camera.s*f)),ratio=ns/camera.s;animateTo(ns,cx-(cx-camera.x)*ratio,cy-(cy-camera.y)*ratio)}
function glideTo(o){let ns=Math.max(camera.s,Math.min(maxZoom(),minZoom()*1.8)),c=viewSize();animateTo(ns,c.w/2-o.x*ns,c.h/2-o.y*ns,650)}
function inertia(){cancelAnimationFrame(camera.momentum);let last=performance.now();function frame(now){let dt=Math.min(2.2,(now-last)/16.7);last=now;camera.vx*=Math.pow(.88,dt);camera.vy*=Math.pow(.88,dt);if(Math.hypot(camera.vx,camera.vy)<.14)return;let prevX=camera.x,prevY=camera.y;camera.x+=camera.vx*dt;camera.y+=camera.vy*dt;clamp();if(camera.x===prevX)camera.vx=0;if(camera.y===prevY)camera.vy=0;if(Math.hypot(camera.vx,camera.vy)>.14)camera.momentum=requestAnimationFrame(frame)}camera.momentum=requestAnimationFrame(frame)}
function notice(txt){const n=$('notice');n.textContent=txt;n.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>n.classList.remove('show'),2100)}
function renderTreasures(){let container=$('treasure-track');container.replaceChildren();for(let o of objects){let done=found.has(o.id),b=document.createElement('button');b.className='treasure'+(done?' discovered':'');b.type='button';b.title=(done?o.awakened:o.name);b.setAttribute('aria-label',done?o.name+' found, transformed to '+o.awakened:'Find '+o.name);let sym=document.createElement('span');sym.className='glyph';sym.textContent=o.icon;let label=document.createElement('span');label.className='name';label.textContent=done?o.awakened:o.name;let seal=document.createElement('span');seal.className='seal';seal.textContent='✦';b.append(sym,label,seal);if(done){let a=document.createElement('span');a.className='awakened';a.textContent='AWAKENED';b.append(a)}b.addEventListener('click',()=>{if(done){glideTo(o);notice(o.awakened+' is watching over the village')}else notice('Search the illustration for '+o.name)});container.append(b)}$('found-count').textContent=found.size;$('found-label').textContent=found.size+' of '+objects.length+' discovered';$('progress-fill').style.width=100*found.size/objects.length+'%'}
function spawnMagic(o,quiet=false){if(!quiet){let p=screenPoint(o);let ring=document.createElement('div');ring.className='reveal-ring';ring.style.cssText=`left:${p.x}px;top:${p.y}px;width:90px;height:90px`;effectLayer.append(ring);setTimeout(()=>ring.remove(),1100);for(let i=0;i<72;i++){let star=document.createElement('i'),a=Math.random()*Math.PI*2,d=35+Math.random()*125;star.className='particle'+(i%4===0?' pale':'');star.style.cssText=`left:${p.x}px;top:${p.y}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-35}px;--duration:${650+Math.random()*1100}ms`;effectLayer.append(star);setTimeout(()=>star.remove(),1850)}}
 if(magicLayer.querySelector('[data-object="'+o.id+'"]'))return;
 // A magical, enhanced window of the actual discovered animal/object is left in the world.
 const box=o.box*1.18,cut=document.createElement('div');cut.className='magic-sprite'+(o.beast?' beast':'');cut.dataset.object=o.id;cut.style.cssText=`left:${o.x}px;top:${o.y}px;width:${box}px;height:${box}px`;
 const crop=document.createElement('div');crop.className='cutout';crop.style.backgroundImage=`url('${sceneURL}')`;crop.style.backgroundSize=`${W}px ${H}px`;crop.style.backgroundPosition=`${box/2-o.x}px ${box/2-o.y}px`;
 const aura=document.createElement('div');aura.className='aura';const rune=document.createElement('div');rune.className='rune';rune.textContent=o.beast?'ᛟ':'✧';cut.append(crop,aura,rune);if(o.beast){let eyes=document.createElement('div');eyes.className='eyes';cut.append(eyes)}magicLayer.append(cut);
}
function findAt(cx,cy){let p=worldPoint(cx,cy);let closest=null,best=Infinity;for(let o of objects){if(found.has(o.id))continue;let d=Math.hypot(p.x-o.x,p.y-o.y);if(d<o.r&&d<best){best=d;closest=o}}if(!closest)return;found.add(closest.id);try{localStorage.setItem(storeKey,JSON.stringify([...found]))}catch(e){}spawnMagic(closest);renderTreasures();notice('✦ '+closest.name+' becomes '+closest.awakened);if(found.size===objects.length)setTimeout(()=>openModal('The Village Awakens','Every secret of Blossom Village has revealed its magic. You have completed the first illustrated chapter.'),1700)}
function setLens(on,cx,cy){
 lensEnabled=on; $('lens-toggle').setAttribute('aria-pressed',String(on));v.classList.toggle('lens-on',on);
 if(on){let b=v.getBoundingClientRect();refreshLoupe(cx??b.left+b.width/2,cy??b.top+b.height/2);notice('Magnifier on · tap once to close')}
 else {$('loupe').classList.remove('visible');notice('Magnifier off')}
}
function refreshLoupe(cx,cy){
 const loupe=$('loupe'),glass=$('loupe-glass');if(!lensEnabled){loupe.classList.remove('visible');return}
 const b=v.getBoundingClientRect(),sx=cx-b.left,sy=cy-b.top;
 if(sx<0||sy<0||sx>b.width||sy>b.height){loupe.classList.remove('visible');return}
 const p=worldPoint(cx,cy),mag=Math.max(camera.s*2.25,.95),diam=148;
 // The lens samples the same source pixels as the world at an enlarged scale.
 glass.style.backgroundImage=`url('${sceneURL}')`;
 glass.style.backgroundSize=`${W*mag}px ${H*mag}px`;
 glass.style.backgroundPosition=`${diam/2-p.x*mag}px ${diam/2-p.y*mag}px`;
 loupe.style.left=sx+'px';loupe.style.top=sy+'px';loupe.classList.add('visible');
}
function pointerdown(e){
 if(e.target.closest('button'))return;
 stopMotion();v.setPointerCapture(e.pointerId);
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,ox:e.clientX,oy:e.clientY});
 if(pointers.size===1){tapStart={x:e.clientX,y:e.clientY,time:performance.now(),multi:false};moved=false;pointerMoved=0;camera.lastMove=performance.now();if(lensEnabled)refreshLoupe(e.clientX,e.clientY)}
 if(pointers.size===2){
  clearTimeout(pendingTapTimer);pendingTapTimer=null;lastTap=null;
  tapStart.multi=true;
  let pts=[...pointers.values()],b=v.getBoundingClientRect(),cx=(pts[0].x+pts[1].x)/2-b.left,cy=(pts[0].y+pts[1].y)/2-b.top;
  gesture={distance:Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y),scale:camera.s,wx:(cx-camera.x)/camera.s,wy:(cy-camera.y)/camera.s};moved=true;
 }
}
function pointermove(e){
 let p=pointers.get(e.pointerId);
 if(!p){if(e.pointerType==='mouse'&&lensEnabled)refreshLoupe(e.clientX,e.clientY);return}
 let dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
 pointerMoved=Math.max(pointerMoved,Math.hypot(p.x-p.ox,p.y-p.oy));if(pointerMoved>8)moved=true;
 if(pointers.size===2&&gesture){
  let pts=[...pointers.values()],b=v.getBoundingClientRect(),cx=(pts[0].x+pts[1].x)/2-b.left,cy=(pts[0].y+pts[1].y)/2-b.top,s=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y)/Math.max(1,gesture.distance);
  camera.s=Math.min(maxZoom(),Math.max(minZoom(),gesture.scale*s));camera.x=cx-gesture.wx*camera.s;camera.y=cy-gesture.wy*camera.s;clamp();
 }else if(lensEnabled){refreshLoupe(e.clientX,e.clientY)}
 else if(pointers.size===1){
  camera.x+=dx;camera.y+=dy;clamp();let now=performance.now(),dt=Math.max(8,now-camera.lastMove);
  camera.vx=.5*camera.vx+.5*dx*16.7/dt;camera.vy=.5*camera.vy+.5*dy*16.7/dt;camera.lastMove=now;
 }
}
function pointerend(e){
 let p=pointers.get(e.pointerId);if(!p)return;
 const single=pointers.size===1,valid=single&&!moved&&!tapStart?.multi;
 pointers.delete(e.pointerId);if(pointers.size<2)gesture=null;
 if(!pointers.size){
  if(valid&&e.type==='pointerup'){
   const now=performance.now();
   if(lensEnabled){
    // One tap leaves loupe mode. It never accidentally collects an object.
    clearTimeout(pendingTapTimer);pendingTapTimer=null;lastTap=null;setLens(false);
   }else if(lastTap&&now-lastTap.time<340&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<36){
    // Double tap turns on the loupe at precisely the tapped location.
    clearTimeout(pendingTapTimer);pendingTapTimer=null;lastTap=null;setLens(true,e.clientX,e.clientY);
   }else{
    // Delay a single discovery tap just enough to distinguish a double tap.
    lastTap={time:now,x:e.clientX,y:e.clientY};
    clearTimeout(pendingTapTimer);
    const cx=e.clientX,cy=e.clientY;
    pendingTapTimer=setTimeout(()=>{lastTap=null;pendingTapTimer=null;if(!lensEnabled)findAt(cx,cy)},345);
   }
  }else if(moved&&single&&!lensEnabled){clearTimeout(pendingTapTimer);lastTap=null;inertia()}
  tapStart=null;moved=false;
 }
}
function openModal(title,body){$('modal-title').textContent=title;$('modal-body').textContent=body;$('modal').hidden=false}
$('modal-close').onclick=()=>$('modal').hidden=true;
$('menu').onclick=()=>openModal('A world in four seasons','Blossom Village Deluxe is the fully interactive first level. The complete adventure is planned as 100 levels, with 25 each for spring, summer, autumn and winter, and more discoveries every ten levels.');
$('hint').onclick=()=>{let o=objects.find(o=>!found.has(o.id));if(!o){notice('You found every treasure');return}glideTo(o);notice('A whisper draws you toward the '+o.name)};
$('zoom-in').onclick=()=>zoomAnimated(1.45);$('zoom-out').onclick=()=>zoomAnimated(1/1.45);$('reset').onclick=()=>{let s=minZoom();animateTo(s,(v.clientWidth-W*s)/2,(v.clientHeight-H*s)/2)};
$('lens-toggle').onclick=()=>setLens(!lensEnabled);
v.addEventListener('pointerdown',pointerdown);v.addEventListener('pointermove',pointermove);v.addEventListener('pointerup',pointerend);v.addEventListener('pointercancel',pointerend);v.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!pointers.size&&lensEnabled)$('loupe').classList.remove('visible')});
v.addEventListener('wheel',e=>{e.preventDefault();let b=v.getBoundingClientRect();zoomAnimated(e.deltaY<0?1.18:1/1.18,e.clientX-b.left,e.clientY-b.top)},{passive:false});
v.addEventListener('dblclick',e=>e.preventDefault());
window.addEventListener('resize',()=>{let p={x:(v.clientWidth/2-camera.x)/camera.s,y:(v.clientHeight/2-camera.y)/camera.s};camera.s=Math.max(minZoom(),Math.min(maxZoom(),camera.s));camera.x=v.clientWidth/2-p.x*camera.s;camera.y=v.clientHeight/2-p.y*camera.s;clamp()});
for(let o of objects)if(found.has(o.id))spawnMagic(o,true);renderTreasures();
$('scene').addEventListener('load',fit);$('scene').addEventListener('error',()=>openModal('The illustration could not load','Check that the assets folder sits next to index.html when hosting the app.'));
fit();if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();
