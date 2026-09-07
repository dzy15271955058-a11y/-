import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as T from '../dist/vendor/three.module.min.js';
import {desserts,createDessert,disposeDessert} from '../dist/models.js';
const snapshot=root=>{const result=[];root.updateMatrixWorld(true);root.traverse(o=>result.push([o.visible,o.intensity??0,...o.matrixWorld.elements.map(n=>Math.round(n*1e5)/1e5)]));return JSON.stringify(result)};
test('all eleven desserts have valid geometry, bounded placement and a visible action change',()=>{
 assert.equal(desserts.length,11);assert.equal(new Set(desserts.map(d=>d.id)).size,11);
 for(const low of [false,true])for(const d of desserts){const model=createDessert(d.id,{low});model.root.traverse(o=>{if(o.geometry)for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n),d.id)});model.update({time:1.2,amount:0,impulse:0});const before=snapshot(model.root);model.update({time:1.2,amount:1,impulse:1});assert.notEqual(snapshot(model.root),before,`${d.id} action changes the model`);const bounds=new T.Box3().setFromObject(model.root);assert.ok(bounds.min.y>=-.4&&bounds.max.y<3.8,`${d.id} fits its display`);model.update({time:1.2,amount:0,impulse:0});assert.equal(snapshot(model.root),before,`${d.id} can return to rest`);disposeDessert(model.root)}
});
test('all visible assets and relative module imports resolve without a CDN',()=>{
 for(const d of desserts)assert.ok(fs.existsSync(new URL(`../dist/assets/icons/${d.id}.png`,import.meta.url)));
 const root=new URL('../dist/',import.meta.url);for(const file of ['index.html','style.css','app.js','models.js','soft-renderer.js','vendor/OrbitControls.js','vendor/three.module.min.js']){const full=new URL(file,root),source=fs.readFileSync(full,'utf8');for(const match of source.matchAll(/(?:from\s*|import\s*)['"](\.\.?\/[^'"]+)['"]/g))assert.ok(fs.existsSync(new URL(match[1],full)),`${file}: ${match[1]}`)}
 const html=fs.readFileSync(new URL('index.html',root),'utf8');assert.ok(html.includes('type="importmap"'));assert.ok(html.includes('lang="zh-CN"'));assert.ok(html.includes('viewport'));assert.ok(!html.includes('https://'));
});
test('rose gradients, soda bursts and falling osmanthus retain their intended visual states',()=>{
 for(const low of [false,true]){
  const rose=createDessert('petal',{low}),petals=[];rose.root.traverse(o=>{if(o.name==='rose-gradient-petal')petals.push(o)});assert.equal(petals.length,42);
  for(const p of petals){const c=p.geometry.attributes.color;assert.ok(p.material.vertexColors);assert.ok(c.getY(c.count-1)>c.getY(0), 'petal edges lighten from their pink roots')}
  disposeDessert(rose.root);
  const soda=createDessert('blue',{low}),ice=[],burst=[];soda.root.traverse(o=>{if(o.name==='soda-ice')ice.push(o);if(o.name==='soda-burst')burst.push(o)});assert.equal(ice.length,13);assert.equal(burst.filter(o=>o.visible).length,0);
  soda.update({time:1,impulse:1});assert.equal(burst.filter(o=>o.visible).length,24);const iceY=ice.map(o=>o.position.y);soda.update({time:1.4,impulse:.86});assert.ok(ice.some((o,i)=>o.position.y!==iceY[i]));soda.update();assert.ok(burst.every(o=>!o.visible));disposeDessert(soda.root);
  const garden=createDessert('parfait',{low}),flowers=[];garden.root.traverse(o=>{if(o.name==='falling-osmanthus')flowers.push(o)});assert.equal(flowers.length,32);assert.ok(flowers.every(o=>!o.visible));
  garden.update({impulse:1});const ys=flowers.map(o=>o.position.y);garden.update({impulse:.65});assert.ok(flowers.every((o,i)=>o.visible&&o.position.y<ys[i]), 'flowers travel downward');garden.update({impulse:.05});assert.ok(flowers.every(o=>!o.visible), 'the shower finishes cleanly');garden.update({impulse:1});assert.ok(flowers.every(o=>o.visible), 'a new click can replay the shower');garden.update();assert.ok(flowers.every(o=>!o.visible));disposeDessert(garden.root);
 }
});
