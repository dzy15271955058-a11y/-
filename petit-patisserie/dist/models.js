import * as T from './vendor/three.module.min.js';
export const desserts=[
{id:'apple',name:'苹果小圆舞',english:'LA VALSE DES POMMES',word:'Pomme',category:'cake',label:'庆祝蛋糕',flavors:['苹果红','香草奶油','复古裱花'],description:'一颗亮晶晶的红苹果，坐在奶油花边上。红与绿绕着蛋糕跳一支复古的小圆舞。',action:'切下一块',undo:'把它放回',title:'切一块，看看里面。',hint:'轻轻移开一角，露出奶油和蛋糕的层次。',feedback:'这一小块，留给你。',caption:'苹果红，奶油白。一场小小的庆祝。',accent:'#b64b65',bg:['#f9e4e9','#f3cedb']},
{id:'peach',name:'蜜桃小皇冠',english:'LA COURONNE DE PÊCHES',word:'Pêche',category:'cake',label:'水果蛋糕',flavors:['蜜桃粉','奶油花边','透明果冻'],description:'六颗透亮的小蜜桃，围着奶油皇冠。软软的粉色，像一封刚拆开的邀请函。',action:'轻碰蜜桃',title:'让小蜜桃晃一下。',hint:'碰一碰，果冻蜜桃会轻轻弹跳，再慢慢停下。',feedback:'桃子也有一点点害羞。',caption:'把柔软的粉色，藏进一颗小蜜桃。',accent:'#c26387',bg:['#ffedf3','#f3d6e5']},
{id:'petal',name:'玫瑰云朵',english:'NUAGE DE ROSES',word:'Fleur',category:'cake',label:'糖花蛋糕',flavors:['轻盈糖片','玫瑰粉','奶油白'],description:'薄薄的糖片一层叠一层，把蛋糕裹成盛开的玫瑰。转过去，还藏着另一朵。',action:'展开糖花',undo:'轻轻收拢',title:'看一朵糖花慢慢开。',hint:'轻触按钮，花瓣向外舒展，露出柔软的花心。',feedback:'花开得很轻，下午也很轻。',caption:'一朵玫瑰，刚好是一块蛋糕的形状。',accent:'#b87990',bg:['#fff0f2','#ecd8e3']},
{id:'heart',name:'给你一颗心',english:'UN PETIT CŒUR',word:'Amour',category:'cake',label:'心形慕斯',flavors:['莓果粉','糖珠','奶油缎带'],description:'一颗圆润的莓果慕斯，戴着奶白色的蝴蝶结。细小的糖珠，像安静的心事。',action:'心动一下',title:'让它替你心动。',hint:'轻轻一碰，心形慕斯会怦怦跳动，然后恢复平静。',feedback:'怦、怦。是一点小小的喜欢。',caption:'有些心意，不用说得很大声。',accent:'#b95f83',bg:['#ffeaf1','#efcfdd']},
{id:'noir',name:'午夜黑玫瑰',english:'ROSE DE MINUIT',word:'Minuit',category:'cake',label:'黑巧蛋糕',flavors:['黑巧克力','黑玫瑰','银色点缀'],description:'深色巧克力裹住层层花边，银色糖珠在光里闪一下。转一圈，看见玫瑰不同的轮廓。',action:'点亮烛光',undo:'熄灭烛光',title:'为午夜点一支蜡烛。',hint:'烛火亮起，暖光轻轻照亮黑巧与银色糖珠。',feedback:'这一刻，安静地亮起来。',caption:'黑玫瑰，也有柔软的心。',accent:'#665576',bg:['#eee7f0','#d3c4dd']},
{id:'cottage',name:'草莓奶油小屋',english:'LA MAISON DES FRAISES',word:'Maison',category:'cake',label:'童话造型蛋糕',flavors:['草莓屋顶','奶油小门','饼干墙'],description:'粉色瓦片铺上屋顶，奶油描出门窗。小屋旁有草莓，门后藏着温暖的光。',action:'打开小门',undo:'轻轻关门',title:'小屋里，住着什么？',hint:'打开饼干小门，看看里面亮起的小小心意。',feedback:'欢迎来小甜屿做客。',caption:'如果下午有住址，大概就在这里。',accent:'#bb6284',bg:['#fff0e9','#f3d8e4']},
{id:'matcha',name:'一小片草地',english:'UN JARDIN DE MATCHA',word:'Jardin',category:'cake',label:'抹茶蛋糕',flavors:['抹茶绿','巧克力土壤','小草'],description:'一层抹茶绿，盖住柔软的蛋糕。巧克力围成土壤，几片嫩叶从中间探出头。',action:'吹过一阵风',title:'给小草一点微风。',hint:'小草顺着风轻轻摇摆，风停后慢慢回到原处。',feedback:'风经过，把好心情留下。',caption:'把一小片春天，端到面前。',accent:'#66884c',bg:['#f1f4df','#dce9cf']},
{id:'slice',name:'橙光千层',english:'UN RAYON D’AGRUME',word:'Soleil',category:'cake',label:'水果切角',flavors:['蜜橙','抹茶胚','轻奶油'],description:'橙子落在奶油上，像午后的阳光。绿与白层层叠起，转到侧面看夹心。',action:'展开层次',undo:'合回蛋糕',title:'一层一层，看看里面。',hint:'蛋糕层轻轻分开，奶油与橙子夹心一目了然。',feedback:'阳光被分成了甜甜的几层。',caption:'把阳光，切成刚刚好的一角。',accent:'#b7803f',bg:['#fff1d8','#f4e3cf']},
{id:'jelly',name:'晴空布丁杯',english:'LE CIEL EN GELÉE',word:'Azur',category:'dessert',label:'果冻甜品',flavors:['水蓝果冻','奶油布丁','红樱桃'],description:'一圈水蓝色果冻，托住香草布丁和一颗樱桃。透明玻璃把光也盛了进去。',action:'轻戳果冻',title:'晃一下，再晃一下。',hint:'戳一戳果冻，观察它软软的回弹。',feedback:'晃呀晃，像一小片海。',caption:'晴天可以装进杯子里。',accent:'#469fb6',bg:['#eaf7ff','#cceaf1']},
{id:'blue',name:'云朵气泡蓝',english:'SODA SOUS LES NUAGES',word:'Nuage',category:'drink',label:'气泡饮品',flavors:['清透水蓝','奶油云朵','气泡'],description:'细长的玻璃杯里，水蓝色一路向上。奶油云朵停在杯口，小冰块透着光，气泡正准备沸腾。',action:'唤醒气泡',title:'听见晴天冒泡了吗？',hint:'点一下，密密的气泡翻涌上升，冰块轻晃，几颗泡泡跃出杯口。',feedback:'啵、啵、啵。晴天出发了。',caption:'一杯蓝色，装满轻轻的好心情。',accent:'#499bb8',bg:['#edf7ff','#cce5f3']},
{id:'parfait',name:'青提小花园',english:'PARFAIT DU JARDIN',word:'Rosée',category:'dessert',label:'高脚杯芭菲',flavors:['青提','香草冰淇淋','金桂花'],description:'青提、奶油和冰淇淋，在高脚杯里搭起小花园。金色桂花落在冰淇淋上，像洒下一小把阳光。',action:'洒落金桂花',title:'下一场金色桂花雨。',hint:'轻轻一点，金色小桂花打着旋儿飘落，点亮青提小花园。',feedback:'桂花落下来，下午也染上一点金。',caption:'在一只杯子里，种一个小花园。',accent:'#7a9752',bg:['#f2f5e5','#e2e6cb']}
];
const C={cream:'#fff1d7',white:'#fff8ed',pink:'#efacc3',rose:'#da6f91',red:'#b92937',green:'#66834f',chocolate:'#5c3c30',gold:'#cba46c'};
const TAU=Math.PI*2;
export function createDessert(id,{low=false}={}){
 const root=new T.Group(),food=new T.Group(),slice=new T.Group(),animated=[],layers=[],bubbles=[],iceCubes=[],blossoms=[];root.add(food);food.add(slice);let door,flame,fire,petals=[],heart;
 const detail=low?16:24,round=low?48:72;
 function material(color,opts={}){return new T.MeshPhysicalMaterial({color,roughness:.48,metalness:0,clearcoat:.18,clearcoatRoughness:.2,...opts});}
 const cream=material(C.cream),white=material(C.white),pink=material(C.pink),red=material(C.red,{roughness:.23,clearcoat:.9}),green=material(C.green),silver=material('#cdd1df',{metalness:.8,roughness:.21});
 function add(geo,mat,parent=food,pos=[0,0,0],scale=[1,1,1]){const mesh=new T.Mesh(geo,mat);mesh.position.set(...pos);mesh.scale.set(...scale);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function ball(x,y,z,r,mat=cream,parent=food,scale=[1,1,1]){return add(new T.SphereGeometry(r,detail,Math.max(8,detail/2)),mat,parent,[x,y,z],scale);}
 function cylinder(rt,rb,h,y,mat=cream,parent=food,start=0,len=TAU){return add(new T.CylinderGeometry(rt,rb,h,round,1,false,start,len),mat,parent,[0,y,0]);}
 function tube(points,r,mat,parent=food){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return add(new T.TubeGeometry(curve,low?18:36,r,low?5:8,false),mat,parent);}
 function torus(r,t,y,mat=cream,parent=food){const o=add(new T.TorusGeometry(r,t,low?6:10,round),mat,parent,[0,y,0]);o.rotation.x=Math.PI/2;return o;}
 function surface(fn,nu,nv,mat,parent=food){const vs=[],indices=[];for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++)vs.push(...fn(i/nu,j/nv));for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+nu+1;indices.push(a,b,a+1,a+1,b,b+1)}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vs,3));geo.setIndex(indices);geo.computeVertexNormals();return add(geo,mat,parent);}
 function dollop(x,y,z,r=.18,h=.27,mat=cream,parent=food){const mesh=surface((u,v)=>{const a=u*TAU+v*1.5,rad=r*Math.pow(1-v,.72)*(1+.16*Math.cos(u*TAU*6));return [Math.cos(a)*rad+.07*v*v,h*v,Math.sin(a)*rad]},low?16:30,low?6:12,mat,parent);mesh.position.set(x,y,z);return mesh;}
 function leaf(x,y,z,angle=0,mat=green,parent=food,size=.35){const o=ball(x,y,z,size,mat,parent,[.32,.055,1]);o.rotation.y=angle;o.rotation.z=.25;return o;}
 function fruit(x,y,z,r,mat=red,parent=food,kind='apple'){const g=new T.Group();g.position.set(x,y,z);parent.add(g);ball(-r*.15,0,0,r,mat,g,[.91,kind==='peach'?1:.92,1]);ball(r*.15,0,0,r*.96,mat,g,[.91,kind==='peach'?1:.94,1]);tube([[0,r*.72,0],[.035,r*1.1,0],[.11,r*1.2,-.035]],.025,material('#745339'),g);leaf(.16,r*.97,0,.9,green,g,r*.6);return g;}
 function rose(x,y,z,r=.25,mat=pink,parent=food){const g=new T.Group();g.position.set(x,y,z);parent.add(g);for(let k=0;k<5;k++){const a=k*TAU/5;const p=surface((u,v)=>{const theta=(u-.5)*Math.PI*1.6,rad=r*(.18+v*.82);return [Math.sin(theta)*rad,Math.cos(theta)*rad*.26+(1-v)*r*.9,Math.cos(theta)*rad]},low?8:16,low?4:7,mat,g);p.rotation.y=a;}dollop(0,0,0,r*.36,r*.8,mat,g);return g;}
 const porcelain=material('#fff8ef',{roughness:.2,clearcoat:.8});cylinder(1.91,1.8,.09,.04,porcelain,root);torus(1.86,.032,.095,material(C.gold,{metalness:.6,roughness:.3}),root);cylinder(.78,.88,.11,-.04,porcelain,root);
 function cake(radius=1.35,height=1.2,baseMat=cream,cut=true){const heights=[.14,height*.31,.105,height*.3,.14],mats=[baseMat,material('#e8ba7e'),baseMat,material('#e8ba7e'),baseMat];let y=.13;const total=heights.reduce((a,b)=>a+b,0),factor=height/total;for(let i=0;i<heights.length;i++){const h=heights[i]*factor;y+=h/2;const rs=radius*(i===0||i===4?1:.975);if(cut){cylinder(rs,rs,h,y,[baseMat,mats[i],mats[i]],food,0,TAU-Math.PI/3);cylinder(rs,rs,h,y,[baseMat,mats[i],mats[i]],slice,TAU-Math.PI/3,Math.PI/3);for(const parent of [food,slice])for(const angle of [0,TAU-Math.PI/3]){const cap=add(new T.PlaneGeometry(rs,h),material(mats[i].color,{side:T.DoubleSide}),parent,[Math.sin(angle)*rs/2,y,Math.cos(angle)*rs/2]);cap.rotation.y=angle-Math.PI/2;}}else cylinder(rs,rs,h,y,[baseMat,mats[i],mats[i]]);y+=h/2;}
  // A thin frosting coat leaves the cut surfaces visible when the slice moves.
  for(const [parent,start,len]of (cut?[[food,0,TAU-Math.PI/3],[slice,TAU-Math.PI/3,Math.PI/3]]:[[food,0,TAU]])){add(new T.CylinderGeometry(radius+.018,radius+.018,height-.025,round,1,true,start,len),baseMat,parent,[0,.13+height/2,0]);}
  const top=.13+height;for(let i=0;i<30;i++){const a=i*TAU/30,parent=cut&&a>=TAU-Math.PI/3?slice:food;dollop(Math.sin(a)*(radius-.04),top,Math.cos(a)*(radius-.04),.13,.2,baseMat,parent);dollop(Math.sin(a)*radius,.14,Math.cos(a)*radius,.105,.15,baseMat,parent);}
  return top;
 }
 function swag(radius,y,mat,parent=food,segments=9){for(let i=0;i<segments;i++){const a=i*TAU/segments,b=(i+1)*TAU/segments;const pts=Array.from({length:12},(_,j)=>{const f=j/11,t=a+(b-a)*f;return [Math.sin(t)*radius,y-Math.sin(f*Math.PI)*.18,Math.cos(t)*radius]});tube(pts,.038,mat,parent);ball(Math.sin(a)*radius,y,Math.cos(a)*radius,.06,mat,parent)}}
 if(id==='apple'){
  const y=cake(1.32,1.15,cream); // Split the outer decorative bands with the cake.
  for(let i=0;i<12;i++){const a=i*TAU/12,parent=a>=TAU-Math.PI/3?slice:food;const pts=Array.from({length:10},(_,j)=>{const q=a+j/9*TAU/12;return [Math.sin(q)*1.35,.98-Math.sin(j/9*Math.PI)*.16,Math.cos(q)*1.35]});tube(pts,.049,green,parent);const rr=rose(Math.sin(a)*1.36,.44,Math.cos(a)*1.36,.105,red,parent);rr.rotation.x=Math.PI/2;rr.rotation.z=-a;}
  for(let i=0;i<18;i++){const a=i*TAU/18;dollop(Math.sin(a)*.92,y+.08,Math.cos(a)*.92,.18,.26,cream,a>=TAU-Math.PI/3?slice:food)}fruit(0,y+.56,0,.46);torus(.64,.033,y+.04,red);
 }else if(id==='peach'){
  const y=cake(1.3,1.03,pink,false);swag(1.32,.83,cream);for(let i=0;i<6;i++){const a=i*TAU/6;const p=fruit(Math.sin(a)*.86,y+.39,Math.cos(a)*.86,.255,material('#ee9ca8',{roughness:.16,transmission:.32,thickness:.45,clearcoat:1}),food,'peach');animated.push({object:p,y:p.position.y,phase:i});}cylinder(.29,.32,.28,y+.15,cream);for(let i=0;i<10;i++){const a=i*TAU/10;dollop(Math.sin(a)*.28,y+.29,Math.cos(a)*.28,.07,.15,white)}
 }else if(id==='petal'){
  cake(1.2,.85,material('#e6a5bd'),false);
  for(let i=0;i<7;i++){
   const a=i*TAU/7,g=new T.Group();g.position.set(Math.sin(a)*.68,.93,Math.cos(a)*.68);g.rotation.y=a;g.rotation.z=(i%2?1:-1)*.18;food.add(g);
   for(let k=0;k<6;k++){
    const nu=low?10:22,nv=low?6:12;
    const petal=surface((u,v)=>{const theta=(u-.5)*Math.PI*1.5,r=.17+v*.52;return [Math.sin(theta)*r,Math.sin(v*Math.PI*.75)*.68,Math.cos(theta)*r]},nu,nv,material('#ffffff',{vertexColors:true,side:T.DoubleSide,roughness:.48}),g);
    // Rose-pink roots soften into blush edges; each folded layer keeps its own tint.
    const colors=[],inner=new T.Color(k%2?'#d77ca3':'#df91af'),outer=new T.Color(i%2?'#f6bdd2':'#f9d0df');
    for(let j=0;j<=nv;j++)for(let u=0;u<=nu;u++){const c=inner.clone().lerp(outer,Math.pow(j/nv,.72)*(.9+.1*Math.sin(u/nu*Math.PI)));colors.push(c.r,c.g,c.b)}
    petal.geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));petal.name='rose-gradient-petal';
    petal.rotation.y=k*TAU/6;petals.push({object:petal,angle:petal.rotation.y,phase:i+k});
   }
   dollop(0,.2,0,.13,.4,material('#f2b3cb'),g);
  }
 }else if(id==='heart'){
  heart=new T.Group();food.add(heart);const shape=new T.Shape();shape.moveTo(0,-.9);shape.bezierCurveTo(-.3,-.5,-1.35,.03,-1.13,.63);shape.bezierCurveTo(-.9,1.22,-.2,1.17,0,.74);shape.bezierCurveTo(.2,1.17,.9,1.22,1.13,.63);shape.bezierCurveTo(1.35,.03,.3,-.5,0,-.9);const geo=new T.ExtrudeGeometry(shape,{depth:.63,bevelEnabled:true,bevelSegments:low?3:6,steps:1,bevelSize:.15,bevelThickness:.14,curveSegments:low?10:24});const m=add(geo,material('#dea2ba',{roughness:.55}),heart,[0,.91,0]);m.rotation.x=Math.PI/2;
  for(let i=0;i<22;i++){const a=i*2.3999,r=.92*Math.sqrt((i+.5)/22);ball(Math.cos(a)*r,.98,Math.sin(a)*r*.8,.022,white,heart)}
  for(const s of [-1,1])tube([[0,1.05,0],[s*.38,1.21,-.07],[s*.54,1.13,.13],[s*.32,1.02,.2],[0,1.05,0]],.063,cream,heart);
  tube([[0,1.06,0],[.26,.98,.42],[.47,.94,.74],[.35,.6,1.02]],.06,cream,heart);tube([[0,1.06,0],[-.22,.98,-.36],[-.53,.97,-.59],[-.68,.5,-.74]],.06,cream,heart);
 }else if(id==='noir'){
  const black=material('#282333',{roughness:.34,clearcoat:.55}),black2=material('#3b3046',{side:T.DoubleSide,roughness:.35});const y=cake(1.17,1.35,black,false);swag(1.2,1.18,black2);swag(1.2,.74,black2);
  for(let i=0;i<9;i++){const a=i*TAU/9;rose(Math.sin(a)*.99,y+.02,Math.cos(a)*.99,.23,black2);for(let k=0;k<3;k++)ball(Math.sin(a+.045*k)*1.21,.83-.11*k,Math.cos(a+.045*k)*1.21,.035,silver)}
  cylinder(.045,.045,.72,y+.39,material('#c3a4bd'));flame=ball(0,y+.87,0,.075,material('#ffc474',{emissive:'#ff8d26',emissiveIntensity:2,roughness:1}),food,[.7,1.7,.7]);fire=new T.PointLight('#ffc18b',0,7);fire.position.set(0,y+.9,.3);food.add(fire);
 }else if(id==='cottage'){
  const wall=add(new T.BoxGeometry(1.95,1.27,1.52),cream,food,[0,.79,0]);const roofGeo=new T.BufferGeometry();roofGeo.setAttribute('position',new T.Float32BufferAttribute([-1.1,1.42,.88,1.1,1.42,.88,0,2.22,.88,-1.1,1.42,-.88,1.1,1.42,-.88,0,2.22,-.88],3));roofGeo.setIndex([0,1,2,3,5,4,0,2,5,0,5,3,2,1,4,2,4,5,0,3,4,0,4,1]);roofGeo.computeVertexNormals();add(roofGeo,pink);
  for(const s of [-1,1])for(let row=0;row<5;row++)for(let col=0;col<8;col++){const f=(row+.5)/5;const m=add(new T.BoxGeometry(.28,.045,.25),material(row%2?'#e7a2bb':'#f2bfd0'),food,[s*f*1.09,2.24-f*.8,(col-3.5)*.235]);m.rotation.z=-s*.63;}
  for(const s of [-1,1]){tube([[s*1.08,1.4,.94],[s*.55,1.81,.94],[0,2.22,.94]],.066,white);add(new T.BoxGeometry(.43,.45,.04),material('#a7cee0'),food,[s*.64,.92,.792]);tube([[s*.64-.21,.69,.84],[s*.64-.21,1.16,.84],[s*.64+.21,1.16,.84],[s*.64+.21,.69,.84]],.035,pink);add(new T.BoxGeometry(.43,.032,.035),cream,food,[s*.64,.92,.83]);add(new T.BoxGeometry(.032,.45,.035),cream,food,[s*.64,.92,.83]);}
  add(new T.BoxGeometry(.54,.78,.03),material('#79514d'),food,[0,.54,.784]);door=new T.Group();door.position.set(-.28,.15,.825);food.add(door);add(new T.BoxGeometry(.54,.79,.08),material('#d9a88e'),door,[.27,.4,0]);for(let i=0;i<5;i++)add(new T.BoxGeometry(.018,.7,.02),cream,door,[.07+i*.1,.4,.05]);ball(.44,.37,.066,.038,material(C.gold),door);const surprise=ball(0,.61,.82,.15,red,food,[1,1,1]);fruit(-.95,.36,1.11,.17,red);fruit(.85,.34,1.04,.16,red);for(let i=0;i<17;i++){const a=i*TAU/17;dollop(Math.sin(a)*1.45,.14,Math.cos(a)*1.18,.13,.15,white)}
 }else if(id==='matcha'){
  const mat=material('#91a34e',{roughness:.95});cake(1.37,.79,mat,false);cylinder(1.355,1.355,.033,.946,material('#66842f',{roughness:1}));for(let i=0;i<30;i++){const a=i*TAU/30;ball(Math.sin(a)*1.4,.18,Math.cos(a)*1.4,.105,material('#594337'),food,[1,.8,.85]);}
  for(let i=0;i<13;i++){const a=i*2.4;const g=new T.Group();g.position.set(Math.sin(a)*.25,.965,Math.cos(a)*.25);g.rotation.y=a;food.add(g);const h=.35+(i%4)*.12;surface((u,v)=>{const w=Math.sin(v*Math.PI)*.075;return [(u-.5)*w*2,h*v,Math.pow(v,1.6)*.34]},4,low?5:10,material('#57794d',{side:T.DoubleSide}),g);animated.push({object:g,phase:i});}
 }else if(id==='slice'){
  const shape=new T.Shape();shape.moveTo(-.99,.84);shape.lineTo(.99,.84);shape.lineTo(0,-1.17);shape.closePath();const mats=[material('#75974b'),cream,material('#75974b'),cream,material('#75974b'),cream];for(let i=0;i<6;i++){const h=i%2?.21:.14;const geo=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});const g=new T.Group();const m=add(geo,mats[i],g);m.rotation.x=-Math.PI/2;g.position.y=.16+i*.18;food.add(g);layers.push({object:g,y:g.position.y,index:i});}
  const top=layers[5].object;for(let i=0;i<6;i++){const a=i*TAU/6;dollop(Math.sin(a)*.36,.23,Math.cos(a)*.4,.18,.2,white,top);ball(Math.sin(a)*.45,.39,Math.cos(a)*.37,.17,material('#ffbc32',{roughness:.25,clearcoat:.8}),top,[1,.95,.75])}leaf(.18,.57,0,.7,green,top,.19);
 }else{
  const glass=material('#e7fbff',{roughness:.06,transmission:.92,transparent:true,opacity:.45,thickness:.12,ior:1.45,side:T.DoubleSide,clearcoat:1});
  cylinder(.7,.7,.055,.16,glass);cylinder(.065,.085,.6,.49,glass);
  if(id==='jelly'){
   const bowl=add(new T.SphereGeometry(1.2,round,detail,0,TAU,0,Math.PI/2),glass,food,[0,1.46,0],[1,.6,1]);bowl.rotation.x=Math.PI;torus(1.2,.028,1.46,glass);
   const wobble=new T.Group();wobble.position.y=1.09;food.add(wobble);animated.push({object:wobble,phase:0});const blue=material('#51c4e9',{transmission:.4,roughness:.1,thickness:.8,clearcoat:1});surface((u,v)=>{const a=u*TAU,r=.75+v*.19+.046*Math.cos(a*12);return [Math.cos(a)*r,.37*(1-v),Math.sin(a)*r]},round,4,blue,wobble);cylinder(.74,.74,.03,.38,blue,wobble);cylinder(.43,.59,.44,.6,cream,wobble);cylinder(.43,.43,.02,.83,material('#e8b07e'),wobble);ball(0,.98,0,.14,red,wobble);tube([[0,1.08,0],[.055,1.24,.02],[.11,1.3,.04]],.016,green,wobble);
  }else if(id==='blue'){
   const pts=[[.12,.76],[.3,.82],[.46,.95],[.53,1.23],[.56,1.65],[.58,2.15],[.63,2.46]].map(([x,y])=>new T.Vector2(x,y));add(new T.LatheGeometry(pts,round),glass);torus(.63,.026,2.46,glass);cylinder(.535,.25,1.26,1.64,material('#67c9e8',{transmission:.55,roughness:.08,thickness:.7,transparent:true,opacity:.64}));
   const iceMat=material('#c5efff',{roughness:.12,transmission:.32,transparent:true,opacity:.8,thickness:.22,clearcoat:1});
   for(let i=0;i<13;i++){
    const a=i*2.4,size=.16+(i%3)*.025,y=1.83+(i%4)*.14;
    const ice=add(new T.BoxGeometry(size,size,size),iceMat,food,[Math.sin(a)*.36,y,Math.cos(a)*.35]);ice.rotation.set(a,a*.3,.3);ice.name='soda-ice';
    iceCubes.push({object:ice,y,angle:a});
   }
   dollop(0,2.43,0,.55,.7,white);for(let i=0;i<8;i++){const a=i*TAU/8;ball(Math.sin(a)*.36,2.48,Math.cos(a)*.36,.17,white)}tube([[-.32,2.1,0],[-.48,2.84,0],[-.6,3.22,0]],.033,material('#b8dfed'));
   const bubbleMat=material('#c9f4ff',{roughness:.12,metalness:.15,transparent:true,opacity:.88,clearcoat:1});
   const bubbleGeo=new T.SphereGeometry(1,low?10:16,low?6:10);
   for(let i=0;i<84;i++){
    const b=add(bubbleGeo,bubbleMat);b.name=i<60?'soda-bubble':'soda-burst';
    bubbles.push({object:b,phase:i,angle:i*2.3999,radius:.032+(i%5)*.011,burst:i>=60});
   }
  }else{
   const pts=[[.075,.78],[.35,.94],[.55,1.16],[.64,1.5],[.62,1.77]].map(([x,y])=>new T.Vector2(x,y));add(new T.LatheGeometry(pts,round),glass);torus(.62,.023,1.77,glass);cylinder(.49,.3,.34,1.18,material('#e2c390'));cylinder(.56,.49,.2,1.46,white);for(let i=0;i<9;i++){const a=i*TAU/9;ball(Math.sin(a)*.46,1.68,Math.cos(a)*.46,.17,material('#b2cb72',{roughness:.25,clearcoat:.7}))}ball(0,1.96,0,.39,material('#b9ce85',{roughness:.65}));dollop(-.2,2.22,0,.21,.29,white);leaf(.26,2.22,0,.5,green,food,.22);
   const gold=material('#edb12d',{roughness:.42,metalness:.16}),pollen=material('#bc771b',{roughness:.6});
   const flowerGeo=new T.SphereGeometry(1,low?8:12,low?6:8);
   function osmanthus(){
    const g=new T.Group();g.name='golden-osmanthus';food.add(g);
    for(let j=0;j<4;j++){const a=j*TAU/4;const p=add(flowerGeo,gold,g,[Math.sin(a)*.043,0,Math.cos(a)*.043],[.035,.012,.048]);p.rotation.y=a}
    add(flowerGeo,pollen,g,[0,.01,0],[.02,.014,.02]);return g;
   }
   for(let i=0;i<11;i++){const a=i*2.4,r=.07+Math.sqrt(i/11)*.25,g=osmanthus();g.position.set(Math.sin(a)*r,2.29-(r/.39)**2*.14,Math.cos(a)*r);g.rotation.set(.25*Math.sin(a),a,.2*Math.cos(a));}
   for(let i=0;i<32;i++){const g=osmanthus();g.name='falling-osmanthus';blossoms.push({object:g,phase:i,angle:i*2.3999});}

  }
 }
 const baseY=food.position.y;
 function update({time=0,amount=0,impulse=0}={}){
  const w=impulse;food.position.y=baseY;food.rotation.set(0,0,0);food.scale.setScalar(1);
  slice.position.set(-amount*.65,amount*.045,amount*.96);
  if(id==='peach')animated.forEach(({object,y,phase})=>{object.position.y=y+Math.abs(Math.sin(time*12+phase*.7))*w*.15;object.rotation.z=Math.sin(time*14+phase)*w*.09});
  if(id==='petal')petals.forEach(({object,angle,phase})=>{object.rotation.y=angle+amount*.14;object.rotation.x=amount*.3;object.scale.setScalar(1+amount*.16)});
  if(id==='heart'){heart.scale.set(1+Math.sin(time*18)*w*.065,1+Math.sin(time*18)*w*.035,1+Math.sin(time*18)*w*.065)}
  if(id==='noir'){flame.visible=amount>.02;flame.scale.y=1.7+Math.sin(time*13)*.16;fire.intensity=amount*(6+Math.sin(time*13)*.6)}
  if(id==='cottage')door.rotation.y=-amount*1.9;
  if(id==='matcha')animated.forEach(({object,phase})=>{object.rotation.x=Math.sin(time*7+phase*.5)*w*.24;object.rotation.z=Math.sin(time*6+phase*.4)*w*.17});
  if(id==='slice')layers.forEach(({object,y,index})=>{object.position.y=y+amount*index*.135});
  if(id==='jelly'){const o=animated[0].object,q=Math.sin(time*17)*w*.13;o.scale.set(1+q,1-q*1.3,1+q*.7);o.rotation.z=Math.sin(time*14)*w*.06;}
  if(id==='blue'){
   const elapsed=(1-w)/.35,strength=Math.min(1,w*3);
   bubbles.forEach(({object,phase,angle,radius,burst})=>{
    const progress=burst?((elapsed*.8+phase*.071)%1):((time*.16+(w>0?elapsed*1.15:0)+phase*.073)%1);
    const spread=burst?.58+progress*.28:.14+progress*.26;
    object.visible=!burst||w>.025;
    object.position.set(Math.sin(angle+Math.sin(time*3+phase)*strength*.15)*spread,burst?2.37+progress*.94:1.06+progress*1.29,Math.cos(angle)*spread);
    object.scale.setScalar(radius*(burst?(1-progress)*1.8*strength:.8+strength*.85));
   });
   iceCubes.forEach(({object,y,angle})=>{object.position.y=y+Math.sin(elapsed*10+angle)*strength*.065;object.rotation.set(angle+Math.sin(elapsed*7+angle)*strength*.16,angle*.3,.3+Math.sin(elapsed*6+angle)*strength*.14)});
  }
  if(id==='parfait'){
   const elapsed=(1-w)/.35;
   blossoms.forEach(({object,phase,angle})=>{
    const progress=Math.max(0,Math.min(1,(elapsed-(phase%8)*.055)/1.95));
    const radius=.24+(phase%5)*.13;
    object.visible=w>0&&progress<1;
    object.position.set(Math.sin(angle)*radius+Math.sin(progress*5+angle)*.12,3.37-progress*(1.12+(phase%5)*.12),Math.cos(angle)*radius+Math.sin(progress*4+phase)*.1);
    object.rotation.set(progress*4+angle,angle+progress*5,Math.sin(progress*6+phase)*.65);
    object.scale.setScalar((.8+(phase%3)*.18)*Math.min(1,(1-progress)*6));
   });
  }
 }
 update();return {root,food,update,center:id==='blue'?1.58:id==='parfait'?1.35:1.12,radius:id==='blue'?2.2:2.4};
}
export function disposeDessert(root){const geometries=new Set(),materials=new Set();root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m))});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}
