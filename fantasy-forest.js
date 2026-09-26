import {T,C,v} from './kit.js';
import {makeCharacters} from './characters.js';
import {makeCreatures} from './creatures.js';
const noise=i=>{let q=Math.sin(i*127.1+19.7)*43758.5453;return q-Math.floor(q);};

export function sculptGardenTree(K,p,x,y,z,s=1,seed=0,flowering=false){
 const tree=K.group(p,flowering?'疏枝繁花树':'透光的分枝森林乔木',x,y,z);tree.scale.setScalar(s);
 const lean=(noise(seed)-.5)*1.2,h=6.4+noise(seed+1)*1.3;
 K.tube(tree,[[0,0,0],[lean*.1,1.7,0],[lean*.4,3.9,.1],[lean,h,0]],.15,flowering?'#997766':'#786950',false,22);
 for(let i=0;i<5;i++){let a=i*2.4;K.tube(tree,[[Math.cos(a)*.8,.02,Math.sin(a)*.8],[Math.cos(a)*.2,.35,Math.sin(a)*.2],[0,1.2,0]],.06,'#786950',false,12);}
 for(let i=0;i<8;i++){
  const a=i*2.399+seed,y=2.6+i*.43,r=1.25+(7-i)*.19,tip=v(Math.cos(a)*r+lean*.7,y+1.0,Math.sin(a)*r);
  K.tube(tree,[[lean*.3,y-.55,0],[Math.cos(a)*r*.52,y+.25,Math.sin(a)*r*.4],tip.toArray()],.058-(i%3)*.006,'#94775e',false,15);
  for(let j=0;j<11;j++){let b=j*2.399+a,rr=.25+noise(seed+i*11+j)*.66,xx=tip.x+Math.cos(b)*rr,zz=tip.z+Math.sin(b)*rr,yy=tip.y+Math.sin(j*1.7)*.27;K.rod(tree,tip.toArray(),[xx,yy,zz],.014,'#a88b64');K.leaf(tree,xx,yy,zz,(flowering?.58:.87)*(1+noise(j+seed)*.25),b,-.30+noise(i+j)*.65);if(flowering&&j%2===0){const f=K.blossom(tree,xx,yy+.09,zz,.12+noise(j+i)*.035,[C.blush,'#f1b4d0','#fff0f3'][j%3],'rose',j,0);f.rotation.x=(noise(j+7)-.5)*.65;}}
 }
 return tree;
}

export function buildRoyalCastle(K,sky){
 const A=makeCharacters(K),g=K.group(sky,'皇家天空城堡',0,.4,-15),stone=K.mat('#f5dbe9',{roughness:.47}),ivory=K.mat('#fff5e4',{roughness:.4}),roof=K.mat('#82558f',{metalness:.18,roughness:.28,clearcoat:.5}),pane=K.mat('#b7c8eb',{metalness:.25,roughness:.15,emissive:'#83709d',emissiveIntensity:.12});
 K.box(g,0,.17,0,25,.42,24,ivory,.18);
 function window(p,x,y,z,w,h){const q=K.group(p,'花饰尖拱窗',x,y,z);K.arch(q,0,0,0,w,h,K.gold,.047);K.box(q,0,h*.45,-.035,w*.82,h*.76,.04,pane,.08);K.rod(q,[0,.08,.05],[0,h-.20,.05],.024,ivory);for(let yy of [h*.27,h*.55])K.rod(q,[-w*.38,yy,.04],[w*.38,yy,.04],.018,ivory);K.blossom(q,0,h+.15,.04,.16,C.blush,'rose',1);return q;}
 // A walled main hall with an actual open central entry.
 for(let x of [-8.1,8.1])K.box(g,x,7,10.5,8.2,14,.42,stone,.05);K.box(g,0,11.6,10.5,8.2,4.8,.42,stone,.04);
 K.arch(g,0,.38,10.77,6.8,8.7,ivory,.29);K.arch(g,0,.38,10.85,6.35,8.25,K.gold,.06);
 K.box(g,0,7,-10.5,24.5,14,.4,stone,.05);for(let x of [-12,12])K.box(g,x,7,0,.4,14,21,stone,.05);
 for(let yy of [.8,6.8,13.6]){K.box(g,0,yy,10.84,25,.20,.45,ivory,.04);K.box(g,0,yy,-10.7,25,.20,.45,ivory,.04);for(let x of [-12.2,12.2])K.box(g,x,yy,0,.45,.20,21.5,ivory,.04);}
 // The lower entrance cornice stays above the doorway rather than barring it.
 const barred=g.children.filter(o=>o.isMesh&&o.position.z===10.84&&[.8,6.8].includes(o.position.y));for(let b of barred){b.removeFromParent();for(let x of [-8.1,8.1])K.box(g,x,b.position.y,10.84,8.2,.2,.45,ivory,.04);}
 for(let x of [-9.7,-6.2,6.2,9.7])for(let y of [1.5,8.0])window(g,x,y,10.78,2.1,4.3);
 for(let x of [-11.5,-4.1,4.1,11.5])K.column(g,x,.4,10.86,13.2,.15);
 for(let side of [-1,1])for(let z of [-6.3,0,6.3]){let w=window(g,side*12.25,3,z,2.5,6.5);w.rotation.y=side*Math.PI/2;}
 const hip=K.mesh(g,new T.ConeGeometry(17.6,7.7,4),roof,0,17.7,0);hip.rotation.y=Math.PI/4;hip.scale.z=.86;
 for(let x of [-7.6,0,7.6]){K.box(g,x,15.3,8.7,3.6,3.3,3.5,stone,.06);let r=K.mesh(g,new T.ConeGeometry(3.2,4.1,4),roof,x,18.8,8.7);r.rotation.y=Math.PI/4;window(g,x,14.1,10.53,2.4,2.8);}
 function tower(x,z,h,r,colour=roof,base=0){let t=K.group(g,'错落的皇家尖塔',x,base,z);K.cyl(t,0,h/2,0,r,r+.22,h,ivory,40);for(let y of [.6,h*.48,h-.18])K.cyl(t,0,y,0,r+.17,r+.17,.20,K.gold,40);for(let i=0;i<8;i++){let a=i*Math.PI/4;for(let yy of [2.2,h*.58]){let w=window(t,Math.sin(a)*(r+.03),yy,Math.cos(a)*(r+.03),r*.68,h*.28);w.rotation.y=a;}K.column(t,Math.sin(a)*(r+.05),.4,Math.cos(a)*(r+.05),h-.6,.065);}K.cyl(t,0,h+.25,0,r+.62,r+.42,.7,ivory,40);K.cyl(t,0,h+4.5,0,0,r+.8,8.0,colour,48);for(let k=0;k<3;k++)K.torus(t,0,h+.7+k*1.12,0,(r+.8)*(1-k*.14),.035,K.gold,true);K.rod(t,[0,h+8.3,0],[0,h+9.7,0],.035,K.gold);K.star(t,0,h+9.3,0,.26,K.gold);return t;}
 tower(-13.3,9.2,17.3,2.35);tower(13.3,9.2,19.0,2.55);tower(-12.1,-10.1,23.0,2.55);tower(12.5,-10.0,21.0,2.35);tower(0,-6.0,12,3.0,K.mat('#be6ab0',{metalness:.2,roughness:.28}),14);
 K.torus(g,0,11.2,11.02,1.3,.08,K.gold);for(let i=0;i<12;i++){let a=i*Math.PI/6;K.ell(g,Math.sin(a)*1.09,11.2+Math.cos(a)*1.09,11.04,.035,.06,.025,K.gold,10);}K.rod(g,[0,11.2,11.10],[0,12.01,11.10],.022,K.gold);K.rod(g,[0,11.2,11.10],[.51,10.9,11.10],.026,K.gold);
 for(let i=0;i<6;i++)K.box(g,0,.03+i*.061,12.6-i*.29,6.8,.12,1.8,ivory,.04);
 K.box(g,0,13.95,0,24.1,.20,20.7,ivory,.02);K.chandelier(g,0,9.4,0,2.0,13.85);K.rug(g,0,.40,0,6.3,7.6,C.blush);K.curvedSofa(g,0,.42,-6,4.3,Math.PI,Math.PI*2,C.rose);K.tea(g,0,.42,-3,1.4);
 A.doll(g,0,.44,2.8,{style:'swan',color:C.violet,pose:'ballet',hairStyle:'bun',name:'水晶宫公主'});A.doll(g,3,.44,0,{style:'sugar',color:C.rose,pose:'wave',hairStyle:'bun',name:'糖果公主'});
 return g;
}

export function buildFantasyForest(K,sky,live,movers){
 const A=makeCharacters(K),B=makeCreatures(K),forest=K.group(sky,'秘境森林 · 古树溪谷与精灵村',-69,.4,-14),motion=K.group(forest,'森林的光与生命');motion.userData.live=true;
 const flow=x=>8+Math.sin(x*.13)*3,leafgreen=K.mat('#60834d',{roughness:.97}),water=K.mat('#91bbd3',{metalness:.24,roughness:.13,clearcoat:1,transparent:true,opacity:.69,depthWrite:false,side:T.DoubleSide}),glow=K.mat('#fff0b9',{emissive:'#f4df89',emissiveIntensity:.85});
 K.ell(forest,0,-4.3,0,32,4.7,37,'#b8b4c5',56);for(let i=0;i<19;i++){let a=i*2.399;K.ell(forest,Math.cos(a)*29,-4.1,Math.sin(a)*33,4.2,1.7,3.8,'#f5edfa',18);}
 const ps=[],ix=[],uv=[],nx=96,nz=100;for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){let x=-31+i/nx*62,z=-36+j/nz*72;ps.push(x,.48+.055*Math.sin(x*.6)*Math.cos(z*.4),z);uv.push(i/nx,j/nz);}for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){let k=j*(nx+1)+i,x=ps[k*3],z=ps[k*3+2];if((x/31)**2+(z/36)**2<.98&&Math.abs(x-flow(z))>2.0)ix.push(k,k+nx+1,k+1,k+1,k+nx+1,k+nx+2);}
 let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(ps,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(ix);geo.computeVertexNormals();const ground=K.mesh(forest,geo,leafgreen);ground.userData.live=true;ground.name='透过树隙的斑驳草地';
 const stream=new T.CatmullRomCurve3(Array.from({length:40},(_,i)=>{let z=-32+i/39*65;return v(flow(z),.39,z);}));
 K.tube(forest,stream.getPoints(70),1.65,K.mat('#b4bdb0',{roughness:.9}),false,100).scale.y=.12;
 const wp=[],wi=[];for(let i=0;i<=160;i++){let q=stream.getPoint(i/160),d=stream.getTangent(i/160),normal=v(-d.z,0,d.x).normalize();for(let s of [-1,1]){let p=q.clone().addScaledVector(normal,s*1.72);wp.push(p.x,p.y,p.z);}if(i<160){let k=i*2;wi.push(k,k+2,k+1,k+1,k+2,k+3);}}
 geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(wp,3));geo.setIndex(wi);geo.computeVertexNormals();K.mesh(forest,geo,water).name='清澈弯曲的林间溪水';
 for(let i=0;i<72;i++){let z=-31+i*.87,x=flow(z),side=i%2?1:-1;K.ell(forest,x+side*(1.72+noise(i)*.28),.31,z,.28+noise(i+4)*.3,.25,.40,'#8f9d79',14);if(i%3===0){for(let j=0;j<4;j++)K.leaf(forest,x+side*2.15,.5,z,.72,j*1.7,-.8);}}
 // A humpback bridge has a supported deck, steps and continuous rails.
 const bz=3.5,bx=flow(bz);for(let i=0;i<=28;i++){let t=i/28,x=bx-3.4+t*6.8,h=.61+Math.sin(t*Math.PI)*.78;K.box(forest,x,h,bz,.28,.18,2.0,'#cfb89e',.02);if(i%4===0)for(let d of [-1,1])K.rod(forest,[x,h,bz+d*.85],[x,h+1.05,bz+d*.85],.038,K.gold);}for(let d of [-1,1])K.tube(forest,Array.from({length:40},(_,i)=>{let t=i/39;return [bx-3.4+t*6.8,1.66+Math.sin(t*Math.PI)*.78,bz+d*.85];}),.044,'#efdcc3',false,50);
 for(let x of [bx-3.1,bx+3.1])for(let z of [bz-.72,bz+.72])K.column(forest,x,.05,z,.66,.13);
 // One small upstream cascade, with rippling threads rather than a solid white wall.
 const fx=flow(-28);for(let i=0;i<9;i++)K.ell(forest,fx+(i%3-1)*1.3,1.0+Math.floor(i/3)*1.45,-29.7-Math.floor(i/3)*.6,1.35,1.05,1.20,['#7a8671','#a6ae91','#879586'][i%3],20);
 const fall=K.group(forest,'苔岩上的层叠瀑布',fx,0,-28);for(let i=0;i<15;i++){let x=-1.2+i*.17;K.tube(fall,[[x,5.1,-1.4],[x,4.3,-1.1],[x+.05,3.1,-.7],[x-.04,2.4,-.5],[x+.05,.43,.4]],.045,water,false,35);}for(let i=0;i<10;i++)K.ell(fall,(noise(i)-.5)*2,.45,noise(i+5)*1.7,.24,.04,.18,'#e5f4f5',12);
 movers.forest={forest,motion,ground,stream,fireflies:[],flowMarks:[],fallDrops:[],peacocks:[],fairies:[],crown:null};const F=movers.forest;
 for(let i=0;i<22;i++){let q=K.ell(motion,0,.415,0,.08,.017,.36,K.mat('#e1f1f8',{transparent:true,opacity:.65,roughness:.2}),10);F.flowMarks.push({g:q,phase:i/22});}
 for(let i=0;i<18;i++){let q=K.ell(motion,fx+(noise(i)-.5)*2.2,2,-28,.026,.18,.025,glow,10);F.fallDrops.push({g:q,phase:i/18,x:q.position.x});}
 for(let i=0;i<39;i++){let a=i*2.399,r=21+noise(i+30)*7.6,x=Math.sin(a)*r,z=Math.cos(a)*r*1.12;if(Math.abs(x-flow(z))<4||x>22&&Math.abs(z)<6)continue;sculptGardenTree(K,forest,x,.50,z,1.2+noise(i+50)*.48,i+60,i%9===0);}
 for(let i=0;i<90;i++){let x=-27+noise(i+100)*54,z=-32+noise(i+200)*64;if((x/29)**2+(z/34)**2>.9||Math.abs(x-flow(z))<2.7||Math.hypot(x+12,z+8)<9||Math.hypot(x+1,z-5)<6)continue;for(let k=0;k<4;k++)K.leaf(forest,x,.5,z,.65+noise(i+k)*.45,k*1.9,-.75);if(i%3===0)K.flower(forest,x,.52,z,.24+noise(i)*.13,[C.violet,C.cream,C.rose][i%3],{seed:i+500});}
 // The reference's tree-grown architecture: buttress roots, warm windows, curled roofs and elevated porches.
 const home=K.group(forest,'古树生长的精灵树屋',-12,.52,-8);
 A.loft(home,[[0,3.9,3.2],[1.5,3.2,2.9],[4,2.35,2.25],[8,1.95,1.8],[12,1.2,1.1],[16,.42,.45]],K.mat('#917580',{roughness:.82}),44,.05);
 for(let i=0;i<7;i++){let a=i*2.399;K.tube(home,[[Math.sin(a)*6.1,0,Math.cos(a)*5.3],[Math.sin(a)*3.3,1.5,Math.cos(a)*3],[Math.sin(a)*1.6,6.6,Math.cos(a)*1.6],[Math.sin(a)*3.9,12+i%3,Math.cos(a)*3.2]],.22,'#b29793',false,28);}
 function hut(x,y,z,r,seed){let q=K.group(home,'花瓣屋顶与暖窗小屋',x,y,z);K.disk(q,0,.03,0,r+.55,.20,C.cream);K.cyl(q,0,1.4,0,r*.77,r,2.8,'#b898b9',28);for(let i=0;i<5;i++){let a=i*Math.PI*2/5;let win=K.group(q,'暖光叶形窗',Math.sin(a)*r*.87,.65,Math.cos(a)*r*.87);win.rotation.y=a;K.arch(win,0,0,0,.70,1.55,K.gold,.055);K.ell(win,0,.74,-.03,.27,.66,.045,glow,18);}let roof=K.mesh(q,new T.ConeGeometry(r+1,3.4,7),A.prism(seed%2?'#ad74ba':'#b881bd'),0,4.2,0);roof.rotation.y=seed;for(let i=0;i<7;i++){let a=i*Math.PI*2/7;K.tube(q,[[Math.sin(a)*(r+1),2.53,Math.cos(a)*(r+1)],[Math.sin(a)*r*.65,3.5,Math.cos(a)*r*.65],[0,5.9,0]],.028,K.gold,false,20);}K.ell(q,0,6,0,.11,.16,.11,glow,16);for(let i=0;i<9;i++){let a=i*Math.PI*2/9;K.rod(q,[Math.sin(a)*(r+.38),.16,Math.cos(a)*(r+.38)],[Math.sin(a)*(r+.38),.94,Math.cos(a)*(r+.38)],.026,K.gold);}K.torus(q,0,.95,0,r+.38,.03,K.gold,true);return q;}
 hut(0,0,1.4,2.2,1);hut(-3.6,5.4,-.8,1.5,2);hut(3.7,7.6,-1.0,1.4,3);hut(.3,12.7,0,1.65,4);
 for(let i=0;i<47;i++){let t=i/46,a=t*Math.PI*2.3;let q=K.box(home,Math.sin(a)*3.3,.3+t*7.3,Math.cos(a)*3.3,.80,.12,1.25,'#d7b8ab',.025);q.rotation.y=a;K.rod(home,[Math.sin(a)*3.8,.3+t*7.3,Math.cos(a)*3.8],[Math.sin(a)*3.8,1.3+t*7.3,Math.cos(a)*3.8],.018,K.gold);}
 for(let i=0;i<24;i++){let a=i*2.4,y=11+noise(i)*5.5,x=Math.sin(a)*(2.2+noise(i+5)*2.7),z=Math.cos(a)*(2+noise(i+6)*2);K.leaf(home,x,y,z,2.2,a,-.3);for(let j=0;j<4;j++)K.blossom(home,x,y-j*.31,z,.12+j*.012,[C.violet,'#9c80cb','#c4a5e5'][j%3],'rose',j,0);}
 // Colourful ironwork and stained glass remain visibly separate from the wood.
 const gate=K.group(forest,'彩窗卷草秘门',21,.52,-4);for(let d of [-1,1])K.tube(gate,[[d*2.5,0,0],[d*2.9,3,0],[d*1.9,6.7,0],[0,7.6,0]],.36,'#887e64',false,28);K.arch(gate,0,0,0,4.2,6.8,K.gold,.13);
 for(let i=0;i<12;i++){let a=i*Math.PI/6,spiral=[];for(let j=0;j<30;j++){let t=j/29,r=.43*(1-t);spiral.push([Math.sin(a)*1.47+Math.cos(t*8)*r,3.4+Math.cos(a)*2.4+Math.sin(t*8)*r,.08]);}K.tube(gate,spiral,.037,'#71456f',false,32);const gem=A.gem(gate,Math.sin(a)*1.62,3.4+Math.cos(a)*2.5,.08,.23,[C.rose,C.violet,C.blue,C.mint][i%4]);gem.scale.y=1.45;}
 const glass=K.mat('#f0d6f5',{transparent:true,opacity:.22,depthWrite:false,roughness:.12,iridescence:1,side:T.DoubleSide});K.box(gate,0,2.65,-.07,3.65,5.3,.045,glass,.3);K.tube(gate,[[0,.15,.12],[.43,1.7,.12],[-.30,3,.12],[.17,5.7,.12]],.055,K.gold,false,36);
 // A central, lit, glazed crown cabinet inspired by the reference's observatory.
 const cabinet=K.group(forest,'中央王冠珍藏亭',-1,.52,5);K.disk(cabinet,0,.07,0,3.6,.22,C.cream);for(let i=0;i<8;i++){let a=i*Math.PI/4;K.column(cabinet,Math.sin(a)*2.8,.18,Math.cos(a)*2.8,5.2,.095);K.arch(cabinet,Math.sin(a)*2.78,.2,Math.cos(a)*2.78,1.9,4.9,K.gold,.027).rotation.y=a;}
 const dome=K.mesh(cabinet,new T.SphereGeometry(3.05,40,22,0,Math.PI*2,0,Math.PI/2),glass,0,5.45,0);dome.scale.y=.7;for(let i=0;i<12;i++){let a=i*Math.PI/6;K.tube(cabinet,Array.from({length:18},(_,j)=>{let t=j/17*Math.PI/2;return [Math.sin(a)*3.05*Math.cos(t),5.45+2.14*Math.sin(t),Math.cos(a)*3.05*Math.cos(t)];}),.026,K.gold,false,24);}K.ell(cabinet,0,7.7,0,.16,.25,.16,K.gold,18);
 K.cyl(cabinet,0,.91,0,1.55,1.72,1.48,'#efdce8',40);K.disk(cabinet,0,1.68,0,1.61,.12,K.gold);K.ell(cabinet,0,1.80,0,1.18,.16,1.18,A.satin('#723c6d'),32);K.cyl(cabinet,0,3.0,0,1.75,1.75,2.55,glass,48);for(let y of [1.75,4.28])K.torus(cabinet,0,y,0,1.78,.035,K.gold,true);
 const crown=K.group(cabinet,'缓缓转动的宝石王冠',0,1.94,0);crown.userData.live=true;A.crown(crown,0,0,0,3.45);for(let i=0;i<24;i++){let a=i*Math.PI/12;K.ell(crown,Math.sin(a)*.87,.035,Math.cos(a)*.87,.027,.027,.027,C.cream,12);}A.gem(crown,0,.57,.84,.12,C.rose);for(let i=0;i<10;i++){let a=i*Math.PI/5;K.ell(cabinet,Math.sin(a)*1.5,4.2,Math.cos(a)*1.5,.045,.025,.045,glow,12);}F.crown=crown;
 const lamp=new T.PointLight('#ffdcfa',4.0,8,2);lamp.position.set(0,3.1,0);cabinet.add(lamp);
 // Peacock tail eyes are individually modelled on slender, curved feather shafts.
 function peacock(x,z,scale=1,seed=0){let q=K.group(motion,'虹彩孔雀',x,.54,z);q.scale.setScalar(scale);const tail=K.group(q,'展开的孔雀尾屏',0,.68,-.14);tail.userData.live=true;for(let i=0;i<25;i++){let a=-1.30+i/24*2.6,rr=2.0+.45*Math.sin(i/24*Math.PI),ex=Math.sin(a)*rr,ey=Math.cos(a)*rr;K.tube(tail,[[0,0,0],[ex*.5,ey*.57,-.09],[ex,ey,-.03]],.012,'#90ad5b',false,20);let feather=K.ell(tail,ex*.84,ey*.84,-.04,.12,.45,.015,A.prism('#69a58f'),16);feather.rotation.z=-a;for(let [r,c]of [[.17,'#bea356'],[.12,'#329b95'],[.072,'#4156a7'],[.03,'#183653']]){let eye=K.ell(tail,ex*.86,ey*.86,.0,r,r*1.3,.015,A.prism(c),18);eye.rotation.z=-a;}}
  K.ell(q,0,.62,.12,.32,.41,.45,A.prism('#438ea1'),24);K.tube(q,[[0,.73,.25],[0,1.21,.39],[0,1.55,.32]],.087,A.prism('#3c73a6'),false,20);K.ell(q,0,1.60,.36,.13,.13,.17,A.prism('#4384ae'),20);for(let side of [-1,1]){K.ell(q,side*.11,1.62,.43,.027,.029,.019,'#182238',12);K.rod(q,[side*.14,.42,.15],[side*.16,.04,.21],.023,'#ad8d6b');}K.ell(q,0,1.57,.56,.055,.035,.12,'#baad88',14);for(let i=0;i<5;i++){K.rod(q,[(i-2)*.02,1.69,.3],[(i-2)*.035,1.99,.27],.008,'#609595');K.ell(q,(i-2)*.035,2.0,.27,.033,.045,.017,A.prism(C.blue),12);}q.rotation.y=seed;F.peacocks.push({g:q,tail,base:seed});}
 peacock(-6,15,1.03,.35);peacock(15,13,.88,-.5);
 for(let i=0;i<5;i++){let x=-19+i*7,z=16+(i%2)*5,y=2.1+(i%3)*.65;let fairy=A.fairy(motion,x,y,z,.68,[C.rose,C.violet,C.cream][i%3]);fairy.rotation.y=(i-2)*.35;F.fairies.push({g:fairy,y});}B.rabbit(forest,-18,.55,12,.9);B.rabbit(forest,-16.3,.55,13,.7);B.horse(forest,-22,.53,3,{deer:true,scale:.95});
 for(let i=0;i<52;i++){const x=-26+noise(i+900)*50,z=-29+noise(i+990)*59,y=.85+noise(i+9900)*4.5;let q=K.ell(motion,x,y,z,.031,.041,.031,K.mat('#fff2a7',{emissive:'#fff1a3',emissiveIntensity:1.9}),10);F.fireflies.push({g:q,x,y,z,phase:i*2.399});}
 for(let i=0;i<7;i++){let x=-25+i*7,z=-17+(i%3)*9;let beam=K.cyl(motion,x,7,z,.05,.67,12,K.mat('#fff1c3',{transparent:true,opacity:.023,depthWrite:false,side:T.DoubleSide}),14);beam.rotation.z=-.22;beam.castShadow=false;(F.beams??=[]).push(beam);}
 for(let i=0;i<5;i++){let x=18+i*1.8,z=22-i*.6;K.tube(forest,[[x,.5,z],[x+.4,2.9,z],[x-1.3,4.4,z],[x-1.8,3.5,z]],.024,'#79954c',false,28);const bell=K.group(forest,'低垂的花瓣灯盏',x-1.8,3.5,z);A.loft(bell,[[-.74,.60,.60],[-.57,.39,.39],[-.20,.19,.19],[0,.065,.065]],K.mat('#e8a2cb',{roughness:.32,side:T.DoubleSide,emissive:'#be83ab',emissiveIntensity:.17}),36,.08);K.ell(bell,0,-.56,0,.16,.17,.16,glow,18);}
 // The eastern threshold meets the original sky island without a gap.
 for(let i=0;i<26;i++)K.box(sky,-42-i*.38,.46,-14,1.05,.16,3.1,'#e0d2cf',.06);
 return F;
}

export function installForestLight(F){const m=F.ground.material;m.onBeforeCompile=s=>{s.uniforms.forestTime={value:0};F.groundShader=s;s.vertexShader='varying vec3 forestPoint;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nforestPoint=(modelMatrix*vec4(position,1.)).xyz;');s.fragmentShader='varying vec3 forestPoint;uniform float forestTime;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat fleck=pow(max(0.,sin(forestPoint.x*1.17+sin(forestPoint.z*1.4)+forestTime*.05)*cos(forestPoint.z*1.73+sin(forestPoint.x*.64))),2.);diffuseColor.rgb*=.74+fleck*.54;');};m.customProgramCacheKey=()=> 'forest-dapple-v1';m.needsUpdate=true;}
export function animateForest(W,time,reduced,lighting){const F=W.skyCity.movers.forest;if(!F)return;const t=reduced?0:time;if(F.groundShader)F.groundShader.uniforms.forestTime.value=t;F.crown.rotation.y=t*.07;
 for(const [i,r]of F.flowMarks.entries()){const q=F.stream.getPoint((r.phase+t*.017)%1);r.g.position.copy(q);r.g.position.y=.415;r.g.rotation.y=Math.atan2(F.stream.getTangent(r.phase).x,F.stream.getTangent(r.phase).z);}
 for(const r of F.fallDrops){let f=(r.phase+t*.31)%1;r.g.position.y=5.05-f*4.5;r.g.position.z=-29.4+f*1.8;}
 for(const r of F.fireflies){r.g.position.set(r.x+Math.sin(t*.39+r.phase)*.43,r.y+Math.sin(t*.61+r.phase)*.30,r.z+Math.cos(t*.43+r.phase)*.36);r.g.scale.setScalar(reduced?.031:.023+.018*(.5+.5*Math.sin(t*1.7+r.phase)));}
 for(const [i,r]of F.fairies.entries()){r.g.position.y=r.y+Math.sin(t*.6+i)*.13;r.g.rotation.z=Math.sin(t*.45+i)*.025;}
 for(const r of F.peacocks){r.g.rotation.y=r.base+Math.sin(t*.26+r.base)*.10;r.tail.rotation.z=Math.sin(t*.46+r.base)*.025;}
 for(const beam of F.beams)beam.visible=lighting!=='night';
}
