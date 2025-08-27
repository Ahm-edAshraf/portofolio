// Theme setup
(function () {
  const html = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) html.classList.add('dark');
})();

// DOM ready
window.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const progress = document.getElementById('progress');
  const glow = document.getElementById('cursor-glow');
  const mesh = document.getElementById('mesh');
  const particles = document.getElementById('particles');
  const nowbarTime = document.getElementById('nowbar-time');

  // Theme toggle
  themeToggle?.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    // swap button icon state class for svg grouping
    themeToggle.classList.toggle('dark', html.classList.contains('dark'));
  });

  // Scroll progress
  const setProgress = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const total = h.scrollHeight - h.clientHeight || 1;
    const pct = Math.min(1, Math.max(0, scrolled / total));
    progress.style.transform = `scaleX(${pct})`;
  };
  setProgress();
  window.addEventListener('scroll', setProgress, { passive: true });

  // Cursor glow follow (RAF & no transition lag)
  let gx = innerWidth / 2, gy = innerHeight / 2, needGlowUpdate = false;
  const queueGlow = (e) => { gx = e.clientX; gy = e.clientY; needGlowUpdate = true; };
  window.addEventListener('pointermove', queueGlow, { passive: true });
  window.addEventListener('mousemove', queueGlow, { passive: true });
  (function glowRAF(){
    if (needGlowUpdate) {
      glow.style.left = `${Math.round(gx)}px`;
      glow.style.top = `${Math.round(gy)}px`;
      needGlowUpdate = false;
    }
    requestAnimationFrame(glowRAF);
  })();

  // Section reveal
  const sections = [...document.querySelectorAll('section')];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  sections.forEach((s) => io.observe(s));

  // Project tilt effect (no lib)
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  function attachTilt(card) {
    const inner = card.querySelector('.project-card-inner');
    const rectFor = () => inner.getBoundingClientRect();
    const onMove = (e) => {
      const r = rectFor();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height; // 0..1
      const rx = clamp((0.5 - py) * 10, -8, 8);
      const ry = clamp((px - 0.5) * 12, -10, 10);
      inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    };
    const onLeave = () => { inner.style.transform = 'rotateX(0) rotateY(0)'; };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
  }

  // Copy to clipboard (only for elements that declare data-copy)
  document.querySelectorAll('.copy-btn[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        const prev = btn.innerHTML;
        btn.innerHTML = `<span class="font-mono">Copied</span><span class="grow"></span><span class="text-emerald-500">${text}</span>`;
        btn.style.boxShadow = '0 8px 24px rgba(16,185,129,.25)';
        setTimeout(() => { btn.innerHTML = prev; btn.style.boxShadow = ''; }, 1600);
      } catch (e) {
        alert('Copy failed, text: ' + text);
      }
    })
  });

  // Footer year
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // Now bar time updater
  if (nowbarTime) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fmt = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' });
    const update = () => { nowbarTime.textContent = `${fmt.format(new Date())} • ${tz}`; };
    update(); setInterval(update, 30_000);
  }

  // Live-ish refresh for GitHub stat images (cache-busting)
  function stamped(url, bucketMs = 10 * 60 * 1000) { // 10 min buckets
    try {
      const u = new URL(url, location.href);
      u.searchParams.set('ts', Math.floor(Date.now() / bucketMs));
      return u.toString();
    } catch { return url; }
  }
  function refreshStats(force = false) {
    document.querySelectorAll('img.gh-stat').forEach((img) => {
      const base = img.getAttribute('data-src') || img.src;
      let next = stamped(base);
      if (force) next += `&r=${Math.random().toString(36).slice(2)}`;
      img.src = next;
    });
  }
  refreshStats(false);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshStats(false); });
  window.addEventListener('focus', () => refreshStats(false));
  document.getElementById('refresh-stats')?.addEventListener('click', () => refreshStats(true));

  // Animated gradient mesh (lightweight blobs)
  if (mesh && mesh.getContext) {
    const ctx = mesh.getContext('2d');
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let w, h;
    const blobs = [];
    const BLOB_COUNT = 14;

    function resize() {
      w = mesh.clientWidth; h = mesh.clientHeight;
      mesh.width = Math.floor(w * DPR);
      mesh.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function rand(a, b) { return a + Math.random() * (b - a); }
    function initBlobs() {
      blobs.length = 0;
      for (let i = 0; i < BLOB_COUNT; i++) {
        blobs.push({
          x: rand(0, w), y: rand(0, h), r: rand(50, 160),
          dx: rand(-0.4, 0.4), dy: rand(-0.35, 0.35),
          hue: rand(170, 330), alpha: rand(0.08, 0.25)
        })
      }
    }
    initBlobs();

    function tick() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const b of blobs) {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        const c1 = `hsla(${b.hue}, 95%, 60%, ${b.alpha})`;
        const c0 = `hsla(${b.hue + 40}, 95%, 60%, ${b.alpha * 0.8})`;
        g.addColorStop(0, c1);
        g.addColorStop(1, 'hsla(0,0%,100%,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        b.x += b.dx; b.y += b.dy;
        if (b.x < -50 || b.x > w + 50) b.dx *= -1;
        if (b.y < -50 || b.y > h + 50) b.dy *= -1;
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  // Parallax elements
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    const onParallax = (e) => {
      const cx = (e.clientX / innerWidth) - 0.5;
      const cy = (e.clientY / innerHeight) - 0.5;
      parallaxEls.forEach((el, i) => {
        const depth = 6 + i * 2;
        el.style.transform = `translate3d(${cx * depth}px, ${cy * depth}px, 0)`;
      });
    };
    window.addEventListener('pointermove', onParallax, { passive: true });
  }

  // Contact form: UI-only (no submission)

  // Modular projects rendering
  const projects = [
    {
      title: 'AI Code Reviewer',
      href: 'https://github.com/Ahm-edAshraf/ai-code-reviewer',
      desc: 'Uses Gemini API to review PRs, suggest improvements, and comment automatically via GitHub webhooks.',
      tech: 'Python • Flask • Webhooks',
      image: 'assets/codereviewer.jpeg',
      tags: ['ai','python','web']
    },
    {
      title: 'Resume-Job Matcher',
      href: 'https://github.com/Ahm-edAshraf/resume-parser',
      desc: 'NLP pipeline for intelligent resume‑job matching with semantic similarity and keyword analysis.',
      tech: 'Python • NLP • ML • Colab',
      image: 'assets/placeholder.svg',
      tags: ['ai','python','nlp','ml']
    },
    {
      title: 'FormAI',
      href: 'https://github.com/Ahm-edAshraf/FormAi',
      desc: 'AI‑powered form builder to generate, customize, and validate forms with natural language prompts.',
      tech: 'Next.js • Supabase • Tailwind',
      image: 'assets/formai.jpeg',
      tags: ['nextjs','supabase','web','ai']
    },
    {
      title: 'APU Student Help',
      href: 'https://github.com/Ahm-edAshraf/apu-student-help',
      desc: 'Peer‑assist platform for university students to exchange help and resources.',
      tech: 'Node.js • Express • Web',
      image: 'assets/studenthelp.jpeg',
      tags: ['node','express','web']
    }
  ];

  const grid = document.getElementById('projects-grid');
  const filtersEl = document.getElementById('project-filters');
  let activeTags = new Set();
  function renderFilters() {
    if (!filtersEl) return;
    const all = Array.from(new Set(projects.flatMap(p => p.tags || [])));
    filtersEl.innerHTML = all.map(tag => `<button class="chip" data-tag="${tag}" data-active="${activeTags.has(tag)}">#${tag}</button>`).join('');
  }
  function renderProjects() {
    if (!grid) return;
    const list = projects.filter(p => activeTags.size === 0 || (p.tags || []).some(t => activeTags.has(t)));
    grid.innerHTML = list.map((p, idx) => {
      const placeholder = 'assets/placeholder.svg';
      const imgSrc = p.image || placeholder;
      const originalIndex = projects.indexOf(p);
      return `
        <a href="${p.href}" target="_blank" rel="noopener" class="project-card group" data-ripple data-index="${originalIndex}">
          <div class="project-card-inner">
            <figure class="project-media" data-lightbox="${originalIndex}">
              <img src="${imgSrc}" alt="${p.title} preview" loading="lazy" decoding="async" sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"/>
            </figure>
            <div class="project-badge mt-3">${p.tech}</div>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.desc}</p>
            <div class="project-cta">View Repo →</div>
            <div class="shine pointer-events-none absolute inset-0 rounded-xl"></div>
          </div>
        </a>`;
    }).join('');
    grid.querySelectorAll('.project-card').forEach((card) => attachTilt(card));
  }
  renderFilters();
  renderProjects();
  filtersEl?.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    const tag = btn.getAttribute('data-tag');
    if (activeTags.has(tag)) activeTags.delete(tag); else activeTags.add(tag);
    renderFilters();
    renderProjects();
  });

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-caption');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');
  const lbClose = document.getElementById('lightbox-close');
  function openLightbox(index) {
    const p = projects[index];
    if (!p) return;
    lbImg.src = p.image || 'assets/placeholder.svg';
    lbCap.textContent = `${p.title} — ${p.tech}`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lb.dataset.index = index;
  }
  function closeLightbox() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function navLightbox(dir) {
    const cur = Number(lb.dataset.index || 0);
    const next = (cur + dir + projects.length) % projects.length;
    openLightbox(next);
  }
  grid?.addEventListener('click', (e) => {
    const fig = e.target.closest('[data-lightbox]');
    if (!fig) return;
    e.preventDefault();
    const idx = Number(fig.getAttribute('data-lightbox'));
    openLightbox(idx);
  });
  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => navLightbox(-1));
  lbNext?.addEventListener('click', () => navLightbox(1));
  lb?.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  window.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  // Magnetic buttons
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 12; // px
    let rect;
    const onEnter = () => { rect = el.getBoundingClientRect(); };
    const onMove = (e) => {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${(x/rect.width)*strength}px, ${(y/rect.height)*strength}px)`;
    };
    const onLeave = () => { el.style.transform = 'translate(0,0)'; };
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
  });

  // Ripple on click for elements with data-ripple
  document.body.addEventListener('click', (e) => {
    const el = e.target.closest('[data-ripple]');
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - r.left}px`;
    ripple.style.top = `${e.clientY - r.top}px`;
    el.style.position = getComputedStyle(el).position === 'static' ? 'relative' : getComputedStyle(el).position;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }, { passive: true });

  // Particle cursor + confetti
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (particles && particles.getContext && !prefersReduced) {
    const ctx = particles.getContext('2d');
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let w, h; const P = [];
    function resizeP() { w = particles.clientWidth; h = particles.clientHeight; particles.width = w * DPR; particles.height = h * DPR; ctx.setTransform(DPR,0,0,DPR,0,0);} resizeP();
    window.addEventListener('resize', resizeP);
    function spawn(x,y, opts={}){ const n=opts.n||6; for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2; const v=(opts.v||1)+Math.random()*1.5; P.push({x,y, vx:Math.cos(a)*v, vy:Math.sin(a)*v - (opts.up||0), life:opts.life||40, r:Math.random()*2+1, c: opts.color||`hsla(${Math.random()*360},90%,60%,1)`}); } }
    let lastX=innerWidth/2,lastY=innerHeight/2; let frame=0;
    window.addEventListener('pointermove', (e)=>{ lastX=e.clientX; lastY=e.clientY; if(frame%2===0) spawn(lastX,lastY,{n:3, v:0.8, up:0.4, life:28, color:'hsla(200,90%,70%,1)'}); }, {passive:true});
    function tickP(){ frame++; ctx.clearRect(0,0,w,h); P.forEach((p,i)=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=0.03; p.life--; ctx.fillStyle=p.c; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); });
      for(let i=P.length-1;i>=0;i--){ if(P[i].life<=0) P.splice(i,1); }
      requestAnimationFrame(tickP);
    } tickP();
    window.confettiBurst = (x,y)=> spawn(x,y,{n:24, v:2.6, up:1.2, life:48});
  }

  // Confetti when copying contact info
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (window.confettiBurst) window.confettiBurst(e.clientX, e.clientY);
    });
  });

  // Command palette
  const cmd = document.getElementById('cmd');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');
  const commands = [
    { label: 'Go to About', action: () => document.getElementById('about').scrollIntoView({behavior:'smooth'}) },
    { label: 'Go to Projects', action: () => document.getElementById('projects').scrollIntoView({behavior:'smooth'}) },
    { label: 'Go to Stack', action: () => document.getElementById('stack').scrollIntoView({behavior:'smooth'}) },
    { label: 'Go to Stats', action: () => document.getElementById('stats').scrollIntoView({behavior:'smooth'}) },
    { label: 'Go to Contact', action: () => document.getElementById('contact').scrollIntoView({behavior:'smooth'}) },
    { label: 'Open GitHub Profile', action: () => window.open('https://github.com/Ahm-edAshraf','_blank') },
    ...projects.map((p) => ({ label: `Open: ${p.title}`, action: () => window.open(p.href,'_blank') }))
  ];
  function openCmd(){ cmd.classList.add('open'); cmd.classList.remove('hidden'); cmdInput.value=''; renderCmd(''); cmdInput.focus(); document.body.style.overflow='hidden'; }
  function closeCmd(){ cmd.classList.remove('open'); cmd.classList.add('hidden'); document.body.style.overflow=''; }
  function renderCmd(q){ const r = fuzzyFilter(commands, q); cmdResults.innerHTML = r.map((c,i)=>`<div class="cmd-item" data-i="${c.index}" ${i===0?'aria-selected="true"':''}>${highlight(c.label,q)}</div>`).join(''); }
  function highlight(text,q){ if(!q) return text; const i=text.toLowerCase().indexOf(q.toLowerCase()); if(i<0) return text; return text.slice(0,i)+`<mark class="bg-transparent text-sky-400">`+text.slice(i,i+q.length)+`</mark>`+text.slice(i+q.length); }
  function fuzzyFilter(items, q){ if(!q) return items.map((it,idx)=>({label:it.label, action:it.action, index:idx})); q=q.toLowerCase(); return items.map((it,idx)=>{ const lbl=it.label.toLowerCase(); const pos=lbl.indexOf(q); return {score: pos<0?999:pos, label:it.label, action:it.action, index:idx}; }).sort((a,b)=>a.score-b.score); }
  document.addEventListener('keydown',(e)=>{ if((e.key==='k' && (e.ctrlKey||e.metaKey)) || e.key==='/'){ e.preventDefault(); openCmd(); } if(e.key==='Escape' && cmd.classList.contains('open')) closeCmd(); });
  cmdInput?.addEventListener('input', (e)=> renderCmd(e.target.value));
  cmdResults?.addEventListener('click', (e)=>{ const it=e.target.closest('.cmd-item'); if(!it) return; const i=Number(it.getAttribute('data-i')); closeCmd(); commands[i].action(); });
  cmd?.addEventListener('click', (e)=>{ if(e.target===cmd) closeCmd(); });
  cmdInput?.addEventListener('keydown', (e)=>{ const items=[...cmdResults.querySelectorAll('.cmd-item')]; const idx = items.findIndex(x=>x.getAttribute('aria-selected')==='true'); if(e.key==='ArrowDown'){ e.preventDefault(); const next=(idx+1)%items.length; items.forEach(x=>x.removeAttribute('aria-selected')); items[next]?.setAttribute('aria-selected','true'); items[next]?.scrollIntoView({block:'nearest'});} if(e.key==='ArrowUp'){ e.preventDefault(); const prev=(idx-1+items.length)%items.length; items.forEach(x=>x.removeAttribute('aria-selected')); items[prev]?.setAttribute('aria-selected','true'); items[prev]?.scrollIntoView({block:'nearest'});} if(e.key==='Enter'){ e.preventDefault(); const sel=items.find(x=>x.getAttribute('aria-selected')==='true')||items[0]; if(sel){ const i=Number(sel.getAttribute('data-i')); closeCmd(); commands[i].action(); }} });
});
