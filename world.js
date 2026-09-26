import {T,C,v,createKit} from './kit.js';
import {buildLifePlaces} from './life-places.js';
import {buildEstateLandscape} from './landscape.js';
import {buildMansion} from './mansion.js';
import {buildIsland} from './island.js';
import {buildPalace} from './palace.js';
import {buildUnderwater} from './underwater.js';
import {buildSkyCity} from './sky-city.js';
import {buildHolidayCoast} from './holiday-coast.js';
import {buildDeepWardrobe} from './deep-wardrobe.js';
import {addFinishing} from './finishing.js';
import {buildHarborTown} from './harbor-town.js';
import {buildOceanLiner} from './ocean-liner.js';
import {buildGlassCoast} from './glass-sea.js';
import {createWorldInteractions} from './world-interactions.js';
export function buildWorld(textures={},optimize=true){
 const K=createKit(textures),root=new T.Group();root.name='芭比 · 海屿梦想豪宅';
 const mansion=buildMansion(K,root),island=buildIsland(K,root),palace=buildPalace(K,root),underwater=buildUnderwater(K,root);
 const skyCity=buildSkyCity(K,root),coast=buildHolidayCoast(K,root),deep=buildDeepWardrobe(K,root);
 addFinishing(K,{mansion,island,palace,underwater,skyCity,coast,deep});
 const town=buildHarborTown(K,root,{island,coast}),liner=buildOceanLiner(K,root);
 liner.princess.userData.live=true;
 const landscaping=buildEstateLandscape(K,{island,coast,town});
 const glassCoast=buildGlassCoast(K,root);
 const lifePlaces=buildLifePlaces(K,island);
 const interactions=createWorldInteractions(K,{root,coast,skyCity,deep,town,liner});
 for(const [object,action,label]of [[lifePlaces.plots,'farm','经营庄园农场'],[lifePlaces.pets,'animals','照料小动物'],[lifePlaces.sand,'sandcastle','亲手堆沙堡'],[lifePlaces.blocks,'blocks','自由拼积木']])interactions.items.push({object,action,label});
 coast.movers.sleigh.userData.live=true;
 if(optimize){K.optimize(mansion.kitchen.props);K.optimize(liner.princess);const F=skyCity.forest;K.optimize(F.crown);for(let r of F.peacocks){K.optimize(r.g);K.optimize(r.tail);}for(let r of F.fairies)K.optimize(r.g);K.optimize(glassCoast.coast);for(let f of glassCoast.fish)K.optimize(f.g);for(let g of [town.land,liner.fleet,deep.closet,deep.movers.lift])K.optimize(g);K.optimize(liner.ship);for(let b of liner.yachts)K.optimize(b.g);for(let parent of new Set(town.labels.map(l=>l.parent)))K.optimize(parent);for(let d of town.doors)K.optimize(d);for(let tree of interactions.trees){K.optimize(tree);for(let halo of tree.userData.halos)K.optimize(halo);}for(let g of coast.movers.carriages){K.optimize(g);for(let d of g.userData.doors)K.optimize(d);}K.optimize(deep.movers.runway);K.optimize(deep.movers.runway.userData.outfit);for(let g of [skyCity.sky,skyCity.bridge,coast.land,deep.deep,coast.snow])K.optimize(g);for(let live of [skyCity.live,coast.live,deep.live])for(let g of live.children)K.optimize(g);for(let h of coast.movers.horses)K.optimize(h.g);for(let w of skyCity.movers.pegasus.userData.wings)K.optimize(w);K.optimize(coast.movers.sleigh);}
 // Keep upstairs and downstairs character collections independently visible.
 const peopleLow=K.group(palace.live,'一层人物与玩偶'),peopleHigh=K.group(palace.live,'二层人物与玩偶');peopleLow.userData.level='ground';peopleHigh.userData.level='upper';
 for(let g of palace.live.children.slice()){if(g===peopleLow||g===peopleHigh)continue;(g.position.y>=8?peopleHigh:peopleLow).add(g);}palace.peopleLow=peopleLow;palace.peopleHigh=peopleHigh;
 // Protect motion subtrees; batch detailed static geometry by material.
 palace.movers.lift.userData.live=true;palace.movers.runway.userData.live=true;palace.movers.runway.userData.outfit.userData.live=true;for(let n of palace.movers.nails)n.userData.live=true;
 if(optimize){for(let g of [mansion.ground,mansion.upper,mansion.glassGroup,mansion.shell,mansion.roofs,mansion.outdoor,island.land,island.sky,palace.ground,palace.upper,palace.shell,palace.roofs,peopleLow,peopleHigh,underwater.sea])K.optimize(g);K.optimize(palace.movers.runway);for(let m of underwater.movers.mermaids){m.tail.userData.live=true;K.optimize(m.g);K.optimize(m.tail);}for(let f of underwater.movers.fish)K.optimize(f.g);for(let j of underwater.movers.jelly)K.optimize(j.g);K.optimize(island.movers.car);K.optimize(island.movers.boat);K.optimize(island.movers.balloon);K.optimize(mansion.movers.disco);K.optimize(mansion.movers.swing);K.optimize(mansion.movers.flamingo);K.optimize(underwater.movers.turtle);}
 root.updateMatrixWorld(true);return {root,K,mansion,island,palace,underwater,skyCity,coast,deep,town,liner,glassCoast,interactions,landscaping,lifePlaces};
}
const L=(id,world,name,en,symbol,pos,target,layer,description,actions=[])=>({id,world,name,en,symbol,pos,target,layer,description,actions});
export const LOCATIONS=[
 L('overview','home','梦想庄园全景','DREAM ESTATE','♡',[84,63,102],[0,6,-12],'full','粉色坡顶主楼、圆塔衣橱、弧形玻璃泳池翼楼，一座属于你的海边庄园。',['tour','deepEnter','dusk']),
 L('festival','beach','星光嘉年华展台','STARLIGHT FESTIVAL','✧',[6,12,88],[-10,3,68],'full','从山谷带回花材、邀请地区伙伴，再送来亲手制作的餐点，海上展台会随筹备进度丰富起来。',['worldFestival']),
 L('farm','home','庄园农场与动物园','GROW & CARE','♧',[-4,12,-60],[-10,1.9,-79],'full','六块菜地可播种、浇水、收获，农产品可以卖给茶会、做饮品与蛋糕。旁边住着小兔、猫咪与小鹿。',['farm','animals']),
 L('frenchgarden','home','法式花园与林荫道','THE FRENCH GARDEN','❧',[-98,33,26],[-64,3,-12],'full','低绿篱勾勒四座刺绣花坛，柑橘盆树、林荫步道与小树林围绕玫瑰盛开的海岸花园。',[]),
 L('foyer','home','双楼梯与观光电梯','THE GRAND ENTRANCE','♜',[1,8,-25],[0,6,-42],'ground','双楼梯环抱挑高中庭，水晶吊灯下的玻璃电梯连接上下层回廊。',['lift']),
 L('pool','home','头像泳池与滑梯','POOL CLUB','≈',[31,30,45],[0,2,14],'full','侧脸与弯曲马尾构成泳池，火烈鸟浮圈、白色池缘和弧形吧台围绕水面。',['slide']),
 L('living','home','临池弧形会客厅','SUNLIT LOUNGE','⌒',[1,6,2],[0,3.5,-6],'ground','连续曲面玻璃、成组奶油沙发、圆几、鲜花与柔软地毯，沿泳池展开。',[]),
 L('wardrobe','home','巨型衣橱与试衣塔','COUTURE ROTUNDA','♕',[-15,7,-.5],[-22,4.1,-8],'ground','两层环形衣橱、旋转楼梯、金色挂杆、手袋、礼盒与可更换服装的人偶。',['dress']),
 L('gallery','home','礼服与玩偶长廊','DRESSED TO DREAM','♧',[-20,7,-32],[-21,3.8,-47],'ground','拱形展示舱保留整套搭配。层叠亮片裙、蓝马甲粉格裙、红金礼服与同款小玩偶。',['dress','references']),
 L('salon','home','闪粉美甲沙龙','GLOSS & GLITTER','✧',[-21,7,8],[-28,3.4,3],'ground','四组美甲工作台、甲油陈列、奶油色座椅。为桌上的甲片挑选颜色与闪亮质感。',['nails']),
 L('kitchen','home','厨房与花艺餐厅','SWEET KITCHEN','♨',[-6,7,-12],[-10,3.5,-22],'ground','灶具、烤箱、粉色冰箱、操作岛台和甜品推车，通过大拱门连接圆桌餐厅。',['cupcake','cake']),
 L('piano','home','钢琴与玻璃展示厅','MUSIC SALON','♫',[27,6,2],[27,3.7,-5],'ground','白色三角钢琴、玻璃展示柜、休闲座席，旁边是独立饮品吧。',['piano']),
 L('bar','home','独立调饮吧','SIP SOMETHING PINK','♧',[27,4.9,-10.3],[25,3.5,-13],'ground','瓶罐、杯碟、金属高脚椅与几何吊灯；玻璃外的下午茶角朝向泳池。',['drink']),
 L('cafe','home','咖啡与甜品吧','THE PATISSERIE','☕',[-8,5.1,-7.8],[-12,3.4,-11],'ground','咖啡机、奶泡杯、玻璃搅拌机与层架甜品，面向会客厅的独立咖啡角。',['teaCafe','cupcake']),
 L('afternoontea','home','池畔下午茶','TEA BY THE POOL','❦',[-24,6.5,17],[-17,3,20],'full','条纹阳伞下的成组茶席，杯碟、花束与清透池景。',[]),
 L('swing','home','花环羽翼秋千','THE FLOWER SWING','♧',[13,12.4,1.2],[13,10.7,-7],'upper','轻盈花环、金色支架、悬吊座椅与羽翼装饰，点按钮轻轻摇摆。',['swing']),
 L('barbie','home','芭比主卧','BARBIE SUITE','♕',[-22,13,-37],[-23,10.3,-49],'upper','帷幔、皇冠、粉色床品、梳妆镜、衣橱与蝴蝶结裙人物。',['dress']),
 L('skipper','home','思琪房间','SKIPPER ROOM','♪',[-10,12.7,-38],[-10,10,-48],'upper','独立卧室，补充紫色床品、书架、桌面屏幕和窗边阅读座席。',[]),
 L('stacie','home','思佩房间','STACIE ROOM','✿',[10,12.7,-38],[10,10,-48],'upper','独立卧室，补充薄荷绿床品、画架、球类和日常收藏。',[]),
 L('kelly','home','Kelly与玩偶屋','KELLY ROOM','ʕ♡ʔ',[23,12.7,-38],[23,10,-47],'upper','小尺寸人物、仙子玩偶、泰迪熊与礼物，组成温柔的玩偶卧室。',['blocks']),
 L('bedroom','home','彩窗公主套房','THE CANOPY SUITE','❀',[-5,12,-9],[-10,10.3,-18],'upper','按彩色圆窗参考补充的客房：白金床架、帷幔、花瓣背板与软绵床尾凳。',[]),
 L('party','home','睡衣电影派对','A GIRLS NIGHT IN','✩',[7,13,-8],[4,10,-17],'upper','四套睡衣、四组床铺、投影银幕、零食、礼物与镜面迪斯科球。',['party']),
 L('gym','home','健身舞蹈与花环秋千','MOVE & SWING','♬',[19,13,-5],[17,10,-16],'upper','跑步机、单车、瑜伽垫、哑铃与芭蕾把杆，门外是花环羽翼秋千。',['swing']),
 L('spa','home','心形泡泡水疗','HEART SPA','♡',[21,7,-26],[22,3.2,-34],'ground','珍珠白池沿、花瓣泡泡、烛光与连续拱洞；另设独立浴缸浴室。',[]),
 L('bath','home','花香独立浴室','BUBBLES & BLOOMS','○',[-22,6.8,19],[-28,3.4,14],'ground','白色金脚浴缸、双台盆、灯泡镜、金色龙头与成组浴品。',[]),
 L('study','home','书房与个采会谈室','BOOKS & CONVERSATION','▤',[21,7,-44],[21,3.7,-54],'ground','整墙书籍、独立书桌与安静会谈角，保留清单中的两个用途。',[]),
 L('birthday','home','生日与红金礼服','CELEBRATE TOGETHER','♔',[-1,7,-41],[-5,3.6,-49],'ground','粉色三角钢琴、蛋糕、气球与红金礼服人物，旁边展示冬日童话微缩街景。',['piano','cake']),
 L('terrace','home','花拱露台晚宴','BENEATH THE FLOWERS','❦',[-20,14,7],[-29,10,-.2],'upper','玫瑰花拱、圆桌蛋糕、白色餐椅、长吧台与垂落星灯。',['night']),
 L('beach','beach','沙滩与粉色假日','MALIBU AFTERNOON','☼',[39,19,76],[0,1,46],'full','条纹遮阳伞、躺椅、野餐、冲浪板和帆船。沿花拱步道走向海岸。',['sandcastle','blocks','drink','picnic']),
 L('drive','beach','敞篷跑车兜风','COASTAL DRIVE','⌁',[50,7,-10],[41,1.8,-17],'full','坐进粉色敞篷跑车，沿独立环岛车道经过入口雕塑、花园和海岸。',['drive']),
 L('picnic','beach','草坪与沙滩野餐','PICNIC CLUB','✿',[-2,6,57],[-3,1.7,50],'full','格纹野餐布、藤篮、蛋糕、杯碟、贝壳与玩偶，旁边就是浪花。',['picnic']),
 L('pier','beach','珍珠码头','THE DIVE PORTAL','♆',[32,7,81],[23,2,72],'full','沿木码头走到发光圆环，进入海底美人鱼的世界。',['dive','deepEnter']),
 L('reef','underwater','珊瑚花园','CORAL GARDENS','♆',[25,-19,151],[0,-27,120],'full','分枝珊瑚、海柳、海草、热带鱼、水母与海龟，在蓝色光束中层层展开。',['mermaid']),
 L('mermaid','underwater','美人鱼与闪亮鱼尾','MERMAID DREAMS','✧',[-.2,-24,130],[-4,-27,123],'full','卷发、贝壳上衣、亮片鳞尾与轻透尾鳍；与美人鱼一起穿过珊瑚。',['mermaid']),
 L('pearl','underwater','贝壳王座与珍珠','THE PEARL THRONE','○',[8,-27,117],[0,-31,109],'full','带细密放射贝纹的双层贝壳，打开上盖，露出柔亮珍珠。',['pearl']),
 L('palace','underwater','海底水晶宫','OCEANA PALACE','♜',[18,-17,114],[0,-27,101],'full','通透的水晶尖塔、珍珠拱廊、贝壳穹顶与发光通路。',[]),
 L('sky','sky','云端花园','ABOVE THE CLOUDS','☁',[-13,45,-16],[-34,36,-40],'full','彩虹、热气球与云朵托起的花园。白金凉亭里，茶点已经准备好了。',['balloon']),
 L('balloon','sky','热气球与彩虹','UP UP & AWAY','◉',[52,29,-17],[35,25,-37],'full','从条纹热气球俯看整座豪宅，越过粉色屋顶与一望无际的海。',['balloon']),
 L('skycity','sky','水晶天空之城','THE CRYSTAL KINGDOM','♜',[-17,98,2],[-85,49,-82],'full','高低错落的尖塔、尖拱彩窗、山墙屋顶与王室大厅，云桥通向天鹅湖和古树精灵森林。',['pegasus','wings','references']),
 L('crystal','sky','水晶宫与糖果公主','A PALACE IN THE CLOUDS','♕',[-80,49,-77],[-85,45,-92],'full','镀金穹顶肋骨、十二瓣星纹地面、吊灯与柔纱舞裙。糖果公主在宫殿里等你。',[]),
 L('theater','sky','十二公主芭蕾剧院','TWELVE DANCING PRINCESSES','♫',[-113,50,-56],[-114,45,-75],'full','十二套不同配色的舞裙、金色台口、酒红幕布、木舞台与观众席，后台还有备用舞鞋。',['ballet']),
 L('swanlake','sky','天鹅湖与森林','SWAN LAKE','♧',[-61,56,-33],[-83,44,-57],'full','白天鹅在珍珠色池岸间游弋，芭蕾舞者、花丛小兔与小鹿散落在云端森林。',[]),
 L('fairygarden','sky','花仙子与神秘之门','THE SECRET FLOWER GARDEN','❀',[-45,51,-49],[-57,46,-70],'full','可居住的巨大花朵、花瓣床、透明翅脉、古树彩色玻璃门，花灯沿小径发光。',['portal']),
 L('forest','sky','古树精灵森林','THE ENCHANTED FOREST','❧',[-124,70,-53],[-154,48,-94],'full','疏密交织的枝叶、斑驳阳光与萤火虫，溪流绕过暖窗树屋、宝石王冠亭和孔雀。',['portal']),
 L('treehouse','sky','古树里的精灵村','THE TREEHOUSE VILLAGE','♧',[-151,57,-89],[-166,50,-102],'full','顺着古树生长的花瓣屋顶、暖光叶窗、根系拱肋与盘旋木阶。',[]),
 L('crown','sky','王冠珍藏亭','THE CROWN JEWEL','♕',[-150,46.8,-83],[-155,45.6,-89],'full','金色穹顶下的玻璃展柜，宝石王冠在丝绒衬垫上缓缓转动，珍珠与切面映出暖光。',[]),
 L('stream','sky','溪桥与萤火秘境','THE FIREFLY CREEK','≈',[-134,49,-81],[-144,44,-95],'full','清浅溪水、苔石瀑布与拱桥穿过森林，岸边有孔雀、小兔和漂浮的小精灵。',[]),
 L('skyhall','sky','城堡王室大厅','THE ROYAL HALL','♜',[-85,49,-89],[-85,46,-96],'full','高挑尖拱入口、吊灯、雕饰圆毯与公主茶席，城堡有完整的室内空间。',[]),
 L('library','sky','星光图书馆与公主课堂','THE ROYAL ACADEMY','▤',[-56,49,-82],[-57,45,-102],'full','两层书墙、阅读精灵、悬浮光球、粉色课桌，以及皇冠、书本和铅笔等桌面细节。',[]),
 L('astronaut','sky','宇航员星际观测台','YOU CAN BE ANYTHING','✧',[-49,57,-77],[-57,54,-85],'full','透明头盔、生命支持背包、望远镜与环绕的小行星，让魔法世界也容得下太空梦想。',[]),
 L('pegasus','sky','白色飞马之旅','WINGS ABOVE THE WORLD','♘',[-90,62,-48],[-103,57,-65],'full','修长收细的颈部、细束鬃毛、分层羽翼与珍珠鞍具。点击飞马振翅或舒展双翼，近看羽毛细节。',['pegasus','wings']),
 L('sleigh','sky','圣诞老人的麋鹿雪橇','CHRISTMAS IN THE SKY','✶',[67,51,9],[49,44,-12],'full','六只麋鹿牵引红金雪橇，圣诞老人和礼物穿过飘雪。进入这里会打开雪季。',['sleigh','snow']),
 L('carousel','beach','花卉旋转木马','THE SILENT CAROUSEL','♘',[102,17,16],[83,5,-5],'full','薄荷奶油色穹顶、玫瑰雕饰、金色螺旋柱与十匹上下起伏的白马，旁边有小象和花园滑梯。',['carousel']),
 L('carriage','beach','珍珠马车与小电动车','A FAIRYTALE ARRIVAL','♕',[72,8,29],[60,3,14],'full','双马牵引的白金马车、花雕车厢、辐条车轮、踏步、珍珠灯和粉色小电动车。',['carriageDoor']),
 L('royalcarriage','beach','华丽舞会马车','THE ROYAL BALL','♔',[117,8,-7],[106,3,-19],'full','黑金车架、酒红帷幕、皇冠顶饰与雕花车轮，保留舞会准备清单中的正式马车版本。',['royalDoor']),
 L('road','beach','远山公路与粉色大巴','THE PINK ROAD TRIP','⌁',[132,26,-71],[83,3,-105],'full','曲折粉色公路穿过仙人掌和层叠远山，粉色观景大巴连接庄园与山丘小亭。',['bus']),
 L('hill','beach','山丘上的彩色艺术亭','DREAM OUTSIDE THE LINES','◇',[85,15,-88],[71,8,-103],'full','粉、蓝、黄相交的倾斜屋面，绿丘长阶、室内地毯和小猫，为世界留下一处奇妙角落。',[]),
 L('flowerfield','beach','风车花田与双人单车','FLOWERS FOR TWO','✿',[88,11,54],[72,2,38],'full','成排花田、奶油风车、粉色双人自行车与海风。',[]),
 L('yacht','beach','粉色游艇假日','PEARL YACHT CLUB','≈',[58,11,99],[45,2.5,84],'full','粉色船体、木纹甲板、金属护栏、双层船舱、救生圈与船长，在珍珠码头外出航。',['yacht']),
 L('christmas','beach','圣诞树与童话街区','CHRISTMAS WISHES','✶',[109,16,-16],[87,5,-44],'full','点击圣诞树旋转或暂停三层星光环。礼物、花环、暖窗街屋与冬日合唱团环绕树下。',['treeHalo','snow','night']),
 L('deepcloset','wardrobe','海底地下衣帽宫','THE GRAND UNDERSEA WARDROBE','♕',[85,-39.5,130],[85,-41,106],'full','独立干燥的海底衣帽宫：挑空长廊、双弧形楼梯、鞋墙、上层回廊和中央珠宝岛台。',['deepDress','deepUpper','deepLift','references']),
 L('shoehall','wardrobe','整墙鞋履与取物梯','A THOUSAND LITTLE DREAMS','♧',[91,-36,109],[85,-38,95.5],'full','九层鞋履陈列、靴子、缎面高跟鞋、金属取物梯、波点礼盒与折叠衣物。',[]),
 L('couture','wardrobe','海景梳妆与高级服装','THE COUTURE ATELIER','✧',[86.6,-41,129.5],[85,-42.4,124.2],'full','碎花礼服、蓝灰束腰、蕾丝帽、珠宝与花束；心形梳妆镜、粉色软凳和折叠屏风布置在海景前。',['references']),
 L('careers','wardrobe','职业与公主造型展舱','EVERY ROLE IS A DREAM','♔',[96,-39,133],[94,-42,119],'full','飞行员、厨师、骑手、宇航员与四种礼服，按完整服装、配饰、鞋履组合陈列。',[]),
 L('deepaccess','underwater','海底观景通道与电梯','THE OCEAN GALLERY','○',[52,-23,112],[59,-31,99],'full','水晶宫一侧的干式观景通道通往海底电梯，再进入下沉的巨大衣帽宫。',['deepLift']),
 L('submarine','underwater','粉色探索潜艇','EXPLORE THE BLUE','♆',[58,-18,157],[45,-23,146],'full','圆形舷窗、潜望镜、推进器、翼片、探照灯与驾驶员，乘潜艇看更远处的海洋。',['submarine']),
 L('whale','underwater','鲸鱼与海豚巡游','OCEAN COMPANIONS','≈',[-18,-7,162],[-44,-16,130],'full','大鲸鱼、海豚、小丑鱼、银亮带鱼和成片海草，沿珊瑚礁外缘缓缓游动。',[]),
 L('town','beach','公路尽头的花港小镇','ROSE HARBOR TOWN','⌂',[179,21,-36],[146,4,-68],'full','连贯路基承托棕色道路，连接小镇的咖啡店、花店、玩偶工坊、书屋和喷泉广场。',['townDoors','bus']),
 L('liner','beach','梦幻远洋邮轮与船队','DREAM OCEAN LINER','⚓',[158,29,230],[84,6,185],'full','四烟囱大邮轮、分层甲板、救生艇与海风舞厅，五艘粉色游艇沿船尾排开。',['linerCruise','linerHorn','linerLights','linerDeck']),
 L('linerDeck','beach','邮轮甲板与海风舞厅','THE OCEAN BALLROOM','♫',[71,11,197],[77,6,184],'full','玻璃顶棚下的海风舞厅，丝缎礼服、白色钢琴与水晶灯，在晚霞里听海。',['linerHorn','linerLights','piano']),
 L('deepUpper','wardrobe','衣帽宫二层回廊','THE UPPER COUTURE GALLERY','♕',[95,-35.5,121],[94,-36,101],'full','走到二层回廊，近看分层衣柜、鞋履、礼盒和挑空长廊。',['deepEnter','deepDress'])

];
