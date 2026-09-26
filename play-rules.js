// Gesture evidence is accumulated from movement, never elapsed time alone.
export function angleTravel(previous,current){
 if(previous===null)return 0;
 return Math.abs(Math.atan2(Math.sin(current-previous),Math.cos(current-previous)));
}
export function paintCell(x,y,columns=6,rows=10){
 if(x<0||x>1||y<0||y>1)return -1;
 return Math.min(rows-1,Math.floor(y*rows))*columns+Math.min(columns-1,Math.floor(x*columns));
}
export function addBrush(cells,x,y,radius=.105){
 for(let row=0;row<10;row++)for(let col=0;col<6;col++){
  const dx=((col+.5)/6-x)*.7,dy=(row+.5)/10-y;
  if(dx*dx+dy*dy<radius*radius)cells.add(row*6+col);
 }
 return cells.size/60;
}
export function lerpStroke(a,b,visit){
 const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/.024));
 for(let i=1;i<=n;i++)visit(a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n);
}
export function insideDrop(point,target,radius){return point.distanceTo(target)<=radius;}
export function fitsOrder(selection){return selection.style==='gown'&&selection.color==='gold'&&selection.accessory==='crown';}
export function proofComplete(kind,r){
 if(!r||r.scene!==true||!Number.isFinite(r.score))return false;
 switch(kind){
  case 'bake':return r.ingredients===4&&r.turns>=3&&r.baked===true&&r.icing>=.75&&r.berries>=5;
  case 'style':return fitsOrder(r)&&r.fitted===true&&r.dyeCoverage>=.7&&r.crowned===true;
  case 'nails':return r.painted===5&&r.color==='violet'&&r.finish==='glitter'&&r.coverage?.length===5&&r.coverage.every(x=>x>=.72)&&r.gems>=5;
  case 'memory':return r.rounds===3;
  case 'rhythm':case 'finalDance':case 'partyDance':return r.hits>=8&&r.total===12;
  case 'gifts':return r.correct===3&&r.wrapped===3;
  case 'carriage':return r.opened===true&&r.distance>=8;
  case 'pearl':return r.cleaned>=5&&r.opened===true;
  case 'portal':return r.traced>=5&&r.crossed===true;
  case 'treeLights':return r.connected===3&&r.rotation>=1;
  default:return false;
 }
}
