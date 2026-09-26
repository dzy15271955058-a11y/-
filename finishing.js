import {C,T} from './kit.js';
import {makeCharacters} from './characters.js';
export function addFinishing(K,W){
 const A=makeCharacters(K),{group,ell,box,cyl,tube,torus,rod,gold}=K;
 const picnic=group(W.island.land,'沙滩野餐 · 圣代与零食',-3,1.1,50);
 const sundae=group(picnic,'草莓巧克力圣代',.9,0,.1);cyl(sundae,0,.23,0,.17,.12,.44,C.rose,24);cyl(sundae,0,.015,0,.22,.22,.03,C.cream,24);ell(sundae,0,.49,0,.19,.14,.19,'#6f4a43',20);let swirl=[];for(let i=0;i<72;i++){let t=i/71,a=t*Math.PI*7,r=.17*(1-t);swirl.push([Math.sin(a)*r,.51+t*.25,Math.cos(a)*r]);}tube(sundae,swirl,.029,C.cream,false,80);ell(sundae,.08,.76,0,.08,.10,.07,C.hot,16);box(sundae,-.14,.76,-.02,.08,.29,.025,'#d8a979',.02);rod(sundae,[.16,.3,0],[.30,.76,.02],.009,gold);ell(sundae,.31,.8,.02,.035,.057,.014,gold,12);
 for(let i=0;i<4;i++){let g=group(picnic,'小块寿司',-.7+i*.20,.04,-.5);box(g,0,.03,0,.15,.10,.21,C.cream,.04);box(g,0,.09,0,.17,.08,.22,C.peach,.03);box(g,0,.07,0,.04,.16,.225,'#56766d',0);}
 for(let i=0;i<3;i++){let g=group(picnic,'牛角面包',-.65+i*.37,.08,.2);tube(g,[[-.13,0,0],[-.12,.04,.11],[0,.08,.16],[.12,.04,.11],[.13,0,0]],.07,'#d9a16d',false,24);for(let j=0;j<4;j++)tube(g,[[-.08+j*.055,.11,.11],[-.04+j*.055,.09,.19]],.008,'#b97e50',false,8);}
 const corn=group(picnic,'玉米与水果',-.4,.06,.75);ell(corn,0,.06,0,.14,.11,.38,'#ead08a',20);for(let j=0;j<7;j++)for(let i=0;i<8;i++){let a=i*Math.PI/4;ell(corn,Math.sin(a)*.125,.1+Math.cos(a)*.07,-.27+j*.08,.025,.025,.035,C.gold,8);}K.bottle(picnic,.9,0,.65,C.peach);K.bottle(picnic,1.2,0,.65,C.aqua);
 let kitty=group(picnic,'美人鱼小猫玩偶',1.5,0,-.3);ell(kitty,0,.4,0,.20,.26,.15,C.cream,20);ell(kitty,0,.77,0,.30,.23,.17,C.white,24);for(let d of [-1,1]){let e=cyl(kitty,d*.22,.98,0,0,.10,.22,C.white,3);ell(kitty,d*.10,.77,.17,.018,.026,.011,'#3c3a48',10);for(let j=0;j<3;j++)rod(kitty,[d*.21,.7+j*.04,.15],[d*.34,.7+j*.04,.15],.006,'#5c4555');}ell(kitty,0,.72,.18,.024,.017,.015,C.gold,12);A.bow(kitty,.22,.94,.14,.48,C.pink);tube(kitty,[[0,.35,0],[0,.20,.2],[0,.1,.38]],.15,A.glitter(C.aqua),false,18);for(let d of [-1,1])ell(kitty,d*.14,.06,.5,.20,.05,.14,A.tulle(C.violet),20);
 // Finish the actual worktop material, without adding a second slab over the seats.
 const {room:kitchen,worktop}=W.mansion.kitchen;
 worktop.material=A.glitter(C.cream);worktop.geometry.computeBoundingBox();
 const top=worktop.position.y+worktop.geometry.boundingBox.max.y;
 const fruit=group(W.mansion.kitchen.props,'岛台上的水果盘',.9,top,1.62);
 box(fruit,0,.02,0,.72,.04,.4,C.blush,.03);
 for(let i=0;i<6;i++)ell(fruit,-.2+(i%3)*.2,.13,-.09+Math.floor(i/3)*.18,.065,.09,.06,C.hot,16);
 const snowmobile=group(W.coast.snow,'粉色雪地摩托与冬日旅人',68,1.3,-31);box(snowmobile,0,.7,0,.55,.8,2.5,C.rose,.28);ell(snowmobile,0,1.2,-.3,.23,.18,1.0,C.cream,24);for(let d of [-1,1]){tube(snowmobile,[[d*.75,.14,.1],[d*.75,.12,1.9],[d*.75,.35,2.2]],.08,gold,false,24);rod(snowmobile,[d*.7,.6,.5],[d*.75,.12,1.3],.055,C.cream);}box(snowmobile,0,.2,-.65,1.2,.5,1.8,'#696073',.18);for(let i=0;i<10;i++)box(snowmobile,0,.03,-1.3+i*.16,1.24,.04,.05,'#aa91ac',.01);box(snowmobile,0,1.52,1.0,1.2,.55,.045,K.glass,.15).rotation.x=-.35;rod(snowmobile,[-.55,1.55,.5],[.55,1.55,.5],.04,gold);for(let d of [-1,1])ell(snowmobile,d*.47,.98,1.31,.23,.12,.035,K.glow,16);for(let d of [-1,1])box(snowmobile,d*.40,.785,.40,.25,.08,.60,gold,.03);let rider=A.doll(snowmobile,0,.45,-.15,{style:'pajamas',color:C.violet,pose:'riding',hairStyle:'bun',scale:.75,name:'雪地旅行者'});for(let i=0;i<12;i++){let a=i*Math.PI/6;ell(rider,Math.sin(a)*.28,1.85,Math.cos(a)*.20,.065,.065,.065,C.cream,10);}
 const bedroom=group(W.mansion.upper,'公主花园卧室小细节',-10,8.55,-18);let lattice=[];for(let i=0;i<16;i++){let a=i*Math.PI/8;let f=K.flower(bedroom,Math.sin(a)*2.2,.12,Math.cos(a)*2.2,.13,C.rose);}
}
