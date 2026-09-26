import {C} from './kit.js';
import {makeCharacters} from './characters.js';
import {makeCreatures} from './creatures.js';
export function buildLifePlaces(K,island){
 const A=makeCharacters(K),B=makeCreatures(K),land=K.group(island.land,'梦想生活 · 农场与沙堡'),farm=K.group(land,'后花园农场',-10,.96,-79);
 // A supported garden terrace joins the north drive without covering its road surface.
 K.box(farm,0,-.48,0,23,1,12,'#cdb59a',.18);K.box(farm,0,.06,0,22.8,.12,11.8,'#a7bf8b',.12);for(let i=0;i<7;i++)K.box(land,-10,.97,-68.5-i*.7,2.4,.16,.62,'#e9d2b8',.025);
 for(let i=0;i<12;i++){for(let z of [-5.7,5.7]){if(z>0&&Math.abs(-10+i*1.85)<1.8)continue;K.box(farm,-10+i*1.85,.66,z,.12,1.2,.12,C.cream,.02);}}for(let z of [-5.7,5.7])for(let side of [-1,1])K.box(farm,side*6.4,.86,z,9.5,.10,.10,C.cream,.01);
 const plots=K.group(farm,'农场播种入口',-3,.20,0);plots.userData.live=true;
 for(let i=0;i<6;i++){const x=(i%3-1)*2.55,z=i<3?-2:1.2;K.box(plots,x,0,z,2.15,.25,2.35,'#79593e',.07);for(let side of [-1,1])K.box(plots,x+side*1.1,.1,z,.12,.36,2.5,'#cfa984',.01);for(let j=0;j<5;j++){let xx=x+(j%2-.5)*.65,zz=z+(Math.floor(j/2)-1)*.60;K.rod(plots,[xx,.1,zz],[xx,.65,zz],.021,'#63864e');for(let k=0;k<3;k++){const leaf=K.ell(plots,xx+(k%2-.5)*.20,.32+k*.10,zz,.16,.055,.09,'#6caa69',12);leaf.rotation.z=k%2?.4:-.4;}if(i%2)K.ell(plots,xx,.51,zz,.08,.15,.07,'#d5b052',12);else K.ell(plots,xx+.08,.25,zz+.07,.10,.14,.09,'#d14672',12);}}
 const pets=K.group(farm,'小动物照料入口',6,.16,0);pets.userData.live=true;K.box(pets,0,.5,-2.8,3,1,1.8,'#e5bdd0',.07);const roof=K.cyl(pets,0,1.42,-2.8,.0,2,1,C.rose,4);roof.rotation.y=Math.PI/4;K.box(pets,0,.55,-1.86,.85,.85,.04,'#6d4a57',.02);B.rabbit(pets,-1.3,0,.3,1.25);A.cat(pets,.3,0,1.2,1.1);B.horse(pets,1.5,0,-.5,{deer:true,scale:.75,color:'#c59b7a'});K.disk(pets,-1,.1,1.8,.4,.15,K.gold);K.disk(pets,-1,.19,1.8,.33,.035,'#9d724a');K.arch(farm,0,.1,5.65,2.8,2.8,C.cream,.09);for(let x of [-1.5,1.5])K.bouquet(farm,x,2.5,5.65,.65);
 const sand=K.group(land,'沙滩沙堡创作入口',6,.91,54.5);sand.userData.live=true;K.box(sand,0,.035,0,5,.08,4,'#edd3a6',.08);for(let x of [-1,1]){K.cyl(sand,x,.54,0,.35,.43,1.05,'#ddbd8a',32);K.cyl(sand,x,1.24,0,.015,.46,.54,'#e1bd89',32);K.rod(sand,[x,1.49,0],[x,1.98,0],.02,K.gold);K.box(sand,x+.14,1.84,0,.29,.18,.025,C.rose,.01);}K.arch(sand,0,.08,.1,1.2,.9,'#e0bd89',.18);K.cyl(sand,-1.9,.35,1,.29,.22,.57,C.rose,24);K.torus(sand,-1.9,.66,1,.27,.025,K.gold,true);
 const blocks=K.group(land,'海滩积木工坊入口',-6,.91,45);blocks.userData.live=true;K.box(blocks,0,.80,0,2.8,.10,2.8,C.cream,.06);for(let x of [-1.2,1.2])for(let z of [-1.2,1.2])K.rod(blocks,[x,0,z],[x,.75,z],.06,K.gold);K.box(blocks,0,.87,0,2.4,.025,2.4,'#d7c7df',.02);K.optimize(blocks);
 K.optimize(plots);K.optimize(pets);K.optimize(sand);K.optimize(land);
 return {land,plots,pets,sand,blocks};
}
