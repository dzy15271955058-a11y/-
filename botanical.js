// Sculpted, reusable botanical geometry. All petals are curved surfaces, never flat discs.
export function makeBotanical(K,T,C){
 const {group,mesh,mat,cyl,torus,tube,rod,ell}=K,cache=new Map();
 const green=mat('#3e8964',{roughness:.76}),leafLight=mat('#74b982',{roughness:.70,side:T.DoubleSide}),leafDark=mat('#458769',{roughness:.72,side:T.DoubleSide});
 const vec=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),noise=n=>{let a=Math.sin(n*127.1+311.7)*43758.5453;return a-Math.floor(a);};
 const tint=(c,t)=>'#'+new T.Color(c?.isMaterial?c.color:c).lerp(new T.Color(t>0?'#fff3f7':'#9a225a'),Math.abs(t)).getHexString();
 function memo(key,make){if(!cache.has(key))cache.set(key,make());return cache.get(key);}
 function surface(kind='round',variant=0,detail=2){return memo('petal-'+kind+'-'+variant+'-'+detail,()=>{
  const p=[],uv=[],idx=[],rows=[5,8,12][detail],cols=[4,6,8][detail];
  for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
   const t=j/rows,u=i/cols*2-1,pointed=kind==='lily'||kind==='dahlia';
   const width=(pointed?.28:.53)*Math.pow(Math.sin(Math.PI*t),pointed?.85:.54)*(.92+.08*Math.cos(t*4+variant));
   const cup=kind==='rose'?.63:kind==='peony'?.29:kind==='lotus'?.35:kind==='lily'?.38:.23;
   const curl=kind==='lily'?.54:kind==='rose'?.12:.27;
   const x=u*width,z=t+.045*Math.sin(t*Math.PI)*u;
   const y=cup*t*t-curl*Math.pow(t,6)+.18*u*u*Math.sin(Math.PI*t)+.018*Math.sin(t*9+variant)*Math.pow(Math.abs(u),4)+.014*Math.cos(u*Math.PI*3)*Math.sin(Math.PI*t);
   p.push(x,y,z);uv.push(i/cols,t);
  }
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let k=j*(cols+1)+i;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
 });}
 function merge(parts){let p=[],n=[],uv=[],ix=[],at=0;for(const g of parts){p.push(...g.attributes.position.array);n.push(...g.attributes.normal.array);uv.push(...g.attributes.uv.array);for(let i of g.index.array)ix.push(at+i);at+=g.attributes.position.count;g.dispose();}let out=new T.BufferGeometry();out.setAttribute('position',new T.Float32BufferAttribute(p,3));out.setAttribute('normal',new T.Float32BufferAttribute(n,3));out.setAttribute('uv',new T.Float32BufferAttribute(uv,2));out.setIndex(ix);return out;}
 function bloomGeometry(kind,variant,detail){return memo('bloom-'+kind+'-'+variant+'-'+detail,()=>{
  const tiers=kind==='rose'&&detail===0?[[7,.11,.95,0],[5,.07,.67,.12],[4,.03,.34,.22]]:kind==='rose'?[[9,.11,.95,0],[7,.08,.70,.12],[6,.035,.40,.21],[4,.01,.19,.25]]:
   kind==='peony'?[[11,.10,1.02,0],[9,.07,.82,.10],[7,.045,.58,.19],[5,.015,.30,.23]]:
   kind==='dahlia'?[[15,.08,1.00,0],[12,.06,.76,.075],[9,.04,.52,.15],[6,.02,.29,.21]]:
   kind==='lotus'?[[10,.42,.98,-.10],[7,.45,.80,.035]]:[[3,.045,1.15,0],[3,.075,1.03,.045]];
  const buckets=[[],[],[]];
  for(let [j,tier]of tiers.entries())for(let i=0;i<tier[0];i++){
   const [count,rad,len,y]=tier,phase=i*2*Math.PI/count+j*2.399+variant*.31,a=phase+.035*Math.sin(i*3.1+j),g=surface(kind==='rose'&&j===0?'peony':kind,variant,detail).clone();
   const q=new T.Quaternion().setFromEuler(new T.Euler(.055*Math.sin(i*2.4+j),a,.055*Math.cos(i*3.1+variant),'YXZ'));
   const matrix=new T.Matrix4().compose(vec(Math.sin(a)*rad,y,Math.cos(a)*rad),q,vec(len*(1+.035*Math.sin(i*2.4)),len,len));g.applyMatrix4(matrix);buckets[Math.min(2,j)].push(g);
  }
  return buckets.map(p=>p.length?merge(p):null);
 });}
 function leafGeometry(){return memo('leaf',()=>{const p=[],uv=[],idx=[],rows=10,cols=6;for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){let t=j/rows,u=i/cols*2-1,w=.24*Math.sin(Math.PI*t)*(1+.045*Math.sin(t*35));p.push(u*w,.15*Math.sin(Math.PI*t)-.035*u*u,t);uv.push(i/cols,t);}for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let k=j*(cols+1)+i;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;});}
 function leaf(p,x,y,z,s=1,angle=0,tilt=-.25){let g=group(p,'弯曲叶片与叶脉',x,y,z);g.rotation.set(tilt,angle,0);g.scale.setScalar(s);mesh(g,leafGeometry(),leafLight);const vein=memo('leaf-vein',()=>new T.TubeGeometry(new T.CatmullRomCurve3([vec(0,.008,0),vec(0,.16,.48),vec(0,.01,1)]),14,.006,4,false));mesh(g,vein,leafDark);return g;}
 function blossom(p,x,y,z,r=.3,c=C.rose,kind='peony',seed=0,detail=r>.65?2:r>.14?1:0){
  let g=group(p,kind==='rose'?'重瓣花园玫瑰':kind==='peony'?'盛放芍药':kind==='dahlia'?'放射大丽花':kind==='lotus'?'云端花瓣寝台':'舒展百合',x,y,z);g.scale.setScalar(r);g.rotation.y=noise(seed+3)*Math.PI*2;g.userData.flowerKind=kind;
  const palette=[tint(c,.28),tint(c,.12),tint(c,-.07)];
  for(let [i,geo]of bloomGeometry(kind,Math.abs(Math.floor(seed))%2,detail).entries())if(geo)mesh(g,geo,mat(palette[i],{roughness:.45,sheen:.35,sheenRoughness:.5,sheenColor:'#ffe9f3',side:T.DoubleSide})).name='舒卷花瓣 · 第'+(i+1)+'层';
  if(kind==='lily')for(let i=0;i<6;i++){let a=i*Math.PI/3;rod(g,[0,.03,0],[Math.sin(a)*.15,.35,Math.cos(a)*.15],.014,'#c99b58');ell(g,Math.sin(a)*.15,.36,Math.cos(a)*.15,.045,.024,.024,'#e5b946',12);}
  if(r>.55){const dew=mat('#e7f2ff',{metalness:.12,roughness:.07,transparent:true,opacity:.72,depthWrite:false,clearcoat:1});for(let i=0;i<3;i++){let a=i*2.399+.6;ell(g,Math.sin(a)*.79,.08,Math.cos(a)*.79,.026,.018,.027,dew,12);}}
  return g;
 }
 function flower(p,x,y,z,s=.3,c=C.rose,options={}){
  const seed=options.seed??Math.floor(noise(x*3.7+y*8.9+z*5.3)*100),kind=options.kind||['peony','rose','peony','lily','dahlia'][seed%5],g=group(p,'自然花枝',x,y,z);g.scale.setScalar(s);
  const h=2.22+noise(seed)*.43,bend=(noise(seed+1)-.5)*.35;
  const stem=memo('stem-'+seed%6,()=>new T.TubeGeometry(new T.CatmullRomCurve3([vec(),vec(.09,.9,.03),vec(-.04,1.5,.07),vec(0,2.3,0)]),14,.031,5,false));let stalk=mesh(g,stem,green);stalk.scale.set(1,h/2.3,1);stalk.rotation.z=bend;
  const tip=vec(0,h,0).applyAxisAngle(vec(0,0,1),bend);const head=blossom(g,tip.x,tip.y,tip.z,.98+noise(seed+2)*.10,c,kind,seed,1);head.rotation.z=bend+(noise(seed+4)-.5)*.32;head.rotation.x=(noise(seed+5)-.5)*.28;
  for(let j=0;j<3;j++)leaf(g,-Math.sin(bend)*(h*.28+j*.37),h*.28+j*.37,.015,.64-j*.085,seed+j*2.399,-.44+j*.12);
  return g;
 }
 function bouquet(p,x,y,z,s=1){
  const g=group(p,'高低错落的庭园花束',x,y,z);g.scale.setScalar(s);
  cyl(g,0,.24,0,.19,.25,.48,mat('#fff1e8',{roughness:.27,clearcoat:.4}),28);torus(g,0,.48,0,.195,.014,K.gold,true);cyl(g,0,.025,0,.23,.23,.05,K.gold,28);
  for(let i=0;i<9;i++){let a=i*2.399,r=i?.30+.06*(i%3):.06,xx=Math.sin(a)*r,zz=Math.cos(a)*r,h=.97+noise(i+7)*.27,size=.235+(i%3)*.035;rod(g,[xx*.16,.34,zz*.16],[xx,h,zz],.010,green);let b=blossom(g,xx,h,zz,size,[C.rose,'#ef93bd',C.cream,'#bb79d2'][i%4],['rose','peony','rose','dahlia','lily'][i%5],i);b.rotation.z=-Math.sin(a)*.25;b.rotation.x=Math.cos(a)*.23;}
  for(let i=0;i<6;i++){let a=i*2.399;leaf(g,Math.sin(a)*.09,.48,Math.cos(a)*.09,.48,a,-.35);}
  for(let d of [-1,1]){rod(g,[0,.43,0],[d*.43,1.39,-.10],.009,green);for(let j=0;j<3;j++)blossom(g,d*(.36+j*.03),1.15+j*.1,-.10,.07,C.cream,'rose',j);}
  return g;
 }
 function flowerSpray(p,x,y,z,s=1,c=C.rose){const g=group(p,'花拱上的玫瑰与垂叶',x,y,z);g.scale.setScalar(s);for(let i=0;i<4;i++){let a=i*2.399,xx=Math.sin(a)*.48,zz=Math.cos(a)*.30;rod(g,[0,-.12,0],[xx,.08,zz],.02,green);let b=blossom(g,xx,.08+(i%2)*.13,zz,.40-(i%3)*.045,i%3?c:C.cream,i%2?'rose':'peony',i);b.rotation.x=.45;}for(let i=0;i<5;i++)leaf(g,0,-.08,0,.79,i*2.399,.1);return g;}
 return {flower,bouquet,blossom,leaf,flowerSpray};
}
