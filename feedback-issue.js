const issueRoot = 'https://github.com/mikelninh/form-pixel/issues/new';
const kinds = {bug:'Bug', friction:'Friction', wish:'Idea', useful:'Feedback', creation:'Creation'};
export function buildFeedbackIssue(input = {}) {
  const kind = Object.hasOwn(kinds, input.kind) ? kinds[input.kind] : 'Feedback';
  const message = String(input.message ?? '').trim();
  if (message.length < 8) throw new Error('Please describe your experience in at least 8 characters.');
  const success = {yes:'Yes', partly:'Partly', no:'No', untried:'Not tried yet'}[input.success] ?? 'Not specified';
  const context = input.context ?? {};
  // Only explicitly allowed, non-identifying settings leave the browser.
  const settings = ['camera', 'style', 'resolution'].map(key => `${key}: ${String(context[key] ?? 'unknown').slice(0, 40)}`).join(' · ');
  const intro = `## What I tried / what happened\n`;
  const tail = `\n\n## Did import → dungeon work?\n${success}\n\n## Intended use\n${String(input.useCase ?? '').trim().slice(0,250) || 'Not specified'}\n\n## Settings\nFORM / PIXEL 006 · ${settings}\nModel: ${context.customModel ? 'user import (filename omitted)' : 'bundled example'}\n\n## Expected result / steps / browser\nPlease add details here if reporting a bug. Screenshots are welcome; only attach models you may redistribute.\n\nSubmitted voluntarily from the workshop. No model file or telemetry is attached.`;
  let snippet = Array.from(message).slice(0, 1500).join('');
  let body, url;
  do {
    body = intro + snippet + (snippet.length < message.length ? '\n[Text shortened for the issue link; add remaining details on GitHub.]' : '') + tail;
    url = issueRoot + '?' + new URLSearchParams({title:`[${kind}] My FORM / PIXEL experience`, body}).toString();
    if (url.length <= 6500) break;
    snippet = Array.from(snippet).slice(0, -50).join('');
  } while (snippet.length);
  return {url, body, title:`[${kind}] My FORM / PIXEL experience`};
}
