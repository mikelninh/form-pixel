import assert from 'node:assert/strict';
import {buildFeedbackIssue} from './feedback-issue.js';
const draft = buildFeedbackIssue({kind:'bug',message:'My sprite has a missing side & outline.',success:'partly',context:{camera:'iso',style:'pocket',resolution:64,customModel:true,filename:'SECRET.glb',token:'SECRET_TOKEN'}});
const url = new URL(draft.url);
assert.equal(url.origin,'https://github.com');
assert.equal(url.pathname,'/mikelninh/form-pixel/issues/new');
assert.equal(url.searchParams.get('body'),draft.body);
assert.ok(!draft.body.includes('SECRET'));
assert.ok(draft.body.includes('Partly'));
assert.throws(()=>buildFeedbackIssue({message:'short'}));
for(const message of ['<script>alert(1)</script>', '龍😀'.repeat(2000)]) {
  const result = buildFeedbackIssue({kind:'constructor',message});
  assert.equal(result.title,'[Feedback] My FORM / PIXEL experience');
  assert.ok(result.url.length <= 6500);
  assert.equal(new URL(result.url).searchParams.get('body'),result.body);
}
console.log('PASS feedback URL, privacy allowlist, validation, Unicode size and fallback kind');
