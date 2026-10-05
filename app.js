'use strict';

(() => {
  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const preferences = {
    read(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    write(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        // The site also works when browser storage is unavailable.
      }
    },
  };

  function initializeTheme() {
    const button = document.querySelector('.theme-button');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    let preference = preferences.read('sarvesh-theme');
    if (preference !== 'light' && preference !== 'dark') preference = null;

    function applyTheme(dark) {
      body.dataset.theme = dark ? 'dark' : 'light';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      document.querySelector('meta[name="theme-color"]').content = dark ? '#111521' : '#f6f7fb';
    }

    applyTheme(preference ? preference === 'dark' : systemTheme.matches);
    button.addEventListener('click', () => {
      preference = body.dataset.theme === 'dark' ? 'light' : 'dark';
      preferences.write('sarvesh-theme', preference);
      applyTheme(preference === 'dark');
    });
    systemTheme.addEventListener('change', () => {
      if (!preference) applyTheme(systemTheme.matches);
    });
  }

  function initializeMotion() {
    const button = document.querySelector('.motion-button');
    const word = document.querySelector('.rotating-word');
    const words = ['connects.', 'simplifies.', 'automates.'];
    const interval = 3400;
    const fadeDuration = 180;
    const listeners = new Set();
    let paused = preferences.read('sarvesh-motion') === 'paused';
    let wordIndex = 0;
    let timer;

    const isReduced = () => paused || reducedMotion.matches;
    const canAnimate = () => !isReduced() && !document.hidden;

    function scheduleWord(delay = interval) {
      timer = window.setTimeout(() => {
        if (!canAnimate()) return;
        word.classList.add('swapping');
        timer = window.setTimeout(() => {
          wordIndex = (wordIndex + 1) % words.length;
          word.textContent = words[wordIndex];
          word.classList.remove('swapping');
          if (canAnimate()) scheduleWord(interval - fadeDuration);
        }, fadeDuration);
      }, delay);
    }

    function updateMotion() {
      const stop = !canAnimate();
      body.classList.toggle('motion-paused', stop);
      root.classList.toggle('motion-paused', stop);
      button.textContent = reducedMotion.matches
        ? 'Reduced motion'
        : paused
          ? 'Resume motion'
          : 'Pause motion';
      button.disabled = reducedMotion.matches;
      button.setAttribute('aria-pressed', String(isReduced()));
      window.clearTimeout(timer);
      word.classList.remove('swapping');
      if (!stop) scheduleWord();
      listeners.forEach((listener) => listener());
    }

    button.addEventListener('click', () => {
      paused = !paused;
      preferences.write('sarvesh-motion', paused ? 'paused' : 'running');
      updateMotion();
    });
    reducedMotion.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateMotion);
    updateMotion();

    return { isReduced, canAnimate, onChange: (listener) => listeners.add(listener) };
  }

  function initializeNavigation() {
    const button = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.main-nav');
    const isOpen = () => button.getAttribute('aria-expanded') === 'true';

    function closeMenu() {
      if (!isOpen()) return;
      navigation.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open navigation');
    }

    button.addEventListener('click', () => {
      const open = !isOpen();
      navigation.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) {
        closeMenu();
        button.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (isOpen() && !navigation.contains(event.target) && !button.contains(event.target))
        closeMenu();
    });
    window.matchMedia('(min-width: 721px)').addEventListener('change', closeMenu);
    return navigation;
  }

  function initializeTabs() {
    document.querySelectorAll('[role="tablist"]').forEach((list) => {
      const tabs = [...list.querySelectorAll('[role="tab"]')];
      const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));

      function select(tab) {
        tabs.forEach((item, index) => {
          const active = item === tab;
          item.setAttribute('aria-selected', String(active));
          item.tabIndex = active ? 0 : -1;
          panels[index].hidden = !active;
        });
      }

      list.addEventListener('click', (event) => {
        const tab = event.target.closest('[role="tab"]');
        if (tabs.includes(tab)) select(tab);
      });
      list.addEventListener('keydown', (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const index = tabs.indexOf(event.target);
        if (index === -1) return;
        let next;
        switch (event.key) {
          case 'ArrowRight':
            next = (index + 1) % tabs.length;
            break;
          case 'ArrowLeft':
            next = (index - 1 + tabs.length) % tabs.length;
            break;
          case 'Home':
            next = 0;
            break;
          case 'End':
            next = tabs.length - 1;
            break;
          default:
            return;
        }
        event.preventDefault();
        select(tabs[next]);
        tabs[next].focus();
      });
    });
  }

  function initializeWorkflow(motion) {
    const demo = document.getElementById('workflow-demo');
    const button = demo.querySelector('.run-button');
    const label = button.querySelector('span');
    const status = demo.querySelector('.demo-status');
    const choices = [...demo.querySelectorAll('[data-workflow]')];
    const stages = [...demo.querySelectorAll('.flow-stage')];
    const titles = stages.map((stage) => stage.querySelector('.stage-title'));
    const workflows = {
      automation: {
        titles: ['Business task', 'Connected workflow', 'Task completed'],
        steps: ['Reading the business task…', 'Connecting the workflow…', 'Completing the task…'],
        done: 'Demo complete. Workflow connected.',
      },
      api: {
        titles: ['Application request', 'API service', 'Structured response'],
        steps: ['Receiving a request…', 'Processing with the API…', 'Returning a response…'],
        done: 'Demo complete. Response delivered.',
      },
      ai: {
        titles: ['User question', 'NLP model', 'Contextual answer'],
        steps: ['Reading the question…', 'Processing the context…', 'Preparing an answer…'],
        done: 'Demo complete. Answer prepared.',
      },
    };
    let mode = 'automation';
    let runId = 0;
    let delayTimer;
    let resolveDelay;

    function finishDelay() {
      window.clearTimeout(delayTimer);
      const resolve = resolveDelay;
      resolveDelay = null;
      if (resolve) resolve();
    }

    function waitForStage() {
      return new Promise((resolve) => {
        resolveDelay = resolve;
        delayTimer = window.setTimeout(finishDelay, 680);
      });
    }

    function reset() {
      runId += 1;
      finishDelay();
      demo.classList.remove('is-running');
      stages.forEach((stage) => stage.classList.remove('active', 'done'));
      button.disabled = false;
      label.textContent = 'Run demo';
    }

    choices.forEach((choice) =>
      choice.addEventListener('click', () => {
        reset();
        mode = choice.dataset.workflow;
        choices.forEach((item) => {
          const active = item === choice;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        titles.forEach((title, index) => {
          title.textContent = workflows[mode].titles[index];
        });
        demo
          .querySelector('.flow-stages')
          .setAttribute('aria-label', 'Illustrative ' + mode + ' workflow');
        status.textContent = 'Ready when you are.';
      }),
    );

    button.addEventListener('click', async () => {
      reset();
      const currentRun = runId;
      const workflow = workflows[mode];
      button.disabled = true;
      label.textContent = 'Running';
      demo.classList.add('is-running');
      for (let index = 0; index < stages.length; index += 1) {
        if (currentRun !== runId) return;
        stages[index].classList.add('active');
        status.textContent = workflow.steps[index];
        if (motion.canAnimate()) await waitForStage();
        if (currentRun !== runId) return;
        stages[index].classList.remove('active');
        stages[index].classList.add('done');
      }
      status.textContent = workflow.done;
      demo.classList.remove('is-running');
      button.disabled = false;
      label.textContent = 'Run again';
    });
    motion.onChange(() => {
      if (!motion.canAnimate()) finishDelay();
    });
  }

  function initializeEmailCopy() {
    const button = document.querySelector('.copy-button');
    const label = button.querySelector('span');
    const status = document.querySelector('.copy-status');
    const email = document.querySelector('.email-link').textContent.trim();
    let resetTimer;

    button.addEventListener('click', async () => {
      window.clearTimeout(resetTimer);
      button.disabled = true;
      status.textContent = '';
      try {
        await navigator.clipboard.writeText(email);
        status.textContent = 'Email copied.';
        label.textContent = 'Copied';
      } catch {
        label.textContent = 'Copy email';
        status.textContent = 'Copy unavailable. Select the email above or open your email app.';
      } finally {
        button.disabled = false;
        resetTimer = window.setTimeout(() => {
          label.textContent = 'Copy email';
        }, 3000);
      }
    });
  }

  function initializeObservers(navigation) {
    if (!('IntersectionObserver' in window)) return;
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll('.reveal').forEach((element) => {
      element.classList.add('ready');
      revealObserver.observe(element);
    });

    const visibility = new Map();
    const links = [...navigation.querySelectorAll('a')];
    const navigationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibility.set(entry.target.id, entry.intersectionRatio);
          else visibility.delete(entry.target.id);
        });
        const active = [...visibility].sort((first, second) => second[1] - first[1])[0]?.[0];
        links.forEach((link) => {
          const current = link.getAttribute('href') === '#' + active;
          link.classList.toggle('current', current);
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      },
      { rootMargin: '-15% 0px -45% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    document
      .querySelectorAll('main > section[id]')
      .forEach((section) => navigationObserver.observe(section));
  }

  function initializeReadingProgress() {
    const progress = document.querySelector('.reading-progress');
    let scrollRange = 0;
    let frame;
    let needsMeasurement = true;

    function update() {
      frame = null;
      if (needsMeasurement) {
        scrollRange = Math.max(0, root.scrollHeight - window.innerHeight);
        needsMeasurement = false;
      }
      progress.style.transform =
        'scaleX(' +
        (scrollRange ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0) +
        ')';
    }

    function schedule(measure = false) {
      needsMeasurement ||= measure;
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', () => schedule(), { passive: true });
    window.addEventListener('resize', () => schedule(true), { passive: true });
    window.addEventListener('pageshow', () => schedule(true));
    if ('ResizeObserver' in window) new ResizeObserver(() => schedule(true)).observe(body);
    else document.addEventListener('click', () => schedule(true));
    // Read document dimensions after the initial render, rather than forcing layout during setup.
    window.requestAnimationFrame(() => schedule(true));
  }

  function initializeParallax(motion) {
    const resets = [];
    document.querySelectorAll('.portrait-scene, .panel').forEach((element) => {
      const portrait = element.classList.contains('portrait-scene');
      const properties = portrait ? ['--portrait-x', '--portrait-y'] : ['--tilt-x', '--tilt-y'];
      const unit = portrait ? 'px' : 'deg';
      let frame;
      let bounds;
      let position;

      function reset() {
        if (!frame && !bounds) return;
        window.cancelAnimationFrame(frame);
        frame = null;
        bounds = null;
        position = null;
        properties.forEach((property) => element.style.setProperty(property, '0' + unit));
      }

      function update() {
        frame = null;
        if (!motion.canAnimate() || !finePointer.matches) return;
        bounds ||= element.getBoundingClientRect();
        const horizontal = (position.x - bounds.left) / bounds.width - 0.5;
        const vertical = (position.y - bounds.top) / bounds.height - 0.5;
        const values = portrait ? [horizontal * 12, vertical * 8] : [-vertical * 3, horizontal * 3];
        properties.forEach((property, index) =>
          element.style.setProperty(property, values[index].toFixed(2) + unit),
        );
      }

      element.addEventListener(
        'pointermove',
        (event) => {
          if (!motion.canAnimate() || !finePointer.matches) return;
          position = { x: event.clientX, y: event.clientY };
          if (!frame) frame = window.requestAnimationFrame(update);
        },
        { passive: true },
      );
      element.addEventListener('pointerleave', reset);
      resets.push(reset);
    });
    const resetAll = () => resets.forEach((reset) => reset());
    window.addEventListener('scroll', resetAll, { passive: true });
    window.addEventListener('resize', resetAll, { passive: true });
    finePointer.addEventListener('change', resetAll);
    motion.onChange(resetAll);
  }

  initializeTheme();
  const motion = initializeMotion();
  const navigation = initializeNavigation();
  initializeTabs();
  initializeWorkflow(motion);
  initializeEmailCopy();
  initializeObservers(navigation);
  initializeReadingProgress();
  initializeParallax(motion);
  root.classList.add('js');
})();
