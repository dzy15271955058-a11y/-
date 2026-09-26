import {T,C,v} from './kit.js';

// Position-based variation never changes the random stream used by the existing flowers.
const n=x=>{const a=Math.sin(x*127.1+311.7)*43758.5453;return a-Math.floor(a);};
function geometry(pos,ix,uv){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));if(uv)g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();return g;}

export function sculptPalm(K,parent,x,y,z,s=1){
 const seed=x*3.17+z*5.31,pg=K.group(parent,'舒展羽叶椰树',x,y,z);pg.scale.setScalar(s);
 const h=5.5+n(seed)*1.25,bend=(n(seed+1)-.5)*1.8,lean=(n(seed+2)-.5)*.7;
 const trunk=new T.CatmullRomCurve3([v(),v(bend*.07,h*.28,lean*.1),v(bend*.44,h*.67,lean*.5),v(bend,h,lean)]);
 const points=[],idx=[],uv=[];
 for(let j=0;j<=28;j++){const t=j/28,p=trunk.getPoint(t),r=.225*(1-t)+.12*t;for(let i=0;i<=12;i++){const a=i*Math.PI/6;points.push(p.x+Math.cos(a)*r,p.y,p.z+Math.sin(a)*r);uv.push(i/12,t);if(j<28&&i<12){let k=j*13+i;idx.push(k,k+13,k+1,k+1,k+13,k+14);}}}
 K.mesh(pg,geometry(points,idx,uv),K.mat('#aa896c',{roughness:.9}));
 for(let i=2;i<21;i++){const t=i/22,p=trunk.getPoint(t),ring=K.torus(pg,p.x,p.y,p.z,.223*(1-t)+.123*t,.012,'#d0af8b',true);ring.quaternion.setFromUnitVectors(v(0,0,1),trunk.getTangent(t));}
 const crown=K.group(pg,'随海风舒展的椰冠',bend,h,lean),palette=['#347f51','#58a263','#82bb70'];
 const counts=[7,7,4],tips=[];
 for(let tier=0;tier<3;tier++)for(let i=0;i<counts[tier];i++){
  const seed2=seed+tier*17+i*2.31,a=i*Math.PI*2/counts[tier]+tier*1.21+n(seed2)*.20;
  const length=(tier===2?1.35:tier===1?2.55:3.1)*(.83+n(seed2+1)*.34),rise=tier===2?2.15:tier===1?.95:.38,drop=tier===2?.20:tier===1?.69:1.03;
  const curve=new T.CatmullRomCurve3([v(0,.02*tier,0),v(Math.cos(a)*length*.28,rise*.77,Math.sin(a)*length*.28),v(Math.cos(a)*length*.67,rise,Math.sin(a)*length*.67),v(Math.cos(a)*length,rise-drop,Math.sin(a)*length)]);
  K.tube(crown,curve.getPoints(16),tier===2?.023:.034,'#94b96e',false,18);tips.push(curve.getPoint(1).y);
  const pos=[],ix=[],tex=[],pairs=tier===2?10:17;
  for(let j=0;j<pairs;j++)for(let side of [-1,1]){
   const t=.10+j/(pairs-1)*.85,p=curve.getPoint(t),along=curve.getTangent(t),out=v(-Math.sin(a),0,Math.cos(a)).multiplyScalar(side);
   const len=(tier===2?.35:.78)*Math.pow(Math.sin(t*Math.PI),.6)*(.84+n(seed2+j+side)*.22),at=pos.length/3;
   for(let k=0;k<=6;k++)for(let edge of [-1,0,1]){const u=k/6,w=.059*Math.pow(Math.sin(Math.PI*u),.75)*(tier===2?.65:1);const q=p.clone().addScaledVector(out,len*u).addScaledVector(along,len*u*.24+edge*w);q.y+=.16*Math.sin(u*Math.PI)-.19*u*u-.035*Math.abs(edge)*Math.sin(u*Math.PI);pos.push(q.x,q.y,q.z);tex.push((edge+1)/2,u);}
   for(let k=0;k<6;k++)for(let j=0;j<2;j++){let b=at+k*3+j;ix.push(b,b+3,b+1,b+1,b+3,b+4);}
  }
  K.mesh(crown,geometry(pos,ix,tex),K.mat(palette[tier],{side:T.DoubleSide,roughness:.72}));
 }
 for(let i=0;i<4;i++){let a=i*2.4+seed;K.ell(pg,bend+Math.cos(a)*.27,h-.13,lean+Math.sin(a)*.27,.18,.24,.18,'#b4a45d',14);}
 // One small moving canopy per tree, batched into four materials.
 K.optimize(crown);crown.userData.live=true;crown.userData.wind={phase:n(seed+6)*Math.PI*2,amplitude:.022+n(seed+8)*.014};crown.userData.tipHeights=tips;
 pg.userData.palm={height:h,upperLeaves:4,spreadingLeaves:7,lowerLeaves:7};return {tree:pg,crown};
}

export function animatePalms(W,time,reduced){for(const crown of W.island.movers.palms){const {phase,amplitude}=crown.userData.wind;let t=reduced?0:time;crown.rotation.z=reduced?0:Math.sin(t*.49+phase)*amplitude;crown.rotation.x=reduced?0:Math.cos(t*.37+phase)*amplitude*.55;}}

export function buildDistantRidges(K,land,snow){
 const range=K.group(land,'三重连续远山与山谷'),winter=K.group(snow,'沿山脊自然分布的积雪');
 const profiles=[
  {z:-148,d:69,c:'#629183',h:26,peaks:[[-151,25,1],[-84,40,.57],[-17,24,.92],[50,31,.63],[118,34,.96],[190,39,.6]]},
  {z:-181,d:96,c:'#8099b0',h:47,peaks:[[-132,32,.8],[-47,45,.59],[40,28,1],[120,39,.8],[211,26,.62]]},
  {z:-231,d:110,c:'#9eaccd',h:71,peaks:[[-172,47,.59],[-65,27,1],[20,41,.65],[107,28,.96],[191,40,.76]]}
 ];
 for(let [layer,o]of profiles.entries()){
  const points=[],ix=[],uv=[],nx=140,nz=30;
  for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){
   const x=-215+i/nx*475,t=j/nz,z=o.z-t*o.d,crest=.34+.10*Math.sin(x*.018+layer),breadth=t<crest?crest:1-crest;
   const envelope=Math.pow(Math.max(0,1-Math.abs(t-crest)/breadth),1.3);let hills=0;for(const [px,w,h]of o.peaks)hills+=Math.exp(-(((x-px)/w)**2))*h;
   const edge=Math.min(1,(x+215)/22,(260-x)/22),ripple=(Math.sin(x*.14+z*.08)*.075+Math.cos(x*.063-z*.18)*.045)*Math.sin(t*Math.PI);
   const y=-1.9+Math.max(0,(hills+ripple)*o.h*envelope*edge);points.push(x,y,z);uv.push(i/nx,t);
   if(i<nx&&j<nz){let k=j*(nx+1)+i;ix.push(k,k+nx+1,k+1,k+1,k+nx+1,k+nx+2);}
  }
  const mesh=K.mesh(range,geometry(points,ix,uv),K.mat(o.c,{roughness:.98,side:T.DoubleSide}));mesh.name=['林木覆盖的缓丘','错落的中景山谷','高低不齐的远山脊'][layer];
  const snowPoints=[],snowIx=[];for(let i=0;i<ix.length;i+=3){const ids=ix.slice(i,i+3),min=Math.min(...ids.map(k=>points[k*3+1]));const px=points[ids[0]*3];if(min>o.h*(.55+.09*Math.sin(px*.08+layer))){for(let k of ids){snowIx.push(snowPoints.length/3);snowPoints.push(points[k*3],points[k*3+1]+.06,points[k*3+2]);}}}
  K.mesh(winter,geometry(snowPoints,snowIx),K.mat('#f5f7ff',{roughness:.91,side:T.DoubleSide}));
 }
 return range;
}

export function buildEstateLandscape(K,W){
 const {island,coast,town}=W,land=K.group(island.land,'法式庄园 · 绿篱花坛与林荫花园'),stats={trees:0,shrubs:0,parterres:4,oranges:0};
 const groundAt=(x,z)=>Math.max(.94,.70+.43*Math.sqrt(Math.max(0,1-((x+65)/25.5)**2-((z+13)/47)**2)));
 const foliage=['#397752','#568d5b','#79a86b'],leafMaterials=foliage.map(c=>K.mat(c,{roughness:.85})),shapes=[];
 for(let type=0;type<5;type++){let g=new T.SphereGeometry(1,16,11),p=g.attributes.position;for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i),f=1+.085*Math.sin(x*8+type)*Math.cos(z*7-y*5)+.045*Math.sin(y*12+type*2);p.setXYZ(i,x*f,y*f,z*f);}g.computeVertexNormals();shapes.push(g);}
 function cluster(p,x,y,z,rx,ry,rz,seed){let m=K.mesh(p,shapes[Math.abs(Math.floor(seed))%5],leafMaterials[Math.abs(Math.floor(seed))%3],x,y,z);m.scale.set(rx,ry,rz);m.rotation.y=seed*2.399;return m;}
 function shrub(p,x,y,z,r=.7,seed=0){stats.shrubs++;const g=K.group(p,'层叠常绿灌木',x,y,z);for(let i=0;i<3;i++){let a=i*2.4+seed;cluster(g,Math.sin(a)*r*.29,r*(.46+.11*i),Math.cos(a)*r*.23,r*.64,r*.57,r*.65,seed+i);}return g;}
 function tree(p,x,y,z,s=1,seed=0,shape='lime'){
  stats.trees++;const g=K.group(p,shape==='cypress'?'挺拔柏树':shape==='orange'?'陶盆柑橘树':'舒展阔叶乔木',x,y,z);g.scale.setScalar(s);
  if(shape==='cypress'){K.cyl(g,0,1.2,0,.10,.16,2.4,'#977658',12);for(let j=0;j<5;j++)cluster(g,.05*Math.sin(j+seed),1.8+j*.57,0,.73-j*.09,1.02,.65-j*.08,seed+j);return g;}
  const h=shape==='orange'?2:4.2+n(seed)*1.1;K.tube(g,[[0,0,0],[.09,h*.45,-.05],[-.12,h*.8,.08],[0,h,0]],.12,'#9b7a5a',false,14);
  for(let i=0;i<7;i++){let a=i*2.399+seed,r=(shape==='orange'?.55:1.22)*(.5+n(seed+i+4)),yy=h+Math.sin(i*2.1)*.55;K.rod(g,[0,h*.58,0],[Math.cos(a)*r,yy,Math.sin(a)*r],.047,'#9b7a5a');cluster(g,Math.cos(a)*r,yy,Math.sin(a)*r,shape==='orange'?.78:1.30,shape==='orange'?.75:1.4,shape==='orange'?.73:1.13,seed+i);}
  if(shape==='orange'){stats.oranges++;for(let i=0;i<12;i++){let a=i*2.399;K.ell(g,Math.sin(a)*1.02,h+.43*Math.cos(i*1.7),Math.cos(a)*1.02,.095,.098,.095,'#f7b348',12);}}
  return g;
 }
 function hedge(p,pts,h=.62,w=.50){const curve=new T.CatmullRomCurve3(pts.map(a=>v(...a))),ps=[],ix=[];const seg=Math.max(20,pts.length*5);for(let i=0;i<=seg;i++){let p=curve.getPoint(i/seg),d=curve.getTangent(i/seg),side=v(-d.z,0,d.x).normalize();for(let [a,y]of [[-1,0],[-1,h],[1,h],[1,0]]){let q=p.clone().addScaledVector(side,a*w/2);ps.push(q.x,q.y+y,q.z);}if(i<seg)for(let k=0;k<3;k++){let b=i*4+k;ix.push(b,b+4,b+1,b+1,b+4,b+5);}}K.mesh(p,geometry(ps,ix),leafMaterials[0]);for(let i=0;i<seg;i+=2){let q=curve.getPoint(i/seg);cluster(p,q.x,q.y+h-.055,q.z,w*.53,.10,w*.49,i);}return curve;}
 function path(p,pts,width=2.3,y=1.14){let curve=new T.CatmullRomCurve3(pts.map(([x,z])=>v(x,y,z))),ps=[],ix=[];for(let i=0;i<=64;i++){let q=curve.getPoint(i/64),d=curve.getTangent(i/64),normal=v(-d.z,0,d.x).normalize();for(let [a,yy]of [[-1,.40],[-1,y],[1,y],[1,.40]]){let r=q.clone().addScaledVector(normal,a*width/2);ps.push(r.x,yy,r.z);}if(i<64)for(let j=0;j<3;j++){let k=i*4+j;ix.push(k,k+1,k+4,k+1,k+5,k+4);}}let m=K.mesh(p,geometry(ps,ix),K.mat('#edddd0',{roughness:.94,side:T.DoubleSide}));m.name='带基层的庄园砂砾步道';return curve;}
 // A real coastal terrace, joined to the existing island instead of floating planters.
 K.ell(land,-65,-1.4,-13,27,2.55,49,'#cbb49c',56);K.slab(land,Array.from({length:72},(_,i)=>{let a=i*Math.PI/36;return [-65+Math.cos(a)*26,-13+Math.sin(a)*48];}),-2,2.94,'#cbb49c');K.ell(land,-65,.70,-13,25.5,.43,47,'#75a878',56);
 const garden=K.group(land,'四分区刺绣花坛',-65,1.14,-12);
 K.box(garden,0,-.20,0,31,.40,49,'#e9d7c9',.14);K.box(garden,0,.035,0,2.8,.04,49,'#f8eade',.02);K.box(garden,0,.035,0,31,.04,2.8,'#f8eade',.02);
 for(let sx of [-1,1])for(let sz of [-1,1]){
  const g=K.group(garden,'低绿篱环绕的玫瑰花坛',sx*7.7,.03,sz*12);K.box(g,0,0,0,10.6,.08,17.4,'#8db37e',.16);
  const loop=[[-5,0,-8],[-5,0,8],[5,0,8],[5,0,-8],[-5,0,-8]];hedge(g,loop,.63,.52);
  for(let side of [-1,1]){const scroll=[];for(let i=0;i<=34;i++){let a=i/34*Math.PI*2.1,r=2.5*(1-i/45);scroll.push([Math.cos(a)*r*side,0,side*3.4+Math.sin(a)*r]);}hedge(g,scroll,.44,.38);}
  for(let i=0;i<14;i++){let a=i*2.399,r=1.6+(.5+.5*Math.sin(i))*1.7;K.flower(g,Math.sin(a)*r,.05,Math.cos(a)*r*1.65,.29+i%3*.04,[C.rose,C.blush,C.cream][i%3],{seed:800+i,kind:i%2?'rose':'peony'});}
 }
 // Open north/south avenues and lateral connection retain clear circulation.
 path(land,[[-65,-59],[-65,-39]],2.8);path(land,[[-65,13],[-65,29],[-43,29]],2.8);path(land,[[-49,-12],[-45,-12]],2.8);
 for(let x of [-82.6,-47.4])for(let i=0;i<7;i++)tree(land,x,groundAt(x,-38+i*8),-38+i*8,.91+(i%3)*.06,11+i+(x<0?3:0));
 for(let x of [-75,-55])for(let z of [-40,16]){
  K.box(land,x,1.54,z,1.4,.94,1.4,'#496f63',.12);for(let dx of [-.65,.65])for(let dz of [-.65,.65])K.ell(land,x+dx,2.04,z+dz,.065,.065,.065,K.gold,12);tree(land,x,2.03,z,.94,Math.abs(x+z),'orange');
 }
 for(let x of [-78,-52])for(let z of [-35,12])tree(land,x,groundAt(x,z),z,.92,Math.abs(x*z),'cypress');
 for(let i=0;i<30;i++){let a=i*Math.PI*2/30,x=-65+Math.cos(a)*23.3,z=-13+Math.sin(a)*43;if(Math.abs(z+12)<4&&x>-60)continue;shrub(land,x,groundAt(x,z),z,.95+(i%3)*.23,i);}
 // North bosquet frames a small garden room without blocking its central passage.
 for(let [i,x,z]of [[0,-73,-49],[1,-57,-49],[2,-77,-54],[3,-53,-54],[4,-68,-56],[5,-61,-57]])tree(land,x,groundAt(x,z),z,1.12+n(i)*.23,40+i);
 for(let x of [-71,-59])K.sofa(land,x,1.14,-45,2.5,C.cream,Math.PI);
 for(let [x,z]of [[-69,25],[-61,25]]){K.column(land,x,1.07,z,2.15,.20);K.bouquet(land,x,3.3,z,.9);}
 // Mixed hedges, shade trees and perennial borders across the older grounds.
 const roadPoints=[island.movers.roadCurve,...town.roads.map(r=>r.curve)].flatMap(c=>Array.from({length:150},(_,i)=>c.getPoint(i/150)));
 const clear=(x,z,r=2)=>roadPoints.every(p=>Math.hypot(p.x-x,p.z-z)>r+3.3);
 const protect=(x,z)=>Math.abs(x)<33&&z>-62&&z<31||Math.hypot(x-83,z+5)<15||x>49&&x<111&&z>-1&&z<33||x>60&&x<109&&z>-62&&z<-32||x>128&&x<165&&z>-95&&z<-39||Math.hypot((x-71)/1.4,z+103)<16;
 K.ell(coast.land,62,.2,-96,99,.60,42,'#78a67c',56);
 const placements=[];
 for(let i=0;i<110;i++){
  let x=-25+n(i+200)*151,z=-137+n(i+560)*70;if(!clear(x,z,2.3)||protect(x,z))continue;
  // Plant only inside a supported land footprint; avoid the exposed coastline.
  if(((x-62)/91)**2+((z+96)/39)**2>.90)continue;
  if(placements.some(p=>Math.hypot(x-p.x,z-p.z)<4.5))continue;
  const h=.2+.60*Math.sqrt(Math.max(0,1-((x-62)/99)**2-((z+96)/42)**2));
  tree(coast.land,x,h,z,.82+n(i+860)*.60,i+90,i%7===0?'cypress':'lime');placements.push({x,z,r:2.3});
  for(let j=0;j<3;j++){let a=j*2.399+i;shrub(coast.land,x+Math.cos(a)*1.8,h,z+Math.sin(a)*1.8,.62+j*.14,i+j);}
 }
 for(let side of [-1,1])for(let i=0;i<7;i++){let x=side*(49+i%2*2.5),z=-30+i*7.4;if(clear(x,z,1.2)&&!protect(x,z)){shrub(island.land,x,.8,z,1.14,i);tree(island.land,x,.8,z,.73+i%3*.07,i+190);}}
 for(let i=0;i<10;i++){let x=169+(i%2)*2.3,z=-91+i*4.7;if(((x-145)/30)**2+((z+75)/41)**2<.86&&clear(x,z,1.4))tree(town.land,x,.89,z,.75+i%3*.12,i+280);}
 land.userData.landscapeStats=stats;return {land,stats,plantings:placements,roadPoints};
}
