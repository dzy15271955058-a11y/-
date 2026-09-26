import {T,C,v} from './kit.js';
import {couture} from './couture.js';
export const BODY_RINGS=[[1.27,.168,.117],[1.40,.172,.118],[1.55,.205,.134],[1.69,.238,.144],[1.82,.246,.134],[1.88,.224,.110],[1.96,.071,.067],[2.035,.061,.060]];
export const BODICE_RINGS=[[1.27,.200,.145],[1.40,.196,.143],[1.55,.234,.163],[1.69,.274,.176],[1.82,.278,.160],[1.88,.238,.135]];
export function legJoints(side,pose,style){
 if(pose==='riding')return [[side*.155,1.32,0],[side*.48,1.25,.47],[side*.55,.64,.68]];
 if(pose==='seated')return [[side*.155,1.32,0],[side*.22,1.25,.53],[side*.23,.64,.64]];
 if(pose==='ballet'&&['ballet','sugar'].includes(style)&&side===1)return [[.12,1.33,0],[.34,1.14,-.43],[.52,1.04,-.97]];
 return [[side*.12,1.33,0],[side*.14,.73,side===1?.035:-.015],[side*.16,.16,side===1?.11:0]];
}
export function makeCharacters(K){
 const {group,mesh,box,cyl,ell,tube,rod,torus,mat,gold,star}=K;
 const satin=c=>mat(c,{roughness:.3,metalness:.08,sheen:.7,sheenRoughness:.4,sheenColor:'#fff0f6',clearcoat:.22});
 const glitter=c=>{const m=mat(c,{roughness:.24,metalness:.25,clearcoat:.5});m.userData.sparkle=true;return m;};
 const prism=(c,transparent=false)=>{const m=mat(c,{roughness:.18,metalness:.28,clearcoat:1,iridescence:1,iridescenceIOR:1.35,iridescenceThicknessRange:[120,740],sheen:.45,sheenColor:'#f3c7ff',side:T.DoubleSide,...(transparent?{transparent:true,opacity:.62,depthWrite:false}:{})});m.userData.sparkle=true;m.userData.prism=true;return m;};
 const tulle=c=>{const m=mat(c,{roughness:.56,metalness:.05,transparent:true,opacity:.38,depthWrite:false,side:T.DoubleSide,sheen:.65});m.userData.sparkle=true;return m;};
 function bow(p,x,y,z,s,c){let g=group(p,'丝缎蝴蝶结',x,y,z);for(let d of [-1,1]){let o=ell(g,d*.23*s,0,0,.27*s,.15*s,.055*s,c,16);o.rotation.z=d*.28;tube(g,[[d*.06*s,-.03*s,0],[d*.14*s,-.21*s,.015],[d*.24*s,-.39*s,.01]],.035*s,c,false,12);}ell(g,0,0,.02*s,.08*s,.08*s,.06*s,c,12);return g;}
 function loft(p,rings,c,n=48,pleat=0){const ps=[],uv=[],ix=[];for(let j=0;j<rings.length;j++){let [y,rx,rz,zc=0]=rings[j];for(let i=0;i<=n;i++){let a=i/n*Math.PI*2,f=1+pleat*Math.sin(a*16);ps.push(Math.sin(a)*rx*f,y,Math.cos(a)*rz*f+zc);uv.push(i/n,j/(rings.length-1));}}for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){let k=j*(n+1)+i;ix.push(k,k+1,k+n+1,k+1,k+n+2,k+n+1);}let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(ps,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(ix);geo.computeVertexNormals();return mesh(p,geo,c);}
 function skirt(p,y,h,rt,rb,c,ruffle=0){let rings=[];for(let j=0;j<=12;j++){let t=j/12;let r=rb*(1-t)**.87+rt*t;rings.push([y+h*t,r,r*.94]);}return loft(p,rings,c,64,.035+ruffle*.055);}
 function limb(p,a,b,r1,r2,c){a=v(...a);b=v(...b);let len=a.distanceTo(b),rings=[[0,r1*.65,r1*.65],[len*.08,r1,r1*.92],[len*.38,r1*.94,r1*.88],[len*.75,r2*1.12,r2],[len,r2,r2]];let q=loft(p,rings,c,16);q.position.copy(a);q.quaternion.setFromUnitVectors(v(0,1,0),b.sub(a).normalize());return q;}
 function gem(p,x,y,z,s,c=C.pink){let q=mesh(p,new T.OctahedronGeometry(s,0),mat(c,{metalness:.4,roughness:.09,clearcoat:1}),x,y,z);q.scale.z=.5;return q;}
 function crown(p,x,y,z,s=1){let g=group(p,'心形宝石皇冠',x,y,z);g.scale.setScalar(s);torus(g,0,0,0,.25,.013,gold,true,Math.PI*2);for(let i=0;i<7;i++){let a=-1.15+i/6*2.3,xx=Math.sin(a)*.25,zz=Math.cos(a)*.25,hh=.10+.11*(1-Math.abs(a)/1.2);tube(g,[[xx-.045,0,zz],[xx,hh,zz+.01],[xx+.045,0,zz]],.009,gold,false,10);gem(g,xx,hh*.7,zz+.01,.042,i===3?'#ed71be':'#f5d7eb');}return g;}
 function flowerApplique(p,x,y,z,s=.04,c=C.rose){let g=K.blossom(p,x,y,z,s*.78,c,'rose',0);g.rotation.x=Math.PI/2;g.scale.y*=.30;return g;}
 function outfit(p,style='ruffle',color=C.pink){const g=group(p,'可更换高级服装'),sa=satin(color),gl=glitter(color);const formal=['gown','floral','swan','ballet','sugar'].includes(style);
 loft(g,BODICE_RINGS,style==='uniform'?satin('#394b99'):sa,56);g.userData.style=style;g.userData.color=color;
 for(let side of [-1,1])tube(g,[[side*.176,1.31,.10],[side*.182,1.47,.14],[side*.243,1.71,.117],[side*.23,1.83,.117]],.0035,style==='uniform'?C.blue:color,false,24);
 for(let d of [-1,1])tube(g,[[d*.19,1.80,.10],[d*.22,1.94,0],[d*.18,1.80,-.12]],.017,formal?gl:sa,false,12);
 if(couture(K,g,style,color,{loft,skirt,satin,tulle,bow,gem,flowerApplique})){}else if(style==='tailor'||style==='pajamas'||style==='astronaut'||style==='pilot'||style==='chef'||style==='rider'){
  for(let d of [-1,1]){let [hip,knee,ankle]=legJoints(d,p.userData.pose||'stand',style),fabric=style==='chef'?satin(C.cream):sa;limb(g,hip,knee,.132,.098,fabric);ell(g,...knee,.097,.096,.098,fabric,24);limb(g,knee,ankle,.098,.069,fabric);torus(g,ankle[0],ankle[1]+.07,ankle[2],.073,.007,C.cream,true);}
  for(let yy of [1.42,1.55,1.68,1.78])ell(g,0,yy,.16,.016,.017,.012,C.cream,10);
  for(let d of [-1,1]){box(g,d*.13,1.64,.157,.10,.08,.015,sa,.012);tube(g,[[d*.05,1.85,.12],[d*.13,1.73,.17],[d*.19,1.85,.08]],.016,C.cream,false,8);}
  if(style==='pajamas')for(let d of [-1,1]){let a=legJoints(d,p.userData.pose||'stand',style)[2];ell(g,a[0],a[1]-.06,a[2]+.09,.096,.066,.18,C.cream);bow(g,a[0],a[1]+.005,a[2]+.15,.19,color);}
  if(style==='pilot'){star(g,.13,1.72,.18,.045,gold,.008);box(g,0,1.40,0,.43,.055,.30,gold,.01);}
 }else if(style==='uniform'){
  skirt(g,.83,.49,.20,.46,satin('#f18ab6'),.3);for(let i=0;i<24;i++){let a=i*Math.PI/12;tube(g,[[Math.sin(a)*.46,.84,Math.cos(a)*.43],[Math.sin(a)*.20,1.32,Math.cos(a)*.19]],.006,C.cream,false,6);}for(let yy of [.92,1.08])torus(g,0,yy,0,yy<1?.41:.32,.008,C.cream,true);bow(g,0,1.79,.16,.23,C.rose);
 }else if(formal){
  let short=style==='ballet'||style==='sugar',bottom=short?.77:.045,rad=short?.73:style==='swan'?1.03:.87;
  skirt(g,bottom,1.30-bottom,.20,rad,sa,.5);
  if(style==='floral'){
   for(let j=0;j<5;j++)for(let i=0;i<16;i++){let t=j/5,a=i*Math.PI/8+(j%2)*.16,r=.83*(1-t)+.23*t;let b=group(g,'碎花缎面刺绣',Math.sin(a)*r,.18+t*1.04,Math.cos(a)*r);b.rotation.y=a;flowerApplique(b,0,0,.02,.037,[C.rose,C.peach,C.violet][(i+j)%3]);}
   for(let j=0;j<7;j++)tube(g,[[-.17,1.34+j*.035,.12],[0,1.37+j*.035,.15],[.17,1.39+j*.035,.12]],.012,'#739bad',false,10);
  }else {
   for(let l=0;l<2;l++)skirt(g,bottom-.015-l*.012,1.30-bottom,.205,rad+.025+l*.03,tulle(l?C.cream:color),.5);
   for(let i=0;i<10;i++){let a=i*Math.PI/5,pp=[];for(let j=0;j<=12;j++){let q=j/12,rr=.21+Math.sin(q*Math.PI*.5)*(rad*.82),aa=a+Math.sin(q*Math.PI)*.19;pp.push([Math.sin(aa)*rr,1.30-q*(short?.37:.89),Math.cos(aa)*rr]);}tube(g,pp,.008,style==='swan'?C.blue:C.cream,false,20);gem(g,Math.sin(a)*rad*.83,bottom+.20,Math.cos(a)*rad*.83,.018,C.cream);}
   for(let j=0;j<7;j++)flowerApplique(g,(j-3)*.052,1.39+Math.abs(j-3)*.075,.147,.022,C.cream);
  }
  bow(g,0,1.30,-.21,.9,style==='floral'?'#739bad':sa);
 }else{for(let i=0;i<3;i++)skirt(g,.73+i*.19,.34,.22,.57-i*.105,glitter([C.violet,color,C.hot][i]),1);bow(g,0,1.31,.16,.35,C.rose);}
 torus(g,0,1.31,0,.204,.009,gold,true);return g;
 }
 function face(p,hair,skin,options={}){
  const g=group(p,'雕塑脸型与细致妆容',0,2.005,0);g.scale.set(.83,.80,.83);g.rotation.y=options.look??-.065;g.rotation.z=options.tilt??.018;
  const profile=[[0,.018,.025],[.045,.074,.067],[.11,.139,.122],[.19,.182,.158],[.29,.203,.175],[.39,.205,.172],[.48,.174,.147],[.55,.107,.087],[.59,.002,.002]];
  function shapeAt(y){let k=0;while(k<profile.length-2&&y>profile[k+1][0])k++;const a=profile[k],b=profile[k+1],f=T.MathUtils.clamp((y-a[0])/(b[0]-a[0]),0,1);let vals=[];for(let d=1;d<3;d++){const prev=profile[Math.max(0,k-1)],next=profile[Math.min(profile.length-1,k+2)];let m0=(b[d]-prev[d])/(b[0]-prev[0]),m1=(next[d]-a[d])/(next[0]-a[0]),h=b[0]-a[0];vals.push((2*f**3-3*f*f+1)*a[d]+(f**3-2*f*f+f)*h*m0+(-2*f**3+3*f*f)*b[d]+(f**3-f*f)*h*m1);}return vals;}
  function sculpt(x,y){let bridge=.021*Math.exp(-((x/.024)**2)-(((y-.28)/.065)**2)),tip=.026*Math.exp(-((x/.030)**2)-(((y-.236)/.025)**2)),cheek=.007*Math.exp(-(((Math.abs(x)-.107)/.062)**2)-(((y-.214)/.055)**2)),orbit=.004*Math.exp(-(((Math.abs(x)-.082)/.059)**2)-(((y-.333)/.031)**2));return bridge+tip+cheek-orbit;}
  function front(x,y){const [rx,rz]=shapeAt(y);return Math.sqrt(Math.max(.01,1-(x/rx)**2))*rz+sculpt(x,y);}
  const ps=[],uv=[],ix=[],ny=48,nx=64;
  for(let j=0;j<=ny;j++){let y=j/ny*.59,[rx,rz]=shapeAt(y);for(let i=0;i<=nx;i++){let a=i/nx*Math.PI*2,x=Math.sin(a)*rx,z=Math.cos(a)*rz;z+=Math.max(0,Math.cos(a))**3*sculpt(x,y);ps.push(x,y,z);uv.push(i/nx,j/ny);}}
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){let k=j*(nx+1)+i;ix.push(k,k+1,k+nx+1,k+1,k+nx+2,k+nx+1);}let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(ps,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(ix);geo.computeVertexNormals();mesh(g,geo,skin).name='连续额头鼻梁颧骨与下颌';
  const eyeWhite=mat('#fffaf4',{roughness:.30,clearcoat:.22}),iris=mat(options.eyes||'#527f9b',{roughness:.22,clearcoat:.55}),lash=mat('#493743',{roughness:.75});
  for(let d of [-1,1]){
   const cx=d*.083,cy=.330,eps=[],eix=[],cols=24,rows=8;
   for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){let u=i/cols*2-1,f=j/rows,x=cx+u*.055,envelope=Math.max(0,1-u*u)**.7,y=cy+(-.019+f*.045)*envelope;eps.push(x,y,front(x,y)+.004+.003*envelope*Math.sin(f*Math.PI));}
   for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let k=j*(cols+1)+i;eix.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}let eg=new T.BufferGeometry();eg.setAttribute('position',new T.Float32BufferAttribute(eps,3));eg.setIndex(eix);eg.computeVertexNormals();mesh(g,eg,eyeWhite).name='贴合眼眶的杏仁形眼白';
   let eye=group(g,'虹膜与双点高光',cx-.002,cy+.001,front(cx,cy)+.009);eye.rotation.y=d*.23;ell(eye,0,0,0,.0215,.023,.006,iris,24);ell(eye,0,.001,.0055,.009,.015,.0025,lash,20);ell(eye,-.006,.010,.008,.005,.005,.0018,C.white,12);ell(eye,.008,-.008,.007,.0023,.0023,.0015,C.white,8);
   const lid=[];for(let i=0;i<=20;i++){let u=i/20*2-1,x=cx+u*.055,y=cy+.026*Math.max(0,1-u*u)**.7;lid.push([x,y,front(x,y)+.006]);}tube(g,lid,.0026,lash,false,26);
   const lower=[];for(let i=0;i<=20;i++){let u=i/20*2-1,x=cx+u*.055,y=cy-.019*Math.max(0,1-u*u)**.7;lower.push([x,y,front(x,y)+.005]);}tube(g,lower,.0017,'#b9868b',false,24);
   for(let j=0;j<5;j++){let x=cx+d*(.017+j*.007),y=cy+.022-j*.002;tube(g,[[x,y,front(x,y)+.006],[x+d*.006,y+.009,front(x,y)+.008],[x+d*.01,y+.014,front(x,y)+.007]],.00125,lash,false,10);}
   const brow=[];for(let i=0;i<12;i++){let f=i/11,x=d*(.034+f*.101),y=.391+Math.sin(f*Math.PI)*.012-f*.004;brow.push([x,y,front(x,y)+.004]);}tube(g,brow,.0038,mat(hair,{roughness:.65}),false,24);
   ell(g,d*.203,.274,-.009,.022,.049,.018,skin,24);ell(g,d*.218,.274,.002,.009,.030,.008,'#d9a396',16);if(options.accessories!==false){torus(g,d*.211,.214,.009,.021,.0035,gold);gem(g,d*.212,.172,.015,.018,'#d7e8f3');}
   const blush=ell(g,d*.126,.22,front(d*.126,.22)+.002,.034,.021,.0015,mat('#ee91aa',{transparent:true,opacity:.14,depthWrite:false,roughness:.9}),24);blush.rotation.y=d*.52;
   ell(g,d*.016,.228,front(d*.016,.228)+.0005,.0045,.0018,.0025,'#bb8c85',12);
  }
  function lip(top){const sh=new T.Shape();sh.moveTo(-.043,.137);if(top){sh.bezierCurveTo(-.026,.148,-.012,.152,0,.145);sh.bezierCurveTo(.013,.152,.026,.15,.043,.14);sh.quadraticCurveTo(0,.137,-.043,.137);}else{sh.quadraticCurveTo(0,.113,.043,.14);sh.quadraticCurveTo(0,.134,-.043,.137);}let ge=new T.ShapeGeometry(sh,24),a=ge.attributes.position;for(let i=0;i<a.count;i++){let x=a.getX(i),y=a.getY(i);a.setZ(i,front(x,y)+.004+.003*Math.max(0,1-(x/.045)**2));}ge.computeVertexNormals();mesh(g,ge,mat(top?'#ca8296':'#e0a0ad',{roughness:.38,clearcoat:.15}));}lip(true);lip(false);
  tube(g,[[-.042,.137,front(-.042,.137)+.006],[0,.137,front(0,.137)+.008],[.043,.14,front(.043,.14)+.006]],.0016,'#a86c7d',false,24);
  if(options.beautyMark)ell(g,.128,.28,front(.128,.28)+.002,.0028,.0028,.0014,'#84575d',10);
  const hm=mat(hair,{roughness:.40,metalness:.025,sheen:.55,sheenRoughness:.45,sheenColor:'#f7e1c2'}),highlight=mat('#'+new T.Color(hair).lerp(new T.Color('#f5dfbb'),.28).getHexString(),{roughness:.44,metalness:.025});
  const cap=mesh(g,new T.SphereGeometry(1,48,28,0,Math.PI*2,0,1.58),hm,0,.365,-.02);cap.scale.set(.212,.229,.196);
  const bun=options.hairStyle==='bun'||['ballet','floral','swan','pilot','rider','chef','astronaut'].includes(options.style);
  for(let side of [-1,1])for(let i=0;i<15;i++){let f=i/14,pts=[];for(let j=0;j<=18;j++){let q=j/18;pts.push([side*(.006+(.196-f*.018)*Math.sin(q*Math.PI*.55)),.59-q*(.205+f*.105),.033+Math.sin(q*Math.PI*.72)*(.136-f*.025)-f*.045]);}tube(g,pts,.004, i%4===0?highlight:hm,false,32);}
  if(bun){ell(g,.028,.35,-.219,.126,.117,.116,hm,32);for(let i=0;i<17;i++){let a=i*Math.PI*2/17;tube(g,[[.028+Math.cos(a)*.096,.35+Math.sin(a)*.090,-.255],[.028+Math.cos(a+.7)*.117,.35+Math.sin(a+.7)*.108,-.302],[.028+Math.cos(a+1.5)*.065,.35+Math.sin(a+1.5)*.061,-.331]],.0035,i%4?hm:highlight,false,20);}if(options.accessories!==false&&!['pilot','rider','chef','astronaut'].includes(options.style))crown(g,0,.515,.013,.70);}
  else{ell(g,0,.10,-.178,.165,.31,.065,hm,32);for(let i=0;i<20;i++){let a=-1.50+i/19*3.0,xx=Math.sin(a)*.204,zz=-Math.cos(a)*.178,pts=[];for(let j=0;j<=20;j++){let t=j/20;let spread=Math.sin(a)*.105*Math.sin(t*Math.PI*.8);pts.push([xx+spread+Math.sin(t*7+i*.35)*.012,.45-t*(options.hairStyle==='long'?1.06:.84),zz-.024-t*.10]);}let curve=new T.CatmullRomCurve3(pts.map(p=>v(...p))),frames=curve.computeFrenetFrames(30,false),verts=[],idx=[];for(let j=0;j<=30;j++){let t=j/30,p=curve.getPointAt(t),r=.026*Math.sin(Math.PI*(.14+.84*t))+.002;for(let k=0;k<=10;k++){let a=k*Math.PI/5,delta=frames.normals[j].clone().multiplyScalar(Math.cos(a)*r).addScaledVector(frames.binormals[j],Math.sin(a)*r*.65);verts.push(...p.clone().add(delta).toArray());}}for(let j=0;j<30;j++)for(let k=0;k<10;k++){let a=j*11+k;idx.push(a,a+1,a+11,a+1,a+12,a+11);}let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setIndex(idx);geo.computeVertexNormals();mesh(g,geo,hm);for(let k=0;k<2;k++)tube(g,pts.map(([x,y,z])=>[x+(k-.5)*.009,y,z+.018]),.0019,k?hm:highlight,false,30);}bow(g,.025,.593,-.06,.30,satin(C.rose));}
  if(options.hairStyle==='tinsel')for(let i=0;i<8;i++)tube(g,[[i*.024-.09,.54,-.12],[Math.sin(i)*.18,.3,-.23],[Math.sin(i+.7)*.23,-.08,-.24]],.0028,glitter([C.blue,C.pink,C.gold,C.mint][i%4]),false,24);
  if(options.style==='floral'){let bonnet=mesh(g,new T.SphereGeometry(.29,36,20,0,Math.PI*2,0,1.58),tulle(C.blue),0,.38,-.039);bonnet.rotation.x=-.8;for(let i=0;i<22;i++){let a=-1.6+i/21*3.2;ell(g,Math.sin(a)*.29,.38+Math.cos(a)*.29,.018,.018,.022,.014,C.cream,12);}bow(g,0,.035,.10,.34,C.blue);}
  g.userData.surfaceFront=front;return g;
 }
 function doll(p,x,y,z,options={}){
  const {style='ruffle',color=C.pink,scale=1,hair='#e7bf7c',skin='#f4c9b4',pose='stand',name='精修人物'}=options;
  let g=group(p,name,x,y,z);g.scale.setScalar(scale);g.rotation.y=options.rotation||0;g.userData.character=true;g.userData.pose=pose;g.userData.style=style;g.userData.color=color;const sk=mat(skin,{roughness:.56,clearcoat:.055,clearcoatRoughness:.6});
  const legs=group(g,'腿部与舞鞋');const ballet=pose==='ballet'&&['ballet','sugar'].includes(style);
  for(let d of [-1,1]){let [hip,knee,ankle]=legJoints(d,pose,style);limb(legs,hip,knee,.10,.065,sk);ell(legs,...knee,.063,.069,.064,sk,20);limb(legs,knee,ankle,.073,.041,sk);let foot=group(legs,'丝缎鞋与绑带',...ankle);if(d===1&&ballet)foot.rotation.x=-.45;ell(foot,0,-.06,.09,.076,.048,.176,satin(color),20);for(let j=0;j<3;j++)tube(foot,[[-.048,j*.055,-.005],[.048,.03+j*.055,.02],[-.048,.065+j*.055,.035]],.007,satin(color),false,12);if(ballet&&d===-1)ell(foot,0,-.123,.18,.060,.036,.100,satin(color),24);if(!ballet){rod(foot,[0,-.07,-.02],[0,-.158,-.02],.012,gold);ell(foot,0,-.137,.105,.070,.022,.145,satin(color),24);}}
  let torso=group(g,'肩颈与躯干');loft(torso,BODY_RINGS,sk,48);limb(torso,[0,1.92,0],[0,2.08,0],.068,.061,sk);
  const clothes=outfit(g,style,color);const head=face(g,hair,sk,{...options,style});
  for(let i=0;i<17;i++){let a=i/16*Math.PI;ell(g,Math.cos(a)*.113,1.92-Math.sin(a)*.073,Math.sin(a)*.095,.008,.008,.008,style==='floral'?C.cream:gold,10);}
  const arms=[];
  for(let d of [-1,1]){let shoulder=[d*.27,1.85,0],elbow=[d*.41,1.49,.035],wrist=[d*.49,1.22,.17];if(pose==='wave'&&d===1){elbow=[.48,1.62,.02];wrist=[.48,2.04,.03];}else if(pose==='ballet'){elbow=[d*.59,d===-1?2.16:1.81,0];wrist=[d*.82,d===-1?2.45:1.99,.02];}else if(pose==='riding'){elbow=[d*.40,1.65,.25];wrist=[d*.46,1.47,.85];}else if(pose==='read'||pose==='hold'||pose==='seated'){elbow=[d*.38,1.51,.11];wrist=[d*.20,1.58,.40];}else if(pose==='astronaut'){elbow=[d*.44,1.66,0];wrist=[d*.53,1.93,.15];}else if(d===1){elbow=[.45,1.49,.015];wrist=[.39,1.38,.21];}
   let ag=group(g,'自然手臂'),sleeved=['tailor','pajamas','astronaut','pilot','chef','rider'].includes(style),gloved=style==='gown'||style==='astronaut',fabric=satin(style==='chef'?C.cream:color),armMat=sleeved?fabric:sk,handMat=gloved?mat(C.cream,{roughness:.57}):sk;ell(ag,...shoulder,sleeved?.085:.076,.085,.073,armMat,24);limb(ag,shoulder,elbow,sleeved?.080:.067,sleeved?.058:.044,armMat);ell(ag,...elbow,.048,.050,.047,armMat,24);limb(ag,elbow,wrist,sleeved?.062:.052,sleeved?.039:.030,gloved?handMat:armMat);
   let hand=group(ag,'手掌与分节手指',...wrist);let direction=v(...wrist).sub(v(...elbow)).normalize();hand.quaternion.setFromUnitVectors(v(0,-1,0),direction);ell(hand,0,-.052,0,.036,.057,.016,handMat,24);for(let j=0;j<4;j++){let xx=-.026+j*.017,len=[.061,.074,.069,.052][j];tube(hand,[[xx,-.095,0],[xx*1.16,-.095-len*.5,.003],[xx*1.22,-.095-len,.018]],.0061,handMat,false,20);if(!gloved)ell(hand,xx*1.22,-.095-len,.023,.004,.009,.002,satin(C.rose),10);}tube(hand,[[d*.028,-.035,0],[d*.063,-.066,.016],[d*.071,-.096,.027]],.008,handMat,false,18);arms.push(ag);
  }
  if(style==='astronaut'){box(g,0,1.59,-.26,.48,.66,.24,C.cream,.09);box(g,0,1.64,.18,.30,.24,.07,C.cream,.04);for(let i=0;i<3;i++)gem(g,-.075+i*.075,1.66,.23,.017,[C.blue,C.pink,C.gold][i]);let helmet=ell(g,0,2.29,0,.34,.39,.33,mat('#d7f5ff',{transparent:true,opacity:.16,depthWrite:false,clearcoat:1,roughness:.09}),36);torus(g,0,2.29,.20,.31,.035,C.cream);for(let d of [-1,1])cyl(g,d*.28,2.31,0,.09,.09,.08,C.rose,20).rotation.z=Math.PI/2;}
  if(style==='chef'){ell(g,0,2.61,0,.205,.15,.19,C.cream,20);cyl(g,0,2.495,0,.18,.18,.13,C.cream,24);}
  if(style==='pilot'){cyl(g,0,2.51,0,.19,.175,.10,C.rose,32);ell(g,0,2.475,.13,.19,.024,.13,C.pink);star(g,0,2.53,.17,.035,gold,.01);}
  if(style==='rider'){ell(g,0,2.49,-.005,.23,.13,.20,C.dark,24);ell(g,0,2.48,.17,.24,.018,.15,C.dark);}
  g.userData.outfit=clothes;g.userData.arms=arms;g.userData.head=head;g.userData.legs=legs;g.userData.torso=torso;g.userData.outfitStyle=style;return g;
 }
 function wings(p,scale=1,color=C.rose){
  const g=group(p,'虹彩蝶翼 · 曲面翼膜与金色翅脉',0,1.72,-.17);g.scale.setScalar(scale);
  for(let d of [-1,1])for(let l=0;l<2;l++){
   const sh=new T.Shape();sh.moveTo(0,0);
   if(!l){sh.bezierCurveTo(d*.16,.48,d*.68,1.02,d*1.22,1.02);sh.bezierCurveTo(d*1.39,.91,d*1.04,.49,d*1.04,.34);sh.bezierCurveTo(d*.99,.20,d*.84,.29,d*.79,.11);sh.bezierCurveTo(d*.57,-.07,d*.16,-.1,0,0);}
   else{sh.bezierCurveTo(d*.42,-.03,d*1.05,-.11,d*.92,-.50);sh.bezierCurveTo(d*.84,-.73,d*.52,-.66,d*.43,-1.03);sh.bezierCurveTo(d*.21,-1.05,d*.08,-.32,0,0);}
   const geo=new T.ShapeGeometry(sh,28),pos=geo.attributes.position;for(let i=0;i<pos.count;i++)pos.setZ(i,-.09*Math.sin(Math.abs(pos.getX(i))*2.2)+.024*Math.sin(pos.getY(i)*6));geo.computeVertexNormals();mesh(g,geo,prism(l?'#bfb1f0':color,true));
   const contour=sh.getPoints(48).map(q=>[q.x,q.y,-.09*Math.sin(Math.abs(q.x)*2.2)+.024*Math.sin(q.y*6)+.006]);tube(g,contour,.0055,gold,true,72);
   for(let j=0;j<5;j++){let ex=d*(l?.24+j*.14:.40+j*.16),ey=l?-.33-j*.062:.18+j*.16;tube(g,[[0,0,0],[ex*.35,ey*.64,-.06],[ex,ey,-.07]],.0036,C.cream,false,22);}
   for(let j=0;j<4;j++){let q=ell(g,d*(.27+j*.16),l?-.30-j*.04:.18+j*.12,-.045,.066,l?.16:.18,.004,prism(['#b4d9ed','#edd6ad','#e5b1d8','#c1c3f0'][j],true),20);q.rotation.z=-d*(.35+j*.10);gem(g,d*(.39+j*.15),l?-.46-j*.015:.22+j*.15,-.02,.012,C.cream);}
  }return g;
 }

 function fairy(p,x,y,z,s=.55,color=C.rose){let g=doll(p,x,y,z,{scale:s,color,style:'swan',pose:'hold',hairStyle:'bun',name:'花仙子'});wings(g,1,color);return g;}
 function cat(p,x,y,z,s=1){let g=group(p,'小猫',x,y,z);g.scale.setScalar(s);ell(g,0,.30,0,.20,.29,.29,C.cream);ell(g,0,.66,.13,.22,.20,.20,C.cream);for(let d of [-1,1]){let ear=cyl(g,d*.14,.86,.09,0,.09,.22,C.cream,3);ear.rotation.z=-d*.17;ell(g,d*.083,.68,.312,.035,.045,.016,'#62a6b3',10);ell(g,d*.085,.68,.329,.009,.035,.005,C.dark,8);ell(g,d*.12,.1,.17,.095,.09,.15,C.white);for(let a of [-1,0,1])rod(g,[d*.1,.57,.31],[d*.32,.57+a*.035,.30],.004,C.dark);}ell(g,0,.61,.33,.025,.02,.015,C.rose);tube(g,[[0,.24,-.20],[.33,.24,-.35],[.36,.6,-.33],[.24,.7,-.3]],.05,C.cream);bow(g,0,.44,.28,.28,C.pink);return g;}
 return {prism,doll,outfit,bow,skirt,glitter,tulle,satin,fairy,cat,wings,crown,gem,loft,limb,flowerApplique};
}
