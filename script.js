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
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
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

  // Copy to clipboard
  document.querySelectorAll('.copy-btn').forEach((btn) => {
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

  // Modular projects rendering
  const projects = [
    {
      title: 'AI Code Reviewer',
      href: 'https://github.com/Ahm-edAshraf/ai-code-reviewer',
      desc: 'Uses Gemini API to review PRs, suggest improvements, and comment automatically via GitHub webhooks.',
      tech: 'Python • Flask • Webhooks',
      image: null
    },
    {
      title: 'FormAI',
      href: 'https://github.com/Ahm-edAshraf/FormAi',
      desc: 'AI‑powered form builder to generate, customize, and validate forms with natural language prompts.',
      tech: 'Next.js • Supabase • Tailwind',
      image: null
    },
    {
      title: 'APU Student Help',
      href: 'https://github.com/Ahm-edAshraf/apu-student-help',
      desc: 'Peer‑assist platform for university students to exchange help and resources.',
      tech: 'Node.js • Express • Web',
      image: null
    }
  ];

  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.innerHTML = projects.map((p) => {
      const placeholder = 'assets/placeholder.svg';
      const imgSrc = p.image || placeholder;
      return `
        <a href="${p.href}" target="_blank" rel="noopener" class="project-card group" data-ripple>
          <div class="project-card-inner">
            <figure class="project-media">
              <img src="${imgSrc}" alt="${p.title} preview" loading="lazy"/>
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
});
