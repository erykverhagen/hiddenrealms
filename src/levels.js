// Object coordinates are measured against the 1672×685 illustration, not screen pixels.
// Each additional illustrated level can be registered here as an independent data module.
export const levels = [
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
export const levelPlan = Array.from({length:100},(_,i)=>({level:i+1,season:['Spring','Summer','Autumn','Winter'][Math.floor(i/25)],objects:10+5*Math.floor(i/10),seasonIntensity:1-Math.abs(i%25-12)/12}));
export const getLevel = (n)=>levels.find(l=>l.id===n);
