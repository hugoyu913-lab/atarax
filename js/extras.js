// ── Extras: Dark Mode, Favourites, Reading List, Enhanced Search ──────────

// ── Dark Mode ─────────────────────────────────────────────────────────────

function toggleDarkMode() {
  var html = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  var next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  // Theme is a device-local UI preference — stored directly in localStorage
  // so it can be applied before Supabase loads (prevents flash on page load).
  try { localStorage.setItem('sj_theme', next); } catch (e) {}
  updateDarkToggleIcon();
}

function updateDarkToggleIcon() {
  var btn = document.getElementById('dark-toggle');
  if (!btn) return;
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.innerHTML = isDark ? '&#9788;' : '&#9790;';
  btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
}

function initDarkMode() {
  try {
    if (localStorage.getItem('sj_theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}
  updateDarkToggleIcon();
}

// ── Favourite Quotes ──────────────────────────────────────────────────────

function getFavorites() {
  return getData('sj_favorites') || [];
}

function saveFavorites(favs) {
  setData('sj_favorites', favs);
}

function isQuoteFavorited(quote) {
  var favs = getFavorites();
  return favs.some(function(f) { return f.quote === quote.quote && f.author === quote.author; });
}

function toggleFavoriteQuote() {
  var q = getDailyQuote();
  var favs = getFavorites();
  var idx = favs.findIndex(function(f) { return f.quote === q.quote && f.author === q.author; });
  if (idx === -1) {
    favs.push(q);
    setData('sj_favorites', favs);
    showToast('Quote saved to Favourites');
  } else {
    favs.splice(idx, 1);
    setData('sj_favorites', favs);
    showToast('Quote removed from Favourites');
  }
  updateFavButton();
}

function updateFavButton() {
  var btn = document.getElementById('fav-quote-btn');
  if (!btn) return;
  var q = getDailyQuote();
  var isFav = isQuoteFavorited(q);
  btn.classList.toggle('favorited', isFav);
  btn.innerHTML = isFav ? '&#9829;' : '&#9825;';
  btn.title = isFav ? 'Remove from Favourites' : 'Save to Favourites';
}

function removeFavorite(idx) {
  var favs = getFavorites();
  favs.splice(idx, 1);
  saveFavorites(favs);
  updateFavButton();
  renderFavorites();
  showToast('Quote removed from Favourites');
}

function renderFavorites() {
  var grid = document.getElementById('favorites-grid');
  if (!grid) return;
  var favs = getFavorites();

  if (favs.length === 0) {
    grid.innerHTML =
      '<div class="favorites-empty">' +
        '<p>No favourite quotes yet.</p>' +
        '<p>Tap the heart &#9825; on today\'s morning quote to save it here.</p>' +
      '</div>';
    return;
  }

  grid.innerHTML = favs.map(function(q, i) {
    return '<div class="fav-quote-card">' +
      '<p class="fav-quote-text">&ldquo;' + escapeHtml(q.quote) + '&rdquo;</p>' +
      '<div class="fav-quote-footer">' +
        '<span class="fav-quote-attr">' + escapeHtml(q.author) + ' &mdash; ' + escapeHtml(q.source) + '</span>' +
        '<button class="fav-remove-btn" onclick="removeFavorite(' + i + ')">Remove</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ── Reading List ──────────────────────────────────────────────────────────

var READING_LIST = [
  { id:'meditations',    title:'Meditations',                     author:'Marcus Aurelius',             period:'c. 161\u2013180 AD', desc:'A private journal never intended for publication, written by a Roman Emperor during military campaigns. Twelve books of intimate daily struggle to embody Stoic principles under immense pressure and responsibility.', why:'The most direct window into authentic Stoic practice from someone who truly had to live it.' },
  { id:'letters_stoic',  title:'Letters from a Stoic',            author:'Seneca',                      period:'c. 65 AD',           desc:'124 personal letters to his friend Lucilius exploring how to live well, face death with courage, manage time wisely, and find genuine inner freedom. Warm, witty, and surprisingly modern.', why:'The most accessible and human entry point into Stoicism \u2014 conversational, specific, and deeply relatable.' },
  { id:'enchiridion',    title:'Enchiridion',                     author:'Epictetus',                   period:'c. 125 AD',          desc:'A short handbook of Stoic practical ethics compiled from Epictetus\'s lectures. Direct, demanding, and profoundly transformative. No philosophical system \u2014 only pure practice.', why:'The single most concentrated dose of Stoic wisdom available. Read it slowly and repeatedly.' },
  { id:'discourses',     title:'Discourses',                      author:'Epictetus',                   period:'c. 108 AD',          desc:'Epictetus\'s teaching as recorded by his student Arrian \u2014 more expansive than the Enchiridion, full of Socratic dialogue, rigorous argument, and unforgettable practical examples.', why:'Essential for understanding the full depth behind the Enchiridion\'s concentrated wisdom.' },
  { id:'shortness',      title:'On the Shortness of Life',        author:'Seneca',                      period:'c. 49 AD',           desc:'A sustained argument that life is not short \u2014 we simply squander the vast majority of it. Seneca dissects precisely how we waste time and shows how to reclaim it through philosophical attention.', why:'One of the most urgently relevant Stoic texts for navigating modern distracted life.' },
  { id:'daily_stoic',    title:'The Daily Stoic',                 author:'Ryan Holiday & S. Hanselman', period:'2016',               desc:'366 daily meditations drawn from primary Stoic texts, organised by theme with original translations. A structured modern introduction that makes ancient wisdom immediately practical.', why:'The best structured way to encounter Stoic texts if you are beginning the practice.' },
  { id:'guide_good',     title:'A Guide to the Good Life',        author:'William B. Irvine',           period:'2008',               desc:'A philosopher\'s rigorous and accessible guide to adopting Stoicism as a complete modern life philosophy. Practical, intellectually honest, and entirely free of unnecessary jargon.', why:'The best scholarly introduction to Stoicism as a living practice rather than mere historical curiosity.' },
  { id:'roman_emperor',  title:'How to Think Like a Roman Emperor', author:'Donald Robertson',          period:'2019',               desc:'Uses the life of Marcus Aurelius as a lens to explore Stoic psychological techniques. Written by a cognitive therapist who draws compelling and clinically grounded parallels to modern CBT.', why:'Bridges ancient Stoic practice and modern psychological method in a deeply practical and readable way.' },
  { id:'obstacle_way',   title:'The Obstacle Is the Way',         author:'Ryan Holiday',                period:'2014',               desc:'A modern interpretation of amor fati illustrated through historical examples from business, war, and sport. Shows how great people have consistently turned adversity into advantage.', why:'The best modern text for understanding how to genuinely reframe difficulty as growth and opportunity.' },
  { id:'stillness_key',  title:'Stillness Is the Key',            author:'Ryan Holiday',                period:'2019',               desc:'Explores the Stoic-adjacent concept of inner stillness, drawing on Marcus Aurelius and Seneca to argue that clarity of mind is the source of all genuinely great action and decision-making.', why:'Complements the active Stoic practice with a deeper and more contemplative focus on inner peace.' }
];

function getReadStatus() {
  return getData('sj_reading') || {};
}

function toggleBookRead(id) {
  var status = getReadStatus();
  status[id] = !status[id];
  setData('sj_reading', status);
  renderReadingList();
}

function renderReadingList() {
  var grid = document.getElementById('reading-grid');
  var header = document.getElementById('reading-header');
  if (!grid) return;

  var status = getReadStatus();
  var readCount = READING_LIST.filter(function(b) { return status[b.id]; }).length;
  var total = READING_LIST.length;
  var pct = Math.round((readCount / total) * 100);

  if (header) {
    header.innerHTML =
      '<p class="reading-stats">You have read <strong>' + readCount + '</strong> of ' + total + ' recommended texts.</p>' +
      '<div class="reading-progress-bar"><div class="reading-progress-fill" style="width:' + pct + '%"></div></div>';
  }

  grid.innerHTML = READING_LIST.map(function(book) {
    var isRead = !!status[book.id];
    return '<div class="book-card' + (isRead ? ' read' : '') + '">' +
      '<button class="book-check-btn' + (isRead ? ' checked' : '') + '" onclick="toggleBookRead(\'' + book.id + '\')" title="' + (isRead ? 'Mark as unread' : 'Mark as read') + '">' +
        (isRead ? '&#10003;' : '') +
      '</button>' +
      '<div class="book-body">' +
        '<div class="book-title">' + escapeHtml(book.title) + '</div>' +
        '<div class="book-author-line">' +
          escapeHtml(book.author) +
          '<span class="book-period">' + escapeHtml(book.period) + '</span>' +
        '</div>' +
        '<p class="book-desc">' + escapeHtml(book.desc) + '</p>' +
        '<p class="book-why">' + escapeHtml(book.why) + '</p>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ── Enhanced Search / Filter ──────────────────────────────────────────────

function applyEntryFilters() {
  var filter    = (document.getElementById('search-input')    ? document.getElementById('search-input').value    : '');
  var dateFrom  = (document.getElementById('filter-date-from') ? document.getElementById('filter-date-from').value : '');
  var dateTo    = (document.getElementById('filter-date-to')   ? document.getElementById('filter-date-to').value   : '');
  var mood      = (document.getElementById('filter-mood')      ? document.getElementById('filter-mood').value      : '');
  renderEntries({ filter: filter, dateFrom: dateFrom, dateTo: dateTo, mood: mood });
}

// ── Init ──────────────────────────────────────────────────────────────────

function initExtras() {
  initDarkMode();
}
