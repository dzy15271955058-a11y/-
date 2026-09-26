import {T} from './kit.js';
// Each display owns its meshes, so closing a workshop cannot dispose world content.
export function createCraftDisplay(W,clearExtra=()=>{}){
 const shown=new Map();
 return (mode,source)=>{
  const previous=shown.get(mode);if(previous){previous.removeFromParent();const geos=new Set(),mats=new Set();previous.traverse(o=>{if(o.geometry)geos.add(o.geometry);if(o.material)mats.add(o.material);});geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());}
  if(mode==='cupcake')clearExtra('cake');if(mode==='mix')clearExtra('drink');
  const g=source.clone(true),geos=new Map(),mats=new Map();g.name='我的创作 · '+mode;g.userData={live:true};g.traverse(o=>{o.layers.set(0);if(o.geometry){if(!geos.has(o.geometry))geos.set(o.geometry,o.geometry.clone());o.geometry=geos.get(o.geometry);}if(o.material){if(!mats.has(o.material))mats.set(o.material,o.material.clone());o.material=mats.get(o.material);}});g.rotation.set(0,0,0);
  if(mode==='sand'){g.position.set(6,.82,54.5);g.scale.setScalar(.55);W.island.land.add(g);W.lifePlaces.sand.visible=false;const item=W.interactions.items.find(i=>i.action==='sandcastle');item.object=g;}
  if(mode==='blocks'){g.position.set(-6,1.405,45);g.scale.setScalar(.30);W.island.land.add(g);}
  if(mode==='cupcake'){g.position.set(-8.15,3.325,-21.9);g.scale.setScalar(.24);W.mansion.ground.add(g);}
  if(mode==='mix'){g.position.set(25,3.635,-12.62);g.scale.setScalar(.32);W.mansion.ground.add(g);}
  shown.set(mode,g);return g;
 };
}
