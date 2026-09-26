import {T,C,v} from './kit.js';
import {makeCharacters} from './characters.js';
import {makeCreatures} from './creatures.js';
import {buildRoyalCastle,buildFantasyForest,sculptGardenTree} from './fantasy-forest.js';
export function buildSkyCity(K,root){
 const {group,box,ell,cyl,disk,rod,tube,torus,mesh,mat,gold,glass,glow,arch,column,flower,bouquet,chair,table,book,star}=K,A=makeCharacters(K),B=makeCreatures(K);
 const sky=group(root,'天空之城 · 水晶与花的国度',-85,42,-80),live=group(sky,'云端生命'),movers={dancers:[],fairies:[]};live.userData.live=true;
 const crystal=mat('#bfaae9',{roughness:.14,metalness:.14,clearcoat:1,iridescence:.45}),pane=mat('#dfcaff',{transparent:true,opacity:.23,depthWrite:false,roughness:.12,metalness:.15,side:T.DoubleSide});crystal.userData.sparkle=true;
 ell(sky,0,-4.7,0,47,4.5,40,'#d8d4ea',48);ell(sky,0,-.05,0,44,.65,37,'#a8d4bd',48);
 for(let i=0;i<38;i++){let a=i*Math.PI/19;ell(sky,Math.cos(a)*43,-4.5+Math.sin(i)*1.5,Math.sin(a)*36,5,2.6,4.2,'#fff1fb',20);}
 const bridge=group(root,'彩虹云桥');let path=[];for(let i=0;i<=60;i++){let f=i/60;path.push([-36-f*35,34+f*8+Math.sin(f*Math.PI)*2,-43-f*7]);}for(let i=0;i<path.length-1;i++){let p=path[i],q=path[i+1],d=v(...q).sub(v(...p));let step=box(bridge,...p,3,.16,d.length()+.09,C.cream,.08);step.rotation.y=Math.atan2(d.x,d.z);for(let side of [-1,1]){let xx=p[0]+side*1.3;rod(bridge,[xx,p[1],p[2]],[xx,p[1]+1.1,p[2]],.024,gold);if(i%5===0)ell(bridge,xx,p[1]+1.15,p[2],.065,.065,.065,glow,10);}}
 for(let side of [-1,1])tube(bridge,path.map(p=>[p[0]+side*1.3,p[1]+1.1,p[2]]),.033,gold,false,90);
 const castle=buildRoyalCastle(K,sky);
 // A visible stage, backstage dressing props, and twelve distinct costumes.
 const theater=group(sky,'十二公主芭蕾剧院',-29,.45,9);box(theater,0,.12,0,22,.45,18,C.cream,.3);box(theater,0,.62,-3,19,.7,9,'#c69673',.15);for(let i=0;i<40;i++)box(theater,-9.1+i*.46,1.0,-3,.017,.018,8.6,'#9c705e',0);
 box(theater,0,5.7,-7.4,20,10,.28,'#663551',0);arch(theater,0,1,-.2,18,10,gold,.22);arch(theater,0,1,-.18,17,9.5,C.cream,.14);for(let d of [-1,1]){column(theater,d*9,1,-.2,9,.30);for(let i=0;i<8;i++)ell(theater,d*(7.15+i*.24),5.6,-.32,.25,4.3,.20,A.satin('#982958'),20);for(let j=0;j<5;j++)box(theater,d*9.4,.12+j*.16,1.5-j*.40,2.1,.18,.8,C.cream,.05);}
 for(let i=0;i<20;i++){ell(theater,-8.8+i*.93,1.14,1.2,.07,.07,.07,glow,12);A.flowerApplique(theater,-8.8+i*.93,9.9,-.05,.17,C.rose);}
 for(let r=0;r<3;r++){let h=.03+r*.12;box(theater,0,.34+h/2,3.7+r*1.45,18,h,1.45,C.blush,.01);}
 for(let r=0;r<3;r++)for(let c=0;c<8;c++)chair(theater,(c-3.5)*2.15,.37+r*.12,3.7+r*1.45,C.rose,Math.PI);
 const hues=[C.pink,C.blue,C.violet,C.mint,C.peach,'#cb4262',C.rose,'#ddd1a6','#91afdf','#bc73bd','#f2c7d7','#71c8c4'];
 for(let i=0;i<12;i++){let x=(i%6-2.5)*2.45,z=-1.8-Math.floor(i/6)*3;let d=A.doll(live,-29+x,1.46,9+z,{style:i%3?'ballet':'swan',color:hues[i],pose:'ballet',hair:i%4===0?'#754d44':i%4===1?'#c99557':'#ead09a',hairStyle:'bun',rotation:(i%3-1)*.2,name:`第${i+1}位跳舞的公主`});movers.dancers.push({g:d,rot:d.rotation.y});}
 for(let d of [-1,1]){K.dress(theater,d*10.5,1,-4,C.violet,.7,2);let shoes=group(theater,'备用粉红舞鞋与长缎带',d*9.8,1.5,-2);for(let k of [-1,1]){ell(shoes,k*.10,0,0,.08,.05,.22,A.satin(C.rose),20);tube(shoes,[[k*.1,.02,-.1],[k*.24,.15,-.45],[k*.05,.06,-.75],[k*.29,.01,-.95]],.014,A.satin(C.rose),false,24);}}
 // Open library and princess academy, with a mezzanine and miniature desk supplies.
 const library=group(sky,'星光图书馆与公主课堂',28,.5,-19);box(library,0,.1,0,19,.35,21,C.cream,.3);box(library,0,4.2,-10,19,8,.3,C.blush,.03);
 for(let x of [-7.6,-3.8,0,3.8,7.6]){column(library,x,0,-8.6,8,.14);arch(library,x,.3,-9.7,3.4,7.4,gold,.09);for(let j=0;j<6;j++){let y=.7+j*1.0;box(library,x,y,-9.3,3.15,.09,.60,C.cream,.02);for(let k=0;k<12;k++){let b=box(library,x-1.36+k*.24,y+.35,-9.15,.15,.46+(k%3)*.09,.30,hues[(j+k)%hues.length],.015);b.rotation.z=(k%7-3)*.015;box(library,b.position.x,y+.27,-8.99,.10,.018,.009,gold,0);}}}
 box(library,0,4.6,-6.9,18,.25,4.8,C.cream,.12);for(let i=0;i<30;i++){let xx=-8.7+i*.6;rod(library,[xx,4.8,-4.5],[xx,5.85,-4.5],.025,gold);}rod(library,[-9,5.9,-4.5],[9,5.9,-4.5],.04,gold);
 for(let i=0;i<23;i++)box(library,8.3,.22+i*.195,5.7-i*.50,1.6,.22,.62,C.cream,.04);
 for(let row=0;row<3;row++)for(let col=0;col<3;col++){let x=(col-1)*4,z=row*2.5;box(library,x,1.15,z,2.5,.13,1.35,C.rose,.10);for(let d of [-1,1])for(let f of [-1,1])rod(library,[x+d,0,z+f*.5],[x+d,1.1,z+f*.5],.035,gold);chair(library,x,.28,z+1.1,C.rose,Math.PI);book(library,x-.3,1.25,z,C.violet,.5);rod(library,[x+.4,1.26,z-.2],[x+.65,1.26,z+.15],.017,C.gold);A.crown(library,x+.65,1.28,z-.2,.6);}
 box(library,0,3,-3.4,5.5,2.4,.13,'#547779',.10);for(let i=0;i<5;i++)star(library,-1.9+i*.95,3.35,-3.31,.13,C.cream,.014);for(let x of [-9,9]){column(library,x,.27,1,8.05,.16);box(library,x,8.36,-4.5,.22,.20,11.4,C.cream);}box(library,0,8.36,1,18.3,.22,.28,C.cream);K.chandelier(library,0,7,1,1.5,8.25);
 for(let i=0;i<3;i++)A.doll(library,-2+i*4,.28,6.9,{style:'uniform',color:C.pink,pose:'read',hairStyle:i===1?'tinsel':'bun',scale:.85,name:'公主学院学生'});
 let librarian=A.fairy(live,24,5.4,-23,.8,C.violet);movers.fairies.push({g:librarian,y:5.4});book(librarian,0,1.52,.42,C.blue,.45);ell(library,-3,2.4,2,.16,.16,.16,glow,20);ell(library,-2,.5,2,.32,.38,.3,C.violet,24);B.eyes(library,.11,.57,2.29,.035);
 // Swan lake has its own basin; flower paths connect the lake and magical forest.
 let lake=group(sky,'天鹅湖',2,.5,23);ell(lake,0,-.2,0,14,.5,8.3,C.cream,48);let water=disk(lake,0,.0,0,1,.05,mat('#86d7de',{roughness:.12,metalness:.45,clearcoat:1}));water.scale.set(13,1,7.5);
 for(let i=0;i<5;i++){let a=i*2.1;let g=B.swan(live,2+Math.cos(a)*8,.65,23+Math.sin(a)*3.5,1.3);g.rotation.y=-a;}
 let odette=A.doll(sky,-12,.427,23,{style:'swan',color:C.blue,pose:'ballet',hairStyle:'bun',name:'天鹅湖的舞者'});A.wings(odette,.75,C.rose);
 for(let i=0;i<110;i++){let a=i*2.399,r=14.5+(i%5)*.4,x=2+Math.sin(a)*r,z=23+Math.cos(a)*9.0;if(z<35)flower(sky,x,.46,z,.26+(i%4)*.055,[C.rose,C.violet,C.white,C.peach][i%4]);}
 for(let i=0;i<21;i++){let a=i*2.4,x=Math.sin(a)*(37+i%3),z=Math.cos(a)*(31+i%3);if(z<-10&&x>12)continue;sculptGardenTree(K,sky,x,.5,z,.94+(i%4)*.08,i+80,i%7===0);if(i%3===0)B.rabbit(sky,x-1,.5,z+1,.8);if(i%5===0)B.horse(sky,x+1,.5,z+1,{deer:true,scale:.8});}
 const garden=group(sky,'花仙子神秘花园',28,.5,14);
 for(let i=0;i<5;i++){let a=i*2.4,x=Math.cos(a)*7.2,z=Math.sin(a)*5.6,h=5+i%3;if(i===2)x-=3.8;let stem=tube(garden,[[x,0,z],[x+.7,h*.5,z],[x,h,z]],.12,'#529c74',false,26);K.blossom(garden,x,h-.02,z,2.75,[C.rose,'#da9ae6','#f2a6c4'][i%3],'lotus',i);disk(garden,x,h,z,1.2,.12,C.blush);ell(garden,x,h+.19,z,.70,.20,.45,C.cream,20);K.pillow(garden,x-.4,h+.4,z,C.violet,.5);ell(garden,x,h-.20,z,.22,.35,.22,glow,16);for(let j=0;j<3;j++)K.leaf(garden,x,h*.24+j,z,2.3-j*.16,(j%2?1:-1)*1.1+i*.25,-.42);}

 const portal=group(garden,'古树中的神秘之门',0,0,-6);for(let d of [-1,1])tube(portal,[[d*2,0,0],[d*2.8,3,0],[d*1.9,6.5,0],[0,8,0]],.55,'#8f7ca4',false,24);arch(portal,0,0,.18,4.0,6.6,gold,.11);box(portal,0,2.7,.1,3.6,5.3,.08,pane,.5);for(let i=0;i<12;i++){let a=i*Math.PI/6;let q=ell(portal,Math.sin(a)*1.1,3.4+Math.cos(a)*1.8,.21,.30,.64,.025,A.glitter(hues[i]),16);q.rotation.z=-a;A.gem(portal,Math.sin(a)*1.5,3.4+Math.cos(a)*2.1,.25,.09,C.cream);}for(let i=0;i<18;i++)flower(portal,(i%2?1:-1)*(2.5+.35*Math.sin(i)),.08,Math.cos(i)*1.0,.27+(i%3)*.06,[C.rose,C.blush,C.cream][i%3]);for(let i=0;i<7;i++){let a=i*Math.PI/6;K.flowerSpray(portal,Math.cos(a)*2.5,6.15+Math.sin(a)*1.65,.15,.64,[C.rose,C.blush,C.violet][i%3]);}
 for(let i=0;i<5;i++){let x=24+(i%3)*3,z=8+Math.floor(i/3)*6,y=3+(i%3)*1.3;let f=A.fairy(live,x,y,z,.65,hues[i]);movers.fairies.push({g:f,y});}
 // Telescope, tiny planets and a fully dressed astronaut above the cloud palace.
 let astro=group(sky,'星际观测台',28,10,-5);cyl(sky,28,5,-5,2.5,2.8,10,C.cream,36);for(let i=0;i<60;i++){let a=i/59*Math.PI*4,y=.36+i/59*9.6;let st=box(sky,28+Math.sin(a)*3.0,y,-5+Math.cos(a)*3.0,1.0,.13,.78,C.cream,.025);st.rotation.y=a;rod(sky,[28+Math.sin(a)*3.48,y,-5+Math.cos(a)*3.48],[28+Math.sin(a)*3.48,y+1,-5+Math.cos(a)*3.48],.02,gold);}disk(astro,0,0,0,4,.22,C.cream);torus(astro,0,.15,0,3.5,.08,gold,true);for(let i=0;i<12;i++){let a=i*Math.PI/6;rod(astro,[Math.sin(a)*3.7,.1,Math.cos(a)*3.7],[Math.sin(a)*3.7,1.2,Math.cos(a)*3.7],.02,gold);}A.doll(astro,0,.18,1,{style:'astronaut',color:C.rose,pose:'astronaut',hairStyle:'bun',name:'芭比宇航员'});let scope=cyl(astro,-1.5,1.8,-1,.30,.38,1.8,C.cream,32);scope.rotation.z=-.9;rod(astro,[-1.5,0,-1],[-1.5,1.5,-1],.08,gold);for(let i=0;i<3;i++){let x=6+i*3;ell(astro,x,2+i*2,-6,1.1-i*.2,1.1-i*.2,1.1-i*.2,hues[i],24);let ring=torus(astro,x,2+i*2,-6,1.8-i*.2,.03,gold);ring.rotation.x=.8;}
 movers.pegasus=B.horse(live,-18,12,15,{pegasus:true,pose:1,scale:2.3});movers.pegasus.rotation.y=-.6;for(let w of movers.pegasus.userData.wings)w.userData.live=true;
 const forest=buildFantasyForest(K,sky,live,movers);
 return {sky,bridge,live,movers,forest,castle};
}
