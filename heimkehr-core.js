import {TILE,W,H,map,rooms,pillars,spawn,pathTo,walkable,dash,sentinels} from './dungeon-core.js';
export {TILE,W,H,map,rooms,pillars,spawn,pathTo,walkable,dash,sentinels};
export const sites={beacon:{x:208,y:176},lumi:{x:1104,y:272},core:{x:752,y:752},home:spawn,secret:{x:432,y:304}};
export const classes={sword:{name:'Schwert',skill:'Sonnenschwung',range:90,cooldown:.7,color:'#f8cd85'},mage:{name:'Magie',skill:'Sternenwelle',range:155,cooldown:2.5,color:'#bba5ff'},bow:{name:'Bogen',skill:'Lichtpfeil',range:280,cooldown:1.15,color:'#90e2b1'}};
export const motives={home:'Ein Zuhause finden',light:'Licht zurückbringen',mystery:'Ein Geheimnis lösen'};
export function createJourney(){return{...spawn,phase:'intro',direction:0,time:0,dash:0,cooldown:0,invulnerable:0,hits:0,distance:0,path:[],moving:false,role:'sword',name:'Reisender',motive:'home',beacon:false,rescued:false,core:false,secret:false,choice:null,abilityCooldown:0,dispersed:[0,0],journal:[],pulse:0,arrival:false};}
const near=(s,p,r)=>Math.hypot(s.x-p.x,s.y-p.y)<r;
function remember(s,id){if(!s.journal.includes(id))s.journal.push(id)}
export function target(s){return !s.beacon?'beacon':!s.rescued?'lumi':!s.core?'core':'home'}
export function objective(s){return s.choice?(s.choice==='garden'?'Dein Garten lebt. Dein Licht lädt doppelt so schnell.':'Der Wächter schützt euch. Die Irrlichter sind friedlich.'):!s.beacon?'Wecke die Lichtquelle im Norden mit deiner Fähigkeit.':!s.rescued?'Löse Lumis Siegel im Osten mit deiner Fähigkeit.':!s.core?'Finde den Energiekern im südlichen Maschinenraum.':'Bring den Kern zum goldenen Kreis nach Hause.'}
function sight(a,b){const d=Math.hypot(a.x-b.x,a.y-b.y);for(let p=8;p<d;p+=8){const x=a.x+(b.x-a.x)*p/d,y=a.y+(b.y-a.y)*p/d;if(map[Math.floor(y/TILE)]?.[Math.floor(x/TILE)]!==1)return false}return true}
export function ability(s){if(s.phase!=='explore'||s.abilityCooldown>0)return[];const c=classes[s.role];s.abilityCooldown=c.cooldown*(s.choice==='garden'?.5:1);s.pulse=.5;const events=[{type:'ability',x:s.x,y:s.y,role:s.role}];
 let enemies=sentinels(s.time).map((e,i)=>({...e,i,d:Math.hypot(s.x-e.x,s.y-e.y)})).filter(e=>e.d<c.range&&s.dispersed[e.i]<=0&&sight(s,e)).sort((a,b)=>a.d-b.d);
 if(s.role==='bow')enemies=enemies.slice(0,1);
 for(const e of enemies){s.dispersed[e.i]=7;events.push({type:'disperse',...e});if(s.role==='bow'){events[0].to={x:e.x,y:e.y};s.direction=(Math.round(Math.atan2(e.x-s.x,e.y-s.y)/(Math.PI/4))+8)%8;}}
 // Shared lantern interaction keeps every visual model and class equally viable.
 if(!s.beacon&&near(s,sites.beacon,78)){s.beacon=true;remember(s,'beacon');events.push({type:'beacon'})}
 else if(s.beacon&&!s.rescued&&near(s,sites.lumi,78)){s.rescued=true;remember(s,'lumi');events.push({type:'rescue'})}
 else if(s.rescued&&!s.core&&near(s,sites.core,78)){s.core=true;remember(s,'core');events.push({type:'core'})}
 if(!s.secret&&near(s,sites.secret,85)){s.secret=true;remember(s,'secret');events.push({type:'secret'})}
 return events;
}
export function choose(s,choice){if(s.phase!=='explore'||s.choice||!s.core||!s.rescued||!near(s,spawn,85)||!['garden','guardian'].includes(choice))return false;s.choice=choice;remember(s,choice);s.path=[];return true}
export function step(s,dt,input={x:0,y:0}){if(s.phase!=='explore')return[];dt=Math.max(0,Math.min(.04,dt));s.time+=dt;for(const k of ['dash','cooldown','invulnerable','abilityCooldown','pulse'])s[k]=Math.max(0,s[k]-dt);s.dispersed=s.dispersed.map(n=>Math.max(0,n-dt));let dx=input.x,dy=input.y;const events=[];
 if(dx||dy)s.path=[];else if(s.path.length){const p=s.path[0],d=Math.hypot(p.x-s.x,p.y-s.y);if(d<4)s.path.shift();else{dx=(p.x-s.x)/d;dy=(p.y-s.y)/d}}
 const len=Math.hypot(dx,dy);s.moving=len>0;if(len){dx/=len;dy/=len;s.direction=(Math.round(Math.atan2(dx,dy)/(Math.PI/4))+8)%8;const travel=(s.dash>0?410:135)*dt,ox=s.x,oy=s.y;if(walkable(s.x+dx*travel,s.y))s.x+=dx*travel;if(walkable(s.x,s.y+dy*travel))s.y+=dy*travel;s.distance+=Math.hypot(s.x-ox,s.y-oy)}
 if(s.choice!=='guardian'&&s.invulnerable===0&&s.dash===0)for(const [i,e]of sentinels(s.time).entries())if(s.dispersed[i]<=0&&near(s,e,22)){s.hits++;s.invulnerable=1.7;s.path=[];events.push({type:'hit',x:s.x,y:s.y});break}
 if(s.core&&!s.choice&&!s.arrival&&near(s,spawn,65)){s.arrival=true;s.path=[];events.push({type:'choose'})}return events;
}
export function serialize(s){return JSON.stringify({version:1,name:s.name,role:s.role,motive:s.motive,x:s.x,y:s.y,time:s.time,hits:s.hits,beacon:s.beacon,rescued:s.rescued,core:s.core,secret:s.secret,choice:s.choice,journal:s.journal})}
export function restore(raw){const s=createJourney();try{const p=JSON.parse(raw);if(p?.version!==1)return s;s.name=typeof p.name==='string'?p.name.slice(0,24):s.name;s.role=Object.hasOwn(classes,p.role)?p.role:'sword';s.motive=Object.hasOwn(motives,p.motive)?p.motive:'home';s.beacon=p.beacon===true;s.rescued=s.beacon&&p.rescued===true;s.core=s.rescued&&p.core===true;s.secret=p.secret===true;s.choice=s.core&&['garden','guardian'].includes(p.choice)?p.choice:null;s.time=Number.isFinite(p.time)?Math.max(0,p.time):0;s.hits=Number.isFinite(p.hits)?Math.max(0,p.hits):0;if(Number.isFinite(p.x)&&Number.isFinite(p.y)&&walkable(p.x,p.y)){s.x=p.x;s.y=p.y}for(const [id,ok]of [['beacon',s.beacon],['lumi',s.rescued],['core',s.core],['secret',s.secret],[s.choice,!!s.choice]])if(ok)remember(s,id);return s}catch{return s}}
