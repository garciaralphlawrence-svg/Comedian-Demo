/* Builds Kapitan's knowledge from data.js, so the fan assistant always matches
   the website: change a tour date in data.js and Kapitan knows it instantly.
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
  function abs(u) { return /^https?:/.test(u) ? u : site + (u || '').replace(/^\.?\//, ''); }
  function link(label, u) { return u && u !== '#' ? '[' + label + '](' + abs(u) + ')' : ''; }
  function showLine(t) {
    return '**' + fmt(t.date) + '** — ' + t.city + ', ' + t.venue + ' · ' + STATUS[t.status] +
      (t.status !== 'soldout' && t.url && t.url !== '#' ? ' · ' + link('Get tickets', t.url) : '');
  }

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var shows = (S.tour || []).filter(function (t) { return d(t.date) >= today; })
    .sort(function (a, b) { return d(a.date) - d(b.date); });
  var next = shows.filter(function (t) { return t.status !== 'soldout'; })[0];
  var tourPage = site + 'index.html#tour';
  var faq = [];
  function add(q, a) { faq.push({ site: 'comedian', q: q, a: a }); }

  // 1st entry = overview (used when someone just names the comedian)
  add(['who is ' + S.name, 'about ' + first, 'bio', 'who are you', 'tell me about ' + first],
    '**' + S.name + '** — ' + S.tagline + '. ' + (S.about && S.about[0] ? S.about[0] : ''));

  add(['when is the next show', 'next show', 'upcoming show', 'kailan next show', 'nearest show'],
    next ? 'Next show: ' + showLine(next) : 'No upcoming shows right now — new dates are announced on ' + first + "'s socials.");

  add(['tour dates', 'all shows', 'schedule', 'where are you performing', 'tour', 'shows', 'concert', 'saan ang show'],
    shows.length ? S.tourName + ':\n' + shows.slice(0, 8).map(function (t) { return '- ' + fmt(t.date).replace(/, \d{4}$/, '') + ' — ' + t.city + ' (' + STATUS[t.status].replace(/ —.*/, '') + ')'; }).join('\n') +
      (shows.length > 8 ? '\n…and ' + (shows.length - 8) + ' more.' : '') + '\n' + link('See all dates & tickets', tourPage)
      : 'No dates announced yet — follow ' + first + ' for the next announcement.');

  // one entry per city: "may show ba sa cebu?", "manila tickets"
  var byCity = {};
  shows.forEach(function (t) { (byCity[t.city] = byCity[t.city] || []).push(t); });
  Object.keys(byCity).forEach(function (city) {
    var c = city.split(',')[0].trim();
    add([c, c + ' show', 'show in ' + c, c + ' tickets', 'concert in ' + c, city],
      (byCity[city].length > 1 ? 'Yes! ' + byCity[city].length + ' shows in ' + c + ':\n' : 'Yes! ') +
      byCity[city].map(function (t) { return (byCity[city].length > 1 ? '- ' : '') + showLine(t); }).join('\n'));
  });

  var sold = shows.filter(function (t) { return t.status === 'soldout'; });
  var low = shows.filter(function (t) { return t.status === 'low'; });
  add(['sold out', 'which shows are sold out', 'still available', 'are tickets available', 'low tickets'],
    (sold.length ? '**Sold out:** ' + sold.map(function (t) { return t.city + ' (' + fmt(t.date).replace(/, \d{4}$/, '') + ')'; }).join(', ') + '\n' : 'No shows are sold out yet.\n') +
    (low.length ? '**Almost gone:** ' + low.map(function (t) { return t.city + ' (' + fmt(t.date).replace(/, \d{4}$/, '') + ')'; }).join(', ') + '\n' : '') +
    'Everything else still has tickets — ' + link('see the tour', tourPage));

  add(['how to buy tickets', 'tickets', 'where to buy tickets', 'ticket price', 'book tickets', 'magkano ticket'],
    'Tickets are sold by each venue\'s ticket partner, so prices depend on the venue and seat. Pick a date on the ' + link('tour page', tourPage) + ' and tap **Buy Tickets**.' +
    (next ? ' Next available: ' + next.city + ' on ' + fmt(next.date) + '.' : ''));

  // contacts by role
  var booking = null;
  (S.contacts || []).forEach(function (c) {
    var r = c.role.toLowerCase();
    var q = [r, r + ' contact', 'contact ' + r];
    if (/book/.test(r)) { booking = c; q = q.concat(['book ' + first + ' for an event', 'corporate event', 'private show', 'hire ' + first, 'booking inquiry', 'event']); }
    if (/manag/.test(r)) q = q.concat(['manager', 'management']);
    if (/press|media/.test(r)) q = q.concat(['interview', 'media', 'press']);
    if (/brand|partner/.test(r)) q = q.concat(['sponsorship', 'brand deal', 'collab', 'endorsement']);
    add(q, '**' + c.role + ':** ' + c.name + ' — ' + c.line);
  });
  add(['contact', 'email', 'fan mail', 'message ' + first, 'how to reach ' + first],
    'Fan mail: **' + S.fanEmail + '**' + (booking ? '\nFor bookings: ' + booking.name + ' — ' + booking.line : '') + '\n' + link('All contacts', site + 'index.html#contact'));

  if (S.merch && S.merch.length) add(['merch', 'merchandise', 'shirt', 'hoodie', 'store', 'shop', 'buy merch', 'hat'],
    'Official merch:\n' + S.merch.map(function (m) { return '- ' + m.name + ' — ' + m.price; }).join('\n') + '\n' + link('Shop all merch', S.merchStore));

  add(['videos', 'watch', 'comedy special', 'youtube', 'clips', 'netflix', 'where can i watch'],
    'Watch ' + first + "'s clips and specials in the " + link('Videos section', site + 'index.html#videos') + '.' +
    (S.videosMore && S.videosMore !== '#' ? ' More on ' + link('YouTube', S.videosMore) + '.' : ''));

  var soc = (S.socials || []).filter(function (x) { return x.href && x.href !== '#'; });
  add(['instagram', 'tiktok', 'social media', 'follow', 'facebook', 'socials', 'podcast'],
    'Follow ' + first + ': ' + (soc.length ? soc.map(function (x) { return link(x.label, x.href); }).join(' · ') : (S.socials || []).map(function (x) { return x.label; }).join(', ') + ' (links on the site).'));

  if (S.news && S.news.length) add(['news', 'latest', 'announcement', 'whats new'],
    'Latest: **' + S.news[0].title + '** — ' + S.news[0].excerpt + ' ' + link('Read more', S.news[0].href));

  window.KAPITAN_KB = {
    v: 2,
    sites: {
      comedian: {
        name: S.name,
        url: site,
        greeting: "Hey! I'm Kapitan 🎤 " + first + "'s assistant. Ask me about shows, tickets, merch or bookings — English or Taglish!",
        suggestions: ['When is the next show?', shows[2] ? 'May show ba sa ' + shows[2].city.split(',')[0] + '?' : 'Tour dates', 'How do I book ' + first + ' for an event?', 'Where can I buy merch?'],
        aliases: [S.name.toLowerCase(), String(first).toLowerCase()].filter(function (x, i, arr) { return x && arr.indexOf(x) === i; })
      }
    },
    faq: faq,
    chunks: (S.about || []).map(function (t) { return { site: 'comedian', siteName: S.name, text: t }; })
  };
})();
