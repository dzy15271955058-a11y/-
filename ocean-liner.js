import {T,C,v} from './kit.js';
import {makeCharacters} from './characters.js';
export function buildOceanLiner(K,root){
 const {group,box,ell,cyl,disk,rod,torus,tube,mesh,mat,gold,glow}=K,A=makeCharacters(K),fleet=group(root,'梦幻远洋邮轮与五艘护航游艇',105,.25,185);fleet.userData.live=true;
 const ship=group(fleet,'四烟囱梦幻大邮轮');ship.rotation.y=Math.PI/2;
 const hullColor=mat('#792347',{roughness:.22,metalness:.25,clearcoat:.8}),trim=mat('#ad315e',{roughness:.3,clearcoat:.5}),deck=mat('#c38e69',{roughness:.66}),glazing=mat('#28627a',{roughness:.10,metalness:.55,clearcoat:1}),lights=mat('#ffd883',{emissive:'#ffc465',emissiveIntensity:.85});
 const stations=[[-35,.30],[-33,2.65],[-29,4.30],[-22,5.15],[-10,5.4],[10,5.4],[24,4.7],[32,2.50],[37,.08]],ps=[],ix=[];
 for(let [z,w]of stations)for(let [x,y]of [[-.56*w,-1.4],[-w,.75],[-w,4.1],[w,4.1],[w,.75],[.56*w,-1.4]])ps.push(x,y,z);
 for(let j=0;j<stations.length-1;j++)for(let i=0;i<6;i++){let a=j*6+i,b=j*6+(i+1)%6;ix.push(a,b,a+6,b,b+6,a+6);}ix.push(0,2,1,0,3,2,0,4,3,0,5,4);let e=(stations.length-1)*6;ix.push(e,e+1,e+2,e,e+2,e+3,e,e+3,e+4,e,e+4,e+5);
 let hg=new T.BufferGeometry();hg.setAttribute('position',new T.Float32BufferAttribute(ps,3));hg.setIndex(ix.reverse());hg.computeVertexNormals();mesh(ship,hg,hullColor);
 let outline=stations.map(([z,w])=>[-w,z]).concat(stations.slice().reverse().map(([z,w])=>[w,z]));K.slab(ship,outline,4.12,.18,deck);
 for(let side of [-1,1]){let sheer=stations.map(([z,w])=>[side*w,3.86,z]);tube(ship,sheer,.065,gold,false,120);let waterline=stations.map(([z,w])=>[side*w,.8,z]);tube(ship,waterline,.10,trim,false,120);}
 function rail(parent,x0,x1,z0,z1,y,n=30){for(let i=0;i<=n;i++){let f=i/n,x=x0+(x1-x0)*f,z=z0+(z1-z0)*f;rod(parent,[x,y,z],[x,y+1.05,z],.019,C.cream);}for(let h of [.4,1.05])rod(parent,[x0,y+h,z0],[x1,y+h,z1],.025,gold);}
 function deckRailing(y,width,length){for(let d of [-1,1])rail(ship,d*width,d*width,-length,length,y,50);for(let d of [-1,1])rail(ship,-width,width,d*length,d*length,y,14);}
 for(let level=0;level<3;level++){let y=4.35+level*2.45,w=9.7-level*.9,l=48-level*6;box(ship,0,y+1.05,-2,w,2.0,l,C.cream,.15);box(ship,0,y+2.17,-2,w+.45,.20,l+.8,deck,.08);for(let side of [-1,1])for(let i=0;i<24-level*3;i++){let z=-l/2-.7+i*(l-2)/(23-level*3);box(ship,side*(w/2+.018),y+1.08,z,.035,1.08,.83,glazing,.07);box(ship,side*(w/2+.043),y+.50,z,.04,.06,.90,gold,.01);if(i%3===0)box(ship,side*(w/2+.066),y+1.55,z,.04,.06,.9,lights,.01);}deckRailing(y+2.28,(w+.45)/2,l/2+.5);}
 for(let side of [-1,1])for(let i=0;i<44;i++){let z=-28+i*1.34,w=5.30-Math.max(0,Math.abs(z)-20)*.055;let r=torus(ship,side*w,2.32,z,.21,.035,gold);r.rotation.y=Math.PI/2;let win=ell(ship,side*(w+.015),2.32,z,.025,.163,.163,glazing,16);}
 for(let i=0;i<4;i++){let stack=group(ship,'远洋邮轮烟囱',0,11.6,-15+i*9.8);stack.rotation.x=-.09;cyl(stack,0,2.0,0,.95,1.13,4.4,'#c95576',40);cyl(stack,0,4.08,0,1.0,1.0,.56,'#493a50',40);torus(stack,0,1.2,0,1.075,.035,gold,true);for(let d of [-1,1])rod(stack,[d*.70,0,-1],[d*.85,3.65,-1],.021,gold);}
 // Foredeck stairs, bridge glazing, ship's wheel and forward mast.
 for(let i=0;i<13;i++)box(ship,0,4.30+i*.18,24-i*.27,2.8,.20,.43,C.cream,.035);box(ship,0,7.15,20,8.6,1.5,3.0,C.cream,.15);for(let i=0;i<7;i++)box(ship,-3.55+i*1.18,7.28,21.52,.96,.97,.025,glazing,.055);box(ship,0,8.02,20,9.0,.20,3.4,deck,.06);
 rod(ship,[0,4.3,29],[0,18,29],.10,gold);rod(ship,[-3.3,15.2,29],[3.3,15.2,29],.045,gold);for(let d of [-1,1])rod(ship,[d*4.1,4.3,25],[0,17,29],.014,C.cream);box(ship,.90,16.5,29,1.8,1.0,.03,C.pink,.03);K.star(ship,.90,16.5,29.04,.27,C.cream,.02);
 for(let d of [-1,1]){let anchor=group(ship,'船锚',d*1.9,2,32);anchor.rotation.y=d*.40;rod(anchor,[0,0,0],[0,1.6,0],.07,gold);torus(anchor,0,1.7,0,.17,.04,gold);tube(anchor,[[-.7,.3,0],[-.45,-.05,0],[0,-.25,0],[.45,-.05,0],[.7,.3,0]],.06,gold,false,24);}
 for(let side of [-1,1])for(let i=0;i<6;i++){let z=-19+i*6.3;let boat=group(ship,'吊挂救生艇',side*5.4,7.15,z);ell(boat,0,0,0,.53,.36,2.1,C.cream,24);ell(boat,0,.27,0,.45,.08,1.88,deck,24);for(let zz of [-1.3,0,1.3])box(boat,0,.35,zz,.86,.10,.25,C.cream,.03);for(let f of [-1,1]){tube(ship,[[side*4.0,7,-.2+z+f*1.5],[side*4.05,9.3,z+f*1.5],[side*5.5,9.3,z+f*1.5]],.06,gold,false,20);rod(ship,[side*5.5,9.3,z+f*1.5],[side*5.5,7.3,z+f*1.5],.014,C.cream);}}
 // A visible rear music salon with a piano and ballroom floor, accessed by its own camera.
 const salon=group(ship,'邮轮海风舞厅',0,4.35,-29.3);
 box(salon,0,.10,0,7.0,.18,6.2,C.cream,.10);disk(salon,0,.205,0,2.3,.025,C.rose);
 for(let i=0;i<12;i++){let a=i*Math.PI/6;K.star(salon,Math.sin(a)*2.1,.225,Math.cos(a)*2.1,.10,gold).rotation.x=-Math.PI/2;}
 for(let side of [-1,1])rod(ship,[side*2.2,3.1,-31.8],[side*3.3,4.42,-31.8],.075,gold);
 // A real canopy, corner columns and crossbeams carry the chandelier above the clear dance floor.
 for(let x of [-3.20,3.20])for(let z of [-2.60,2.50])K.column(salon,x,.19,z,5.1,.11);
 for(let x of [-3.2,3.2])box(salon,x,5.38,-.05,.16,.18,5.3,gold,.025);
 for(let z of [-2.60,2.50])box(salon,0,5.38,z,6.6,.18,.16,gold,.025);
 box(salon,0,5.49,-.05,6.7,.09,5.45,K.mat('#e8eff5',{transparent:true,opacity:.16,depthWrite:false,roughness:.12,clearcoat:1}),.04);
 box(salon,0,5.38,-.05,.13,.16,5.3,gold,.02);box(salon,0,5.38,-.05,6.6,.16,.13,gold,.02);
 K.chandelier(salon,0,4.45,-.25,.65,5.30);
 const piano=group(salon,'独立靠边钢琴',-1.85,.20,-1.75);K.piano(piano,0,0,0,C.cream,.63,0);
 K.sofa(salon,1.85,.20,-2.25,2.0,C.rose);K.table(salon,2.48,.20,-.97,.36,.48,C.cream);K.cup(salon,2.48,.74,-.97);
 const princess=A.doll(salon,-.05,.219,.54,{style:'gown',color:C.pink,pose:'hold',hairStyle:'bun',look:-.12,name:'邮轮舞会公主'});
 // Keep the bridge operator on the open forward deck, clear of the bridge cabin and stairs.
 const captain=A.doll(ship,2.8,4.30,26.5,{style:'pilot',color:C.cream,pose:'wave',hairStyle:'bun',rotation:.25,name:'邮轮船长'});
 for(let side of [-1,1])for(let i=0;i<8;i++){K.chair(ship,side*3.4,11.75,-19+i*5,C.rose,-side*Math.PI/2);if(i%2===0){K.table(ship,side*2.7,11.75,-18+i*5,.38,.5,C.cream);K.cup(ship,side*2.7,12.35,-18+i*5);}}
 // Broken luminous wakes make the convoy's direction readable from above.
 const yachts=[],wakes=[];
 function yacht(x,z,i){let g=group(fleet,'随行粉色游艇 '+(i+1),x,0,z);g.userData.live=true;g.rotation.y=Math.PI/2;let color=i%2?C.pink:C.rose;A.loft(g,[[0,1.1,4.7],[.45,1.7,5.5],[1.12,2.0,5.6]],A.glitter(color),48);ell(g,0,1.12,0,1.94,.08,5.45,deck,32);box(g,0,1.85,-.5,2.7,1.5,3.7,C.cream,.25);box(g,0,2.63,-.5,3.0,.17,4.0,color,.1);box(g,0,1.99,1.37,2.35,.70,.035,glazing,.08);for(let d of [-1,1]){box(g,d*1.36,2.0,-.5,.03,.70,2.9,glazing,.06);for(let j=0;j<14;j++){let a=j*Math.PI/7;rod(g,[Math.sin(a)*1.86,1.22,Math.cos(a)*5.20],[Math.sin(a)*1.86,1.96,Math.cos(a)*5.20],.017,gold);}}let pts=[];for(let j=0;j<=60;j++){let a=j*Math.PI/30;pts.push([Math.sin(a)*1.86,1.96,Math.cos(a)*5.20]);}tube(g,pts,.02,gold,true,70);K.sofa(g,0,1.22,3.5,2.5,C.cream);K.table(g,0,1.22,4.8,.36,.42,C.cream);rod(g,[0,2.7,-1.4],[0,4.6,-1.4],.025,gold);box(g,.38,4.1,-1.4,.76,.50,.022,C.pink,.015);let wake=group(fleet,'游艇尾流',x-5.5,.01,z);for(let side of [-1,1])for(let j=0;j<8;j++)tube(wake,[[-j*1.1,0,side*(.5+j*.19)],[-j*1.1-.6,0,side*(.5+j*.19)]],.045,mat('#e6fbff',{transparent:true,opacity:.6,depthWrite:false}),false,6);yachts.push({g,x,z});wakes.push(wake);return g;}
 yacht(-48,-8,0);yacht(-49,9,1);yacht(-65,-1,2);yacht(-82,-10,3);yacht(-84,10,4);
 const labels=[{text:'DREAM OCEAN',parent:ship,pos:[0,3.12,36.9],width:2.3}];
 return {fleet,ship,salon,princess,captain,yachts,wakes,lights,labels,base:v(105,.25,185)};
}
