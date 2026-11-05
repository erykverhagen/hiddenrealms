export class Camera {
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
