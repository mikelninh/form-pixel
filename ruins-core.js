export const TILE=32,W=63,H=32;
export const rooms=[[2,19,15,30],[3,3,19,15],[25,3,40,17],[45,8,61,29],[21,23,35,30]];
export const spawn={x:272,y:848};
export const markers={home:spawn,first:{x:336,y:304},second:{x:1008,y:336},boss:{x:1696,y:624},secret:{x:880,y:848}};
export const classes={sword:{name:'Schwert',skill:'Sonnenschwung',range:92,cooldown:.48,color:'#f6c97d',hint:'E: Schwung · Leertaste: Parierdash'},mage:{name:'Magie',skill:'Gezeitenstoß',range:158,cooldown:1.05,color:'#b5a6ff',hint:'E: Stoßwelle · Gegner gegen Mauern drücken'},bow:{name:'Bogen',skill:'Sonnenpfeil',range:330,cooldown:.5,color:'#a5e0b3',hint:'E halten & lösen: aufgeladener Schuss'}};
const base=Array.from({length:H},()=>Array(W).fill(0));
for(const [a,b,c,d] of [...rooms,[8,14,11,21],[18,8,26,11],[39,11,46,14]])for(let y=b;y<d;y++)for(let x=a;x<c;x++)base[y][x]=1;
export const pillars=[[5,5],[16,5],[5,12],[16,12],[27,5],[37,5],[27,14],[37,14],[47,10],[58,10],[47,26],[58,26]];
for(const [x,y]of pillars)base[y][x]=2;
export function tile(s,x,y){if(x<0||x>=W||y<0||y>=H)return 0;if(s.choice==='garden'&&x>=14&&x<22&&y>=25&&y<28)return 1;if(s.choice==='guardian'&&x>=30&&x<33&&y>=16&&y<24)return 1;if(x===22&&y>=8&&y<11&&!s.cleared.includes(1))return 3;if(x===42&&y>=11&&y<14&&!s.cleared.includes(2))return 3;return base[y][x]}
export function walkable(s,x,y,r=9){return[[-r,-r],[r,-r],[r,r],[-r,r]].every(([a,b])=>tile(s,Math.floor((x+a)/TILE),Math.floor((y+b)/TILE))===1)}
export function sight(s,a,b){const d=Math.hypot(a.x-b.x,a.y-b.y);for(let p=8;p<d;p+=8)if(tile(s,Math.floor((a.x+(b.x-a.x)*p/d)/32),Math.floor((a.y+(b.y-a.y)*p/d)/32))!==1)return false;return true}
export function pathTo(s,to){const start=[Math.floor(s.x/32),Math.floor(s.y/32)],end=[Math.floor(to.x/32),Math.floor(to.y/32)],key=(x,y)=>y*W+x;if(tile(s,...end)!==1)return[];const q=[start],prev=new Map([[key(...start),null]]);let found=false;for(let i=0;i<q.length;i++){const [x,y]=q[i];if(x===end[0]&&y===end[1]){found=true;break}for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(tile(s,nx,ny)===1&&!prev.has(k)){q.push([nx,ny]);prev.set(k,[x,y])}}}if(!found)return[];let cur=end,out=[];while(cur){out.push({x:(cur[0]+.5)*32,y:(cur[1]+.5)*32});cur=prev.get(key(...cur))}out.reverse();out.shift();if(walkable(s,to.x,to.y))out.push({...to});return out}
export function roomAt(p){for(let i=0;i<rooms.length;i++){const[a,b,c,d]=rooms[i];if(p.x>=a*32&&p.x<c*32&&p.y>=b*32&&p.y<d*32)return i}return -1}
function enemy(id,type,room,x,y){return{id,type,room,x,y,home:{x,y},hp:type==='boss'?40:type==='charger'?7:6,maxHp:type==='boss'?40:type==='charger'?7:6,state:'idle',timer:1+id*.12,aim:{x,y},flash:0,stun:0,cycle:0,marks:[],vulnerable:0}}
export function createRun(){return{...spawn,phase:'intro',name:'Reisender',role:'sword',choice:'garden',time:0,direction:0,moving:false,path:[],hp:7,maxHp:7,invulnerable:0,cooldown:0,dash:0,dashCooldown:0,dashX:0,dashY:1,parry:0,empowered:0,charge:0,charging:false,cleared:[],checkpoint:0,secret:false,shield:false,attacks:0,hits:0,parries:0,defeats:0,returned:false,room:0,visited:[0],enemies:[enemy(0,'charger',1,368,272),enemy(1,'charger',1,480,368),enemy(2,'charger',2,960,352),enemy(3,'shooter',2,1152,224),enemy(4,'shooter',2,1152,448),enemy(5,'boss',3,1696,560)],shots:[],events:[]}}
export function nextTarget(s){if(s.cleared.includes(3))return markers.home;return !s.cleared.includes(1)?markers.first:!s.cleared.includes(2)?markers.second:markers.boss}
export function objective(s){if(s.returned)return 'Das Herz leuchtet zu Hause. Eure nächste Geschichte wartet.';if(s.cleared.includes(3))return 'Bring das befreite Herz zurück in deinen Zufluchtsort.';return !s.cleared.includes(1)?'Dornenhalle: Lies den roten Anlauf und weiche seitlich aus.':!s.cleared.includes(2)?'Spiegelgarten: Bewege dich zwischen den Schüssen.':'Herzkammer: Verlasse die Kreise. Triff den geöffneten Kern.'}
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function emit(s,type,data={}){s.events.push({type,...data})}
function damageEnemy(s,e,amount){if(e.hp<=0)return;if(e.type==='boss'&&e.state!=='recover')amount=Math.max(1,Math.floor(amount*.4));e.hp=Math.max(0,e.hp-amount);e.flash=.16;emit(s,'hitEnemy',{x:e.x,y:e.y,amount,boss:e.type==='boss'});if(!e.hp){e.state='dead';emit(s,'kill',{x:e.x,y:e.y,enemyType:e.type});}}
export function attack(s,power=0){if(s.phase!=='play'||s.cooldown>0)return false;const c=classes[s.role];s.cooldown=c.cooldown*(s.choice==='garden'?.85:1);s.attacks++;let candidates=s.enemies.filter(e=>e.hp>0&&dist(s,e)<=c.range&&sight(s,s,e)&&e.room===roomAt(s)).sort((a,b)=>dist(s,a)-dist(s,b));let to={x:s.x+Math.sin(s.direction*Math.PI/4)*c.range,y:s.y+Math.cos(s.direction*Math.PI/4)*c.range};if(candidates.length){to={x:candidates[0].x,y:candidates[0].y};s.direction=(Math.round(Math.atan2(to.x-s.x,to.y-s.y)/(Math.PI/4))+8)%8}
 if(s.role==='bow'){const dx=to.x-s.x,dy=to.y-s.y,d=Math.hypot(dx,dy)||1;s.shots.push({x:s.x,y:s.y,vx:dx/d*620,vy:dy/d*620,life:c.range/620,owner:'hero',damage:power>.65?7:3,pierce:power>.65?2:1,hit:[],charged:power>.65});}
 else for(const e of candidates){damageEnemy(s,e,s.role==='sword'?(s.empowered>0?7:3):4);if(s.role==='mage'&&e.type!=='boss'){const d=dist(s,e)||1,dx=(e.x-s.x)/d,dy=(e.y-s.y)/d;let wall=false;for(let i=0;i<15;i++){if(walkable(s,e.x+dx*5,e.y+dy*5,12)){e.x+=dx*5;e.y+=dy*5}else{wall=true;break}}e.stun=.7;e.state='idle';e.timer=1;if(wall){damageEnemy(s,e,3);e.stun=1.5;emit(s,'wall',{x:e.x,y:e.y})}}}
 emit(s,'attack',{x:s.x,y:s.y,to,role:s.role,power,empowered:s.empowered>0});s.empowered=0;
 if(!s.secret&&dist(s,markers.secret)<85){s.secret=true;s.maxHp=8;s.hp=8;s.shield=s.choice==='guardian';emit(s,'secret')}
 return true;
}
export function beginCharge(s){if(s.phase!=='play')return;if(s.role==='bow'&&s.cooldown<=0){s.charging=true;s.charge=0}else if(s.role!=='bow')attack(s)}
export function releaseCharge(s){if(s.charging){const p=s.charge;s.charging=false;s.charge=0;attack(s,p)}}
export function dash(s,input={x:0,y:0}){if(s.phase!=='play'||s.dashCooldown>0)return false;let dx=input.x,dy=input.y;if(!dx&&!dy&&s.path.length){dx=s.path[0].x-s.x;dy=s.path[0].y-s.y}if(!dx&&!dy){dx=Math.sin(s.direction*Math.PI/4);dy=Math.cos(s.direction*Math.PI/4)}const n=Math.hypot(dx,dy)||1;s.dashX=dx/n;s.dashY=dy/n;s.dash=.24;s.dashCooldown=1.1;s.parry=s.role==='sword'?.3:0;s.invulnerable=Math.max(s.invulnerable,.24);emit(s,'dash',{x:s.x,y:s.y});return true}
function hurt(s,source){if(s.parry>0){s.parry=0;s.empowered=3;s.parries++;if(source?.hp>0){source.stun=1.5;source.state='recover';source.timer=1.5}emit(s,'parry',{x:s.x,y:s.y});return}if(s.invulnerable>0)return;if(s.shield){s.shield=false;s.invulnerable=1;emit(s,'shield');return}s.hp--;s.hits++;s.invulnerable=1.1;s.charging=false;s.charge=0;emit(s,'hurt',{x:s.x,y:s.y});if(s.hp<=0){s.phase='down';s.path=[];s.defeats++;emit(s,'down')}}
export function retry(s){if(s.phase!=='down')return;const p=s.checkpoint===2?{x:1008,y:464}:s.checkpoint===1?{x:336,y:368}:spawn;s.x=p.x;s.y=p.y;s.hp=s.maxHp;s.phase='play';s.shots=[];s.invulnerable=1.5;s.shield=s.choice==='guardian';s.path=[];for(const e of s.enemies)if(!s.cleared.includes(e.room)){e.hp=e.maxHp;Object.assign(e,e.home);e.state='idle';e.timer=1;e.stun=0;e.marks=[]}emit(s,'retry')}
function move(s,p,dx,dy,r=9){if(walkable(s,p.x+dx,p.y,r))p.x+=dx;if(walkable(s,p.x,p.y+dy,r))p.y+=dy}
export function step(s,dt,input={x:0,y:0}){if(s.phase!=='play')return[];dt=Math.min(.04,Math.max(0,dt));s.time+=dt;for(const k of ['cooldown','dashCooldown','parry','invulnerable','empowered'])s[k]=Math.max(0,s[k]-dt);if(s.charging)s.charge=Math.min(1.2,s.charge+dt);let dx=input.x,dy=input.y;if(dx||dy)s.path=[];else if(s.path.length){const p=s.path[0],d=dist(s,p);if(d<5)s.path.shift();else{dx=(p.x-s.x)/d;dy=(p.y-s.y)/d}}
 const n=Math.hypot(dx,dy);s.moving=n>0||s.dash>0;if(s.dash>0){s.dash=Math.max(0,s.dash-dt);move(s,s,s.dashX*470*dt,s.dashY*470*dt)}else if(n){s.direction=(Math.round(Math.atan2(dx,dy)/(Math.PI/4))+8)%8;move(s,s,dx/n*(s.charging?87:156)*dt,dy/n*(s.charging?87:156)*dt)}
 s.room=roomAt(s);if(s.room>=0&&!s.visited.includes(s.room)){s.visited.push(s.room);emit(s,'enter',{room:s.room})}
 for(const e of s.enemies){e.flash=Math.max(0,e.flash-dt);if(e.hp<=0||e.room!==s.room)continue;if(e.stun>0){e.stun-=dt;continue}e.timer-=dt;const d=dist(s,e);
 if(e.type==='boss'){
  if(e.state==='idle'&&e.timer<=0){e.state='windup';e.timer=e.hp<=20?1.05:1.35;e.cycle++;e.marks=[{x:s.x,y:s.y,r:70}];if(e.hp<=20)e.marks.push({x:s.x+105,y:s.y+55,r:61},{x:s.x-105,y:s.y-55,r:61});emit(s,'warning',{boss:true})}
  else if(e.state==='windup'&&e.timer<=0){for(const m of e.marks)if(dist(s,m)<m.r+8)hurt(s,e);emit(s,'slam',{marks:e.marks});e.state='recover';e.timer=e.hp<=20?1.6:2.1}
  else if(e.state==='recover'&&e.timer<=0){e.state='idle';e.timer=.65;e.marks=[]}
 }else if(e.type==='charger'){
  if(e.state==='idle'){if(d>95&&sight(s,e,s))move(s,e,(s.x-e.x)/d*40*dt,(s.y-e.y)/d*40*dt,12);if(e.timer<=0&&d<280&&sight(s,e,s)){e.state='windup';e.timer=.9;e.aim={x:s.x,y:s.y};}}
  else if(e.state==='windup'&&e.timer<=0){const ax=e.aim.x-e.x,ay=e.aim.y-e.y,n=Math.hypot(ax,ay)||1;e.vx=ax/n*340;e.vy=ay/n*340;e.state='charge';e.timer=.53}
  else if(e.state==='charge'){move(s,e,e.vx*dt,e.vy*dt,12);if(dist(s,e)<28)hurt(s,e);if(e.timer<=0){e.state='recover';e.timer=1.1}}
  else if(e.state==='recover'&&e.timer<=0){e.state='idle';e.timer=.6}
 }else{
  if(e.state==='idle'&&e.timer<=0&&d<490&&sight(s,e,s)){e.state='windup';e.timer=1.1;e.aim={x:s.x,y:s.y}}
  else if(e.state==='windup'&&e.timer<=0){const ax=e.aim.x-e.x,ay=e.aim.y-e.y,n=Math.hypot(ax,ay)||1;s.shots.push({x:e.x,y:e.y,vx:ax/n*175,vy:ay/n*175,life:3,owner:'enemy',source:e.id});e.state='recover';e.timer=1.5}
  else if(e.state==='recover'&&e.timer<=0){e.state='idle';e.timer=.7}
 }}
 for(const p of s.shots){p.life-=dt;const parts=Math.max(1,Math.ceil(Math.hypot(p.vx,p.vy)*dt/8));for(let i=0;i<parts&&p.life>0;i++){p.x+=p.vx*dt/parts;p.y+=p.vy*dt/parts;if(!walkable(s,p.x,p.y,2)){p.life=0;break}if(p.owner==='enemy'){if(dist(s,p)<17){hurt(s,s.enemies.find(e=>e.id===p.source));p.life=0}}else for(const e of s.enemies)if(e.hp>0&&!p.hit.includes(e.id)&&dist(p,e)<(e.type==='boss'?43:22)){p.hit.push(e.id);damageEnemy(s,e,p.damage);p.pierce--;if(p.pierce<=0){p.life=0;break}}}}
 s.shots=s.shots.filter(p=>p.life>0);
 for(const room of [1,2,3])if(!s.cleared.includes(room)&&s.enemies.filter(e=>e.room===room).every(e=>e.hp<=0)){s.cleared.push(room);s.checkpoint=Math.max(s.checkpoint,room===3?2:room);s.hp=s.maxHp;s.shield=s.choice==='guardian';s.shots=s.shots.filter(p=>p.owner==='hero');emit(s,'clear',{room})}
 if(s.cleared.includes(3)&&!s.returned&&dist(s,spawn)<65){s.returned=true;emit(s,'win')}
 return drain(s);
}
export function drain(s){const e=s.events;s.events=[];return e}
export function serialize(s){return JSON.stringify({version:1,name:s.name,role:s.role,choice:s.choice,cleared:s.cleared,secret:s.secret,returned:s.returned,time:s.time,hits:s.hits,parries:s.parries,defeats:s.defeats})}
export function restore(raw){const s=createRun();try{const p=JSON.parse(raw);if(p?.version!==1)return s;s.name=typeof p.name==='string'?p.name.slice(0,24):s.name;if(Object.hasOwn(classes,p.role))s.role=p.role;if(['garden','guardian'].includes(p.choice))s.choice=p.choice;for(const room of [1,2,3]){if(Array.isArray(p.cleared)&&p.cleared.includes(room)&&(room===1||s.cleared.includes(room-1)))s.cleared.push(room)}s.secret=p.secret===true;s.maxHp=s.secret?8:7;s.hp=s.maxHp;s.shield=s.choice==='guardian';s.returned=s.cleared.includes(3)&&p.returned===true;for(const k of ['time','hits','parries','defeats'])s[k]=Number.isFinite(p[k])?Math.max(0,p[k]):0;s.checkpoint=Math.min(2,s.cleared.length);const pos=s.returned?spawn:s.checkpoint===2?{x:1008,y:464}:s.checkpoint===1?{x:336,y:368}:spawn;Object.assign(s,pos);for(const e of s.enemies)if(s.cleared.includes(e.room)){e.hp=0;e.state='dead'}return s}catch{return s}}

