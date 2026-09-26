import {T,C} from './kit.js';

export function createWorldInteractions(K,W){
 const state={carriageOpen:false,royalOpen:false,treeSpin:true,wings:true,townOpen:false,linerLit:true},items=[],trees=[];
 function add(object,action,label){object.userData.live=true;items.push({object,action,label});}
 W.root.traverse(o=>{if(o.userData.halos)trees.push(o);});
 for(let [i,g]of W.coast.movers.carriages.entries())add(g,i?'royalDoor':'carriageDoor',i?'开合舞会马车门':'开合珍珠马车门');
 add(W.coast.movers.christmasTree,'treeHalo','旋转／暂停圣诞星光环');add(W.skyCity.movers.pegasus,'wings','振翅／舒展飞马翅膀');
 for(let g of W.town.doors)add(g,'townDoors','开合小镇店门');add(W.liner.ship,'linerCruise','乘邮轮欣赏船队');
 add(W.deep.movers.runway,'deepDress','海底衣帽宫换装');
 return {state,items,trees,elapsedTree:0,elapsedWing:0};
}
export function toggleWorldInteraction(W,action){
 const map={carriageDoor:'carriageOpen',royalDoor:'royalOpen',treeHalo:'treeSpin',wings:'wings',townDoors:'townOpen',linerLights:'linerLit'},key=map[action];if(!key)return null;
 const s=W.interactions.state;s[key]=!s[key];return s[key];
}
export function updateWorldInteractions(W,dt,time,reduced){
 const I=W.interactions,s=I.state;if(s.treeSpin&&!reduced)I.elapsedTree+=dt;if(s.wings&&!reduced)I.elapsedWing+=dt;
 for(let [i,g]of W.coast.movers.carriages.entries())for(let door of g.userData.doors){let open=i?s.royalOpen:s.carriageOpen,target=open?door.userData.side*1.43:0;door.rotation.y=T.MathUtils.damp(door.rotation.y,target,reduced?1000:5,dt);}
 for(let tree of I.trees)for(let [i,h]of tree.userData.halos.entries())h.rotation.y=I.elapsedTree*(i%2?-.45:.65)+i*.7;
 for(let [i,w]of W.skyCity.movers.pegasus.userData.wings.entries()){let side=i?1:-1,target=s.wings?side*(.12+Math.sin(I.elapsedWing*2.2)*.43):side*.86;w.rotation.z=T.MathUtils.damp(w.rotation.z,target,reduced?1000:7,dt);}
 for(let door of W.town.doors)door.rotation.y=T.MathUtils.damp(door.rotation.y,s.townOpen?-1.30:0,reduced?1000:5,dt);
 W.liner.lights.emissiveIntensity=s.linerLit?1.65:.08;
 W.liner.fleet.position.y=W.liner.base.y+(reduced?0:Math.sin(time*.33)*.08);
 for(let [i,b]of W.liner.yachts.entries()){b.g.position.y=reduced?0:Math.sin(time*.55+i)*.06;b.g.rotation.z=reduced?0:Math.sin(time*.42+i)*.015;}
}

export const submergedWorld=w=>w==='underwater'||w==='wardrobe';
export function visibleInScene(object){for(let o=object;o;o=o.parent)if(!o.visible)return false;return true;}

// Shared by navigation and geometry checks so the wardrobe never inherits the land visibility state.
export function applyRealmVisibility(W,value,winter=false){
 const sub=submergedWorld(value);
 W.underwater.sea.visible=W.deep.deep.visible=sub;
 W.deep.movers.roof.visible=value!=='wardrobe';
 for(let g of [W.skyCity.sky,W.skyCity.bridge,W.coast.land,W.coast.live,W.town.land,W.town.live,W.liner.fleet,W.mansion.ground,W.mansion.upper,W.mansion.glassGroup,W.mansion.shell,W.mansion.roofs,W.mansion.outdoor,W.island.land,W.island.sky,W.island.animated,W.palace.ground,W.palace.upper,W.palace.shell,W.palace.roofs,W.palace.live])g.visible=!sub;
 W.coast.snow.visible=winter&&!sub;if(W.glassCoast)W.glassCoast.coast.visible=!sub;
 return sub;
}
