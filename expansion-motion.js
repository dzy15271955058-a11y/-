import {T,v} from './kit.js';
import {submergedWorld} from './world-interactions.js';
export function installWeather(W,scene){
 const material=W.K.mat('#fffaff',{roughness:.82}),positions=[];W.root.updateMatrixWorld(true);
 for(let roofs of [W.mansion.roofs,W.palace.roofs])roofs.traverse(o=>{if(!o.isMesh)return;let g=o.geometry.index?o.geometry.toNonIndexed():o.geometry,a=g.attributes.position,aa=v(),bb=v(),cc=v();for(let i=0;i<a.count;i+=3){aa.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);bb.fromBufferAttribute(a,i+1).applyMatrix4(o.matrixWorld);cc.fromBufferAttribute(a,i+2).applyMatrix4(o.matrixWorld);let n=bb.clone().sub(aa).cross(cc.clone().sub(aa)).normalize();if(n.y<.45||Math.min(aa.y,bb.y,cc.y)<12)continue;for(let p of [aa,bb,cc])positions.push(p.x,p.y+.045,p.z);}if(g!==o.geometry)g.dispose();});
 let roofs=new T.BufferGeometry();roofs.setAttribute('position',new T.Float32BufferAttribute(positions,3));roofs.computeVertexNormals();W.K.mesh(W.coast.snow,roofs,material).name='沿实际屋顶形状覆盖的薄雪';
 let snowGeo=new T.BufferGeometry(),data=[],seed=[];for(let i=0;i<1600;i++){let r=(Math.sin(i*127.1)*43758.5453)%1;if(r<0)r+=1;data.push((r-.5)*140,(i*.6180339%1)*90,(i*.4142135%1-.5)*140);seed.push(i*.731%1);}snowGeo.setAttribute('position',new T.Float32BufferAttribute(data,3));snowGeo.setAttribute('seed',new T.Float32BufferAttribute(seed,1));
 let snowMat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:{value:0},anchor:{value:v()},motion:{value:1}},vertexShader:`attribute float seed;uniform float time;uniform vec3 anchor;uniform float motion;varying float alpha;void main(){vec3 p=position;p.y=mod(p.y-time*(1.6+seed*2.4)*motion,90.)-25.;p.x+=sin(time*.3*motion+seed*50.)*1.2;p+=anchor;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(210./-mv.z,1.3,5.)*(.6+seed);alpha=.45+seed*.45;}`,fragmentShader:`varying float alpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(1.,.97,1.,alpha*smoothstep(.5,.16,d));}`});
 let flakes=new T.Points(snowGeo,snowMat);flakes.frustumCulled=false;flakes.visible=false;scene.add(flakes);return {flakes,mat:snowMat};
}
export function animateExpansion(W,time,reduced,world,winter,weather,camera,ballet=true){
 const t=reduced?0:time,s=W.skyCity.movers,c=W.coast.movers,d=W.deep.movers;
 const p=c.busCurve.getPoint((t*.006)%1),tan=c.busCurve.getTangent((t*.006)%1);c.bus.position.copy(p).add(v(0,.14,0));c.bus.rotation.y=Math.atan2(tan.x,tan.z);
 c.carousel.rotation.y=t*.065;for(let [i,h]of c.horses.entries())h.g.position.y=h.y+Math.sin(t*1.2+i)*.27;
 c.yacht.position.y=.25+Math.sin(t*.55)*.09;c.yacht.rotation.z=Math.sin(t*.4)*.012;
 c.sleigh.position.set(49+Math.sin(t*.08)*12,42+Math.sin(t*.2)*1.5,-18+Math.cos(t*.08)*8);c.sleigh.rotation.y=Math.sin(t*.08)*.35;
 s.pegasus.position.set(-18+Math.sin(t*.10)*15,12+Math.sin(t*.5)*.5,15+Math.cos(t*.10)*5);s.pegasus.rotation.y=-.6+Math.sin(t*.10)*.4;
 for(let [i,f]of s.fairies.entries()){f.g.position.y=f.y+Math.sin(t*.9+i)*.22;f.g.rotation.y=Math.sin(t*.35+i)*.16;}
 for(let [i,f]of s.dancers.entries())f.g.rotation.y=f.rot+(ballet?Math.sin(t*.45+i*.8)*.16:0);
 for(let [i,m]of d.marine.entries()){m.g.position.set(m.x+Math.sin(t*m.speed+i)*2.1,m.y+Math.sin(t*.4+i)*.3,m.z+Math.cos(t*m.speed+i)*2);m.g.rotation.y=Math.PI/2-t*m.speed-i;}
 d.submarine.position.y=-24+Math.sin(t*.25)*.13;
 W.coast.snow.visible=winter&&!submergedWorld(world);weather.flakes.visible=winter&&!submergedWorld(world);weather.mat.uniforms.time.value=t;weather.mat.uniforms.motion.value=reduced?0:1;weather.mat.uniforms.anchor.value.copy(camera.position).add(v(0,20,0));
}
export function expansionRide(W,type,q,ride={}){
 let object,behind=8,up=4,targetUp=1.5;
 if(type==='bus'){object=W.coast.movers.bus;behind=11;up=5;}
 else if(type==='yacht'){object=W.coast.movers.yacht;let a=q*Math.PI*2;object.position.set(45+Math.sin(a)*19,.25,84+9*(1-Math.cos(a)));object.rotation.y=a+Math.PI/2;behind=13;up=6;}
 else if(type==='submarine'){object=W.deep.movers.submarine;let a=q*Math.PI*2;object.position.set(37+Math.sin(a)*24,-24+Math.sin(a)*4,139+Math.cos(a)*15);object.rotation.y=a+Math.PI/2;behind=11;}
 else if(type==='pegasus'){object=W.skyCity.movers.pegasus;behind=9;up=4;}
 else if(type==='sleigh'){object=W.coast.movers.sleigh;behind=15;up=6;}
 else if(type==='carousel'){object=W.coast.movers.carousel;let p=object.getWorldPosition(v()),a=q*Math.PI*2;return {position:p.clone().add(v(Math.sin(a)*5.6,3.5,Math.cos(a)*5.6)),target:p.clone().add(v(Math.sin(a)*15,4,Math.cos(a)*15))};}
 else if(type==='deepLift'){let y=T.MathUtils.lerp(ride.fromY??-30,ride.toY??-43.7,q);W.deep.movers.lift.position.y=y;return {position:v(66,y+1.7,99),target:v(79,y+1.7,106)};}
 else if(type==='liner'){let p=W.liner.base.clone().add(v(q*50,0,0));W.liner.fleet.position.copy(p);return {position:p.clone().add(v(-27,20,32)),target:p.clone().add(v(-8,6,0))};}
 if(!object)return null;object.updateWorldMatrix(true,false);let p=object.getWorldPosition(v()),direction=v(0,0,1).applyQuaternion(object.getWorldQuaternion(new T.Quaternion()));return {position:p.clone().addScaledVector(direction,-behind).add(v(0,up,0)),target:p.clone().addScaledVector(direction,4).add(v(0,targetUp,0))};
}
