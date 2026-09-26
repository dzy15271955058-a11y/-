import {T,C,v} from './kit.js';
import {makeCharacters} from './characters.js';

// Continuous, supported road ribbons: every visible lane has a matching roadbed.
export function pavedRoad(K,parent,curve,width=5.7,color='#bd648d',closed=false){
 const g=K.group(parent,'连续路面与路基'),n=closed?360:180,ps=[],ix=[],sides=[],si=[],left=[],right=[];
 for(let i=0;i<=n;i++){let p=curve.getPoint(i/n),d=curve.getTangent(i/n),normal=v(-d.z,0,d.x).normalize();
  for(let side of [-1,1]){let q=p.clone().addScaledVector(normal,side*width/2);ps.push(q.x,q.y+.12,q.z);(side===-1?left:right).push([q.x,q.y+.20,q.z]);sides.push(q.x,-1.4,q.z,q.x,q.y+.08,q.z);}
  if(i<n){let a=i*2;ix.push(a,a+1,a+2,a+1,a+3,a+2);for(let j=0;j<2;j++){let b=i*4+j*2;si.push(b,b+4,b+1,b+1,b+4,b+5);}}
  if(i%7===0){let line=K.box(g,p.x,p.y+.14,p.z,.10,.02,.9,C.cream,0);line.rotation.y=Math.atan2(d.x,d.z);}
 }
 for(let [positions,indices,c]of [[ps,ix,color],[sides,si,'#aa7d79']]){let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();K.mesh(g,geo,K.mat(c,{roughness:.77,side:T.DoubleSide}));}
 for(let a of [left,right])K.tube(g,a,.085,C.cream,false,n);
 return {group:g,curve,width};
}

export function buildHarborTown(K,root,W){
 const {group,box,ell,cyl,rod,torus,tube,mesh,gold,glow,arch}=K,A=makeCharacters(K),land=group(root,'远山花港小镇与连接道路'),live=group(land,'可进入的小镇店铺');live.userData.live=true;
 const roads=[],doors=[],labels=[];roads.push(pavedRoad(K,land,W.coast.movers.busCurve,5.7,'#c25d91',true));
 const ring=W.island.movers.roadCurve;let nearest=0,best=Infinity;for(let i=0;i<1000;i++){let distance=ring.getPoint(i/1000).distanceToSquared(v(43,.81,-62));if(distance<best){best=distance;nearest=i/1000;}}
 const start=ring.getPoint(nearest),connector=new T.CatmullRomCurve3([start,v(40,1,-65),v(49,1.12,-68),W.coast.movers.busCurve.getPoint(.04)]);roads.push(pavedRoad(K,land,connector,5.2,'#bb7298'));
 let base=[];for(let i=0;i<80;i++){let a=i*Math.PI/40;base.push([145+Math.sin(a)*32,-75+Math.cos(a)*44]);}K.slab(land,base,-1.6,2.5,'#b59086');K.ell(land,145,.53,-75,30,.55,41,'#69a987',48);
 const branch=new T.CatmullRomCurve3([v(112,1.4,-104),v(126,1.4,-104),v(140,1.4,-98),v(146,1.4,-88),v(146,1.62,-54.7)],false,'catmullrom',.20);roads.push(pavedRoad(K,land,branch,6.8,'#996c67'));
 // This second loop visibly links the new town back to the existing Christmas district.
 const roundabout=new T.CatmullRomCurve3(Array.from({length:32},(_,i)=>{let a=i*Math.PI/16;return v(146+Math.sin(a)*6.7,1.62,-48+Math.cos(a)*6.7);}),true);roads.push(pavedRoad(K,land,roundabout,4.3,'#996c67',true));
 const south=new T.CatmullRomCurve3([v(146,1.62,-41.3),v(137,1.3,-35),v(119,1.2,-30),v(106,1.1,-35)],false,'catmullrom',.2);roads.push(pavedRoad(K,land,south,5.2,'#996c67'));
 const town=group(land,'花港小镇',146,1.5,-69);K.disk(town,0,-.1,21,9.2,.28,C.cream);K.disk(town,0,.2,21,2.7,.45,C.rose);K.disk(town,0,.44,21,2.4,.08,C.aqua);cyl(town,0,1.4,21,.17,.25,2.2,gold,24);ell(town,0,2.7,21,.38,.35,.38,glow,20);for(let i=0;i<12;i++){let a=i*Math.PI/6;tube(town,[[0,2.6,21],[Math.sin(a)*1.5,2.8,21+Math.cos(a)*1.5],[Math.sin(a)*2.2,.5,21+Math.cos(a)*2.2]],.023,K.glass,false,25);}
 const names=['玫瑰咖啡','蝴蝶花店','玩偶工坊','星光书屋','蜜桃甜点','丝缎精品','海风餐厅','珠宝小铺'];
 for(let side of [-1,1])for(let i=0;i<4;i++){
  let index=(side===-1?0:4)+i,z=-17+i*9.5,x=side*10.3,h=6+(i%2)*1.4;
  let shop=group(live,names[index],146+x,1.55,-69+z);shop.rotation.y=-side*Math.PI/2;shop.userData.live=true;
  let wall=[C.rose,C.violet,C.blue,C.peach][i];box(shop,0,h/2,-4.20,7,h,.22,wall,.05);for(let d of [-1,1]){box(shop,d*3.42,h/2,-1,.18,h,6.4,wall,.05);box(shop,d*2.08,h/2,2.22,2.70,h,.22,wall,.05);}box(shop,0,(h+3.15)/2,2.22,1.5,h-3.15,.22,wall,.05);box(shop,0,.1,-1,7,.2,6.5,C.cream,.04);box(shop,0,1,-2.8,4.0,1.2,.8,C.rose,.1);K.cake(shop,0,1.62,-2.8,.7);box(shop,0,.15,3.0,8,.3,2.1,C.cream,.04);for(let yy of [.55,3.65,h-.20])box(shop,0,yy,2.28,7.15,.11,.20,C.cream,.02);
  let roof=mesh(shop,new T.ConeGeometry(5.25,2.9,4),i%2?'#762b77':'#b43578',0,h+1.35,-1);roof.rotation.y=Math.PI/4;shop.updateWorldMatrix(true,true);let snowRoof=mesh(W.coast.snow,roof.geometry,K.mat('#fffaff',{roughness:.82}));snowRoof.position.copy(roof.getWorldPosition(v())).y+=.045;snowRoof.quaternion.copy(roof.getWorldQuaternion(new T.Quaternion()));snowRoof.scale.setScalar(1.008);
  for(let x of [-2.15,2.15]){box(shop,x,1.8,2.31,1.5,2.3,.05,'#347c91',.16);box(shop,x,4.9,2.31,1.15,1.65,.05,glow,.22);K.frame(shop,x-.03,4.04,2.36,1.24,1.75,C.cream);K.bouquet(shop,x,3.01,2.47,.48);}
  arch(shop,0,.25,2.37,1.32,2.7,gold,.08);let door=group(shop,'可开启店门',-.63,.25,2.42);door.userData.live=true;box(door,.63,1.15,0,1.26,2.3,.08,C.cream,.05);box(door,.63,1.46,.05,1.03,1.34,.025,'#60b2c8',.09);ell(door,1.1,1.0,.1,.04,.045,.035,gold,12);doors.push(door);
  for(let k=0;k<10;k++){let aw=box(shop,-3.25+k*.72,3.22,2.9,.72,.14,1.35,k%2?C.cream:C.pink,.02);aw.rotation.x=.2;}K.table(shop,-1.7,.3,4.3,.55,.65,C.cream);K.chair(shop,-2.4,.3,4.6,C.pink);K.chair(shop,-1,.3,4.6,C.pink);K.cup(shop,-1.7,1.02,4.3);
  if(i===0)K.cake(shop,2.15,.5,3.4,.6);else if(i===1)for(let j=0;j<3;j++)K.bouquet(shop,1.3+j*.65,.3,3.7,.6);else if(i===2)K.bear(shop,2.1,.3,3.7,.55);else K.book(shop,2.1,.65,3.4,C.pink,.5);
  labels.push({text:names[index],parent:shop,pos:[0,3.86,2.43],width:3.3});
 }
 for(let side of [-1,1])for(let i=0;i<12;i++){let z=-91+i*4.2;rod(land,[146+side*4.25,1.5,z],[146+side*4.25,4.6,z],.055,gold);ell(land,146+side*4.25,4.7,z,.15,.23,.15,glow,16);if(i%3===0)K.bouquet(land,146+side*5.6,1.4,z,.9);}
 let stop=group(land,'小镇巴士站',132,1.45,-95);stop.userData.live=true;box(stop,0,2,-.5,4.8,3.9,.08,K.glass,.05);box(stop,0,4,0,5.5,.20,2.2,C.rose,.20);for(let d of [-1,1])rod(stop,[d*2.2,0,0],[d*2.2,4,0],.05,gold);K.sofa(stop,0,0,-.1,3.8,C.pink);labels.push({text:'花港小镇',parent:stop,pos:[0,3.25,-.42],width:3.6});
 A.doll(town,-4,.2,13,{style:'floral',color:C.rose,pose:'wave',hairStyle:'bun',name:'小镇访客'});A.cat(town,3,.2,19,1);K.bouquet(town,-3,.2,23,.9);
 return {land,live,roads,doors,labels,branch};
}
