export const TILE=32,W=42,H=28;
export const rooms=[[2,17,12,25],[2,3,16,12],[21,3,38,14],[20,19,39,26]];
const halls=[[7,10,10,19],[14,6,24,9],[28,12,31,22]];
export const pillars=[[5,9],[12,5],[24,10],[34,5],[33,11],[27,23],[36,24]];
export const runes=[{x:6.5*TILE,y:5.5*TILE},{x:34.5*TILE,y:8.5*TILE},{x:23.5*TILE,y:23.5*TILE}];
export const gate={x:35.5*TILE,y:21.5*TILE};
export const spawn={x:7.5*TILE,y:22.5*TILE};
export const map=Array.from({length:H},()=>Array(W).fill(0));
for(const [a,b,c,d] of [...rooms,...halls])for(let y=b;y<d;y++)for(let x=a;x<c;x++)map[y][x]=1;
for(const [x,y] of pillars)map[y][x]=2;
export function walkable(x,y){const r=8;return [[-r,-r],[r,-r],[-r,r],[r,r]].every(([a,b])=>map[Math.floor((y+b)/TILE)]?.[Math.floor((x+a)/TILE)]===1)}
export function pathTo(from,to){const start=[Math.floor(from.x/TILE),Math.floor(from.y/TILE)],end=[Math.floor(to.x/TILE),Math.floor(to.y/TILE)];if(map[end[1]]?.[end[0]]!==1)return[];const key=(x,y)=>y*W+x,q=[start],prev=new Map([[key(...start),null]]);let found=false;for(let i=0;i<q.length;i++){const [x,y]=q[i];if(x===end[0]&&y===end[1]){found=true;break}for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(map[ny]?.[nx]===1&&!prev.has(k)){prev.set(k,[x,y]);q.push([nx,ny])}}}if(!found)return[];let cur=end,route=[];while(cur){route.push({x:(cur[0]+.5)*TILE,y:(cur[1]+.5)*TILE});cur=prev.get(key(...cur))}route.reverse();route.shift();if(walkable(to.x,to.y))route.push({...to});return route;}
export function createRun(){return{...spawn,direction:0,collected:[],phase:'intro',time:0,dash:0,cooldown:0,invulnerable:0,hits:0,distance:0,path:[],particles:[],moving:false,trail:[]}}
export function dash(s){if(s.phase==='explore'&&s.cooldown<=0){s.dash=.19;s.cooldown=1.15;return true}return false}
export function sentinels(t){return[{x:26*TILE+Math.sin(t*.9)*82,y:7.5*TILE},{x:29.5*TILE,y:16.3*TILE+Math.sin(t*1.1)*55}]}
export function step(s,dt,input={x:0,y:0}){if(s.phase!=='explore')return[];dt=Math.min(.04,dt);s.time+=dt;s.cooldown=Math.max(0,s.cooldown-dt);s.dash=Math.max(0,s.dash-dt);s.invulnerable=Math.max(0,s.invulnerable-dt);let dx=input.x,dy=input.y;
 if(dx||dy)s.path=[];else if(s.path.length){const p=s.path[0],d=Math.hypot(p.x-s.x,p.y-s.y);if(d<4)s.path.shift();else{dx=(p.x-s.x)/d;dy=(p.y-s.y)/d;}}
 const len=Math.hypot(dx,dy),speed=s.dash>0?410:135;const events=[];s.moving=len>0;
 if(len){dx/=len;dy/=len;s.direction=(Math.round(Math.atan2(dx,dy)/(Math.PI/4))+8)%8;const travel=speed*dt;const nx=s.x+dx*travel,ny=s.y+dy*travel;const ox=s.x,oy=s.y;if(walkable(nx,s.y))s.x=nx;if(walkable(s.x,ny))s.y=ny;s.distance+=Math.hypot(s.x-ox,s.y-oy);}
 for(let i=0;i<runes.length;i++){const r=runes[i];if(!s.collected.includes(i)&&Math.hypot(s.x-r.x,s.y-r.y)<24){s.collected.push(i);events.push({type:'rune',...r,index:i})}}
 if(s.invulnerable===0&&s.dash===0)for(const e of sentinels(s.time))if(Math.hypot(s.x-e.x,s.y-e.y)<22){s.hits++;s.invulnerable=1.7;events.push({type:'hit',x:s.x,y:s.y});const a=Math.atan2(s.y-e.y,s.x-e.x);for(let i=0;i<30;i++){const nx=s.x+Math.cos(a)*2,ny=s.y+Math.sin(a)*2;if(walkable(nx,ny)){s.x=nx;s.y=ny}}s.path=[];break;}
 if(s.collected.length===3&&Math.hypot(s.x-gate.x,s.y-gate.y)<32){s.phase='won';events.push({type:'won'})}return events;}
