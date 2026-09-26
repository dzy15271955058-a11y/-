import {T,C} from './kit.js';
export const COUTURE=['rococo','cascade','mermaidcouture','petalcouture','starlight','sailor','picnicdress','icecape'];
// Distinct pattern-cut panels, open overskirts and asymmetric hems, at doll scale.
export function couture(K,g,style,color,H){
 if(!COUTURE.includes(style))return false;
 const {loft,skirt,satin,tulle,bow,gem,flowerApplique}=H,light=new T.Color(color).lerp(new T.Color('#fff4e8'),.58).getStyle(),dark=new T.Color(color).multiplyScalar(.62).getStyle(),sa=satin(color),ivory=satin('#fff6e8');
 const trim=K.group(g,'手工滚边与珠绣');
 function panel(name,{top=1.31,bottom=.07,rt=.21,rb=.94,start=0,end=Math.PI*2,depth=1,back=0,pleat=.035,asym=0},material){const p=[],idx=[],cols=64,rows=20;for(let j=0;j<=rows;j++){const t=j/rows;for(let i=0;i<=cols;i++){const a=start+(end-start)*i/cols,r=(rt+(rb-rt)*Math.pow(t,.8))*(1+pleat*Math.sin(a*18)),hem=bottom+asym*(1+Math.cos(a))*.5;p.push(Math.sin(a)*r,top+(hem-top)*t,Math.cos(a)*r*depth-back*t);}}for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let a=j*(cols+1)+i;idx.push(a,a+1,a+cols+1,a+1,a+cols+2,a+cols+1);}let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setIndex(idx);geo.computeVertexNormals();const mat=material.clone();mat.side=T.DoubleSide;let o=K.mesh(g,geo,mat);o.name=name;return o;}
 function hem(y,r,mat=K.gold,wave=.03){const pts=[];for(let i=0;i<=96;i++){let a=i/96*Math.PI*2;pts.push([Math.sin(a)*r,y+Math.sin(a*18)*wave,Math.cos(a)*r*.94]);}K.tube(trim,pts,.008,mat);}
 function pearls(y,r,n=32){for(let i=0;i<n;i++){let a=i/n*Math.PI*2;K.ell(trim,Math.sin(a)*r,y,Math.cos(a)*r*.94,.012,.014,.012,'#fff7ea',8);}}
 function corset(){for(let d of [-1,1])K.tube(trim,[[d*.14,1.33,.118],[d*.11,1.54,.173],[d*.18,1.79,.151]],.008,K.gold);for(let i=0;i<6;i++)K.tube(trim,[[-.075,1.4+i*.056,.151],[.075,1.44+i*.056,.154]],.005,ivory);}
 if(style==='rococo'){
  loft(g,[[.055,1.01,.81],[.25,.97,.77],[.7,.68,.51],[1.1,.40,.27],[1.32,.20,.15]],ivory,80,.045);
  panel('敞口洛可可侧裙',{rb:1.06,depth:.8,start:.62,end:Math.PI*2-.62},sa);
  for(const side of [-1,1]){for(let j=0;j<4;j++){const pts=[];for(let k=0;k<=14;k++){let t=k/14;pts.push([side*(.21+t*.62),1.20-j*.18-Math.sin(t*Math.PI)*.13,.16+t*.35]);}K.tube(trim,pts,.023,light);}bow(trim,side*.48,.96,.49,.60,light);}corset();hem(.075,1.01,light);pearls(.24,.96);bow(g,0,1.31,-.21,.8,light);
 }else if(style==='cascade'){
  panel('前短后长高低裙',{rb:.91,depth:1.02,asym:.63},sa);
  for(let j=0;j<3;j++)panel('斜向瀑布褶',{top:1.30-j*.18,bottom:.10+j*.10,rb:.94-j*.05,rt:.23+j*.05,start:.2+j*.4,end:2.7+j*.3,asym:.45},satin(j%2?light:color));
  panel('单肩飘带',{top:1.84,bottom:.18,rt:.31,rb:.80,start:3.4,end:4.7,back:.14},tulle(light));gem(trim,-.22,1.88,.04,.09,'#dbcaee');corset();
 }else if(style==='mermaidcouture'){
  loft(g,[[.05,1.03,.88,-.12],[.18,.8,.71,-.10],[.47,.34,.29],[.67,.255,.21],[.96,.30,.255],[1.14,.255,.19],[1.31,.20,.145]],sa,80,.035);
  for(let j=0;j<3;j++)panel('鱼尾荷叶边',{top:.49-j*.12,bottom:.045,rt:.34+j*.13,rb:1.04+j*.045,back:.12},tulle(j%2?light:color));
  for(let j=0;j<6;j++)for(let i=0;i<9;i++){let a=(i-4)*.34,r=.255+Math.abs(j-2)*.012;gem(trim,Math.sin(a)*r,.65+j*.11,Math.cos(a)*r*.85,.018,light);}K.tube(trim,[[-.27,1.80,.04],[-.15,1.85,.16],[0,1.80,.18],[.15,1.85,.16],[.27,1.80,.04]],.027,ivory);
 }else if(style==='petalcouture'){
  skirt(g,.50,.82,.20,.58,ivory,.25);
  for(let row=0;row<3;row++)for(let i=0;i<8;i++){let a=i*Math.PI/4+row*.22,pts=[],ix=[];for(let j=0;j<=16;j++){let t=j/16,r=.22+t*(.45-row*.07),w=Math.sin(Math.PI*t)*.31;for(let d of [-1,1])pts.push(Math.sin(a+d*w)*r,1.3-row*.14-t*.62,Math.cos(a+d*w)*r);}for(let j=0;j<16;j++){let k=j*2;ix.push(k,k+1,k+2,k+1,k+3,k+2);}let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pts,3));geo.setIndex(ix);geo.computeVertexNormals();K.mesh(g,geo,K.mat(row%2?light:color,{side:T.DoubleSide,roughness:.3,sheen:.8})).name='独立花瓣裙片';}for(let i=0;i<7;i++)flowerApplique(trim,(i-3)*.052,1.40+Math.abs(i-3)*.06,.17,.034,light);
 }else if(style==='starlight'){
  skirt(g,.045,1.27,.20,.83,satin(dark),.15);panel('星图欧根纱外裙',{rb:.96,pleat:.05},tulle(color));
  for(let i=0;i<30;i++){let a=i*2.399,y=.17+(i%7)*.14,r=.22+(.98-y)*.72;K.star(trim,Math.sin(a)*r,y,Math.cos(a)*r,.016+(i%3)*.008,K.gold,.004);}for(let d of [-1,1])panel('披帛',{top:1.87,bottom:.25,rt:.32,rb:.99,start:d<0?3.6:1.5,end:d<0?4.5:2.7},tulle(light));pearls(1.34,.209,22);
 }else if(style==='sailor'){
  skirt(g,.70,.61,.20,.52,sa,.8);hem(.72,.52,ivory,0);hem(.78,.485,ivory,0);K.box(g,0,1.82,-.148,.43,.15,.035,'#fff6e8',.018);for(let d of [-1,1])K.tube(trim,[[d*.23,1.88,.03],[d*.16,1.78,.16],[0,1.65,.182]],.032,ivory);bow(trim,0,1.67,.21,.35,dark);for(let y of [1.4,1.49])for(let d of [-1,1])gem(trim,d*.07,y,.16,.018,C.gold);
 }else if(style==='picnicdress'){
  skirt(g,.44,.87,.20,.67,sa,.35);for(let j=0;j<2;j++){skirt(g,.44+j*.14,.21,.48-j*.08,.70-j*.075,ivory,.8);hem(.46+j*.14,.69-j*.075,color,.025);}for(let d of [-1,1]){K.ell(g,d*.29,1.82,.002,.12,.11,.105,sa,24);bow(trim,d*.29,1.72,.065,.2,light);}for(let i=0;i<24;i++){let a=i*2.4,y=.75+(i%4)*.11,r=.2+(1.3-y)*.49;flowerApplique(trim,Math.sin(a)*r,y,Math.cos(a)*r*.94,.022,'#fff4d7');}bow(trim,0,1.31,.16,.55,light);
 }else if(style==='icecape'){
  panel('冰晶修长礼裙',{rt:.20,rb:.57,pleat:.02},sa);panel('落地晶纱斗篷',{top:1.87,bottom:.045,rt:.32,rb:1.13,start:1.20,end:5.08,back:.18},tulle(light));
  for(let i=0;i<15;i++){let a=1.2+i/14*3.88;K.tube(trim,[[Math.sin(a)*.32,1.86,Math.cos(a)*.32],[Math.sin(a)*.7,.96,Math.cos(a)*.7-.1],[Math.sin(a)*1.13,.05,Math.cos(a)*1.13-.18]],.006,light);gem(trim,Math.sin(a)*1.10,.12,Math.cos(a)*1.10-.18,.035,'#cbe9ff');}for(let d of [-1,1])gem(trim,d*.23,1.86,.055,.065,'#bde4ff');corset();
 }
 g.userData.couture=style;return true;
}
