import {freshAdventure,restoreAdventure} from './adventure-state.js';
import {freshCraft,restoreCraft} from './craft-state.js';
// Open-ended life systems. All prices are earned in-game; no payments or timers away.
export const LIFE_KEY='barbie-dream-life-v1';
export const TAGS={elegant:'优雅',romantic:'浪漫',fresh:'清新',bold:'个性',casual:'休闲',fantasy:'梦幻'};
export const CATALOG=[
 ['rose','dress','玫瑰缎裙',0,'ruffle','romantic','casual'],['moon','dress','月光长礼服',40,'gown','elegant','romantic'],['swan','dress','天鹅羽纱',65,'swan','elegant','fantasy'],['flower','dress','花语层叠裙',55,'floral','romantic','fantasy'],['ballet','dress','剧院舞裙',35,'ballet','elegant','fresh'],['pilot','dress','海岛飞行套装',35,'pilot','bold','casual'],['lounge','dress','丝缎休闲套装',0,'pajamas','casual','fresh'],
 ['tailor','dress','都会丝缎套装',55,'tailor','bold','elegant'],
 ['rococo','dress','玫瑰宫廷侧开裙',0,'rococo','romantic','elegant'],['cascade','dress','瀑布褶高低礼裙',0,'cascade','bold','elegant'],['mermaidcouture','dress','珍珠鱼尾礼裙',60,'mermaidcouture','elegant','romantic'],['petalcouture','dress','层瓣花仙短裙',0,'petalcouture','fantasy','fresh'],['starlight','dress','星图欧根纱礼服',60,'starlight','fantasy','bold'],['sailor','dress','海风水手裙',0,'sailor','fresh','casual'],['picnicdress','dress','刺绣泡袖茶歇裙',40,'picnicdress','romantic','casual'],['icecape','dress','冰晶落地斗篷裙',60,'icecape','fantasy','elegant'],
 ['long','hair','柔光长卷发',0,'long','romantic','casual'],['bun','hair','珍珠盘发',20,'bun','elegant','fresh'],['tinsel','hair','星丝编发',30,'tinsel','fantasy','bold'],
 ['pinkshoe','shoes','莓粉缎带鞋',0,'#db4b90','romantic','casual'],['goldshoe','shoes','香槟细跟鞋',20,'#d5ac55','elegant','romantic'],['blueshoe','shoes','海蓝舞鞋',20,'#6a9be6','fresh','fantasy'],['darkshoe','shoes','黑莓短靴',25,'#362342','bold','casual'],
 ['bow','jewel','绸缎蝴蝶结',0,'bow','romantic','casual'],['crown','jewel','月桂宝石冠',45,'crown','elegant','fantasy'],['wings','jewel','流光花仙翼',75,'wings','fantasy','fresh'],['pearl','jewel','珍珠垂坠耳饰',25,'pearl','elegant','fresh'],
 ['comet','jewel','星芒耳饰',35,'star','bold','fantasy'],
 ['rosebag','bag','玫瑰手提包',0,'#d74091','romantic','casual'],['goldbag','bag','金色晚宴包',25,'#d6b66d','elegant','fantasy'],['bluebag','bag','海盐蓝小包',25,'#8bbce9','fresh','casual'],['darkbag','bag','黑莓链条包',25,'#332644','bold','elegant']
].map(([id,slot,name,price,value,...tags])=>({id,slot,name,price,value,tags}));
export const SLOTS={dress:'服装',hair:'发型',shoes:'鞋履',jewel:'饰品',bag:'手袋'};
export const PALETTE=[['berry','莓果粉','#da4a91','romantic'],['ivory','珍珠白','#f1ebdf','elegant'],['blue','海盐蓝','#74a8e6','fresh'],['plum','黑莓紫','#67426f','bold'],['lilac','虹光紫','#b28fe2','fantasy'],['gold','香槟金','#d7b76c','elegant']];
export const FABRICS=[['satin','缎面','elegant'],['velvet','丝绒','bold'],['prism','虹彩','fantasy']];
export const BRIEFS=[
 {id:'yacht',name:'落日游艇晚宴',story:'甲板上有海风，也有正式晚宴。优雅为主，带一点浪漫。',tags:['elegant','romantic'],palette:['ivory','gold','berry'],reward:'晚宴策划邀请'},
 {id:'forest',name:'森林花语展',story:'以花仙子为灵感，梦幻与清新都要有，让衣服像会呼吸。',tags:['fantasy','fresh'],palette:['lilac','blue','ivory'],reward:'花语展造型记录'},
 {id:'coast',name:'海岸周末画报',story:'舒展的休闲轮廓，配合清新的海岛色彩。',tags:['casual','fresh'],palette:['blue','ivory','berry'],reward:'海岸画报记录'},
 {id:'premiere',name:'剧院首映之夜',story:'有个性的轮廓与精致礼仪并存。用深色或金色表达态度。',tags:['bold','elegant'],palette:['plum','gold','ivory'],reward:'首映礼造型记录'},
 {id:'tea',name:'玫瑰花园茶会',story:'浪漫而松弛的朋友聚会，不必穿得像正式舞会。',tags:['romantic','casual'],palette:['berry','ivory','lilac'],reward:'茶会主理人记录'},
 {id:'moon',name:'月光幻想舞台',story:'个性与梦幻碰撞，给仙子电影设计一套新的舞台服。',tags:['fantasy','bold'],palette:['lilac','plum','blue'],reward:'月光舞台造型记录'}
];
export const RECIPES=[
 {id:'roseTea',name:'玫瑰果茶',tags:['花香','清爽'],cost:4,price:14,time:3,color:'#d65b87',type:'drink'},
 {id:'seaSoda',name:'海盐气泡饮',tags:['清爽','气泡'],cost:5,price:16,time:4,color:'#8ec5ef',type:'drink'},
 {id:'latte',name:'香草拿铁',tags:['咖啡','奶香'],cost:6,price:19,time:5,color:'#c8a27a',type:'drink'},
 {id:'berryCake',name:'莓果慕斯',tags:['莓果','奶香'],cost:7,price:22,time:5,color:'#e273ac',type:'cake'},
 {id:'flowerCake',name:'桂花轻芝士',tags:['花香','奶香'],cost:8,price:24,time:6,color:'#e8c96a',type:'cake'},
 {id:'cocoaCake',name:'黑莓巧克力',tags:['可可','莓果'],cost:8,price:24,time:6,color:'#765074',type:'cake'}
];
export const TOPPINGS=[{id:'none',name:'原味',tag:null,cost:0,extra:0},{id:'petals',name:'食用花瓣',tag:'花香',cost:2,extra:3},{id:'berries',name:'鲜莓果',tag:'莓果',cost:3,extra:4},{id:'pearls',name:'奶油珍珠',tag:'奶香',cost:3,extra:5},{id:'fizz',name:'气泡啫喱',tag:'气泡',cost:2,extra:3}];
export function customizeRecipe(id,topping='none'){const base=RECIPES.find(r=>r.id===id),t=TOPPINGS.find(t=>t.id===topping)||TOPPINGS[0];return {...base,name:base.name+(t.tag?' · '+t.name:''),tags:[...new Set([...base.tags,...(t.tag?[t.tag]:[])])],cost:base.cost+t.cost,price:base.price+t.extra,time:base.time+(t.tag?1:0),topping:t.id};}
export const CLIENTS=[
 {name:'思琪',want:['花香','清爽'],avoid:'咖啡',budget:19,line:'花香轻一点，想喝清爽的。'},
 {name:'蕾妮',want:['咖啡','奶香'],avoid:'气泡',budget:25,line:'拍摄一整天，想来一杯奶咖。'},
 {name:'黛西',want:['莓果','奶香'],avoid:'咖啡',budget:28,line:'彩排结束，想吃莓果甜品。'},
 {name:'花仙子',want:['花香','奶香'],avoid:'可可',budget:30,line:'想把花园的香气装进甜点。'},
 {name:'美人鱼',want:['清爽','气泡'],avoid:'咖啡',budget:21,line:'海风一样轻盈的气泡饮吧。'},
 {name:'思佩',want:['可可','莓果'],avoid:'花香',budget:30,line:'要莓果与浓郁可可的层次。'}
];
export const PETS=[{id:'cat',name:'奶油猫',likes:'奶香',trait:'擅长招待客人'},{id:'rabbit',name:'月光兔',likes:'清爽',trait:'喜欢寻找花园灵感'},{id:'deer',name:'花斑鹿',likes:'花香',trait:'喜欢陪伴走秀'}];
const clamp=(n,a,b)=>Math.min(b,Math.max(a,Number.isFinite(n)?n:a));
export function freshLife(){return {world:freshAdventure(),craft:freshCraft(),version:1,coins:160,owned:CATALOG.filter(x=>!x.price).map(x=>x.id),look:{dress:'rose',hair:'long',shoes:'pinkshoe',jewel:'bow',bag:'rosebag',color:'berry',fabric:'satin'},album:[],best:{},brief:'yacht',services:0,served:0,rep:0,upgrades:[],pet:{id:'cat',name:'奶油',bond:0,energy:80,joy:75,food:80,clean:85,trained:0,follow:false},difficulty:'relaxed'};}
export function restoreLife(raw){const s=freshLife();try{const d=typeof raw==='string'?JSON.parse(raw):raw;if(d?.version!==1)return s;s.craft=restoreCraft(d.craft);s.world=restoreAdventure(d.world);s.coins=clamp(d.coins,0,999999);s.owned=[...new Set([...s.owned,...CATALOG.filter(x=>d.owned?.includes(x.id)).map(x=>x.id)])];for(const slot of Object.keys(SLOTS))if(CATALOG.some(x=>x.id===d.look?.[slot]&&x.slot===slot&&s.owned.includes(x.id)))s.look[slot]=d.look[slot];if(PALETTE.some(x=>x[0]===d.look?.color))s.look.color=d.look.color;if(FABRICS.some(x=>x[0]===d.look?.fabric))s.look.fabric=d.look.fabric;for(const b of BRIEFS)s.best[b.id]=clamp(d.best?.[b.id],0,100);if(BRIEFS.some(b=>b.id===d.brief))s.brief=d.brief;s.album=(Array.isArray(d.album)?d.album:[]).slice(0,12).filter(a=>a&&typeof a.name==='string'&&a.look).map(a=>({name:a.name.slice(0,30),look:restoreLife({...d,album:[],look:a.look}).look}));for(const key of ['services','served','rep'])s[key]=Math.floor(clamp(d[key],0,999999));s.upgrades=['station','decor'].filter(x=>d.upgrades?.includes(x));if(PETS.some(x=>x.id===d.pet?.id))s.pet.id=d.pet.id;if(typeof d.pet?.name==='string')s.pet.name=d.pet.name.slice(0,12)||'奶油';for(const key of ['energy','joy','food','clean'])s.pet[key]=clamp(d.pet?.[key]??s.pet[key],0,100);s.pet.bond=clamp(d.pet?.bond,0,99999);s.pet.trained=Math.floor(clamp(d.pet?.trained,0,99999));s.pet.follow=d.pet?.follow===true;s.difficulty=d.difficulty==='rush'?'rush':'relaxed';return s;}catch{return s;}}
export function item(id){return CATALOG.find(x=>x.id===id);}
export function gradeLook(look,brief){const weights={dress:3,hair:1,shoes:1,jewel:2,bag:1},totals={};for(const [slot,w]of Object.entries(weights))for(const t of item(look[slot])?.tags||[])totals[t]=(totals[t]||0)+w;const cloth=FABRICS.find(x=>x[0]===look.fabric);if(cloth)totals[cloth[2]]=(totals[cloth[2]]||0)+1;const rows=brief.tags.map(t=>({name:TAGS[t],value:Math.min(35,Math.round((totals[t]||0)/6*35))}));const color=brief.palette.includes(look.color)?20:8;const complete=Object.keys(SLOTS).every(k=>item(look[k])?.slot===k)?10:0;return {score:Math.min(100,rows.reduce((n,r)=>n+r.value,0)+color+complete),rows:[...rows,{name:'场合配色',value:color},{name:'搭配完整度',value:complete}],tip:rows.some(r=>r.value<25)?`可以加强${rows.sort((a,b)=>a.value-b.value)[0].name}，试着换一件饰品或改变面料。`:color<20?'轮廓很合适，可以试试请柬推荐的配色。':'这套搭配回应了场合，也有完整的细节。'};}
export function buy(s,id){const x=item(id);if(!x||s.owned.includes(id)||s.coins<x.price)return false;s.coins-=x.price;s.owned.push(id);return true;}
export function awardLook(s,brief,result){const old=s.best[brief.id]||0;if(result.score<=old)return 0;const bonus=old<75&&result.score>=75?25:0,pay=Math.floor(result.score/5)-Math.floor(old/5)+bonus;s.best[brief.id]=result.score;s.coins+=pay;return pay;}
export function customersFor(n){return [0,1,2].map((_,i)=>({...CLIENTS[(n*2+i)%CLIENTS.length],id:i,served:false,waiting:0}));}
export function gradeOrder(recipe,customer,{premium=false,wait=0,relaxed=true,decor=false,pet=false}={}){const match=recipe.tags.filter(t=>customer.want.includes(t)).length,avoided=recipe.tags.includes(customer.avoid),price=recipe.price+(premium?6:0);const score=clamp(35+match*25-(avoided?35:0)-(price>customer.budget?20:0)-(relaxed?0:Math.floor(wait/20)*5)+(decor?5:0)+(pet?5:0),10,100);const tip=score>=85?5:score>=65?2:0;return {score,price,tip,profit:price+tip-recipe.cost,reason:avoided?'出现了客人不喜欢的口味':price>customer.budget?'价格超过了客人的预算':match===2?'两种偏好都满足了':match===1?'满足了一种口味偏好':'口味与这位客人的期待不同'};}
export function petLevel(p){return 1+Math.min(4,Math.floor(p.bond/35));}
export function carePet(s,action){const p=s.pet;if(action==='feed'){if(p.food>=96)return false;p.food=clamp(p.food+28,0,100);p.joy=clamp(p.joy+6,0,100);}else if(action==='groom'){if(p.clean>=96)return false;p.clean=100;p.joy=clamp(p.joy+8,0,100);}else if(action==='rest'){p.energy=100;}else return false;p.bond+=2;return true;}
export function trainPet(s){s.pet.trained++;s.pet.bond+=12;s.pet.energy=clamp(s.pet.energy-14,0,100);s.pet.food=clamp(s.pet.food-10,0,100);s.pet.clean=clamp(s.pet.clean-8,0,100);s.pet.joy=clamp(s.pet.joy+10,0,100);s.coins+=8;}

CATALOG.push(...[['trail','风铃徒步装','picnicdress'],['divesuit','珍珠潜航服','astronaut'],['valleycouture','风铃花园礼服','petalcouture'],['rosepilot','蔷薇飞行员','sailor'],['oceanweave','流光海洋礼服','mermaidcouture'],['chefcouture','星夜甜点师','cascade']].map(([id,name,value])=>({id,name,value,slot:'dress',tags:id==='trail'?['fresh','casual']:['fantasy','romantic'],price:9999999})),{id:'trailboots',name:'缎带防滑短靴',value:'#aa82a2',slot:'shoes',tags:['casual','fresh'],price:9999999});
