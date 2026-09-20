import assert from 'node:assert/strict';
import {createRun,pathTo,step,dash,gate,runes,walkable,TILE} from './dungeon-core.js';
const s=createRun();assert.equal(s.phase,'intro');const x=s.x;step(s,.04,{x:1,y:0});assert.equal(s.x,x);s.phase='explore';
assert.equal(dash(s),true);assert.equal(dash(s),false);for(let i=0;i<40;i++)step(s,.04);assert.equal(dash(s),true);
const locked=createRun();locked.phase='explore';locked.x=gate.x;locked.y=gate.y;step(locked,.02);assert.notEqual(locked.phase,'won');
function go(s,to){s.path=pathTo(s,to);assert.ok(s.path.length,'destination reachable');let frames=0;while(s.phase!=='won'&&Math.hypot(s.x-to.x,s.y-to.y)>12&&frames++<15000){step(s,.02);if(!s.path.length&&Math.hypot(s.x-to.x,s.y-to.y)>12)s.path=pathTo(s,to);if(frames%50===0)dash(s);assert.ok(walkable(s.x,s.y),'collision bounds respected');}assert.ok(frames<15000,'path completes');return frames;}
const counts=[];for(const r of runes)counts.push(go(s,r));assert.equal(s.collected.length,3);counts.push(go(s,gate));assert.equal(s.phase,'won');const before=s.time;step(s,.04,{x:1,y:0});assert.equal(s.time,before);
const wall=createRun();wall.phase='explore';wall.x=2*TILE+9;wall.y=22*TILE;for(let i=0;i<100;i++)step(wall,.02,{x:-1,y:0});assert.ok(wall.x>=2*TILE+8);
console.log(JSON.stringify({pass:true,checks:['intro blocks input','dash cooldown','locked portal','all runes reachable','collision bounds','full adventure completes','won freezes movement'],routeFrames:counts,time:s.time,hits:s.hits},null,2));
