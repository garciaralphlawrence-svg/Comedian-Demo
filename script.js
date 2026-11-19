(() => {
  const S = window.SITE;
  if (/[?&]still/.test(location.search)) document.documentElement.classList.add('still');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ph = icon => `<div class="ph"><i class="${icon}"></i></div>`;
  const ext = href => /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
  const MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const DOW = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const parseDate = d => { const [y, m, day] = d.split('-').map(Number); return new Date(y, m - 1, day); };

  /* ---------- simple text bindings ---------- */
  document.title = `${S.name} — Official Site`;
  $$('[data-bind]').forEach(el => el.textContent = S[el.dataset.bind] ?? '');
  $$('[data-href]').forEach(el => el.href = S[el.dataset.href] || '#');
  $('#year').textContent = new Date().getFullYear();

  // split hero title into letters for the stagger-in
  const h1 = $('.hero-title');
  h1.innerHTML = S.name.split(' ').map(w => `<span style="white-space:nowrap">${[...w].map(c => `<span class="ch">${esc(c)}</span>`).join('')}</span>`).join(' ');
  $$('.ch', h1).forEach((c, i) => c.style.transitionDelay = `${.15 + i * .04}s`);

  /* ---------- section renderers ---------- */
  const R = {
    socials: () => S.socials.map(s => `<a href="${esc(s.href)}" aria-label="${esc(s.label)}"${ext(s.href)}><i class="${s.icon}"></i></a>`).join(''),
    heroButtons: () => S.heroButtons.map(b => `<a href="${esc(b.href)}" class="btn ${b.primary ? 'btn-primary' : ''}">${b.primary ? '<i class="fa-solid fa-ticket"></i>' : '<i class="fa-solid fa-play"></i>'}${esc(b.label)}</a>`).join(''),
    chips: () => S.chips.map((c, i) => `<div class="chip chip-${i}" data-depth="${[2.2, 2.6, 1.9][i] || 2}"><i class="${c.icon}"></i><div><b>${esc(c.title)}</b><small>${esc(c.sub)}</small></div></div>`).join(''),
    promos: () => S.promos.map(p => `<a class="promo reveal" href="${esc(p.href)}"${ext(p.href)}>${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : ph('fa-solid fa-image')}<span class="arrow"><i class="fa-solid fa-arrow-right"></i></span><small>${esc(p.kicker)}</small><h3>${esc(p.title)}</h3></a>`).join(''),
    about: () => S.about.map(p => `<p>${esc(p)}</p>`).join(''),
    stats: () => S.stats.map(s => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join(''),
    videos: () => S.videos.map(v => `<button class="video reveal" data-yt="${esc(v.id)}"><div class="thumb">${v.id ? `<img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy">` : ph('fa-brands fa-youtube')}<span class="play"><i class="fa-solid fa-play"></i></span></div><p>${esc(v.title)}</p></button>`).join(''),
    merch: () => S.merch.map(m => `<a class="product reveal" href="${esc(m.href)}"${ext(m.href)}><div class="img">${m.img ? `<img src="${esc(m.img)}" alt="${esc(m.name)}" loading="lazy">` : ph('fa-solid fa-shirt')}</div><div class="info"><b>${esc(m.name)}</b><span>${esc(m.price)}</span></div></a>`).join(''),
    news: () => S.news.map(n => { const d = parseDate(n.date); return `<a class="news-card reveal" href="${esc(n.href)}"${ext(n.href)}><div class="img">${n.img ? `<img src="${esc(n.img)}" alt="" loading="lazy">` : ph('fa-regular fa-newspaper')}</div><time>${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}</time><h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p></a>`; }).join(''),
    contacts: () => S.contacts.concat([{ role: `Talk to ${S.firstName}`, name: 'Fan mail', line: S.fanEmail }])
      .map(c => `<div class="contact reveal"><small>${esc(c.role)}</small><b>${esc(c.name)}</b>${/@/.test(c.line) ? `<a href="mailto:${esc(c.line)}">${esc(c.line)}</a>` : `<a href="tel:${esc(c.line)}">${esc(c.line)}</a>`}</div>`).join('')
  };
  $$('[data-render]').forEach(el => { const f = R[el.dataset.render]; if (f) el.innerHTML = f(); });
  // chips must sit directly inside .hero-visual so they position against it
  const chipHost = $('#heroVisual [data-render="chips"]'); chipHost.replaceWith(...chipHost.children);

  /* ---------- tour: upcoming only, sorted, preview + expand ---------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const shows = S.tour.filter(t => parseDate(t.date) >= today).sort((a, b) => parseDate(a.date) - parseDate(b.date));
  const LABEL = { available: 'Buy Tickets', low: 'Low Tickets', soldout: 'Sold Out' };
  $('#tourList').innerHTML = shows.length ? shows.map((t, i) => { const d = parseDate(t.date); return `
    <li class="tour-row reveal${i >= S.tourPreview ? ' hidden' : ''}">
      <div class="t-date"><small>${MON[d.getMonth()]}</small><b>${d.getDate()}</b><em>${DOW[d.getDay()]}</em></div>
      <div><div class="t-city">${esc(t.city)}${t.note ? `<span class="t-badge">${esc(t.note)}</span>` : ''}</div><div class="t-venue">${esc(t.venue)}</div></div>
      <a class="btn t-btn ${t.status === 'available' ? 'btn-primary' : t.status}" href="${esc(t.url)}"${ext(t.url)}>${LABEL[t.status] || 'Tickets'}</a>
    </li>`; }).join('') : '<li class="tour-row"><div></div><div class="t-venue">New dates coming soon. Follow along for announcements.</div></li>';
  const more = $('#tourMore');
  if (shows.length <= S.tourPreview) more.remove();
  else more.addEventListener('click', () => {
    const open = more.dataset.open === '1';
    $$('.tour-row').forEach((r, i) => { if (i >= S.tourPreview) { r.classList.toggle('hidden', open); r.classList.add('in'); } });
    more.dataset.open = open ? '0' : '1'; more.textContent = open ? 'See all dates' : 'Show fewer';
    if (open) $('#tour').scrollIntoView();
  });

  // next show card in the hero
  const nx = shows.find(t => t.status !== 'soldout');
  if (nx) { const d = parseDate(nx.date); $('#nextShow').innerHTML = `<div class="ns-date"><small>${MON[d.getMonth()]}</small>${d.getDate()}</div><div><span>Next show</span><b>${esc(nx.city)} · ${esc(nx.venue)}</b></div><a class="btn btn-sm btn-primary" href="${esc(nx.url)}"${ext(nx.url)}>Tickets</a>`; }

  // ticker
  const items = [S.tourName, ...new Set(shows.map(t => t.city))].slice(0, 9).map(t => `<span>${esc(t)}</span><i class="fa-solid fa-star"></i>`).join('');
  $('#ticker').innerHTML = items + items;

  /* ---------- floating cutout ---------- */
  const img = $('#portraitImg');
  img.alt = S.name; img.src = S.photo;
  const sweep = $('.sweep');
  sweep.style.webkitMaskImage = sweep.style.maskImage = `url("${S.photo}")`;
  const ready = () => requestAnimationFrame(() => document.body.classList.add('ready'));
  img.complete ? ready() : (img.addEventListener('load', ready), img.addEventListener('error', ready));
  setTimeout(ready, 2500); // never leave the hero hidden

  // mouse parallax: every [data-depth] layer drifts by its depth
  const hero = $('.hero');
  const layers = $$('.hero [data-depth]');
  const fine = matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fine) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    hero.addEventListener('mousemove', e => { const r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; });
    hero.addEventListener('mouseleave', () => { tx = ty = 0; });
    (function loop() {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      layers.forEach(l => { const d = +l.dataset.depth; l.style.translate = `${-cx * d * 14}px ${-cy * d * 10}px`; });
      requestAnimationFrame(loop);
    })();
  }
  // portrait uses transform for centering, so parallax rides on `translate` (separate property) — no conflict

  /* ---------- nav ---------- */
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });
  const burger = $('#burger'), links = $('#navLinks');
  burger.addEventListener('click', () => { burger.classList.toggle('open'); links.classList.toggle('open'); });
  $$('a', links).forEach(a => a.addEventListener('click', () => { burger.classList.remove('open'); links.classList.remove('open'); }));
  const secs = $$('main section[id]');
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$('a', links).forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => spy.observe(s));

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * .08}s`; io.observe(el); });

  /* ---------- video lightbox ---------- */
  const lb = $('#lightbox'), frame = $('#lbFrame');
  $$('.video').forEach(v => v.addEventListener('click', () => {
    if (!v.dataset.yt) return;
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.dataset.yt)}?autoplay=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    lb.hidden = false;
  }));
  const close = () => { lb.hidden = true; frame.innerHTML = ''; };
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('.lb-close')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
})();
