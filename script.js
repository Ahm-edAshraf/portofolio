document.documentElement.classList.add('js');

const repositories = [
  { name: 'siap-chutes', year: '2026', category: ['product', 'data'], stack: 'Next.js · Convex · Chutes TEE · OCR', desc: 'Privacy-first application copilot with four parallel confidential-compute agents.' },
  { name: 'stupider-discord-bot', year: '2026', category: ['automation', 'experiment'], stack: 'Bun · TypeScript · Discord.js · SQLite', desc: 'Voice, music, and personality-aware AI bot with bounded memory and usage controls.' },
  { name: 'gear-guard', year: '2026', category: ['product'], stack: 'Next.js · React · TypeScript', desc: 'Campus equipment booking and return tracking with conflict prevention.' },
  { name: 'FormAi', year: '2026', category: ['product', 'data'], stack: 'Next.js · Convex · Clerk · Groq', desc: 'Prompt-to-form product with a visual builder, publishing, workspaces, and analytics.' },
  { name: 'stupid-discord-bot', year: '2026', category: ['automation', 'experiment'], stack: 'Python · discord.py', desc: 'A modular slash-command Discord bot foundation with safe sync workflows.' },
  { name: 'FactoryPulse-Lite', year: '2026', category: ['data', 'product'], stack: 'Python · XGBoost · Streamlit · SHAP', desc: 'Predictive maintenance, RUL forecasting, change-point detection, and action planning.' },
  { name: 'receipt-ai', year: '2026', category: ['product', 'data'], stack: 'Electron · TypeScript · Groq · Excel', desc: 'Desktop workflow for extracting, reviewing, and exporting structured receipt data.' },
  { name: 'Jo.-', year: '2026', category: ['automation', 'experiment'], stack: 'Python · Lavalink · Discord.py', desc: 'A deployable Discord music bot with queues, filters, seeking, and playback controls.' },
  { name: 'mafia-ai', year: '2026', category: ['product', 'data', 'experiment'], stack: 'Next.js · Convex · Groq · Realtime', desc: 'Realtime Mafia game with live chat, spectators, timed phases, and AI players.' },
  { name: 'hackathon-sidi', year: '2025', category: ['product', 'data'], stack: 'Next.js · AWS · OCR · Bedrock', desc: 'Ledgerly: an AI accounting copilot for reports, expense intelligence, and forecasting.' },
  { name: 'hackathon-sar', year: '2025', category: ['product', 'automation', 'data'], stack: 'Next.js · AWS · MCP · Leaflet', desc: 'Search-and-rescue mission console with live events, maps, routing, and MCP tools.' },
  { name: 'ai-debater', year: '2025', category: ['product', 'data', 'experiment'], stack: 'Next.js · Bun · Gemini', desc: 'Two AI debaters argue in turns while a user nudges each side and a judge scores the round.' },
  { name: 'streamlit-uber-dataset-prediction', year: '2025', category: ['data', 'product'], stack: 'Python · LightGBM · Streamlit · Plotly', desc: 'NCR ride analytics and real-time completion prediction across 150,000+ records.' },
  { name: 'resume-parser', year: '2025', category: ['data'], stack: 'Python · spaCy · KeyBERT · Transformers', desc: 'Resume-to-job matching with semantic similarity, keyword extraction, and skill-gap analysis.' },
  { name: 'ai-code-reviewer', year: '2025', category: ['automation', 'data'], stack: 'Python · Flask · Gemini · GitHub API', desc: 'GitHub App that turns pull-request diffs into severity-ranked review comments.' },
  { name: 'n8n', year: '2025', category: ['automation'], stack: 'n8n · Render · PostgreSQL', desc: 'A compact deployment scaffold for a persistent n8n automation environment.' },
  { name: 'apu-student-help', year: '2025', category: ['product', 'data'], stack: 'Next.js · Supabase · Gemini · PWA', desc: 'AI study companion with tasks, timetable, document vault, analytics, and offline support.' },
  { name: 'saad-website', year: '2025', category: ['product', 'experiment'], stack: 'JavaScript · Chart.js · PDF · CSV', desc: 'VetSync clinic management prototype with records, reports, and operational dashboards.' },
  { name: 'mothers-day', year: '2025', category: ['experiment'], stack: 'HTML · CSS · JavaScript', desc: 'A small, expressive browser experience built as a personal Mother’s Day gift.' },
  { name: 'SADAQAPP', year: '2025', category: ['product'], stack: 'Next.js · TypeScript · Accessibility', desc: 'Voice-first, Shariah-compliant financial aid prototype for donors and beneficiaries.' },
  { name: 'MarkdownCSS2PDF', year: '2025', category: ['product', 'automation'], stack: 'JavaScript · Marked · html2pdf', desc: 'Fully client-side Markdown and custom CSS editor with live preview and PDF export.' },
  { name: 'character-stats', year: '2025', category: ['product', 'experiment'], stack: 'Node.js · JavaScript · MongoDB', desc: 'Authenticated character-sheet builder for stats, techniques, inventory, and backstory.' },
  { name: 'career-plan', year: '2024', category: ['product', 'experiment'], stack: 'React · JavaScript', desc: 'An early interactive career-planning experience deployed as a static web app.' },
  { name: 'tedx-barcodes', year: '2024', category: ['automation', 'experiment'], stack: 'JavaScript · HTML · CSS', desc: 'Barcode-based TEDx event check-in tool with fast attendee validation.' },
  { name: 'aloruba-events', year: '2024', category: ['product', 'experiment'], stack: 'HTML · CSS · JavaScript · PHP', desc: 'An early school events site with a lightweight submission workflow.' },
  { name: 'buss', year: '2023', category: ['experiment'], stack: 'Lua', desc: 'The first public repository in the timeline: a compact Lua scripting experiment.' }
];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initRepositoryAtlas() {
  const grid = document.querySelector('#repo-grid');
  const controls = document.querySelector('.atlas-controls');
  if (!grid || !controls) return;

  grid.innerHTML = repositories.map((repo) => `
    <a class="repo-card reveal is-visible" data-category="${repo.category.join(' ')}" href="https://github.com/Ahm-edAshraf/${encodeURIComponent(repo.name)}" target="_blank" rel="noreferrer">
      <div class="repo-meta"><i></i><span>${repo.category[0]}</span><span>/ ${repo.year}</span></div>
      <h3>${repo.name}</h3>
      <p>${repo.desc}</p>
      <span class="repo-stack">${repo.stack}</span>
    </a>
  `).join('');

  controls.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const filter = button.dataset.filter;
    controls.querySelectorAll('[data-filter]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    grid.querySelectorAll('.repo-card').forEach((card) => {
      const matches = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.hidden = !matches;
    });
  });
}

function initReveals() {
  const items = [...document.querySelectorAll('.reveal:not(.is-visible)')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.11, rootMargin: '0px 0px -5% 0px' });
  items.forEach((item) => observer.observe(item));
}

function initProgress() {
  const progress = document.querySelector('#scroll-progress');
  if (!progress) return;
  let queued = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    queued = false;
  };
  addEventListener('scroll', () => {
    if (!queued) requestAnimationFrame(update);
    queued = true;
  }, { passive: true });
  update();
}

function initRotatingWord() {
  const element = document.querySelector('.hero-shift');
  if (!element || reducedMotion) return;
  const words = element.dataset.words.split(',');
  let wordIndex = 0;
  let removing = false;
  let cursor = words[0].length;

  const tick = () => {
    const word = words[wordIndex];
    if (!removing) {
      cursor += 1;
      element.textContent = word.slice(0, cursor);
      if (cursor >= word.length) {
        removing = true;
        setTimeout(tick, 1450);
        return;
      }
    } else {
      cursor -= 1;
      element.textContent = word.slice(0, Math.max(0, cursor));
      if (cursor <= 0) {
        removing = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(tick, removing ? 52 : 82);
  };
  setTimeout(() => { removing = true; tick(); }, 1600);
}

function initTime() {
  const time = document.querySelector('#local-time');
  if (!time) return;
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const render = () => { time.textContent = `MYT ${formatter.format(new Date())}`; };
  render();
  setInterval(render, 30_000);
}

function initHeroDepth() {
  if (reducedMotion || !matchMedia('(pointer: fine)').matches) return;
  const system = document.querySelector('#hero-system');
  if (!system) return;
  system.addEventListener('pointermove', (event) => {
    const bounds = system.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    system.style.transform = `perspective(1100px) rotateX(${y * -3}deg) rotateY(${x * 4}deg) translateZ(0)`;
  });
  system.addEventListener('pointerleave', () => { system.style.transform = ''; });

  document.querySelectorAll('.magnetic').forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const bounds = item.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      item.style.transform = `translate(${x * .07}px, ${y * .1}px) translateY(-2px)`;
    });
    item.addEventListener('pointerleave', () => { item.style.transform = ''; });
  });
}

function initCommandMenu() {
  const trigger = document.querySelector('#command-trigger');
  const menu = document.querySelector('#command-menu');
  if (!trigger || !menu) return;
  let previousFocus = null;

  const open = () => {
    previousFocus = document.activeElement;
    menu.hidden = false;
    document.body.classList.add('menu-open');
    menu.querySelector('a')?.focus();
  };
  const close = () => {
    menu.hidden = true;
    document.body.classList.remove('menu-open');
    previousFocus?.focus();
  };
  trigger.addEventListener('click', open);
  menu.querySelectorAll('[data-command-close]').forEach((item) => item.addEventListener('click', close));
  menu.querySelectorAll('a').forEach((item) => item.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      menu.hidden ? open() : close();
    }
    if (event.key === 'Escape' && !menu.hidden) close();
    if (event.key === 'Tab' && !menu.hidden) {
      const focusable = [...menu.querySelectorAll('a, button')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
}

function initCopyEmail() {
  const button = document.querySelector('#copy-email');
  const status = document.querySelector('#copy-status');
  if (!button || !status) return;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.email);
      button.textContent = 'Copied';
      status.textContent = 'Email copied to clipboard.';
      setTimeout(() => { button.textContent = 'Copy email'; status.textContent = ''; }, 2200);
    } catch {
      status.textContent = `Copy unavailable. Email: ${button.dataset.email}`;
    }
  });
}

function initNetworkCanvas() {
  if (reducedMotion) return;
  const canvas = document.querySelector('#network-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const pointer = { x: innerWidth * .5, y: innerHeight * .45, active: false };
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let frame = 0;
  let running = true;

  const resize = () => {
    width = innerWidth;
    height = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(54, Math.max(28, Math.floor(width / 28)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .15,
      vy: (Math.random() - .5) * .15,
      r: Math.random() * 1.2 + .45
    }));
  };

  const draw = () => {
    if (!running) return;
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'rgba(130,145,255,.55)';
    for (let index = 0; index < particles.length; index += 1) {
      const point = particles[index];
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < -20) point.x = width + 20;
      if (point.x > width + 20) point.x = -20;
      if (point.y < -20) point.y = height + 20;
      if (point.y > height + 20) point.y = -20;
      context.beginPath();
      context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
      context.fill();

      for (let compare = index + 1; compare < particles.length; compare += 1) {
        const other = particles[compare];
        const dx = point.x - other.x;
        const dy = point.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 125) {
          context.strokeStyle = `rgba(91,108,255,${(1 - distance / 125) * .12})`;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }

      if (pointer.active) {
        const distance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
        if (distance < 155) {
          context.strokeStyle = `rgba(92,225,230,${(1 - distance / 155) * .28})`;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
      }
    }
    frame = requestAnimationFrame(draw);
  };

  addEventListener('pointermove', (event) => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true; }, { passive: true });
  addEventListener('pointerleave', () => { pointer.active = false; });
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) draw(); else cancelAnimationFrame(frame);
  });
  resize();
  draw();
}

initRepositoryAtlas();
initReveals();
initProgress();
initRotatingWord();
initTime();
initHeroDepth();
initCommandMenu();
initCopyEmail();
initNetworkCanvas();

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
