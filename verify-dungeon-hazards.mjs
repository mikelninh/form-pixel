import assert from 'node:assert/strict';
import {createRun,step,dash,sentinels} from './dungeon-core.js';
const make=()=>{const s=createRun();s.phase='explore';Object.assign(s,sentinels(.02)[0]);return s};
let s=make();let events=step(s,.02);assert.ok(events.some(e=>e.type==='hit'));assert.equal(s.hits,1);const hits=s.hits;step(s,.02);assert.equal(s.hits,hits);
s=make();dash(s);events=step(s,.02);assert.equal(s.hits,0);assert.ok(!events.some(e=>e.type==='hit'));
console.log('PASS sentinel collision, invulnerability and dash immunity');
