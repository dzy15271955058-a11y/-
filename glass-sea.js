import {T,C,v} from './kit.js';
import {makeCreatures} from './creatures.js';

// The shallow shelf is actual geometry seen through the transparent water.
export function shoreDistance(x,z){return Math.min(
 (Math.hypot((x+65)/27,(z+13)/49)-1)*27,
 (Math.hypot(x/68,(z+8)/83)-1)*68,
 (Math.hypot((x-82)/35,(z+17)/58)-1)*35,
 (Math.hypot((x-145)/31,(z+75)/43)-1)*31,
 (Math.hypot((x-62)/95,(z+96)/43)-1)*43
 );}
export function seabedHeight(x,z){const distance=Math.max(0,shoreDistance(x,z));return -1.8-Math.min(22,distance*.19)-.22*Math.sin(x*.12)*Math.cos(z*.14);}
export function buildGlassCoast(K,root){
 const coast=K.group(root,'透明海水下的沙底与浅礁'),geo=new T.PlaneGeometry(1600,1600,180,180);geo.rotateX(-Math.PI/2);const a=geo.attributes.position;
 for(let i=0;i<a.count;i++)a.setY(i,seabedHeight(a.getX(i),a.getZ(i)));geo.computeVertexNormals();
 const bed=K.mesh(coast,geo,K.mat('#cedff5',{roughness:.82}));bed.name='连续浅色海床';bed.userData.live=true;
 const B=makeCreatures(K),fish=[],living=K.group(coast,'玻璃海浅水鱼群');living.userData.live=true;
 for(const [cx,cz]of [[-38,82],[17,88],[89,66],[124,25]]){
  for(let i=0;i<7;i++){let x=cx+Math.sin(i*2.4)*4,z=cz+Math.cos(i*2.4)*3,y=seabedHeight(x,z);K.ell(coast,x,y-.12,z,.6+i%3*.25,.35,.7,'#e3e7d8',20);if(i%2===0)for(let s of [-1,1])K.tube(coast,[[x,y,z],[x+s*.16,y+.45,z],[x+s*.42,y+.79,z+.09]],.055,[C.rose,C.peach,C.violet][i%3],false,20);else for(let j=0;j<3;j++)K.tube(coast,[[x+j*.1,y,z],[x+.2,y+.5,z],[x-.09,y+1.1,z+.1]],.025,'#72bcb0',false,18);}
  for(let i=0;i<4;i++){let x=cx+i*1.5-2,z=cz+3,y=seabedHeight(x,z)+1.2,g=B.marine(living,x,y,z,{type:'clownfish',scale:.45});g.userData.live=true;fish.push({g,x,y,z});}
 }
 return {coast,bed,living,fish};
}
const voronoi=`
vec2 hash2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
float caustic(vec2 p,float tm){p+=.13*vec2(sin(p.y*1.8+tm*.24),cos(p.x*1.4-tm*.19));vec2 cell=floor(p),f=fract(p);float first=10.,second=10.;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));vec2 h=hash2(cell+b);vec2 offset=.5+.31*sin(6.28318*h+tm*.22);float d=length(b+offset-f);if(d<first){second=first;first=d;}else second=min(second,d);}return 1.-smoothstep(.018,.065,second-first);}
float shore(vec2 p){float a=(length((p-vec2(0.,-8.))/vec2(68.,83.))-1.)*68.;float b=(length((p-vec2(82.,-17.))/vec2(35.,58.))-1.)*35.;float c=(length((p-vec2(145.,-75.))/vec2(31.,43.))-1.)*31.;float d=(length((p-vec2(62.,-96.))/vec2(95.,43.))-1.)*43.;float e=(length((p-vec2(-65.,-13.))/vec2(27.,49.))-1.)*27.;return min(e,min(min(a,b),min(c,d)));}
`;
export function waterMaterial(pool=false){return new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,fog:true,uniforms:{time:{value:0},waterColor:{value:new T.Color(pool?'#164fce':'#90bdf4')},skyColor:{value:new T.Color('#d8e6ff')},sunColor:{value:new T.Color('#fffaf0')},sunDirection:{value:v(-.45,.8,.35).normalize()},night:{value:0},isPool:{value:pool?1:0},...T.UniformsUtils.clone(T.UniformsLib.fog)},vertexShader:`
 uniform float time;uniform float isPool;varying vec3 wp;varying vec3 wn;
 #include <fog_pars_vertex>
 void main(){vec3 p=position;float f=isPool>.5?.40:.065;float amp=isPool>.5?.022:.095;p.z+=sin(p.x*f+time*.6)*amp+cos(p.y*f*.85+time*.46)*amp;vec4 w=modelMatrix*vec4(p,1.);wp=w.xyz;wn=normalize(mat3(modelMatrix)*vec3(-cos(p.x*f+time*.6)*amp*f,sin(p.y*f*.85+time*.46)*amp*f*.85,1.));vec4 mvPosition=viewMatrix*w;gl_Position=projectionMatrix*mvPosition;
 #include <fog_vertex>
 }`,fragmentShader:`
 uniform float time;uniform float night;uniform float isPool;uniform vec3 waterColor;uniform vec3 skyColor;uniform vec3 sunColor;uniform vec3 sunDirection;varying vec3 wp;varying vec3 wn;
 #include <fog_pars_fragment>
 ${voronoi}
 void main(){vec3 n=normalize(wn+vec3(sin(wp.z*.57+time*.34)*.024,0.,cos(wp.x*.65-time*.4)*.024));vec3 eye=normalize(cameraPosition-wp);float fr=pow(1.-max(dot(n,eye),0.),3.);float distanceToShore=max(0.,shore(wp.xz));float depth=smoothstep(4.,90.,distanceToShore);float network=caustic(wp.xz*.62,time);float light=pow(max(dot(reflect(-sunDirection,n),eye),0.),180.);vec3 col=mix(waterColor,skyColor,fr*(isPool>.5?.26:.65))+network*(isPool>.5?.026:.016)+sunColor*light*.62;float beachFoam=(1.-smoothstep(.3,1.1,abs(distanceToShore-1.8-sin(time*.4)*.28)))*step(.05,distanceToShore)*(1.-depth);col=mix(col,vec3(.97,.985,1.),beachFoam*.36*(1.-isPool));col*=1.-night*.38;float opacity=mix(.32,.54,depth)+fr*.27+beachFoam*.12;if(isPool>.5)opacity=.86+fr*.08;gl_FragColor=vec4(col,clamp(opacity,.2,.95));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 #include <fog_fragment>
 }`});}
export function installSeaOptics(W){
 const bed=W.glassCoast.bed;bed.material=new T.ShaderMaterial({uniforms:{time:{value:0},night:{value:0},warmth:{value:0},...T.UniformsUtils.clone(T.UniformsLib.fog)},fog:true,vertexShader:`varying vec3 wp;
 #include <fog_pars_vertex>
 void main(){vec4 p=modelMatrix*vec4(position,1.);wp=p.xyz;vec4 mvPosition=viewMatrix*p;gl_Position=projectionMatrix*mvPosition;
 #include <fog_vertex>
 }`,fragmentShader:`varying vec3 wp;uniform float time;uniform float night;uniform float warmth;
 #include <fog_pars_fragment>
 ${voronoi}
 void main(){float distanceToShore=max(0.,shore(wp.xz)),depth=smoothstep(5.,100.,distanceToShore);float ripples=sin(wp.x*.18+wp.z*.3)*.017;vec3 sand=mix(vec3(.82,.87,.96),vec3(.36,.58,.88),depth)+ripples;float pattern=caustic(wp.xz*.66,time);float second=caustic(wp.xz*.71+vec2(8.,3.),-time*.7);sand+=vec3(.20,.23,.25)*pattern+vec3(.06,.07,.08)*second;sand=mix(sand,sand*vec3(1.10,.96,.91),warmth*.5);sand*=1.-night*.66;gl_FragColor=vec4(sand,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 #include <fog_fragment>
 }`});return bed.material;
}
export function animateGlassCoast(W,time,reduced){for(let [i,f]of W.glassCoast.fish.entries()){let t=reduced?0:time;f.g.position.set(f.x+Math.sin(t*.28+i)*.75,f.y+Math.sin(t*.55+i)*.09,f.z+Math.cos(t*.28+i)*.5);f.g.rotation.y=-t*.28-i;}W.glassCoast.bed.material.uniforms.time.value=reduced?0:time;}
