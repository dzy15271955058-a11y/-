import {createKit,C} from './kit.js';
import {makeCharacters} from './characters.js';
import {PEOPLE} from './adventure-state.js';

// The party grows in the original island, with space for guests and a clear entry.
export function createFestivalDisplay(W,state,reduced=false){
 if(!W.island?.land)return {update(){}};
 const K=createKit(),A=makeCharacters(K),root=K.group(W.island.land,'星光嘉年华 · 筹备中的海上展台',-10,.9,68);
 root.userData.live=true;
 K.box(root,0,-.25,0,18,.5,12,C.cream,.12);
 K.box(root,0,-.18,-8.2,3.2,.36,5.4,C.wood,.04);
 for(const x of [-8,0,8])for(const z of [-5,5])K.cyl(root,x,-2.6,z,.18,.24,4.7,C.cream);
 for(const x of [-8.4,8.4]){K.rod(root,[x,.1,-5.4],[x,.1,5.4],.07,K.gold);for(let z=-5;z<=5;z+=2)K.rod(root,[x,0,z],[x,1.05,z],.04,K.gold);K.rod(root,[x,1.05,-5.4],[x,1.05,5.4],.045,K.gold);}
 K.rug(root,0,.03,.4,5.4,3.5,'#dbaaC9');
 K.arch(root,0,0,4.6,7,5,C.cream,.26);
 const star=K.star(root,0,5.15,4.6,.64,K.gold);star.userData.live=true;
 const bouquets=K.group(root,'收集来的山谷花艺'),banners=K.group(root,'手工制作的缎带帷幔'),foods=[],guests=[];
 bouquets.userData.live=banners.userData.live=true;
 for(const x of [-6.7,6.7])for(const z of [-3.5,3.5]){K.cyl(bouquets,x,.5,z,.46,.32,1,C.white);K.bouquet(bouquets,x,1.02,z,1.6);}
 for(const x of [-3.45,3.45]){K.box(banners,x,2.2,4.75,.76,3.8,.09,K.mat('#d58eb8',{roughness:.36,sheen:.9}),.03);K.torus(banners,x,1.6,4.68,.35,.06,K.gold);}
 K.tube(banners,[[-3.4,4.1,4.6],[-1.7,3.65,4.6],[0,4.1,4.6],[1.7,3.65,4.6],[3.4,4.1,4.6]],.10,C.rose);
 for(let i=0;i<4;i++){const x=-5.8+i*3.85;K.table(root,x,0,3.2,.84,.96);const g=K.group(root,'亲手准备的宴会餐点');g.userData.live=true;K.cake(g,x,1.02,3.2,.52);K.cup(g,x+.4,1.02,3.1);foods.push(g);K.optimize(g);}
 for(const [i,id]of ['mira','joey','neri'].entries()){const p=PEOPLE[id],g=A.doll(root,-3.6+i*3.6,.03,.2,{style:p.style,color:p.color,name:p.name+' · 嘉年华嘉宾',rotation:Math.PI});g.userData.live=true;K.optimize(g);guests.push({id,g,x:g.position.x});}
 K.optimize(bouquets);K.optimize(banners);K.optimize(root);
 W.interactions?.items.push({object:root,action:'worldFestival',label:'星光嘉年华筹备'});
 function update(time=0){const w=state.world;root.visible=w.started||w.flags.prologue===true;bouquets.visible=w.festival.flowers>=4;banners.visible=w.festival.cloth>=4;foods.forEach((g,i)=>g.visible=i<w.festival.food);guests.forEach(({id,g,x},i)=>{g.visible=w.invited.includes(id);g.position.x=x+(w.festival.complete&&!reduced?Math.sin(time*.85+i)*.18:0);g.rotation.y=Math.PI+(w.festival.complete&&!reduced?Math.sin(time*1.2+i)*.20:0);});star.rotation.y=reduced?0:time*.3;}
 update();return {root,bouquets,banners,foods,guests,update};
}
