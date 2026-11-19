/* Builds Kapitan's knowledge from data.js, so the fan assistant always matches
   the website: change a show in data.js and Kapitan knows it instantly.
   Load order: data.js → kapitan-kb.js → kapitan.js (data-site="comedian"). */
(function () {
  var S = window.SITE;
  if (!S) return;
  var first = S.firstName || S.name;
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var STATUS = { soldout: 'Sold out', low: 'Low tickets — hurry!', available: 'Tickets available' };
  var site = location.href.replace(/[#?].*$/, '').replace(/[^\/]*$/, '');
  function d(s) { var p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function fmt(s) { var x = d(s); return DOW[x.getDay()] + ', ' + MON[x.getMonth()] + ' ' + x.getDate() + ', ' + x.getFullYear(); }
  function short(s) { return fmt(s).replace(/, \d{4}$/, ''); }
  function abs(u) { return /^(https?:|tel:|mailto:)/.test(u) ? u : site + (u || '').replace(/^\.?\//, ''); }
  function link(label, u) { return u && u !== '#' ? '[' + label + '](' + abs(u) + ')' : ''; }
  function tel(p) { return 'tel:+1' + String(p).replace(/\D/g, ''); }
  function phones(t) { return (t.ticketPhones || []).map(function (p) { return p.name + ' ' + p.phone; }).join(' · '); }
  function prices(t) { return (t.prices || []).map(function (p) { return p.label + ' ' + p.price; }).join(' · '); }
  function where(t) { return t.venue + ', ' + (t.address || t.city); }
  function showLine(t) {
    return (t.show ? '**' + t.show + '** — ' : '') + '**' + fmt(t.date) + (t.time ? ', ' + t.time : '') + '** at ' + where(t) + '. ' +
      (t.prices ? 'Tickets: ' + prices(t) + '. ' : '') + STATUS[t.status] +
      (t.status === 'soldout' ? '' : t.ticketPhones ? ' — call ' + phones(t) + '.' : (t.url && t.url !== '#' ? ' · ' + link('Get tickets', t.url) : ''));
  }

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var shows = (S.tour || []).filter(function (t) { return d(t.date) >= today; })
    .sort(function (a, b) { return d(a.date) - d(b.date); });
  var next = shows.filter(function (t) { return t.status !== 'soldout'; })[0];
  var home = site + 'index.html';
  var faq = [];
  function add(q, a) { faq.push({ site: 'comedian', q: q, a: a }); }

  // 1st entry = overview (used for "who is he?" or when someone just names him)
  add(['who is ' + S.name, 'about ' + first, 'bio', 'who are you', 'tell me about ' + first],
    '**' + S.name + '** — ' + S.tagline + '. ' + (S.about && S.about[0] ? S.about[0] : ''));

  add(['when is the next show', 'next show', 'upcoming show', 'kailan next show', 'kailan show', 'nearest show', 'next event'],
    next ? 'Next show: ' + showLine(next) : 'No upcoming shows right now — new dates are announced on ' + first + "'s YouTube.");

  add(['tour dates', 'all shows', 'schedule', 'where are you performing', 'shows', 'events', 'concert', 'saan ang show'],
    shows.length ? 'Upcoming shows:\n' + shows.slice(0, 8).map(function (t) { return '- ' + short(t.date) + ' — ' + (t.show ? t.show + ', ' : '') + t.city + ' (' + STATUS[t.status].replace(/ —.*/, '') + ')'; }).join('\n') +
      '\n' + link('See shows', home + '#tour') : 'No dates announced yet — follow ' + first + ' for the next announcement.');

  // one entry per city: "may show ba sa long beach?", "LA show"
  var byCity = {};
  shows.forEach(function (t) { (byCity[t.city] = byCity[t.city] || []).push(t); });
  Object.keys(byCity).forEach(function (city) {
    var c = city.split(',')[0].trim();
    var q = [c, c + ' show', 'show in ' + c, c + ' tickets', 'concert in ' + c, city];
    if (/long beach|los angeles|hollywood|carson|torrance/i.test(city)) q = q.concat(['los angeles', 'la show', 'california', 'show in la', 'socal']);
    add(q, (byCity[city].length > 1 ? 'Yes! ' + byCity[city].length + ' shows in ' + c + ':\n' : 'Yes! ') +
      byCity[city].map(function (t) { return (byCity[city].length > 1 ? '- ' : '') + showLine(t); }).join('\n'));
  });

  var sold = shows.filter(function (t) { return t.status === 'soldout'; });
  var low = shows.filter(function (t) { return t.status === 'low'; });
  add(['sold out', 'is it sold out', 'still available', 'are tickets available', 'low tickets', 'may ticket pa'],
    (sold.length ? '**Sold out:** ' + sold.map(function (t) { return t.city + ' (' + short(t.date) + ')'; }).join(', ') + '\n' : 'Not sold out yet! ') +
    (low.length ? '**Almost gone:** ' + low.map(function (t) { return t.city + ' (' + short(t.date) + ')'; }).join(', ') + '\n' : '') +
    (next && next.ticketPhones ? 'Grab yours now — call ' + phones(next) + '.' : link('See shows', home + '#tour')));

  if (next && next.prices) {
    add(['ticket price', 'how much are tickets', 'magkano ticket', 'vip', 'general admission', 'price'],
      (next.show || 'Next show') + ' tickets: **' + prices(next) + '**.' + (next.ticketPhones ? ' To buy, call ' + phones(next) + '.' : ''));
  }
  add(['how to buy tickets', 'tickets', 'where to buy tickets', 'book tickets', 'reserve tickets', 'paano bumili ticket'],
    next && next.ticketPhones
      ? 'Tickets for ' + (next.show || 'the next show') + ' are sold by phone' + (next.prices ? ' (' + prices(next) + ')' : '') + '. Call ' + phones(next) + '.'
      : 'Pick a date on the ' + link('shows page', home + '#tour') + ' and tap **Buy Tickets**.');
  if (next) {
    add(['where is the venue', 'address', 'venue', 'location', 'how to get there', 'parking', 'saan ang venue', 'directions'],
      '**' + next.venue + '** — ' + (next.address || next.city) + '. ' + link('Open in Google Maps', 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(where(next))));
    add(['what time is the show', 'what time', 'anong oras', 'when does it start', 'start time'],
      (next.show || 'The show') + ' starts at **' + (next.time || 'TBA') + '** on ' + fmt(next.date) + '.');
    if (next.lineup) add(['who is performing', 'lineup', 'who else is in the show', 'dreamgays', 'thage', 'bona', 'kasama', 'performers'],
      (next.show ? '**' + next.show + '**: ' : '') + next.lineup + '.');
  }

  // contacts by role
  (S.contacts || []).forEach(function (c) {
    var r = c.role.toLowerCase();
    var q = [r, r + ' contact', 'contact ' + r];
    if (/book/.test(r)) q = q.concat(['booking', 'book ' + first, 'book ' + first + ' for an event', 'corporate event', 'private show', 'hire ' + first, 'party', 'event', 'birthday']);
    if (/ticket/.test(r)) q = q.concat(['ticket hotline', 'ticket contact']);
    if (/manag/.test(r)) q = q.concat(['manager', 'management']);
    if (/press|media/.test(r)) q = q.concat(['interview', 'media', 'press']);
    if (/brand|partner/.test(r)) q = q.concat(['sponsorship', 'brand deal', 'collab', 'endorsement']);
    add(q, '**' + c.role + ':** ' + c.name + ' — ' + c.line);
  });
  add(['contact', 'email', 'phone number', 'message ' + first, 'how to reach ' + first, 'contact number'],
    (S.fanEmail ? 'Fan mail: **' + S.fanEmail + '**\n' : '') +
    (S.contacts || []).map(function (c) { return '**' + c.role + ':** ' + c.name + ' — ' + c.line; }).join('\n') + '\n' + link('All contacts', home + '#contact'));

  if (S.merch && S.merch.length) add(['merch', 'merchandise', 'shirt', 'hoodie', 'store', 'shop', 'buy merch', 'hat'],
    'Official merch:\n' + S.merch.map(function (m) { return '- ' + m.name + ' — ' + m.price; }).join('\n') + '\n' + link('Shop all merch', S.merchStore));
  else add(['merch', 'merchandise', 'shirt', 'store', 'shop'], 'No merch store yet — stay tuned! Meanwhile, catch ' + first + ' live or on ' + link('YouTube', S.videosMore) + '.');

  var picks = (S.shorts || []).concat(S.videos || []).slice(0, 3).map(function (v) { return v.title; });
  add(['videos', 'watch', 'youtube', 'clips', 'vlog', 'where can i watch', 'panlasang charot', 'funny videos'],
    'Watch ' + first + ' in the ' + link('Videos section', home + '#videos') + (S.videosMore ? ' or subscribe on ' + link('YouTube', S.videosMore) : '') + '.' +
    (picks.length ? ' Fan favourites: ' + picks.join(', ') + '.' : ''));

  var soc = (S.socials || []).filter(function (x) { return x.href && x.href !== '#'; });
  add(['instagram', 'tiktok', 'social media', 'follow', 'facebook', 'socials', 'subscribe'],
    'Follow ' + first + ': ' + (soc.length ? soc.map(function (x) { return link(x.label, x.href); }).join(' · ') : 'links are on the site.'));

  if (S.news && S.news.length) add(['news', 'latest', 'announcement', 'whats new'],
    'Latest: **' + S.news[0].title + '** — ' + S.news[0].excerpt + ' ' + link('Read more', S.news[0].href));

  window.KAPITAN_KB = {
    v: 2,
    sites: {
      comedian: {
        name: S.name,
        url: site,
        greeting: "Hey! I'm Kapitan 🎤 " + first + "'s assistant. Ask me about shows, tickets or bookings — English or Taglish!",
        suggestions: ['When is the next show?', 'How much are tickets?', 'Where is the venue?', 'How do I book ' + first + ' for an event?'],
        aliases: [S.name.toLowerCase(), String(first).toLowerCase()].filter(function (x, i, arr) { return x && arr.indexOf(x) === i; })
      }
    },
    faq: faq,
    chunks: (S.about || []).map(function (t) { return { site: 'comedian', siteName: S.name, text: t }; })
  };
})();
