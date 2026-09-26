import {proofComplete} from './play-rules.js';
// Local, single-player campaign. No network or account is needed to play.
export const SAVE_KEY='barbie-dream-island-game-v1';
export const SOURCES=[
 ['芭比之梦想豪宅','https://www.netflix.com/title/70294800','朋友、衣橱与泳池派对'],
 ['芭比之美人鱼历险记','https://www.universalpicturesathome.com/movies/barbie-in-a-mermaid-tale','海洋冒险与伙伴合作'],
 ['芭比之天鹅湖','https://www.universalpicturesathome.com/movies/barbie-of-swan-lake','天鹅、魔法森林与勇气'],
 ['芭比之十二个跳舞的公主','https://www.universalpicturesathome.com/movies/barbie-in-the-12-dancing-princesses','秘密入口与舞蹈'],
 ['芭比彩虹仙子','https://www.universalpicturesathome.com/movies/barbie-fairytopia','花朵家园、仙子与友谊']
];
const challenge=(place,kind,text)=>({place,kind,text,type:'challenge'});
const action=(place,event,text)=>({place,event,text,type:'action'});
export const QUESTS=[
 {id:'party',title:'给朋友的惊喜派对',short:'豪宅日常',icon:'♡',npc:'芭比',source:0,reward:30,badge:'甜蜜伙伴',color:'#ef4d96',intro:'大家快到啦！可以帮我做一只草莓庆祝蛋糕，再一起点亮睡衣派对吗？',steps:[challenge('kitchen','bake','加料、搅拌、烘烤并裱花装饰'),challenge('party','partyDance','和朋友完成一支派对舞蹈')],gift:'rose'},
 {id:'couture',title:'海底衣橱的舞会请柬',short:'造型设计',icon:'♕',npc:'思琪',source:0,reward:30,badge:'梦幻造型师',color:'#9d57cf',intro:'海底衣帽宫收到了一张舞会请柬。请挑一套香槟金晚礼服，配上王冠；马车已经在等我们了。',steps:[challenge('deepcloset','style','试穿、染色并戴上王冠'),challenge('royalcarriage','carriage','拉开马车门，亲手驾车出发')],gift:'gold'},
 {id:'salon',title:'指尖上的星光',short:'美甲沙龙',icon:'✧',npc:'思佩',source:0,reward:25,badge:'闪耀设计师',color:'#c54bae',intro:'我想试试紫水晶色的闪粉美甲。亲手把五片甲面涂好，再逐片镶上小水晶吧。',steps:[challenge('salon','nails','亲手涂满五片紫晶甲面并镶钻')],gift:'violet'},
 {id:'ocean',title:'守护珊瑚花园',short:'美人鱼冒险',icon:'♆',npc:'美人鱼伙伴',source:1,reward:40,badge:'海洋守护者',color:'#2874c9',intro:'有六件漂流垃圾闯进了珊瑚花园！点中它们装进回收袋，别碰小鱼。清理后去打开珍珠贝壳。',steps:[challenge('reef','cleanup','在海里收走六件垃圾'),challenge('pearl','pearl','清走缠绕海藻，亲手抬起贝壳')],gift:'ocean'},
 {id:'forest',title:'找回花园的光',short:'仙子魔法',icon:'❀',npc:'花仙子',source:4,reward:40,badge:'花园守护者',color:'#8f52bd',intro:'花园的魔法花粉散在溪桥附近。找齐五颗粉金花粉，不要采走蓝色萤火虫，再穿过神秘之门。',steps:[challenge('stream','pollen','找齐五颗粉金花粉'),challenge('fairygarden','portal','连起五枚印记，穿过神秘之门')],gift:'fairy'},
 {id:'swan',title:'天鹅湖的魔法回声',short:'森林解谜',icon:'♧',npc:'天鹅湖舞者',source:2,reward:40,badge:'水晶之心',color:'#5c80c4',intro:'湖面藏着一段魔法回声。记住四枚符文亮起的顺序，再依次点回来。完成三轮，唤醒森林的祝福。',steps:[challenge('swanlake','memory','重现三轮湖面符文顺序')],gift:'swan'},
 {id:'dance',title:'十二公主的邀请',short:'芭蕾节拍',icon:'♫',npc:'公主舞团',source:3,reward:45,badge:'星光舞者',color:'#c45183',intro:'跟着落下的音符起舞吧！音符到达金色判定线时，按对应方向。十二拍中接住八拍，就能加入舞会。',steps:[challenge('theater','rhythm','在十二拍中接住至少八拍')],gift:'ballet'},
 {id:'flight',title:'飞马的云端星路',short:'空中冒险',icon:'♘',npc:'白色飞马',source:null,reward:45,badge:'云端骑士',color:'#8073ce',intro:'握稳缰绳！用方向键或屏幕方向按钮引导我穿过星环。九道环中穿过六道，我们就把星光带回城堡。',steps:[challenge('pegasus','flight','操控飞马穿过六道星环')],gift:'starlight'},
 {id:'christmas',title:'圣诞愿望派送',short:'雪季番外',icon:'✶',npc:'圣诞小精灵',source:null,reward:35,badge:'冬日送梦人',color:'#b44668',intro:'三位朋友在礼物卡上写下了愿望。帮我把对应的礼物装好，再点亮会旋转的圣诞星光环。',steps:[challenge('christmas','gifts','匹配三份愿望，拉丝带包装礼盒'),challenge('christmas','treeLights','挂回三盏灯，让圣诞星光环旋转')],gift:'winter'},
 {id:'finale',title:'海屿星光庆典',short:'最终章节',icon:'♔',npc:'所有的朋友',source:null,reward:80,badge:'梦想海屿之星',color:'#dd2b7e',requires:['party','couture','salon','ocean','forest','swan','dance','flight','christmas'],intro:'九枚友谊徽章都亮起来了！带上你最喜欢的服装，在邮轮舞厅完成最后一段舞蹈，为这座岛点亮庆典。',steps:[challenge('linerDeck','finalDance','完成星光庆典的最后十二拍')],gift:'crown'}
];
export const LOOKS=[
 {id:'everyday',name:'玫瑰日常',style:'ruffle',color:'#ee62a3',accessory:'bow'},
 {id:'rose',name:'莓果睡衣',style:'pajamas',color:'#e2589a',accessory:'bow'},
 {id:'gold',name:'香槟王冠',style:'gown',color:'#d9b96e',accessory:'crown'},
 {id:'violet',name:'紫晶晚礼服',style:'gown',color:'#ae75d8',accessory:'crown'},
 {id:'ocean',name:'珍珠海蓝',style:'swan',color:'#79afea',accessory:'crown'},
 {id:'fairy',name:'花仙子流光',style:'floral',color:'#db8bda',accessory:'wings'},
 {id:'swan',name:'天鹅湖月光',style:'swan',color:'#e9f0ff',accessory:'crown'},
 {id:'ballet',name:'粉红舞鞋',style:'ballet',color:'#f48db7',accessory:'bow'},
 {id:'starlight',name:'云端飞行员',style:'pilot',color:'#c397e9',accessory:'none'},
 {id:'winter',name:'冬日红丝绒',style:'gown',color:'#b42d54',accessory:'crown'},
 {id:'crown',name:'海屿女王',style:'gown',color:'#f3c273',accessory:'wings'}
];
export function freshSave(){return {version:1,active:'party',progress:{},completed:[],best:{},look:'everyday',started:false,slow:false};}
export function restoreSave(raw){
 const s=freshSave();try{const d=typeof raw==='string'?JSON.parse(raw):raw;if(!d||d.version!==1)return s;
 s.completed=QUESTS.filter(q=>Array.isArray(d.completed)&&d.completed.includes(q.id)).map(q=>q.id);
 // A final chapter cannot be restored without its prerequisite badges.
 if(!QUESTS.at(-1).requires.every(id=>s.completed.includes(id)))s.completed=s.completed.filter(id=>id!=='finale');
 for(const q of QUESTS){const n=d.progress?.[q.id];s.progress[q.id]=Number.isInteger(n)?Math.max(0,Math.min(n,s.completed.includes(q.id)?q.steps.length:q.steps.length-1)):s.completed.includes(q.id)?q.steps.length:0;const score=d.best?.[q.id];if(Number.isFinite(score))s.best[q.id]=Math.max(0,Math.min(100,Math.round(score)));}
 s.active=QUESTS.some(q=>q.id===d.active)&&isUnlocked(s,d.active)?d.active:'party';s.started=d.started===true;s.slow=d.slow===true;s.look=unlockedLooks(s).some(l=>l.id===d.look)?d.look:'everyday';return s;}catch{return s;}
}
export function isUnlocked(s,id){const q=QUESTS.find(q=>q.id===id);return !!q&&(!q.requires||q.requires.every(x=>s.completed.includes(x)));}
export function unlockedLooks(s){return LOOKS.filter(l=>l.id==='everyday'||QUESTS.some(q=>q.gift===l.id&&s.completed.includes(q.id)));}
export function stars(s){return QUESTS.filter(q=>s.completed.includes(q.id)).reduce((a,q)=>a+q.reward,0);}
export function currentStep(s){const q=QUESTS.find(q=>q.id===s.active);return q?.steps[s.progress[q.id]||0]||null;}
export function passChallenge(kind,result){
 if(!result||!Number.isFinite(result.score))return false;
 if(kind==='cleanup')return result.count===6;
 if(kind==='pollen')return result.count===5;
 if(kind==='flight')return result.hits>=6&&result.total===9;
 return proofComplete(kind,result);
}
export function reduceGame(save,event){const s=restoreSave(save);if(event.type==='start'){s.started=true;return s;}if(event.type==='slow'){s.slow=!!event.value;return s;}if(event.type==='look'){if(unlockedLooks(s).some(l=>l.id===event.id))s.look=event.id;return s;}if(event.type==='select'){if(isUnlocked(s,event.id)){s.active=event.id;if(event.replay&&s.completed.includes(event.id))s.progress[event.id]=0;}return s;}
 const q=QUESTS.find(q=>q.id===s.active),step=currentStep(s);if(!q||!step||!isUnlocked(s,q.id)||event.place!==step.place)return s;
 let passed=event.type==='challenge'&&step.type==='challenge'&&event.kind===step.kind&&passChallenge(step.kind,event.result);
 if(event.type==='action'&&step.type==='action'&&event.action===step.event&&event.success===true)passed=true;
 if(passed){s.progress[q.id]=(s.progress[q.id]||0)+1;if(event.result)s.best[q.id]=Math.max(s.best[q.id]||0,Math.min(100,Math.round(event.result.score)));if(s.progress[q.id]===q.steps.length&&!s.completed.includes(q.id))s.completed.push(q.id);}
 return s;
}
// Milliseconds are intentionally independent of animation frame rate.
export const DANCE_NOTES=[0,1,2,1,0,2,2,0,1,2,0,1];
export function judgeBeat(elapsed,lane,judged,{slow=false}={}){const gap=slow?1.15:.78,start=2,window=slow?.43:.28;let best=-1,delta=Infinity;for(let i=0;i<DANCE_NOTES.length;i++){const d=Math.abs(elapsed-(start+i*gap));if(!judged.has(i)&&DANCE_NOTES[i]===lane&&d<=window&&d<delta){best=i;delta=d;}}return {index:best,perfect:delta<window*.45};}
