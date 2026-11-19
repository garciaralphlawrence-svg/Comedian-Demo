(() => {
  const S = window.SITE;
  if (/[?&]still/.test(location.search)) document.documentElement.classList.add('still');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ext = href => /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const parseDate = d => { const [y, m, day] = d.split('-').map(Number); return new Date(y, m - 1, day); };
  const tel = p => 'tel:+1' + String(p).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  const isPhone = s => /^[+\d][\d\s().-]{6,}$/.test(String(s).trim());

  /* ---------- text bindings ---------- */
  document.title = `${S.name} — Official Site`;
  $$('[data-bind]').forEach(el => el.textContent = S[el.dataset.bind] ?? '');
  $$('[data-href]').forEach(el => el.href = S[el.dataset.href] || '#');
  $('#year').textContent = new Date().getFullYear();
  // hide sections (and their nav links) that have no content
  $$('[data-needs]').forEach(el => { if (!(S[el.dataset.needs] || []).length) el.hidden = true; });

  // hero title: one word per line, letters stagger in, surname in shimmering gold
  const words = S.name.split(' ');
  let n = 0;
  $('#heroTitle').innerHTML = words.map((w, wi) =>
    `<span class="word${wi === words.length - 1 ? ' gold-text' : ''}">${[...w].map(c => `<span class="ch" style="transition-delay:${1.6 + (n++) * .05}s">${esc(c)}</span>`).join('')}</span>`).join('');
  $('#heroTitle').setAttribute('aria-label', S.name);

  /* ---------- renderers ---------- */
  const R = {
    socials: () => S.socials.map(s => `<a href="${esc(s.href)}" aria-label="${esc(s.label)}"${ext(s.href)}><i class="${s.icon}"></i></a>`).join(''),
    heroButtons: () => S.heroButtons.map(b => `<a href="${esc(b.href)}" class="btn ${b.primary ? 'btn-gold' : 'btn-ghost'}"${ext(b.href)}><i class="${b.primary ? 'fa-solid fa-ticket' : 'fa-brands fa-youtube'}"></i>${esc(b.label)}</a>`).join(''),
    chips: () => S.chips.map((c, i) => `<div class="chip chip-${i}"><i class="${c.icon}"></i><div><b>${esc(c.title)}</b><small>${esc(c.sub)}</small></div></div>`).join(''),
    promos: () => S.promos.map(p => `<a class="promo reveal${p.contain ? ' contain' : ''}" href="${esc(p.href)}"${ext(p.href)}><img src="${esc(p.img)}" alt="" loading="lazy" style="object-position:${esc(p.pos || '50% 50%')}"><span class="arrow"><i class="fa-solid fa-arrow-right"></i></span><small>${esc(p.kicker)}</small><h3>${esc(p.title)}</h3></a>`).join(''),
    about: () => S.about.map(p => `<p>${esc(p)}</p>`).join(''),
    stats: () => S.stats.map(s => `<div class="stat"><b data-count="${esc(s.value)}">${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join(''),
    videos: () => S.videos.slice(1).map(v => `<button class="video reveal" data-yt="${esc(v.id)}"><div class="thumb"><img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy"><span class="mini-play"><i class="fa-solid fa-play"></i></span></div><p>${esc(v.title)}</p></button>`).join(''),
    merch: () => S.merch.map(m => `<a class="product reveal" href="${esc(m.href)}"${ext(m.href)}><div class="img"><img src="${esc(m.img)}" alt="${esc(m.name)}" loading="lazy"></div><div class="info"><b>${esc(m.name)}</b><span>${esc(m.price)}</span></div></a>`).join(''),
    news: () => S.news.map(x => { const d = parseDate(x.date); return `<a class="news-card reveal" href="${esc(x.href)}"${ext(x.href)}><div class="img"><img src="${esc(x.img)}" alt="" loading="lazy"></div><time>${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}</time><h3>${esc(x.title)}</h3><p>${esc(x.excerpt)}</p></a>`; }).join(''),
    contacts: () => S.contacts.concat(S.fanEmail ? [{ role: `Fan mail`, name: `Write to ${S.firstName}`, line: S.fanEmail }] : [])
      .map(c => `<div class="contact reveal"><span class="ic"><i class="fa-solid ${/@/.test(c.line) ? 'fa-envelope' : 'fa-phone'}"></i></span><small>${esc(c.role)}</small><b>${esc(c.name)}</b>${/@/.test(c.line) ? `<a href="mailto:${esc(c.line)}">${esc(c.line)}</a>` : isPhone(c.line) ? `<a href="${tel(c.line)}">${esc(c.line)}</a>` : `<span>${esc(c.line)}</span>`}</div>`).join('')
  };
  $$('[data-render]').forEach(el => { const f = R[el.dataset.render]; if (f) el.innerHTML = f(); });
  const chipHost = $('#heroVisual [data-render="chips"]'); chipHost.replaceWith(...chipHost.children);

  /* ---------- shows ---------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const shows = S.tour.filter(t => parseDate(t.date) >= today).sort((a, b) => parseDate(a.date) - parseDate(b.date));
  const LABEL = { available: 'Buy Tickets', low: 'Low Tickets', soldout: 'Sold Out' };
  $('#tourList').innerHTML = shows.length ? shows.map((t, i) => { const d = parseDate(t.date); return `
    <li class="tour-row reveal${i >= S.tourPreview ? ' hidden' : ''}">
      <div class="t-date"><small>${MON[d.getMonth()]}</small><b>${d.getDate()}</b><em>${DOW[d.getDay()]}${t.time ? ' · ' + esc(t.time) : ''}</em></div>
      <div>${t.show ? `<div class="t-show">${esc(t.show)}${t.note ? `<span class="t-badge">${esc(t.note)}</span>` : ''}</div>` : ''}<div class="t-city">${esc(t.city)}</div><div class="t-venue">${esc(t.venue)}</div></div>
      <a class="btn t-btn ${t.status === 'available' ? 'btn-gold' : t.status}" href="${esc(t.url)}"${ext(t.url)}><i class="fa-solid ${/^tel:/.test(t.url) ? 'fa-phone' : 'fa-ticket'}"></i>${esc(t.status === 'available' && t.cta ? t.cta : LABEL[t.status])}</a>
    </li>`; }).join('') : '<li class="tour-row"><div></div><div class="t-venue">New dates coming soon.</div></li>';
  const more = $('#tourMore');
  if (shows.length <= S.tourPreview) more.remove();
  else more.addEventListener('click', () => {
    const open = more.dataset.open === '1';
    $$('.tour-row').forEach((r, i) => { if (i >= S.tourPreview) { r.classList.toggle('hidden', open); r.classList.add('in'); } });
    more.dataset.open = open ? '0' : '1'; more.textContent = open ? 'See all dates' : 'Show fewer';
  });

  /* ---------- featured event: poster + countdown + prices ---------- */
  const ev = shows.find(t => t.featured) || shows[0];
  const startOf = t => t ? new Date(t.startUtc || t.date + 'T20:00:00') : null;
  if (ev) {
    const d = parseDate(ev.date);
    const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ev.venue + ', ' + (ev.address || ev.city));
    $('#eventWrap').innerHTML = `
      ${ev.poster ? `<div class="poster-wrap reveal"><div class="poster" id="poster"><img src="${esc(ev.poster)}" alt="${esc(ev.show || S.tourName)} poster" loading="lazy"></div></div>` : ''}
      <div class="event-info">
        <span class="kicker reveal">Next show</span>
        <h2 class="event-title reveal"><span class="script">live in ${esc(ev.city.split(',')[0] === 'Long Beach' ? 'Los Angeles' : ev.city.split(',')[0])}</span>${esc(ev.show || S.tourName)}</h2>
        ${ev.lineup ? `<p class="event-lineup reveal">${esc(ev.lineup)}</p>` : ''}
        <ul class="event-facts reveal">
          <li><i class="fa-regular fa-calendar"></i><div><b>${DAY[d.getDay()]}, ${MONTH[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}</b><span>${ev.time ? 'Show starts ' + esc(ev.time) : ''}</span></div></li>
          <li><i class="fa-solid fa-location-dot"></i><div><b>${esc(ev.venue)}</b><span><a href="${map}" target="_blank" rel="noopener">${esc(ev.address || ev.city)}</a></span></div></li>
        </ul>
        ${ev.prices ? `<div class="prices reveal">${ev.prices.map((p, i) => `<div class="price${i === 0 ? ' vip' : ''}"><small>${esc(p.label)}</small><b>${esc(p.price)}</b></div>`).join('')}</div>` : ''}
        <a class="btn btn-gold reveal" href="${esc(ev.url)}"${ext(ev.url)}><i class="fa-solid ${/^tel:/.test(ev.url) ? 'fa-phone' : 'fa-ticket'}"></i>${esc(ev.cta || 'Get Tickets')}</a>
        ${ev.ticketPhones ? `<div class="ticket-lines reveal">${ev.ticketPhones.map(p => `<a href="${tel(p.phone)}"><i class="fa-solid fa-phone"></i>${esc(p.name)} · ${esc(p.phone)}</a>`).join('')}</div>` : ''}
        <span class="count-label reveal">Showtime in</span>
        <div class="countdown reveal" id="bigCount"></div>
      </div>`;
  } else $('#event').hidden = true;

  // countdowns tick every second; digits flip when they change
  const target = startOf(ev);
  const counters = [$('#miniCount'), $('#bigCount')].filter(Boolean);
  const UNITS = [['d', 'Days', 864e5], ['h', 'Hrs', 36e5], ['m', 'Min', 6e4], ['s', 'Sec', 1e3]];
  counters.forEach(c => { c.innerHTML = UNITS.map(u => `<div class="unit"><span class="num" data-u="${u[0]}"></span><small>${u[1]}</small></div>`).join(''); });
  function tick() {
    if (!target) return;
    let left = Math.max(0, target - Date.now());
    const vals = {};
    UNITS.forEach(([k, , ms]) => { vals[k] = Math.floor(left / ms); left -= vals[k] * ms; });
    counters.forEach(c => $$('.num', c).forEach(el => {
      const v = String(vals[el.dataset.u]).padStart(2, '0');
      if (el.dataset.v !== v) { el.dataset.v = v; el.innerHTML = `<i>${v}</i>`; }
    }));
  }
  if (target && target > Date.now()) { tick(); setInterval(tick, 1000); } else counters.forEach(c => c.remove());

  // ticker
  const items = [S.tourName, S.name, 'Comedy · Diva · Live', ...shows.map(t => `${t.city} · ${MON[parseDate(t.date).getMonth()]} ${parseDate(t.date).getDate()}`), 'Panlasang Charot on YouTube'];
  const tk = items.map(t => `<span>${esc(t)}</span><i class="fa-solid fa-star"></i>`).join('');
  $('#ticker').innerHTML = tk + tk + tk + tk;

  /* ---------- photos ---------- */
  const img = $('#portraitImg');
  img.alt = S.name;
  if (S.photo && /\.webp$/.test(S.photo)) $('#photoWebp').srcset = S.photo;
  img.src = S.photoFallback || S.photo;
  const sweep = $('.sweep');
  sweep.style.webkitMaskImage = sweep.style.maskImage = `url("${S.photoFallback || S.photo}")`;
  const aboutImg = $('#aboutImg'); aboutImg.src = S.photo; aboutImg.alt = S.name;
  const ready = () => requestAnimationFrame(() => document.documentElement.classList.add('ready'));
  img.complete ? ready() : (img.addEventListener('load', ready), img.addEventListener('error', ready));
  setTimeout(ready, 2600);

  /* ---------- falling gold glitter (canvas) ---------- */
  const cv = $('#glitter'), hero = $('#hero');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    let W, H, dpr, parts = [], running = true;
    const COLORS = ['#fff1c1', '#e8c26a', '#f6dc8d', '#b8862f', '#ffffff', '#c3283f'];
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, W * H / 11000));
      parts = Array.from({ length: count }, () => spawn(true));
    }
    function spawn(anywhere) {
      const star = Math.random() < .16;
      return { x: Math.random() * W, y: anywhere ? Math.random() * H : -20, s: star ? 2 + Math.random() * 3 : 2 + Math.random() * 5,
        vy: .35 + Math.random() * 1.1, vx: (Math.random() - .5) * .4, a: Math.random() * Math.PI * 2, va: (Math.random() - .5) * .08,
        sway: Math.random() * Math.PI * 2, c: COLORS[(Math.random() * (star ? 2 : COLORS.length)) | 0], star, tw: Math.random() * Math.PI * 2 };
    }
    function draw(p) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
      if (p.star) {
        const g = .5 + .5 * Math.sin(p.tw); ctx.globalAlpha = .35 + .65 * g; ctx.fillStyle = p.c;
        const r = p.s * (1 + g); ctx.beginPath();
        for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.lineTo(0, -r * 2.2); ctx.lineTo(r * .35, -r * .35); }
        ctx.closePath(); ctx.fill();
      } else {
        ctx.globalAlpha = .85; ctx.fillStyle = p.c;
        ctx.scale(1, Math.abs(Math.cos(p.a * 2)) * .9 + .1); // confetti flips as it falls
        ctx.fillRect(-p.s / 2, -p.s * .35, p.s, p.s * .7);
      }
      ctx.restore();
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.sway += .02; p.x += p.vx + Math.sin(p.sway) * .35; p.y += p.vy; p.a += p.va; p.tw += .08;
        if (p.y > H + 20 || p.x < -30 || p.x > W + 30) parts[i] = spawn(false);
        draw(p);
      }
      requestAnimationFrame(frame);
    }
    size(); addEventListener('resize', size);
    // only animate while the hero is on screen and the tab is visible
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting && !document.hidden; if (running && !was) frame(); }).observe(hero);
    document.addEventListener('visibilitychange', () => { const was = running; running = !document.hidden; if (running && !was) frame(); });
    frame();
  }

  /* ---------- scroll-driven motion (no cursor tracking) ---------- */
  const nav = $('#nav');
  const layers = $$('[data-scroll]');
  const heroName = $('.hero-name');
  let ticking = false;
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 30);
    if (!reduce && y < innerHeight * 1.2) {
      layers.forEach(l => l.style.translate = `${l.classList.contains('portrait') ? '-50%' : '0'} ${y * +l.dataset.scroll}px`);
      heroName.style.transform = `translateX(${-y * .25}px)`;
    }
    const poster = $('#poster');
    if (poster && !reduce) {
      const r = poster.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, 1 - (r.top + r.height * .3) / innerHeight)); // 0 → 1 as it scrolls into view
      poster.style.setProperty('--rx', (14 * (1 - p)).toFixed(2) + 'deg');
      poster.style.setProperty('--ry', (-12 * (1 - p)).toFixed(2) + 'deg');
      poster.style.setProperty('--ps', (.92 + .08 * p).toFixed(3));
    }
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- nav ---------- */
  const burger = $('#burger'), links = $('#navLinks');
  burger.addEventListener('click', () => { burger.classList.toggle('open'); links.classList.toggle('open'); });
  $$('a', links).forEach(a => a.addEventListener('click', () => { burger.classList.remove('open'); links.classList.remove('open'); }));
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('a', links).forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* ---------- scroll reveals + count-up stats ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(countUp);
  }), { threshold: .12 });
  $$('.reveal, .reveal-wipe').forEach((el, i) => { if (el.classList.contains('reveal')) el.style.transitionDelay = `${(i % 4) * .08}s`; io.observe(el); });
  function countUp(el) {
    const m = el.dataset.count.match(/^(\d+)(.*)$/);
    if (!m || reduce) return;
    const end = +m[1], suf = m[2], t0 = performance.now();
    (function step(t) { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(step); })(t0);
  }

  /* ---------- videos ---------- */
  const lead = S.videos[0];
  if (lead) $('#videoFeature').outerHTML = `<button class="video-feature reveal" data-yt="${esc(lead.id)}"><img src="https://i.ytimg.com/vi/${esc(lead.id)}/maxresdefault.jpg" onerror="this.src='https://i.ytimg.com/vi/${esc(lead.id)}/hqdefault.jpg'" alt="" loading="lazy"><span class="play"><i class="fa-solid fa-play"></i></span><div class="vf-info"><small>Featured video</small><h3>${esc(lead.title)}</h3></div></button>`;
  const shortsHtml = (S.shorts || []).map(v => `<button class="short" data-yt="${esc(v.id)}" data-vertical="1"><span class="badge"><i class="fa-brands fa-youtube"></i></span><img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy"><span>${esc(v.title)}</span></button>`).join('');
  if (shortsHtml) $('#shortsTrack').innerHTML = shortsHtml + shortsHtml; // doubled for a seamless loop
  else { $('.shorts').remove(); $('.shorts-head').remove(); }
  $$('.reveal').forEach(el => { if (!el.classList.contains('in')) io.observe(el); });

  const lb = $('#lightbox'), frame = $('#lbFrame');
  document.addEventListener('click', e => {
    const v = e.target.closest('[data-yt]');
    if (!v) return;
    frame.classList.toggle('vertical', !!v.dataset.vertical);
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.dataset.yt)}?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    lb.hidden = false;
  });
  const close = () => { lb.hidden = true; frame.innerHTML = ''; };
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-close')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
})();
