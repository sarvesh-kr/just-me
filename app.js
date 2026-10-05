'use strict';
(() => {
  const body = document.body;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const storage = { get(key) { try { return localStorage.getItem(key); } catch { return null; } }, set(key, value) { try { localStorage.setItem(key, value); } catch {} } };
  const themeButton = document.querySelector('.theme-button');
  function setTheme(dark) {
    body.dataset.theme = dark ? 'dark' : 'light';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#111521' : '#f6f7fb';
  }
  setTheme(storage.get('sarvesh-theme') === 'dark');
  themeButton.addEventListener('click', () => { const dark = body.dataset.theme !== 'dark'; setTheme(dark); storage.set('sarvesh-theme', dark ? 'dark' : 'light'); });
  const motionButton = document.querySelector('.motion-button');
  let paused = storage.get('sarvesh-motion') === 'paused';
  let wordTimer;
  const words = ['connects.', 'simplifies.', 'automates.'];
  let wordIndex = 0;
  const word = document.querySelector('.rotating-word');
  const reduced = () => paused || prefersReduced.matches;
  function updateMotion() {
    const stop = reduced();
    body.classList.toggle('motion-paused', stop);
    document.documentElement.classList.toggle('motion-paused', stop);
    motionButton.textContent = prefersReduced.matches ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion';
    motionButton.disabled = prefersReduced.matches;
    motionButton.setAttribute('aria-pressed', String(stop));
    clearInterval(wordTimer);
    word.classList.remove('swapping');
    if (!stop) wordTimer = setInterval(() => {
      if (document.hidden) return;
      word.classList.add('swapping');
      setTimeout(() => { wordIndex = (wordIndex + 1) % words.length; word.textContent = words[wordIndex]; word.classList.remove('swapping'); }, 180);
    }, 3400);
  }
  motionButton.addEventListener('click', () => { paused = !paused; storage.set('sarvesh-motion', paused ? 'paused' : 'running'); updateMotion(); });
  prefersReduced.addEventListener('change', updateMotion);
  updateMotion();
  const portrait = document.querySelector('.portrait-scene');
  function resetPortrait() {
    if (!portrait) return;
    portrait.style.setProperty('--portrait-x', '0px');
    portrait.style.setProperty('--portrait-y', '0px');
  }
  if (portrait && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    portrait.addEventListener('pointermove', event => {
      if (reduced()) return;
      const rect = portrait.getBoundingClientRect();
      portrait.style.setProperty('--portrait-x', (((event.clientX - rect.left) / rect.width - .5) * 12).toFixed(2) + 'px');
      portrait.style.setProperty('--portrait-y', (((event.clientY - rect.top) / rect.height - .5) * 8).toFixed(2) + 'px');
    });
    portrait.addEventListener('pointerleave', resetPortrait);
    motionButton.addEventListener('click', resetPortrait);
    prefersReduced.addEventListener('change', resetPortrait);
  }
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  function closeMenu() { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); }
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
  document.addEventListener('click', event => { if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
  window.matchMedia('(min-width: 721px)').addEventListener('change', closeMenu);
  document.querySelectorAll('[role="tablist"]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = tab => {
      tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; document.getElementById(item.getAttribute('aria-controls')).hidden = !active; });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); select(tabs[next]); tabs[next].focus(); }
      });
    });
  });
  const demo = document.getElementById('workflow-demo');
  const runButton = demo.querySelector('.run-button');
  const status = demo.querySelector('.demo-status');
  const flowButtons = [...demo.querySelectorAll('[data-workflow]')];
  const stages = [...demo.querySelectorAll('.flow-stage')];
  const workflows = {
    automation: { titles: ['Business task', 'Connected workflow', 'Task completed'], steps: ['Reading the business task…', 'Connecting the workflow…', 'Completing the task…'], done: 'Demo complete. Workflow connected.' },
    api: { titles: ['Application request', 'API service', 'Structured response'], steps: ['Receiving a request…', 'Processing with the API…', 'Returning a response…'], done: 'Demo complete. Response delivered.' },
    ai: { titles: ['User question', 'NLP model', 'Contextual answer'], steps: ['Reading the question…', 'Processing the context…', 'Preparing an answer…'], done: 'Demo complete. Answer prepared.' }
  };
  let mode = 'automation';
  let runId = 0;
  function resetDemo() { runId++; demo.classList.remove('is-running'); stages.forEach(stage => stage.classList.remove('active', 'done')); runButton.disabled = false; runButton.querySelector('span').textContent = 'Run demo'; }
  flowButtons.forEach(button => button.addEventListener('click', () => {
    resetDemo(); mode = button.dataset.workflow;
    flowButtons.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    stages.forEach((stage, index) => stage.querySelector('.stage-title').textContent = workflows[mode].titles[index]);
    demo.querySelector('.flow-stages').setAttribute('aria-label', 'Illustrative ' + mode + ' workflow');
    status.textContent = 'Ready when you are.';
  }));
  runButton.addEventListener('click', async () => {
    resetDemo(); const currentRun = runId; const config = workflows[mode];
    runButton.disabled = true; runButton.querySelector('span').textContent = 'Running'; demo.classList.add('is-running');
    for (let i = 0; i < stages.length; i++) {
      if (currentRun !== runId) return;
      stages[i].classList.add('active'); status.textContent = config.steps[i];
      if (!reduced()) await new Promise(resolve => setTimeout(resolve, 680));
      if (currentRun !== runId) return;
      stages[i].classList.remove('active'); stages[i].classList.add('done');
    }
    status.textContent = config.done; demo.classList.remove('is-running'); runButton.disabled = false; runButton.querySelector('span').textContent = 'Run again';
  });
  const copyButton = document.querySelector('.copy-button');
  const copyStatus = document.querySelector('.copy-status');
  copyButton.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('sarvesh.official@icloud.com'); copyStatus.textContent = 'Email copied.'; copyButton.querySelector('span').textContent = 'Copied'; }
    catch { copyStatus.textContent = 'Copy unavailable. Select the email above or open your email app.'; }
    setTimeout(() => { copyButton.querySelector('span').textContent = 'Copy email'; }, 3000);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(element => { element.classList.add('ready'); observer.observe(element); });
    const sections = [...document.querySelectorAll('main>section[id]')].filter(section => section.id !== 'main');
    const navObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      const id = visible[0].target.id;
      nav.querySelectorAll('a').forEach(link => { const active = link.getAttribute('href') === '#' + id; link.classList.toggle('current', active); if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    }, { rootMargin: '-15% 0px -45% 0px', threshold: [0, .2, .5] });
    sections.forEach(section => navObserver.observe(section));
  }
  const progress = document.querySelector('.reading-progress');
  let ticking = false;
  function updateProgress() { const max = document.documentElement.scrollHeight - window.innerHeight; progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')'; ticking = false; }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  window.addEventListener('resize', updateProgress); updateProgress();
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.panel').forEach(panel => {
      panel.addEventListener('pointermove', event => { if (reduced()) return; const rect = panel.getBoundingClientRect(); panel.style.setProperty('--tilt-x', ((.5 - (event.clientY - rect.top) / rect.height) * 3).toFixed(2) + 'deg'); panel.style.setProperty('--tilt-y', (((event.clientX - rect.left) / rect.width - .5) * 3).toFixed(2) + 'deg'); });
      panel.addEventListener('pointerleave', () => { panel.style.setProperty('--tilt-x', '0deg'); panel.style.setProperty('--tilt-y', '0deg'); });
    });
  }
})();
