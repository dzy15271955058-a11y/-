export const TRAVEL_KEY='barbie-dream-travel-v1';
export const REGIONS={
 bus:{name:'风铃山谷',vehicle:'观景大巴',subtitle:'公路 · 花港市集 · 玻璃温室 · 山顶车站',bounds:160,spawn:[0,.3,115],color:'#df6d9f',stops:[
  {id:'depot',name:'庄园总站',p:[0,.3,115],kind:'depot',hint:'从这里转乘游艇或返回豪宅。'},
  {id:'market',name:'花港市集',p:[-95,.3,35],kind:'market',hint:'把温室鲜果与山顶乘客送到市集。'},
  {id:'orchard',name:'玫瑰温室农庄',p:[-80,.3,-85],kind:'orchard',hint:'下车到货架拿果箱，再搬到大巴。温室可进入农场。'},
  {id:'peak',name:'云岭观景站',p:[65,.3,-100],kind:'peak',hint:'三位朋友正在候车。停稳并开门，她们会依次登车。'},
  {id:'bridge',name:'溪谷花桥',p:[95,.3,30],kind:'bridge',hint:'下车沿溪流看瀑布，旁边的花园可以照料小动物。'}]},
 yacht:{name:'蔚蓝外海群岛',vehicle:'珍珠游艇',subtitle:'自由航行 · 登岛 · 灯塔 · 海岛庆典',bounds:195,spawn:[0,.25,110],color:'#4286ba',stops:[
  {id:'marina',name:'珍珠母港',p:[0,.25,110],kind:'marina',hint:'补给、转乘大巴，也可在港口调饮。'},
  {id:'garden',name:'花语外岛',p:[-100,.25,5],kind:'garden',hint:'登岛领取花篮，装船后送到庆典岛。'},
  {id:'lighthouse',name:'星镜灯塔岛',p:[60,.25,-90],kind:'lighthouse',hint:'登岛调准三层星镜，重新点亮航标。'},
  {id:'festival',name:'白帆庆典岛',p:[110,.25,55],kind:'festival',hint:'将花篮带到舞台花架，布置完成后开启海岛舞会。'},
  {id:'reefport',name:'月牙珊瑚湾',p:[-55,.25,-100],kind:'reefport',hint:'从潜水台换乘潜艇，探索海沟和沉船。'}]},
 submarine:{name:'深海琉璃海沟',vehicle:'探索潜艇',subtitle:'深度驾驶 · 声呐 · 机械臂 · 海底基地',bounds:165,spawn:[0,-18,110],color:'#7284d3',stops:[
  {id:'surface',name:'潜航入口',p:[0,-18,110],kind:'surface',hint:'上浮后可回到游艇和群岛。'},
  {id:'coral',name:'流光珊瑚拱',p:[-65,-28,25],kind:'sample',hint:'声呐扫描遗失的能源匣，再用机械臂打捞。'},
  {id:'wreck',name:'远洋沉船遗址',p:[-70,-55,-65],kind:'sample',hint:'在沉船旁寻找第二枚能源匣，留意深度。'},
  {id:'trench',name:'晶光海沟',p:[60,-78,-80],kind:'sample',hint:'最后一枚能源匣藏在晶柱之间。'},
  {id:'base',name:'珍珠观测基地',p:[85,-38,60],kind:'base',hint:'带回三枚能源匣，恢复基地灯光并开启舱门。'}]}
};
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number.isFinite(n)?n:a));
export const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
export function freshTravel(){return {version:1,last:'bus',locations:Object.fromEntries(Object.entries(REGIONS).map(([k,r])=>[k,{p:[...r.spawn],yaw:Math.PI,dock:r.stops[0].id}])),visits:[],cargo:[],passengers:0,picked:[],delivered:0,arrivals:0,flowers:0,lens:[0,0,0],scanned:[],cells:[],base:false,badges:[],distance:0};}
export function restoreTravel(raw){const s=freshTravel();try{const d=typeof raw==='string'?JSON.parse(raw):raw;if(d?.version!==1)return s;if(REGIONS[d.last])s.last=d.last;for(const [k,r]of Object.entries(REGIONS)){const l=d.locations?.[k];if(Array.isArray(l?.p)&&l.p.length===3&&l.p.every(Number.isFinite)){s.locations[k]={p:[clamp(l.p[0],-r.bounds,r.bounds),k==='submarine'?clamp(l.p[1],-95,-12):r.spawn[1],clamp(l.p[2],-r.bounds,r.bounds)],yaw:wrap(l.yaw||0),dock:r.stops.some(a=>a.id===l.dock)?l.dock:null};}}const strings=(key,allowed,max=99)=>{s[key]=Array.isArray(d[key])?[...new Set(d[key].filter(v=>allowed.includes(v)))].slice(0,max):[];};strings('visits',Object.entries(REGIONS).flatMap(([k,r])=>r.stops.map(a=>k+':'+a.id)));strings('scanned',['coral','wreck','trench']);strings('cells',['coral','wreck','trench']);strings('picked',['fruit0','fruit1','fruit2','flower0','flower1','flower2','passengers']);strings('badges',['valley','islands','ocean']);s.cargo=(Array.isArray(d.cargo)?d.cargo:[]).filter(v=>['fruit','flower'].includes(v)).slice(0,6);s.passengers=Math.round(clamp(d.passengers,0,3));s.delivered=Math.round(clamp(d.delivered,0,3));s.arrivals=Math.round(clamp(d.arrivals,0,3));s.flowers=Math.round(clamp(d.flowers,0,3));s.lens=[0,1,2].map(i=>Math.floor(clamp(d.lens?.[i],0,7)));s.base=d.base===true;s.distance=clamp(d.distance,0,1e8);return s;}catch{return s;}}
export function closestOnPath(p,a,b){const dx=b[0]-a[0],dz=b[2]-a[2],t=clamp(((p[0]-a[0])*dx+(p[2]-a[2])*dz)/(dx*dx+dz*dz),0,1);return [a[0]+t*dx,p[1],a[2]+t*dz];}
export function roadDistance(p){const stops=REGIONS.bus.stops;return Math.min(...stops.map((s,i)=>distance(p,closestOnPath(p,s.p,stops[(i+1)%stops.length].p))));}
export function islandCenter(stop){const l=Math.hypot(stop.p[0],stop.p[2])||1;return [stop.p[0]+stop.p[0]/l*33,1.2,stop.p[2]+stop.p[2]/l*33];}
export function isWater(p){return REGIONS.yacht.stops.every(s=>{const c=islandCenter(s);return Math.hypot(p[0]-c[0],p[2]-c[2])>27;});}
export function isWalkable(p,mode,dock){if(mode==='bus')return Math.abs(p[0])<155&&Math.abs(p[2])<150;if(mode==='submarine')return dock==='base'&&Math.hypot(p[0]-85,p[2]-36)<22;const s=REGIONS.yacht.stops.find(a=>a.id===dock);if(!s)return false;const c=islandCenter(s),q=closestOnPath(p,s.p,c);return Math.hypot(p[0]-c[0],p[2]-c[2])<24||Math.hypot(p[0]-q[0],p[2]-q[2])<3.5;}
export function route(mode,p,id){const r=REGIONS[mode],dest=r.stops.find(s=>s.id===id);if(!dest)return [];if(mode==='yacht')return [[0,.25,0],[...dest.p]];if(mode==='submarine')return [[dest.p[0],dest.p[1],dest.p[2]+(dest.kind==='sample'?13:0)]];const stops=r.stops;let nearest=0,best=Infinity;for(let i=0;i<stops.length;i++){const d=distance(p,stops[i].p);if(d<best){best=d;nearest=i;}}const end=stops.indexOf(dest),a=[],b=[];for(let i=0;i<=stops.length;i++){a.push([...stops[(nearest+i)%stops.length].p]);if((nearest+i)%stops.length===end)break;}for(let i=0;i<=stops.length;i++){const j=(nearest-i+stops.length)%stops.length;b.push([...stops[j].p]);if(j===end)break;}const length=arr=>arr.reduce((n,v,i)=>n+distance(i?arr[i-1]:p,v),0);return length(a)<length(b)?a:b;}
export function nearbyStop(mode,p){return REGIONS[mode].stops.map(s=>({s,d:distance(p,s.p)})).sort((a,b)=>a.d-b.d)[0];}
export function completeBadge(s,id){if(s.badges.includes(id))return false;const ok=id==='valley'?s.delivered>=3&&s.arrivals>=3:id==='islands'?s.flowers>=3&&s.lens.every((v,i)=>v===[2,5,7][i]):s.base;if(ok)s.badges.push(id);return ok;}
// Local walking routes avoid buildings and the water between an island and its pier.
export function walkRoute(start,target,valid,arrival=1.7){
 const step=1.25,key=(x,z)=>x+','+z,heuristic=(x,z)=>Math.hypot(start[0]+x*step-target[0],start[2]+z*step-target[2]);
 const open=[{x:0,z:0,g:0,f:heuristic(0,0),parent:null}],best=new Map([[key(0,0),0]]),closed=new Set();let iterations=0;
 while(open.length&&iterations++<10000){open.sort((a,b)=>b.f-a.f);const n=open.pop(),id=key(n.x,n.z);if(closed.has(id))continue;closed.add(id);const p=[start[0]+n.x*step,start[1],start[2]+n.z*step];if(heuristic(n.x,n.z)<arrival){const out=[];let at=n;while(at.parent){out.push([start[0]+at.x*step,start[1],start[2]+at.z*step]);at=at.parent;}out.reverse();out.push([...target]);return out;}
  for(const [dx,dz]of [[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]){const x=n.x+dx,z=n.z+dz,q=[start[0]+x*step,start[1],start[2]+z*step],cost=n.g+Math.hypot(dx,dz),k=key(x,z);if(closed.has(k)||cost>180||cost>=(best.get(k)??Infinity)||!valid(q)||!valid([(p[0]+q[0])/2,start[1],(p[2]+q[2])/2]))continue;best.set(k,cost);open.push({x,z,g:cost,f:cost+heuristic(x,z)/step,parent:n});}
 }return [];
}
