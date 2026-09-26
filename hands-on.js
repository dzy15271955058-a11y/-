import {T,C,v,createKit} from './kit.js';
import {makeCharacters} from './characters.js';
import {DANCE_NOTES,judgeBeat} from './game-state.js';
import {angleTravel,addBrush,lerpStroke,insideDrop,fitsOrder} from './play-rules.js';

export const HANDS_ON_KINDS=['bake','style','nails','memory','gifts','rhythm','finalDance','partyDance','carriage','pearl','portal','treeLights'];
const COLORS={pink:'#e53d97',gold:'#d7aa49',blue:'#689bea',violet:'#a45ed6'};
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};

// Every activity uses the same world camera and canvas as the estate.
// The dock only selects tools. Completion comes from gestures and scene state.
export function startHandsOn({kind,W,scene,camera,controls,bridge,slow=false,finish,cancel}){
 const K=createKit(),A=makeCharacters(K),root=K.group(scene,'亲手完成 · '+kind);
 const canvas=document.querySelector('#scene'),ray=new T.Raycaster();
 const before={camera:camera.position.clone(),target:controls.target.clone(),enabled:controls.enabled,near:camera.near};
 let alive=true,ending=false,time=0,drag=null,pointerDown=false,lastEvent=null,step='',controller=null,selectedDrag=null,pressOrigin=null;
 const hooks=[],tweens=[],labels=[],targets=[],hidden=[],restores=[],ownedTextures=new Set(),ownedMaterials=new Set();
 const ui=document.createElement('section');ui.id='hands-on';ui.setAttribute('aria-label','场景操作');
 ui.innerHTML='<div class="play-header glass"><div><span id="play-phase"></span><h2 id="play-title"></h2></div><button id="play-exit" aria-label="退出当前挑战">×</button></div><div class="play-instruction glass"><span id="play-instruction"></span><output id="play-feedback" aria-live="polite"></output></div><div class="play-labels"></div><div class="play-dock glass"><div id="play-progress"><i></i><span></span></div><div id="play-tools"></div><p id="play-hint"></p></div>';
 document.body.append(ui);document.body.classList.add('hands-on-active','challenge-active');controls.enabled=false;
 const $=s=>ui.querySelector(s);$('#play-exit').onclick=cancel;
 function tell(title,instruction,phase,hint='物品可拖动，也可先点选再点目标 · Esc 退出'){
  $('#play-title').textContent=title;$('#play-instruction').textContent=instruction;$('#play-phase').textContent=phase;$('#play-hint').textContent=hint;$('#play-feedback').textContent='';
 }
 function feedback(text){$('#play-feedback').textContent=text;}
 function progress(value,text){$('#play-progress i').style.width=Math.min(1,Math.max(0,value))*100+'%';$('#play-progress span').textContent=text;}
 function toolButtons(options,onSelect){$('#play-tools').replaceChildren();for(const [id,title,color] of options){let b=document.createElement('button');b.textContent=title;b.dataset.tool=id;b.setAttribute('aria-pressed','false');if(color)b.style.setProperty('--tool-color',color);b.onclick=()=>{for(const q of $('#play-tools').children)q.setAttribute('aria-pressed',String(q===b));onSelect(id);};$('#play-tools').append(b);}return $('#play-tools');}
 function mark(object,text,offset=v(0,.45,0)){
  const el=document.createElement('span');el.className='play-object-label';el.textContent=text;$('.play-labels').append(el);const record={object,el,offset};labels.push(record);return record;
 }
 function setTargets(items){targets.length=0;targets.push(...items);}
 function target(object,id){object.userData.playId=id;return object;}
 function visible(o){for(let a=o;a;a=a.parent)if(!a.visible)return false;return true;}
 function pointRay(e){const rect=canvas.getBoundingClientRect();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,1-(e.clientY-rect.top)/rect.height*2),camera);}
 function hit(e){pointRay(e);root.updateMatrixWorld(true);const available=targets.filter(visible),hits=ray.intersectObjects(available,true);if(!hits.length){let closest=null;for(const object of available){if(!object.isGroup)continue;const p=v(),bounds=new T.Box3().setFromObject(object);if(ray.ray.intersectBox(bounds,p)){const distance=ray.ray.origin.distanceTo(p);if(!closest||distance<closest.distance)closest={owner:object,id:object.userData.playId,point:p,distance};}}return closest;}const h=hits[0];let object=h.object;while(object&&!targets.includes(object))object=object.parent;return {...h,owner:object,id:object?.userData.playId};}
 function planePoint(e,axis='z',value=0){pointRay(e);root.updateMatrixWorld(true);const normal=(axis==='y'?v(0,1,0):v(0,0,1)).transformDirection(root.matrixWorld),at=root.localToWorld(axis==='y'?v(0,value,0):v(0,0,value));let p=v();if(!ray.ray.intersectPlane(new T.Plane().setFromNormalAndCoplanarPoint(normal,at),p))return null;return root.worldToLocal(p);}
 function view(center,width,height,elevation=.3){
  root.updateMatrixWorld(true);const look=root.localToWorld(v(...center)),scale=root.getWorldScale(v()).x;
  const vfov=camera.fov*Math.PI/180,d=Math.max(height/(2*Math.tan(vfov/2)*.50),width/(2*Math.tan(vfov/2)*camera.aspect*.84))*scale;
  camera.near=innerWidth<720?Math.max(.05,d-(kind==='portal'?2.4:Math.max(width,height)*.9)*scale):.05;camera.updateProjectionMatrix();camera.position.copy(look).add(v(0,Math.sin(elevation)*d,Math.cos(elevation)*d));controls.target.copy(look);camera.lookAt(look);camera.updateMatrixWorld(true);
 }
 let framing=null;
 function frame(center,width,height,elevation=.3){framing=[center,width,height,elevation];view(...framing);}
 function place(origin,scale=1){root.position.set(...origin);root.scale.setScalar(scale);const light=new T.PointLight('#fff6ea',28*scale*scale,24*scale,2);light.position.set(0,5,5);root.add(light);}
 function hide(o){hidden.push([o,o.visible]);o.visible=false;}
 function tween(seconds,fn,done){tweens.push({at:time,seconds,fn,done});}
 function sound(n=660){bridge.note(n,.16);}
 function burst(position,color='#ffb3d6',n=18){const g=K.group(root,'完成的闪光',...position.toArray());for(let i=0;i<n;i++){const a=i*2.4;K.ell(g,Math.sin(a)*.1,0,Math.cos(a)*.1,.025,.025,.025,K.mat(color,{emissive:color,emissiveIntensity:1}),8);}tween(.7,t=>g.children.forEach((m,i)=>{let a=i*2.4;m.position.set(Math.sin(a)*t*.8,Math.sin(t*Math.PI)*.5+Math.sin(i)*t*.4,Math.cos(a)*t*.5);m.scale.setScalar(Math.max(.01,1-t));}),()=>g.removeFromParent());}
 function complete(result,delay=1.5){if(ending)return;ending=true;setTargets([]);pointerDown=false;drag=null;progress(1,'完成！看看你亲手做出的作品');sound(784);tween(delay,()=>{},()=>{if(alive)finish({...result,scene:true});});}
 function onDown(e){if(ending||e.button>0)return;e.preventDefault();e.stopImmediatePropagation();canvas.setPointerCapture?.(e.pointerId);pointerDown=true;lastEvent=e;pressOrigin={x:e.clientX,y:e.clientY};if(selectedDrag){drag=selectedDrag;selectedDrag=null;pressOrigin=null;}else controller?.down?.(e,hit(e));}
 function onMove(e){if(ending)return;if(pointerDown){e.preventDefault();e.stopImmediatePropagation();lastEvent=e;controller?.move?.(e,hit(e));}}
 function onUp(e){if(!pointerDown)return;e.preventDefault();e.stopImmediatePropagation();pointerDown=false;if(drag?.g&&pressOrigin&&Math.hypot(e.clientX-pressOrigin.x,e.clientY-pressOrigin.y)<9&&['ingredients','fit','crown','gem','match','berries','connect'].includes(step)){selectedDrag=drag;feedback('已选中，再点要放置的位置。');drag=null;lastEvent=null;return;}controller?.up?.(e,hit(e));drag=null;lastEvent=null;}
 function onKey(e){if(e.code==='Escape'){e.preventDefault();cancel();return;}controller?.key?.(e);}
 function resize(){if(framing)view(...framing);}
 function blur(){pointerDown=false;drag=null;selectedDrag=null;lastEvent=null;controller?.release?.();}
 function visibility(){if(document.hidden)cancel();}
 for(const [name,fn] of [['pointerdown',onDown],['pointermove',onMove],['pointerup',onUp],['pointercancel',onUp]]){canvas.addEventListener(name,fn,true);hooks.push(()=>canvas.removeEventListener(name,fn,true));}
 addEventListener('keydown',onKey);addEventListener('resize',resize);addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility);
 hooks.push(()=>removeEventListener('keydown',onKey),()=>removeEventListener('resize',resize),()=>removeEventListener('blur',blur),()=>document.removeEventListener('visibilitychange',visibility));

 function paintTexture(base='#f7e8e5'){
  const c=document.createElement('canvas');c.width=192;c.height=288;const ctx=c.getContext('2d');ctx.fillStyle=base;ctx.fillRect(0,0,192,288);
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;ownedTextures.add(texture);
  const m=new T.MeshPhysicalMaterial({map:texture,roughness:.20,clearcoat:1,metalness:.08});ownedMaterials.add(m);
  const cells=new Set();let previous=null;
  return {material:m,texture,cells,stroke(uv,color){const p={x:uv.x,y:uv.y};const draw=(x,y)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(x*192,(1-y)*288,37,0,Math.PI*2);ctx.fill();addBrush(cells,x,y,.20);};if(previous)lerpStroke(previous,p,draw);else draw(p.x,p.y);previous=p;texture.needsUpdate=true;return cells.size/60;},release(){previous=null;},reset(){cells.clear();previous=null;ctx.fillStyle=base;ctx.fillRect(0,0,192,288);texture.needsUpdate=true;}};
 }

 function bake(){
  hide(W.mansion.kitchen.props);place([-10,3.335,-21.72],.31);frame([0,.6,0],7.7,3.4,.83);step='ingredients';
  const tray=K.box(root,0,.025,0,7.7,.08,3.9,'#f9e8ec',.18);
  const bowl=K.group(root,'搅拌盆',0,.1,0);const profile=[[0,0],[.65,.03],[1,.38],[1.06,.8],[1.14,.82],[1.08,.34],[.72,-.05],[0,-.05]].map(p=>new T.Vector2(...p));
  K.mesh(bowl,new T.LatheGeometry(profile,48),K.mat('#e893b5',{metalness:.35,roughness:.21}));
  const batter=K.disk(bowl,0,.15,0,.58,.08,'#ffedcc');batter.visible=false;
  const spoon=K.group(bowl,'搅拌勺');K.rod(spoon,[.55,.15,0],[.25,1.65,.1],.055,K.gold);K.ell(spoon,.55,.2,0,.19,.07,.27,C.cream);spoon.visible=false;
  const bowlTarget=target(K.cyl(root,0,.72,0,1.05,1.05,.1,K.mat('#ffffff',{transparent:true,opacity:0,depthWrite:false})), 'bowl');
  let count=0,turns=0,lastAngle=null,bakeHeat=0,holdingHeat=false,icingCells=new Set(),berries=0,icingTool=true,baked=false;
  const names=['面粉','鸡蛋','牛奶','草莓'],items=[];
  for(let i=0;i<4;i++){let g=K.group(root,names[i],-3+i*2,.1,1.35);target(g,i);g.userData.home=g.position.clone();
   if(i===0){K.box(g,0,.45,0,.7,.9,.46,C.cream,.10);K.box(g,0,.50,.241,.50,.26,.02,C.rose,.01);}
   if(i===1){K.ell(g,0,.35,0,.26,.36,.26,'#f5ceaa',24);}
   if(i===2){K.cyl(g,0,.38,0,.23,.24,.76,'#fcfbff',24);K.cyl(g,0,.86,0,.13,.13,.16,C.rose,20);}
   if(i===3){for(let j=0;j<3;j++){K.ell(g,(j-1)*.23,.25,0,.16,.23,.17,C.hot,20);K.star(g,(j-1)*.23,.47,0,.12,C.leaf);}}
   items.push(g);mark(g,names[i]);
  }
  const falling=K.group(root,'正在倒入的食材');falling.visible=false;
  for(let i=0;i<12;i++)K.ell(falling,Math.sin(i*3)*.20,i*.08,Math.cos(i*3)*.2,.055,.07,.055,C.cream,8);
  let cake=null,oven=null,door=null,berryTray=null,bag=null;
  tell('草莓庆祝蛋糕','把面粉、鸡蛋、牛奶、草莓依次拖进搅拌盆。','厨房 · 1 / 5 加入原料');progress(0,'原料 0 / 4');setTargets(items);
  function startMix(){step='mix';items.forEach(g=>g.visible=false);spoon.visible=true;setTargets([bowlTarget]);tell('亲手搅拌面糊','按住搅拌盆，沿着盆边连续画圈；勺子会跟着你的手转。','厨房 · 2 / 5 搅拌');progress(0,'搅拌 0 / 3 圈');}
  function startOven(){step='heat';bowl.visible=false;bowlTarget.visible=false;falling.visible=false;
   cake=K.group(root,'亲手制作的草莓蛋糕',0,.15,0);K.disk(cake,0,.06,0,1.06,.10,K.gold);K.cyl(cake,0,.42,0,.85,.88,.60,'#f0d4a2',48);
   oven=K.group(root,'烘烤小烤箱',0,.1,0);for(let x of [-1.24,1.24])K.box(oven,x,.68,0,.10,1.30,2.05,C.cream,.08);K.box(oven,0,1.35,0,2.6,.16,2.1,C.rose,.10);K.box(oven,0,.65,-1,2.6,1.30,.10,C.rose,.06);
   door=K.group(oven,'烤箱门',0,.08,1.08);K.box(door,0,.58,0,2.40,1.16,.09,K.mat('#784763',{transparent:true,opacity:.3,depthWrite:false}),.06);K.rod(door,[-.75,.95,.1],[.75,.95,.1],.065,K.gold);
   target(door,'heat');mark(door,'按住烘烤 → 金色区松手',v(0,1.5,0));setTargets([door]);
   tell('把蛋糕烤到金黄','按住烤箱门加热，在金色烘烤区间松手；过早或烤焦都需要重试。','厨房 · 3 / 5 烘烤');progress(0,'按住烤箱门 · 理想烘烤 65%–88%');
  }
  function startIcing(){step='icing';oven.visible=false;cake.visible=true;bag=K.group(root,'裱花袋',0,1.2,0);K.cyl(bag,0,.3,0,.24,.025,.65,C.cream,24);bag.visible=false;
   target(cake,'cake');setTargets([cake]);tell('给蛋糕裱花','按住蛋糕表面拖动，铺出一圈圈奶油。至少覆盖四分之三，再摆草莓。','厨房 · 4 / 5 裱花');progress(0,'奶油覆盖 0%');
  }
  function startBerries(){step='berries';bag.visible=false;berryTray=K.group(root,'草莓盘',-2.6,.1,0);K.disk(berryTray,0,.03,0,.55,.07,C.cream);for(let i=0;i<6;i++)K.ell(berryTray,Math.sin(i)*.24,.25,Math.cos(i)*.24,.16,.22,.15,C.hot,18);target(berryTray,'berry');setTargets([berryTray,cake]);mark(berryTray,'拖一颗草莓到蛋糕');tell('摆上五颗草莓','从左边的盘子拖出草莓，摆在蛋糕顶部，彼此留一点空隙。','厨房 · 5 / 5 装饰');progress(0,'草莓 0 / 5');}
  const berryPositions=[];
  function decorate(e){const p=planePoint(e,'y',.9);if(!p||Math.hypot(p.x,p.z)>.85)return;const cell=Math.floor((p.x+.9)/.15)+Math.floor((p.z+.9)/.15)*12;if(icingCells.has(cell))return;
   icingCells.add(cell);K.ell(cake,p.x,.79,p.z,.13,.07,.13,C.cream,12);bag.visible=true;bag.position.set(p.x,1,p.z);const coverage=icingCells.size/92;progress(coverage/.75,`奶油覆盖 ${Math.min(100,Math.round(coverage*100))}%`);if(coverage>=.75)startBerries();}
  return {
   down(e,h){
    if(step==='ingredients'&&h&&typeof h.id==='number'){drag={g:h.owner,index:h.id};}
    else if(step==='mix'&&h){lastAngle=null;this.move(e,h);}
    else if(step==='heat'&&h){holdingHeat=true;bakeHeat=0;}
    else if(step==='icing'&&h)decorate(e);
    else if(step==='berries'&&h?.id==='berry'){let g=K.group(root,'选中的草莓',-2.6,.4,0);K.ell(g,0,0,0,.17,.23,.17,C.hot,20);K.star(g,0,.23,0,.15,C.leaf);drag={g};}
   },
   move(e,h){
    if(drag){const p=planePoint(e,'y',1);if(p)drag.g.position.set(p.x,1,p.z);return;}
    if(step==='mix'){const p=planePoint(e,'y',.75);if(!p)return;const r=Math.hypot(p.x,p.z);if(r<.3||r>1.5){lastAngle=null;return;}const a=Math.atan2(p.z,p.x),delta=angleTravel(lastAngle,a);lastAngle=a;if(delta<.75)turns+=delta/(Math.PI*2);spoon.rotation.y=-a;batter.rotation.y=-a;progress(turns/3,`搅拌 ${Math.min(3,turns).toFixed(1)} / 3 圈`);if(turns>=3)startOven();}
    if(step==='icing')decorate(e);
   },
   up(e){
    if(step==='ingredients'&&drag){const d=drag,p=planePoint(e,'y',.7);if(p&&Math.hypot(p.x,p.z)<1.45&&d.index===count){d.g.visible=false;falling.visible=true;falling.position.set(0,.2,0);tween(.65,t=>{falling.position.y=1-t;falling.rotation.y=t*2;},()=>falling.visible=false);count++;batter.visible=true;batter.position.y=.15+count*.10;batter.scale.set(1+count*.11,1,1+count*.11);sound(390+count*60);progress(count/4,`原料 ${count} / 4`);if(count===4)tween(.7,()=>{},startMix);}else{d.g.position.copy(d.g.userData.home);feedback(p&&Math.hypot(p.x,p.z)<1.45?'下一样需要放入'+names[count]:'把食材拖到盆里再松开。');}}
    if(step==='mix')lastAngle=null;
    if(step==='heat'&&holdingHeat){holdingHeat=false;if(bakeHeat>=.65&&bakeHeat<=.88){baked=true;step='opening';tween(.9,t=>door.rotation.x=-t*1.6,startIcing);}else{feedback(bakeHeat>.88?'烤得过头了，重做这一层蛋糕再试一次。':'还没有烤透，再按住久一点。');bakeHeat=0;}}
    if(step==='icing'&&bag)bag.visible=false;
    if(step==='berries'&&drag){const p=planePoint(e,'y',.94);if(p&&Math.hypot(p.x,p.z)<.8&&berryPositions.every(q=>Math.hypot(q.x-p.x,q.z-p.z)>.20)){drag.g.position.set(p.x,1.15,p.z);berryPositions.push(p);berries++;sound();progress(berries/5,`草莓 ${berries} / 5`);if(berries===5){bridge.cake(berryPositions.map(p=>({x:p.x,z:p.z})));burst(v(0,1,0));complete({ingredients:count,turns,baked,icing:icingCells.size/92,berries,recipe:true,score:100},2.5);}}else{drag.g.removeFromParent();feedback('草莓要落在蛋糕上，并留出一点间距。');}}
   },
   release(){holdingHeat=false;lastAngle=null;},
   update(dt){if(step==='heat'&&holdingHeat){bakeHeat=Math.min(1.15,bakeHeat+dt/(slow?7:5));progress(bakeHeat,`烘烤 ${Math.round(bakeHeat*100)}% · 65%–88% 松手`);cake.children[1].material=K.mat(bakeHeat>.88?'#824f30':bakeHeat>.55?'#d79a57':'#f0d4a2');if(bakeHeat>=1.15){holdingHeat=false;bakeHeat=0;feedback('烤焦了！按住烤箱门重新烘烤。');}}}
  };
 }

 function style(){
  W.root.updateMatrixWorld(true);const model=W.deep.movers.runway,origin=model.getWorldPosition(v());hide(model);place(origin.add(v(0,0,1.7)).toArray());frame([-.45,1.40,0],5.8,3.7,.11);
  const doll=A.doll(root,.65,0,.5,{style:'ruffle',color:C.pink,hairStyle:'bun',accessories:false,name:'正在试衣的主角'});
  for(const part of [doll.userData.head,doll.userData.outfit,doll.userData.torso,doll.userData.legs,...doll.userData.arms]){part.userData.live=true;K.optimize(part);}K.optimize(doll);
  const rack=K.group(root,'试衣挂架',-2.0,0,1.9);K.rod(rack,[-1,0,0],[-1,2.9,0],.035,K.gold);K.rod(rack,[1,0,0],[1,2.9,0],.035,K.gold);K.rod(rack,[-1,2.9,0],[1,2.9,0],.035,K.gold);
  const selection={style:'ruffle',color:'pink',accessory:'none'},garments=[],dyeCells=new Set();let fitted=false,crowned=false,dyeCoverage=0,paint=null,dyeMaterial=null,coat=null,lastUv=null,preview=0;
  const styles=['ruffle','gown','ballet'];styles.forEach((s,i)=>{let g=K.group(rack,'可拿取礼服',(i-1)*.73,1.0,0);g.scale.setScalar(.40);A.outfit(g,s,C.cream);target(g,s);g.userData.home=g.position.clone();garments.push(g);mark(g,['日常裙','晚礼服','芭蕾裙'][i],v(0,2.1,0));});
  step='fit';tell('舞会造型工作室','把挂架上的晚礼服拖到人物身上，亲手完成试衣。','造型 · 1 / 3 选择裙型');progress(0,'请柬：香槟金 · 晚礼服 · 王冠');setTargets(garments);
  const mannequinTarget=target(K.ell(root,.65,1.3,.5,.55,1.28,.30,K.mat('#fff',{transparent:true,opacity:0,depthWrite:false})), 'mannequin');mannequinTarget.visible=false;
  function dress(s){doll.userData.outfit.removeFromParent();const o=A.outfit(doll,s,C.cream);doll.userData.outfit=o;selection.style=s;K.optimize(o);return o;}
  function dye(){step='dye';coat=dress('gown');paint=paintTexture();dyeMaterial=paint.material;coat.traverse(o=>{if(o.isMesh&&!o.material.transparent){const c=o.material.color;if(c&&c.r>.65&&c.g>.6&&c.b>.5)o.material=dyeMaterial;}});target(coat,'fabric');setTargets([coat]);
   tell('为礼服染上香槟金','选择香槟金，按住裙面涂染。未涂到的地方会保留白色。','造型 · 2 / 3 染色');toolButtons([['pink','芭比粉',COLORS.pink],['gold','香槟金',COLORS.gold],['blue','海蓝色',COLORS.blue]],id=>{selection.color=id;if(id!=='gold')feedback('请柬要香槟金，你也可以先试试其他颜色。');});progress(0,'染色覆盖 0%');
  }
  function crown(){step='crown';toolButtons([],()=>{});coat.traverse(o=>{if(o.isMesh&&o.material===dyeMaterial)o.material=A.satin(COLORS.gold);});selection.color='gold';
   let g=K.group(root,'待佩戴王冠',-1.4,.95,1);A.crown(g,0,0,0,1.5);target(g,'crown');setTargets([g]);mark(g,'拖到头顶',v(0,.4,0));tell('亲手戴上王冠','把左侧王冠拖到人物头顶，放稳后欣赏整套造型。','造型 · 3 / 3 配饰');progress(.85,'晚礼服已染好 · 等待王冠');
  }
  return {
   down(e,h){if(!h)return;if(step==='fit'){drag={g:h.owner,start:h.owner.position.clone(),id:h.id};}else if(step==='dye'){lastUv=null;this.move(e,h);}else if(step==='crown')drag={g:h.owner,start:h.owner.position.clone()};},
   move(e,h){if(drag){const p=planePoint(e,'z',.7);if(!p)return;if(step==='fit'){const world=root.localToWorld(p);drag.g.position.copy(rack.worldToLocal(world));}else drag.g.position.copy(p);}
    else if(step==='dye'&&h?.uv){if(selection.color!=='gold'){feedback('换成香槟金再上色，这张请柬需要金色礼服。');return;}paint.stroke(h.uv,COLORS.gold);const p=doll.worldToLocal(h.point.clone()),radius=.87-Math.min(1,p.y/1.3)*.67;addBrush(dyeCells,.5+p.x/(2*radius),Math.min(1,p.y/1.3),.20);dyeCoverage=dyeCells.size/60;progress(dyeCoverage/.7,`染色覆盖 ${Math.round(dyeCoverage*100)}%`);if(dyeCoverage>=.7)crown();}},
   up(e){if(step==='fit'&&drag){const p=planePoint(e,'z',.7);if(p&&Math.abs(p.x-.65)<.7&&p.y>.25&&p.y<2.3){dress(drag.id);if(drag.id==='gown'){fitted=true;drag.g.visible=false;dye();}else{feedback('这件试穿好了，不过舞会请柬要求晚礼服。');drag.g.position.copy(drag.start);}}else drag.g.position.copy(drag.start);}
    else if(step==='crown'&&drag){const p=planePoint(e,'z',.7);if(p&&Math.abs(p.x-.65)<.55&&Math.abs(p.y-2.55)<.55){drag.g.visible=false;A.crown(doll,0,2.54,0,1);selection.accessory='crown';crowned=true;bridge.outfit('gown',COLORS.gold,'crown');step='reveal';burst(v(.65,2.5,.5));complete({...selection,fitted,crowned,dyeCoverage,score:100},3);}else{drag.g.position.copy(drag.start);feedback('将王冠放到头顶的高度，再松手。');}}paint?.release();},
   update(dt){if(step==='reveal'){preview+=dt;doll.rotation.y=Math.sin(preview*1.3)*.50;doll.userData.head.rotation.z=.018+Math.sin(preview)*.015;}}
  };
 }

 function nails(){
  place([-28,3.18,3.1],.43);frame([0,.4,.1],4.5,3.3,.92);for(const n of W.palace.movers.nails)hide(n);
  K.box(root,0,.035,0,4.6,.07,3.3,C.cream,.14);const paints=[],meshes=[],gems=[];let color='violet',finishKind='glitter',painted=0,gemCount=0,brush=null,lastNail=-1;
  const positions=[[-1.36,0],[-.68,-.16],[0,-.25],[.68,-.16],[1.36,0]];
  positions.forEach(([x,z],i)=>{K.ell(root,x,.19,z,.24,.17,.55,'#efbfac',24);const p=paintTexture();paints.push(p);const geo=new T.PlaneGeometry(.40,.87,16,24),a=geo.attributes.position;for(let j=0;j<a.count;j++){const xx=a.getX(j),yy=a.getY(j);a.setXYZ(j,xx*(.78+.22*Math.cos(yy/.87*Math.PI)),.04*Math.cos(xx/.4*Math.PI)*Math.cos(yy/.87*Math.PI),-yy);}geo.computeVertexNormals();const n=K.mesh(root,geo,p.material,x,.345,z);target(n,i);meshes.push(n);mark(n,['拇指','食指','中指','无名指','小指'][i],v(0,.1,.75));});
  brush=K.group(root,'跟随手势的甲油刷');K.cyl(brush,0,.35,0,.09,.11,.65,C.violet);K.box(brush,0,0,0,.11,.09,.20,COLORS.violet,.02);brush.visible=false;
  tell('逐笔涂出紫晶美甲','按住甲面来回涂抹。五片都涂满后，给每片拖上一颗水晶。','美甲 · 1 / 2 涂色');progress(0,'完成 0 / 5 · 每片至少涂满 72%');setTargets(meshes);
  toolButtons([['violet','紫水晶',COLORS.violet],['pink','芭比粉',COLORS.pink],['blue','海蓝色',COLORS.blue]],id=>{if(color===id)return;color=id;paints.forEach(p=>p.reset());painted=0;progress(0,'换色后重新涂抹 · 完成 0 / 5');});
  step='paint';
  function crystalStep(){step='gem';brush.visible=false;toolButtons([],()=>{});const g=K.group(root,'水晶盒',0,.20,1.13);K.box(g,0,0,0,.8,.13,.50,C.rose,.08);for(let i=0;i<9;i++)A.gem(g,((i%3)-1)*.19,.13,(Math.floor(i/3)-1)*.14,.07,C.cream);target(g,'crystals');gems.push(g);mark(g,'拖到每片甲面的前端',v(0,.2,.43));setTargets([g,...meshes]);tell('镶上五颗小水晶','从水晶盒拖出宝石，分别放在五片甲面上，光泽会随视角变化。','美甲 · 2 / 2 镶钻');progress(0,'水晶 0 / 5');}
  const doneGems=new Set();
  return {
   down(e,h){if(step==='paint'&&typeof h?.id==='number'){lastNail=-1;this.move(e,h);}else if(step==='gem'&&h?.id==='crystals'){let g=K.group(root,'选中的水晶',0,.6,1.13);A.gem(g,0,0,0,.11,C.cream);drag={g};}},
   move(e,h){if(drag){const p=planePoint(e,'y',.5);if(p)drag.g.position.copy(p);return;}if(step!=='paint'||typeof h?.id!=='number'||!h.uv)return;const i=h.id;if(lastNail!==i)paints.forEach(p=>p.release());lastNail=i;const coverage=paints[i].stroke(h.uv,COLORS[color]);brush.visible=true;brush.position.copy(root.worldToLocal(h.point.clone())).add(v(0,.12,0));painted=paints.filter(p=>p.cells.size/60>=.72).length;progress(paints.reduce((s,p)=>s+p.cells.size,0)/300,`完成 ${painted} / 5 · 当前甲面 ${Math.round(coverage*100)}%`);if(painted===5){if(color==='violet')crystalStep();else feedback('客人要紫水晶色，换色后再涂一遍就好。');}},
   up(e,h){brush.visible=false;paints.forEach(p=>p.release());lastNail=-1;if(step==='gem'&&drag){pointRay(e);const hits=ray.intersectObjects(meshes,false);if(hits.length){let n=hits[0].object,i=n.userData.playId;if(!doneGems.has(i)){doneGems.add(i);drag.g.position.set(n.position.x,.51,n.position.z-.23);gemCount++;sound();progress(gemCount/5,`水晶 ${gemCount} / 5`);if(gemCount===5){bridge.nails(COLORS.violet,'glitter',true);burst(v(0,.5,0));complete({painted:5,color:'violet',finish:'glitter',coverage:paints.map(p=>p.cells.size/60),gems:5,score:100},3);}}else{drag.g.removeFromParent();feedback('这片已经有水晶，试试还空着的甲面。');}}else drag.g.removeFromParent();}},
   update(dt){if(step==='gem'||ending)gems.forEach(g=>g.rotation.y=Math.sin(time)*.05);}
  };
 }

 function memory(){
  place([-83,43.8,-54]);frame([0,1.3,0],10,6,.26);const colors=['#bd82f6','#f6bf73','#75b5ef','#f17ab6'],stones=[],lights=[];
  const center=K.group(root,'天鹅湖魔法水晶');K.cyl(center,0,.5,0,0,.65,1.3,A.prism('#c8dfff'),6);const halo=K.torus(center,0,.6,0,.95,.025,K.gold,true);
  for(let i=0;i<4;i++){let g=K.group(root,['月亮石','羽毛石','水晶石','花朵石'][i],(i-1.5)*2.5,.1,1);K.cyl(g,0,.4,0,.5,.64,.8,C.cream,24);const gem=A.gem(g,0,1.1,0,.5,colors[i]);const m=new T.MeshStandardMaterial({color:colors[i],emissive:colors[i],emissiveIntensity:.15,metalness:.4,roughness:.18});ownedMaterials.add(m);g.traverse(o=>{if(o.isMesh&&o!==g.children[0])o.material=m;});stones.push(target(g,i));lights.push(m);mark(g,(i+1)+' · '+['月亮','羽毛','水晶','花朵'][i],v(0,1.85,0));}
  const sequences=[[0,2,1],[3,0,1,2],[2,1,3,0,2]];let round=0,input=0,showAt=0,locked=true,lit=-1,litUntil=0,lastShown=-1;
  function show(){showAt=time+.8;locked=true;input=0;lastShown=-1;feedback('先看湖岸水晶亮起的顺序。');progress(round/3,`第 ${round+1} / 3 轮 · 观察`);}
  tell('天鹅湖的魔法回声','观察湖岸四座水晶，按同样顺序触碰它们。错了可以重新观察。','森林 · 魔法回声','点击场景里的水晶 · 或按 1–4');setTargets(stones);toolButtons([['again','重新观察']],()=>show());show();
  function choose(i){if(locked||ending)return;lit=i;litUntil=time+.35;sound([392,440,523,659][i]);if(sequences[round][input]!==i){feedback('这一枚不对。水晶会重新示范本轮顺序。');show();return;}input++;burst(stones[i].position.clone().add(v(0,1.1,0)),colors[i],8);progress((round+input/sequences[round].length)/3,`本轮正确 ${input} / ${sequences[round].length}`);if(input===sequences[round].length){round++;if(round===3){center.scale.setScalar(1.7);complete({rounds:3,score:100},2);}else show();}}
  return {down(e,h){if(h)choose(h.id);},key(e){if(!e.repeat&&/^[1-4]$/.test(e.key)){e.preventDefault();choose(+e.key-1);}},update(dt){
   center.rotation.y=time*.5;halo.rotation.z=Math.sin(time)*.16;
   if(locked&&round<3){let elapsed=time-showAt,i=Math.floor(elapsed/.85);lit=elapsed>=0&&i<sequences[round].length&&elapsed% .85<.52?sequences[round][i]:-1;if(lit>=0&&lastShown!==i){lastShown=i;sound([392,440,523,659][lit]);}if(elapsed>=sequences[round].length*.85){locked=false;lit=-1;feedback('轮到你了，触碰刚才亮起的水晶。');}}
   else if(time>litUntil)lit=-1;
   lights.forEach((m,i)=>{m.emissiveIntensity=i===lit?2.6:.15;stones[i].scale.setScalar(i===lit?1.11:1);});
  }};
 }

 function dancer(x,z,color){
  const g=A.doll(root,x,0,z,{style:'ballet',pose:'stand',hairStyle:'bun',color,accessories:false,name:'跟随你节拍的舞者'}),pivots=[];
  g.userData.arms.forEach((a,i)=>{const shoulder=v(i? .27:-.27,1.85,0),p=K.group(g,'肩部动作轴',...shoulder.toArray());a.removeFromParent();p.add(a);a.position.sub(shoulder);pivots.push(p);});
  const legs=g.userData.legs,legPivots=[];
  for(const side of [-1,1]){const p=K.group(g,'脚步动作轴',side*.12,1.33,0);for(const child of legs.children.slice()){child.geometry?.computeBoundingBox();const cx=child.position.x+(child.geometry?.boundingBox?.getCenter(v()).x||0);if((cx<0?-1:1)===side){child.removeFromParent();p.add(child);child.position.sub(p.position);}}legPivots.push(p);}
  // Merge only within moving parts so arms, feet and head stay articulated.
  for(const p of [...pivots,...legPivots,g.userData.head,g.userData.outfit,g.userData.torso]){p.userData.live=true;K.optimize(p);}K.optimize(g);
  return {g,pivots,legs:legPivots,x,z};
 }

 function dance(){
  const isParty=kind==='partyDance',isFinal=kind==='finalDance';
  if(isParty)place([4,8.55,-16]);else if(isFinal){hide(W.liner.princess);place([76.4,4.90,184.2]);}else place([-114,43.48,-70]);
  if(!isParty&&!isFinal)for(const d of W.skyCity.movers.dancers)hide(d.g);
  frame([0,1.9,.1],6.8,4.9,isFinal?.5:isParty?.1:.55);
  const floor=K.disk(root,0,.01,0,3.5,.06,isParty?'#694683':'#bf7d92');const cast=[dancer(0,0,C.rose),dancer(-1.7,-.8,C.violet),dancer(1.7,-.8,'#88b6e9')];
  const pads=[],notes=[];for(let lane=0;lane<3;lane++){const g=K.group(root,'舞台节拍落点',(lane-1)*1.75,.10,1.45);K.torus(g,0,0,0,.52,.045,K.gold,true);const disk=K.disk(g,0,.01,0,.46,.02,K.mat('#ad447e',{emissive:'#932862',emissiveIntensity:.45}));target(g,lane);pads.push(g);mark(g,['← / A','↓ / S','→ / D'][lane],v(0,0,.65));}
  for(let i=0;i<12;i++){const g=K.group(root,'第'+(i+1)+'拍星光',(DANCE_NOTES[i]-1)*1.75,5.2,1.45);K.star(g,0,0,0,.18,K.mat('#ffc8e4',{emissive:'#ff77bf',emissiveIntensity:1.2}));g.visible=false;notes.push(g);}
  const beamLights=[];for(const x of [-2.5,2.5]){const light=new T.PointLight(x<0?'#ffc6e1':'#b6c5ff',9,8);light.position.set(x,3.5,1);root.add(light);beamLights.push(light);}
  let start=null,judged=new Set(),hits=0,combo=0,moveAt=-20,moveLane=1,lastBeat=-1,danceTime=0,failed=false;const gap=slow?1.15:.78;
  tell(isParty?'和朋友一起开派对':isFinal?'海屿星光庆典':'十二公主的星光舞台','星光落到金色圆环时按对应方向。每次命中，舞者会做出转身、摆臂或跳步。','演出 · 实时舞蹈','方向键 ← ↓ → / A S D · 或触碰底部三个节拍键');progress(0,'命中 0 / 12 · 接住 8 拍过关');
  const dock=toolButtons([['0','← 左步'],['1','↓ 旋转'],['2','→ 右步']],id=>hitLane(+id));for(const b of dock.children){b.onclick=null;b.onpointerdown=e=>{e.preventDefault();hitLane(+b.dataset.tool);};}
  setTargets(pads);function begin(){start=time+1.7;judged.clear();hits=combo=0;failed=false;lastBeat=-1;notes.forEach(n=>n.visible=false);feedback('准备 · 音符即将落下');}
  function hitLane(lane){if(start===null||failed||ending)return;const result=judgeBeat(time-start,lane,judged,{slow});if(result.index>=0){judged.add(result.index);hits++;combo++;notes[result.index].visible=false;moveAt=time;moveLane=lane;sound([392,494,587][lane]);burst(pads[lane].position.clone(),'#ffd38f',12);feedback((result.perfect?'完美！':'接住了！')+' 连击 '+combo);}else{combo=0;feedback('等星光接近金环再按。');}progress(hits/12,`命中 ${hits} / 12 · 目标 8 拍`);}
  begin();
  return {down(e,h){if(h)hitLane(h.id);},key(e){if(e.repeat)return;const lane={ArrowLeft:0,ArrowDown:1,ArrowRight:2,KeyA:0,KeyS:1,KeyD:2}[e.code];if(lane!==undefined){e.preventDefault();hitLane(lane);}},update(dt){
   const elapsed=time-start,phase=(time-moveAt)/.72,active=phase>=0&&phase<1,ease=active?Math.sin(Math.PI*phase):0;
   cast.forEach((d,i)=>{d.g.position.x=d.x+(active&&moveLane!==1?(moveLane===0?-.28:.28)*ease:0);d.g.position.y=active&&moveLane!==1?.16*ease:0;d.g.rotation.y=active&&moveLane===1?phase*Math.PI*2:Math.sin(time*1.5+i)*.07;d.pivots[0].rotation.z=-.15-ease*(moveLane===0?1.1:.50);d.pivots[1].rotation.z=.15+ease*(moveLane===2?1.1:.50);d.legs[0].rotation.x=active?.20*ease:0;d.legs[1].rotation.x=active?-.20*ease:0;d.g.userData.head.rotation.z=.018+Math.sin(time*1.7+i)*.025;});
   pads.forEach((p,i)=>p.scale.setScalar(active&&moveLane===i?1+ease*.18:1));beamLights.forEach((l,i)=>{l.intensity=9+ease*11;l.color.setHSL((time*.035+i*.3)%1,.6,.75);});
   if(ending||failed)return;const beat=Math.floor((elapsed-2)/gap);if(beat!==lastBeat&&beat>=0&&beat<12){lastBeat=beat;sound([261.63,329.63,392,440][beat%4]);}
   DANCE_NOTES.forEach((lane,i)=>{const targetTime=2+i*gap,diff=targetTime-elapsed;if(!judged.has(i)&&diff<-(slow?.43:.28)){judged.add(i);combo=0;feedback('漏了一拍，继续追下一颗星光。');}const g=notes[i];g.visible=!judged.has(i)&&diff<2.2&&diff>-.45;g.position.y=.15+diff*2.05;g.rotation.z=time*.8;});
   if(elapsed>2+11*gap+1){if(hits>=8){if(isParty)bridge.ensureAction('party','party');else bridge.dance(true);complete({hits,total:12,score:Math.round(hits/12*100)},2);}else{failed=true;feedback(`接住 ${hits} 拍，再试一次可以做得更好。`);toolButtons([['retry','重新跳这一曲']],()=>{toolButtons([['0','← 左步'],['1','↓ 旋转'],['2','→ 右步']],id=>hitLane(+id));begin();});}}
  }};
 }

 function gifts(){
  bridge.snow(true);place([87,1.6,-37],.70);frame([0,1.0,0],6.8,4.6,.6);
  K.box(root,0,.03,0,6.8,.08,3.7,C.cream,.16);const items=[],slots=[],packed=[],lidGroups=[];
  const names=['童话书','芭蕾舞鞋','海洋清理包'],wishes=['Kelly：想读仙子故事','思琪：练习芭蕾','海洋伙伴：清理珊瑚'];
  for(let i=0;i<3;i++){const x=(i-1)*2.2,g=K.group(root,names[i],x,.13,1.25);target(g,i);g.userData.home=g.position.clone();
   if(i===0){K.book(g,0,0,0,C.violet,1);K.star(g,0,.1,.04,.2,K.gold).rotation.x=-Math.PI/2;}
   if(i===1){for(const d of [-1,1]){K.ell(g,d*.23,.13,0,.15,.11,.44,A.satin(C.rose),24);K.tube(g,[[d*.2,.2,-.1],[d*.4,.5,-.5],[d*.1,.25,-.7]],.035,C.rose);}}
   if(i===2){K.box(g,0,.23,0,.75,.5,.50,C.blue,.10);K.torus(g,0,.55,0,.22,.04,K.gold);K.rod(g,[.5,.03,0],[.5,.8,0],.035,K.gold);}
   items.push(g);mark(g,names[i],v(0,.75,0));
   const slot=K.group(root,'礼盒',(i-1)*2.2,.08,-.85);K.box(slot,0,.04,0,1.55,.08,1.1,C.rose,.07);for(const x of [-.75,.75])K.box(slot,x,.35,0,.06,.64,1.1,C.blush,.02);for(const z of [-.52,.52])K.box(slot,0,.35,z,1.55,.64,.05,C.blush,.02);slots.push(slot);mark(slot,wishes[i],v(0,1.25,0));
   const lid=K.group(root,'礼盒盖',...slot.position.toArray());K.box(lid,0,.78,0,1.62,.13,1.18,C.rose,.06);lid.visible=false;lidGroups.push(lid);
  }
  let correct=0,wrapped=0,currentWrap=-1,wrapDistance=0,lastWrap=null;step='match';
  tell('把愿望装进礼物盒','读三张愿望卡，将物品拖入对应的礼盒，再拉过丝带把它包好。','圣诞工坊 · 配礼与包装');progress(0,'配对 0 / 3 · 包装 0 / 3');setTargets(items);
  function wrap(index){step='wrap';currentWrap=index;wrapDistance=0;lastWrap=null;const lid=lidGroups[index];lid.visible=true;lid.position.y=1.6;tween(.65,t=>lid.position.y=1.6*(1-t)+.08*t);const ribbon=K.group(root,'待拉紧的缎带',slots[index].position.x-1,.95,-.85);K.torus(ribbon,0,0,0,.15,.045,K.gold);target(ribbon,'ribbon');setTargets([ribbon]);mark(ribbon,'按住向右拉过礼盒',v(0,.5,0));feedback('配对正确！抓住金色丝带圈，拉过盒顶。');}
  return {down(e,h){if(!h)return;if(step==='match')drag={g:h.owner,id:h.id};else if(step==='wrap')drag={g:h.owner,start:h.owner.position.clone()};},move(e){if(!drag)return;const p=planePoint(e,'y',step==='wrap'?.95:1);if(!p)return;drag.g.position.set(p.x,step==='wrap'?.95:1,p.z);if(step==='wrap'){wrapDistance=Math.max(wrapDistance,p.x-drag.start.x);progress((correct+wrapped+Math.min(1,wrapDistance/1.8))/6,`把丝带拉过盒顶 ${Math.min(100,Math.round(wrapDistance/1.8*100))}%`);}},up(e){if(!drag)return;if(step==='match'){const p=planePoint(e,'y',.65);const idx=p?slots.findIndex(s=>Math.abs(p.x-s.position.x)<.85&&Math.abs(p.z-s.position.z)<.68):-1;if(idx===drag.id&&!packed.includes(idx)){drag.g.position.copy(slots[idx].position).add(v(0,.14,0));packed.push(idx);correct++;sound();wrap(idx);}else{drag.g.position.copy(drag.g.userData.home);feedback('看看愿望卡，把礼物放到对应朋友的盒子里。');}}
    else if(step==='wrap'){const p=planePoint(e,'y',.95);if(wrapDistance>=1.8&&p&&Math.abs(p.z+.85)<.65){drag.g.visible=false;const slot=slots[currentWrap],lid=lidGroups[currentWrap];K.box(lid,0,.86,0,1.64,.045,.16,K.gold,.015);K.box(lid,0,.86,0,.16,.045,1.2,K.gold,.015);A.bow(lid,0,1,0,.65,K.gold);wrapped++;step='match';setTargets(items.filter((g,i)=>!packed.includes(i)));progress((correct+wrapped)/6,`配对 ${correct} / 3 · 包装 ${wrapped} / 3`);sound();if(wrapped===3){burst(v(0,1,0));complete({correct,wrapped,score:100},2.5);}else feedback('这一盒包装好了，继续帮下一位朋友。');}else{drag.g.position.copy(drag.start);feedback('抓住丝带，拉过盒顶后再松开。');}}}
  };
 }

 function carriage(){
  const car=W.coast.movers.carriages.find(g=>g.name.includes('黑金'))||W.coast.movers.carriages[1];W.root.updateMatrixWorld(true);place(car.getWorldPosition(v()).toArray());frame([0,2,0],6.5,6.0,.24);
  const beforePosition=car.position.clone(),wasOpen=W.interactions.state.royalOpen;restores.push(()=>{car.position.copy(beforePosition);W.interactions.state.royalOpen=ending?true:wasOpen;});W.interactions.state.royalOpen=false;
  // Frame the visible right-side door obliquely, not the rear of the carriage.
  root.rotation.y=Math.PI/2;frame([0,1.9,0],6,5.4,.20);
  const handle=K.group(root,'车门金色拉环',-.3,2.1,1.85);K.torus(handle,0,0,0,.17,.045,K.gold);target(handle,'handle');mark(handle,'向右拖开车门',v(0,.5,0));setTargets([handle]);
  let opening=0,opened=false,distance=0,drive=false,keys=new Set(),elapsed=0;step='door';
  tell('登上舞会马车','按住金色门环向右拉，把门完全打开，再亲手驾驶马车。','舞会 · 开门与驾车');progress(0,'开门 0%');
  const reins=K.group(root,'马车缰绳',0,1.5,1.8);K.torus(reins,0,0,0,.33,.055,C.wood);reins.visible=false;
  const meter=()=>progress(distance/8,`前进 ${distance.toFixed(1)} / 8 米 · 按住前进，松开就停`);
  function ready(){opened=true;step='drive';handle.visible=false;reins.visible=true;target(reins,'reins');setTargets([reins]);mark(reins,'按住缰绳前进',v(0,.65,0));feedback('车门已经打开，按住缰绳或上方向键出发。');meter();}
  return {down(e,h){if(h&&step==='door')drag={x:e.clientX};if(h&&step==='drive')drive=true;},move(e){if(step==='door'&&drag){opening=T.MathUtils.clamp((e.clientX-drag.x)/(innerWidth*.18),0,1);handle.position.x=-.3+opening*1.5;progress(opening,`开门 ${Math.round(opening*100)}%`);}},up(){drive=false;if(step==='door'&&opening>.85){W.interactions.state.royalOpen=true;ready();}},release(){drive=false;keys.clear();},key(e){if(e.code==='ArrowUp'||e.code==='KeyW'){e.preventDefault();drive=true;}},update(dt){
   if(step==='door')for(const door of car.userData.doors)door.rotation.y=-door.userData.side*opening*1.43;
   if(step==='drive'&&(drive||keys.has('ArrowUp'))){distance=Math.min(8,distance+dt*2.0);car.position.z=beforePosition.z+distance;root.position.z=beforePosition.z+distance;view(...framing);meter();if(distance>=8){drive=false;complete({opened,distance,score:100},2);}}
  },keyup(e){if(['ArrowUp','KeyW'].includes(e.code))drive=false;}};
 }

 function pearl(){
  W.root.updateMatrixWorld(true);const lid=W.underwater.movers.shell,shell=lid.parent;place(shell.getWorldPosition(v()).toArray());frame([0,1.6,1.4],8.3,5.5,.40);
  let cleaned=0,opening=0,opened=false;const debris=[];for(let i=0;i<5;i++){const a=(i+.6)/5*Math.PI;let g=K.group(root,'贝壳上的海藻',Math.cos(a)*2.6,.7,Math.sin(a)*2.5);for(let j=0;j<3;j++)K.tube(g,[[j*.11,0,0],[j*.12,.4,.2],[j*.08,.7,0]],.045,'#579c8d');target(g,i);debris.push(g);}
  const grip=K.group(root,'贝壳开启把手',0,.25,3.5);K.ell(grip,0,0,0,.32,.14,.23,K.gold);grip.visible=false;target(grip,'lid');
  tell('唤醒贝壳里的珍珠','抓住贝壳上的五束缠绕海藻，向外拖走，再抬起贝壳上盖。','海底 · 清理与开启');progress(0,'清理海藻 0 / 5');setTargets(debris);step='clean';
  return {down(e,h){if(h)drag={g:h.owner,id:h.id,x:e.clientX,y:e.clientY,start:h.owner.position.clone()};},move(e){if(!drag)return;if(step==='clean'){const p=planePoint(e,'y',.8);if(p)drag.g.position.copy(p);}else{opening=T.MathUtils.clamp((drag.y-e.clientY)/(innerHeight*.20),0,1);progress(opening,`抬起贝壳 ${Math.round(opening*100)}%`);}},up(e){if(!drag)return;if(step==='clean'){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>Math.min(innerWidth,innerHeight)*.09){drag.g.visible=false;cleaned++;sound();progress(cleaned/5,`清理海藻 ${cleaned} / 5`);if(cleaned===5){step='open';grip.visible=true;setTargets([grip]);mark(grip,'向上拖起上盖',v(0,.5,0));feedback('海藻清理干净了，抓住金色把手向上抬。');}}else drag.g.position.copy(drag.start);}else if(opening>=.85){opened=true;bridge.ensureAction('pearl','pearl');burst(v(0,1.3,1.6),'#e4d7ff',26);complete({cleaned,opened,score:100},2.5);}},update(){lid.rotation.x=-1.12*opening;grip.position.y=.25+opening*3;}};
 }

 function portal(){
  place([-57,43.2,-65]);frame([0,2,0],7,6,.1);const arch=K.arch(root,0,0,0,3.7,4.5,K.gold,.15);const runes=[],sequence=[0,1,2,3,4];for(let i=0;i<5;i++){const a=Math.PI-i/4*Math.PI,g=K.group(root,'门上的魔法印记',Math.cos(a)*1.65,1.35+Math.sin(a)*2.25,.15);K.torus(g,0,0,0,.20,.04,K.gold);A.gem(g,0,0,0,.13,C.violet);target(g,i);runes.push(g);mark(g,String(i+1),v(0,.35,0));}
  const door=K.box(root,0,1.9,-.05,3.3,3.8,.07,A.prism('#a786dd',true),.08);let traced=0,crossed=false,trail=[],walk=0,walking=false;step='trace';
  tell('亲手唤醒神秘之门','依次点击 1、2、3、4、5，或连续划过，连出拱门上的魔法轨迹。','森林 · 连线与穿门');progress(0,'魔法印记 0 / 5');setTargets(runes);
  function touch(h){if(!h||h.id!==traced)return;traced++;runes[h.id].scale.setScalar(1.3);burst(runes[h.id].position.clone(),'#c9a6ff',10);if(traced>1){const i=traced-2;if(!trail[i])trail[i]=K.rod(root,runes[i].position.toArray(),runes[i+1].position.toArray(),.025,K.glow);trail[i].visible=true;}sound(350+traced*70);progress(traced/5,`魔法印记 ${traced} / 5`);if(traced===5){step='enter';door.material=K.mat('#e9c8ff',{emissive:'#ac64da',emissiveIntensity:.6,transparent:true,opacity:.22,depthWrite:false});feedback('门已经打开。按住门中央，走进发光的入口。');target(door,'enter');setTargets([door]);}}
  return {down(e,h){if(step==='trace'){if(h?.id===0&&traced===0)touch(h);else touch(h);}else if(h?.id==='enter')walking=true;},move(e,h){if(step==='trace')touch(h);},up(){walking=false;if(step==='trace'&&traced>0)feedback('已连起 '+traced+' 枚，可以松手后继续点下一枚。');},update(dt){if(step==='enter'&&pointerDown&&walking&&!ending){camera.near=.05;camera.updateProjectionMatrix();walk+=dt;const q=Math.min(1,walk/2.2);camera.position.lerpVectors(root.localToWorld(v(0,2,7)),root.localToWorld(v(0,2,-1)),smooth(q));camera.lookAt(root.localToWorld(v(0,2,-4)));progress(q,'正在穿过神秘之门…');if(q===1){crossed=true;complete({traced:5,crossed,score:100},.5);}}}};
 }

 function treeLights(){
  step='connect';bridge.snow(true);W.root.updateMatrixWorld(true);const tree=W.coast.movers.christmasTree;place(tree.getWorldPosition(v()).toArray());frame([0,4.4,1],9,10,.1);let connected=0,rotation=0;const bulbs=[],hooksAt=[],wires=[];const oldSpin=W.interactions.state.treeSpin;W.interactions.state.treeSpin=false;restores.push(()=>{if(!ending)W.interactions.state.treeSpin=oldSpin;});
  for(let i=0;i<3;i++){const col=['#f393c7','#ffc45d','#9eafff'][i],g=K.group(root,'需要挂回去的发光挂件',(i-1)*2.1+(i===1?.6:0),.9,5.5);K.ell(g,0,0,0,.30,.38,.30,A.prism(col));K.torus(g,0,.42,0,.11,.03,K.gold);target(g,i);g.userData.home=g.position.clone();bulbs.push(g);mark(g,['粉色','金色','紫色'][i],v(0,.6,0));let h=K.group(root,'挂件的对应灯座',(i-1)*1.55+(i===1?.7:0),3+i*.85,1.7);K.torus(h,0,0,0,.42,.055,col);hooksAt.push(h);}
  tell('修好圣诞树的星光','将三个挂件拖到同色灯座上。全部接好后，光环才会围绕树旋转。','圣诞 · 挂灯与点亮');progress(0,'灯饰 0 / 3');setTargets(bulbs);
  return {down(e,h){if(h)drag={g:h.owner,id:h.id};},move(e){if(drag){const p=planePoint(e,'z',1.7);if(p)drag.g.position.copy(p);}},up(e){if(!drag)return;const p=planePoint(e,'z',1.7),dest=hooksAt[drag.id].position;if(p&&p.distanceTo(dest)<.95){drag.g.position.copy(dest);targets.splice(targets.indexOf(drag.g),1);drag.g.children[0].material=K.mat(['#f393c7','#ffc45d','#9eafff'][drag.id],{emissive:'#ffda9a',emissiveIntensity:1.5});connected++;sound();progress(connected/3,`灯饰 ${connected} / 3`);if(connected===3){W.interactions.state.treeSpin=true;step='spin';feedback('线路接好了，星光环开始旋转！');}}else{drag.g.position.copy(drag.g.userData.home);feedback('对准同色的灯座再放下。');}},update(dt){if(step==='spin'){rotation+=dt*.65;progress(Math.min(1,rotation),'看，光环正在绕树旋转');if(rotation>=1)complete({connected,rotation,score:100},1.5);}}};
 }

 controller=kind==='bake'?bake():kind==='style'?style():kind==='nails'?nails():kind==='memory'?memory():kind==='gifts'?gifts():['rhythm','finalDance','partyDance'].includes(kind)?dance():kind==='carriage'?carriage():kind==='pearl'?pearl():kind==='portal'?portal():treeLights();
 function keyup(e){controller?.keyup?.(e);}addEventListener('keyup',keyup);hooks.push(()=>removeEventListener('keyup',keyup));
 function update(dt){
  if(!alive)return;time+=dt;controller?.update?.(dt);
  for(const t of tweens.slice()){const q=Math.min(1,(time-t.at)/t.seconds);t.fn(q);if(q===1){tweens.splice(tweens.indexOf(t),1);t.done?.();}}
  root.updateMatrixWorld(true);camera.updateMatrixWorld(true);
  for(const l of labels){const p=l.object.localToWorld(l.offset.clone()).project(camera);l.el.hidden=!visible(l.object)||p.z<-1||p.z>1||Math.abs(p.x)>1||Math.abs(p.y)>1;l.el.style.transform=`translate(-50%,-50%) translate(${(p.x*.5+.5)*innerWidth}px,${(-p.y*.5+.5)*innerHeight}px)`;}
 }
 function stop(){
  if(!alive)return;alive=false;hooks.forEach(fn=>fn());restores.forEach(fn=>fn());hidden.forEach(([g,val])=>g.visible=val);root.removeFromParent();
  const gs=new Set(),ms=new Set(ownedMaterials);root.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)for(const m of (Array.isArray(o.material)?o.material:[o.material]))ms.add(m);});for(const g of gs)g.dispose();for(const m of ms)m.dispose();for(const t of ownedTextures)t.dispose();
  ui.remove();document.body.classList.remove('hands-on-active','challenge-active');camera.position.copy(before.camera);controls.target.copy(before.target);controls.enabled=before.enabled;camera.near=before.near;camera.updateProjectionMatrix();camera.lookAt(controls.target);
 }
 return {update,stop,root,get state(){return {kind,step,time,ending};}};
}
