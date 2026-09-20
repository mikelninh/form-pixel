# Contributing to FORM / PIXEL

Start with one small experiment. A useful bug report, a surprising model or a short playtest can matter as much as a code change.

Original code contributions are made under the project MIT license. Keep third-party assets under their existing terms.

## Try the challenge

**What is the most unexpected object you can turn into a dungeon hero?**

Share a short clip or screenshot, the original model's source, your selected settings, and one thing you would improve. Do not attach a model unless you have permission to redistribute it.

## Useful bug reports

- What were you trying to do?
- What happened, and what did you expect?
- Steps to reproduce, including model name and rendering settings.
- Browser, operating system and approximate device type.
- Screenshot or short clip if useful.
- A public model source or a minimal model you can share, if needed.

Check screenshots and logs before posting; leave out personal files and private information. Locally saved feedback stays on your device. The optional GitHub draft lets you review the text before opening GitHub and submitting it yourself.

## Small starter tasks

These are proposed tasks, not claims that GitHub issues already exist:

1. **English interface:** translate workshop and adventure labels, preserving keyboard and touch hints. Done when a new user can import, play and export entirely in English.
2. **Import report:** test one shareable GLB and document orientation, clipping, materials and export results. Include a before/after image and source attribution.
3. **Weapon attachment controls:** let players adjust visual equipment position, scale and rotation. Keep the existing default and explain that equipment is cosmetic.
4. **One-room remix:** add an isolated room experiment with a clear goal and a visible exit. Keep both existing chapters playable.

Discuss changes to gameplay rules or architecture in an issue first. Keep pull requests focused: explain the problem, the result and how you checked it. Preserve asset attribution.

## Verify a code change

Run the relevant core checks listed in README. For UI or rendering changes, also check the actual browser at desktop and a narrow mobile width, keyboard focus and visible touch controls. Include a screenshot when it helps reviewers judge the change. Distinguish simulated checks from actual playtesting.

Avoid adding accounts, analytics, uploads or paid API requirements to the local workflow without an explicit project decision.
