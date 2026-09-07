// Render the project's own geometry. No supplied reference images are read.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import * as T from '../dist/vendor/three.module.min.js';
import {desserts,createDessert,disposeDessert} from '../dist/models.js';
import {SoftRenderer} from '../dist/soft-renderer.js';
const require=createRequire(import.meta.url);
const {createCanvas}=require(process.env.PATISSERIE_CANVAS_MODULE || '@napi-rs/canvas');
const output=new URL('../dist/assets/icons/',import.meta.url);fs.mkdirSync(output,{recursive:true});
const ids=process.argv.slice(2),selected=desserts.filter(d=>!ids.length||ids.includes(d.id));
for(const dessert of selected){
 const canvas=createCanvas(640,560),renderer=new SoftRenderer(canvas);renderer.setSize(640,560);
 const scene=new T.Scene(),model=createDessert(dessert.id,{low:false});
 for(const child of model.root.children)if(child!==model.food)child.visible=false;
 scene.add(model.root);model.update({time:0,amount:0,impulse:0});
 const box=new T.Box3();model.root.updateMatrixWorld(true);model.food.traverse(o=>{if(o.isMesh&&o.visible){let p=o.parent;while(p&&p.visible)p=p.parent;if(!p)box.expandByObject(o)}});const center=box.getCenter(new T.Vector3());
 const camera=new T.OrthographicCamera(-2.13,2.13,1.865,-1.865,.1,40);
 camera.position.copy(center).add(new T.Vector3(5,3.6,8));camera.lookAt(center);camera.updateProjectionMatrix();
 renderer.render(scene,camera);
 const small=createCanvas(320,280),ctx=small.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(canvas,0,0,320,280);
 fs.writeFileSync(new URL(`${dessert.id}.png`,output),small.toBuffer('image/png'));disposeDessert(model.root);renderer.dispose();
}
console.log(`Rendered ${selected.length} original model icons.`);
