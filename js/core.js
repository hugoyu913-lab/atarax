// ── Atarax Core ──────────────────────────────────────────────────────────────

// ── Stoic Quotes (64 quotes — full shuffled deck, no repeats until all shown) ──
var QUOTES = [
  // ── Marcus Aurelius — Meditations ──
  { quote:"You have power over your mind, not outside events. Realize this, and you will find strength.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"Waste no more time arguing about what a good man should be. Be one.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"The first rule is to keep an untroubled spirit. The second is to look things in the face and know them for what they are.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"Confine yourself to the present.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"If it is not right, do not do it; if it is not true, do not say it.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"The object of life is not to be on the side of the majority, but to escape finding oneself in the ranks of the insane.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"The best revenge is not to be like your enemy.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"Receive without pride, relinquish without struggle.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"Think of yourself as dead. You have lived your life. Now take what's left and live it properly.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"Do not act as if you had ten thousand years to live.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"The soul becomes dyed with the colour of its thoughts.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"The impediment to action advances action. What stands in the way becomes the way.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"Loss is nothing else but change, and change is Nature's delight.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"Accept the things to which fate binds you, and love the people with whom fate brings you together, and do so wholeheartedly.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"How much more grievous are the consequences of anger than the causes of it.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"The universe is change; our life is what our thoughts make it.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"If someone is able to show me that what I think or do is not right, I will happily change, for I seek truth, by which no one was ever truly harmed.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"Nowhere can man find a quieter or more untroubled retreat than in his own soul.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"When you wake up in the morning, tell yourself: the people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous and surly. They are this way because they cannot tell good from evil.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"You have power over your mind, not outside events. Realize this, and you will find strength.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"Look well into thyself; there is a source of strength which will always spring up if thou wilt always look.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"It never troubles the wolf how many the sheep may be.", author:"Virgil", source:"cited in Marcus Aurelius, Meditations" },
  { quote:"Choose not to be harmed — and you won't feel harmed. Don't feel harmed — and you haven't been.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"To live a good life: we have the potential for it. If we can learn to be indifferent to what makes no difference.", author:"Marcus Aurelius", source:"Meditations" },
  { quote:"The things you think about determine the quality of your mind. Your soul takes on the colour of your thoughts.", author:"Marcus Aurelius", source:"Meditations" },
  // ── Epictetus — Enchiridion & Discourses ──
  { quote:"Make the best use of what is in your power, and take the rest as it happens.", author:"Epictetus", source:"Enchiridion" },
  { quote:"Seek not the good in external things; seek it in yourself.", author:"Epictetus", source:"Discourses" },
  { quote:"He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.", author:"Epictetus", source:"Fragments" },
  { quote:"No man is free who is not a master of himself.", author:"Epictetus", source:"Discourses" },
  { quote:"Man is not disturbed by events, but by the opinions he has of events.", author:"Epictetus", source:"Enchiridion" },
  { quote:"First say to yourself what you would be; and then do what you have to do.", author:"Epictetus", source:"Discourses" },
  { quote:"How long are you going to wait before you demand the best for yourself?", author:"Epictetus", source:"Discourses" },
  { quote:"Wealth consists not in having great possessions, but in having few wants.", author:"Epictetus", source:"Discourses" },
  { quote:"Seek not that the things which happen should happen as you wish; but wish the things which happen to be as they are, and you will have a tranquil flow of life.", author:"Epictetus", source:"Enchiridion" },
  { quote:"If you want to improve, be content to be thought foolish and stupid with regard to external things.", author:"Epictetus", source:"Enchiridion" },
  { quote:"There is only one way to happiness and that is to cease worrying about things which are beyond the power of our will.", author:"Epictetus", source:"Discourses" },
  { quote:"It's not what happens to you, but how you react to it that matters.", author:"Epictetus", source:"Enchiridion" },
  { quote:"Practice yourself, for heaven's sake, in little things, and thence proceed to greater.", author:"Epictetus", source:"Discourses" },
  { quote:"Circumstances do not make the man; they reveal him.", author:"Epictetus", source:"Discourses" },
  { quote:"Don't explain your philosophy. Embody it.", author:"Epictetus", source:"Discourses" },
  { quote:"We cannot choose our external circumstances, but we can always choose how we respond to them.", author:"Epictetus", source:"Discourses" },
  { quote:"People are not disturbed by the things which happen, but by the opinions about the things.", author:"Epictetus", source:"Enchiridion" },
  { quote:"Freedom is the only worthy goal in life. It is won by disregarding things that lie beyond our control.", author:"Epictetus", source:"Discourses" },
  { quote:"He has the most who is content with the least.", author:"Diogenes", source:"Lives of the Eminent Philosophers" },
  // ── Seneca — Letters to Lucilius & other works ──
  { quote:"He who fears death will never do anything worthy of a living man.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"We suffer more in imagination than in reality.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"How does it help to make troubles heavier by bemoaning them?", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"True happiness is to enjoy the present, without anxious dependence upon the future.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"Do not indulge in expectations of what is absent; count up the blessings you actually possess.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"Let philosophy scrape off your own faults rather than be a way to rail at the faults of others.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"Begin at once to live, and count each separate day as a separate life.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"Difficulties strengthen the mind, as labor does the body.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"You are afraid of dying. But, come now, how is this life of yours anything but death?", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"Each day acquire something that will fortify you against poverty, against death, indeed against other misfortunes as well.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"The whole future lies in uncertainty: live immediately.", author:"Seneca", source:"Natural Questions" },
  { quote:"To be everywhere is to be nowhere.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"It is not the man who has too little, but the man who craves more, that is poor.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"While we are postponing, life speeds by.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"Treat your inferiors as you would be treated by your superiors.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"Fire tests gold, suffering tests brave men.", author:"Seneca", source:"On Providence" },
  { quote:"He who is brave is free.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"Whatever can happen to one man can happen to all.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"It is a rough road that leads to the heights of greatness.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"The part of life we really live is small. For all the rest of existence is not life, but merely time.", author:"Seneca", source:"On the Shortness of Life" },
  { quote:"Retire into yourself as much as possible; associate with those who are likely to improve you.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"I am not born for one corner; the whole world is my native land.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"No man was ever wise by chance.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"If you really want to escape the things that harass you, what you need is not to be in a different place but to be a different person.", author:"Seneca", source:"Letters to Lucilius" },
  { quote:"It is not that I am brave, but that I choose what to be afraid of.", author:"Seneca", source:"Letters to Lucilius" }
];

// ── Seven Challenges ──────────────────────────────────────────────────────
var CHALLENGES = [
  { id:'voluntary_discomfort', numeral:'I', name:'Voluntary Discomfort',
    desc:'Choose one comfort to forgo today — a warm shower, a morning coffee, a familiar ease. Live simply, by choice.',
    context:'"Set aside a certain number of days, during which you shall be content with the scantiest and cheapest fare." — Seneca, Letters' },
  { id:'digital_minimalism', numeral:'II', name:'Digital Minimalism',
    desc:'No social media, no news, no streaming for one full day. Observe what fills the silence when distraction is removed.',
    context:'"The greatest remedy for anger is delay." The same is true of impulse. Silence creates space for reason.' },
  { id:'silent_walk', numeral:'III', name:'The Silent Walk',
    desc:'Walk for at least 30 minutes without your phone, without music, without agenda. Simply observe what is around and within you.',
    context:'The peripatetic tradition knew that movement clarifies thought. Walk as Aristotle walked — to think.' },
  { id:'memento_mori', numeral:'IV', name:'Memento Mori',
    desc:'Spend ten minutes in quiet contemplation of your mortality. Write what becomes clear when you remember you will die.',
    context:'"Let us prepare our minds as if we had come to the very end of life. Let us postpone nothing." — Seneca, Letters' },
  { id:'deep_gratitude', numeral:'V', name:'Deep Gratitude',
    desc:'Write in detail about three things you are grateful for. Not what they are — why they matter, what it would mean to lose them.',
    context:'"He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has." — Epictetus' },
  { id:'premeditatio', numeral:'VI', name:'Premeditatio Malorum',
    desc:'Visualize in concrete detail a difficulty you fear. Sit with it. Plan your response. Remove its power through familiarity.',
    context:'"He robs present ills of their power who has perceived their coming beforehand." — Seneca, Letters' },
  { id:'full_virtue_day', numeral:'VII', name:'Full Virtue Day',
    desc:'In every interaction and decision today, pause and ask: Is this wise? Is this courageous? Is this just? Is this temperate?',
    context:'"Virtue is the only true good." To live one full day by the four cardinal virtues is to know what it means to live well.' }
];

// ── State ─────────────────────────────────────────────────────────────────
var activeSection = 'today';
var activeTab = 'morning';
var selectedVirtue = null;
var virtueRatings = { wisdom: 0, courage: 0, justice: 0, temperance: 0 };

// ── Date utilities ─────────────────────────────────────────────────────────
function dateKey(d) {
  if (!d) d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

function getWeekKey() {
  var d = new Date();
  var jan1 = new Date(d.getFullYear(), 0, 1);
  var wk = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return d.getFullYear() + '-W' + String(wk).padStart(2, '0');
}

function getMonthKey() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

function formatDateLong(iso) {
  var parts = iso.split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

function formatWeekLabel(wk) {
  var parts = wk.split('-W');
  return 'Week ' + parseInt(parts[1]) + ' &middot; ' + parts[0];
}

function formatMonthLabel(mo) {
  var parts = mo.split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatTimestamp(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) +
    ' &middot; ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Quote deck system ─────────────────────────────────────────────────────
// A shuffled deck ensures every quote appears before any repeats.
// State: { date, index, deck } stored in localStorage under sj_quote_state.

function shuffleDeck(n) {
  var deck = [];
  for (var i = 0; i < n; i++) deck.push(i);
  // Fisher-Yates shuffle
  for (var i = deck.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = deck[i]; deck[i] = deck[j]; deck[j] = tmp;
  }
  return deck;
}

function getDailyQuote() {
  var today = dateKey();
  var state = getData('sj_quote_state') || {};

  // Same day — return the already-chosen quote
  if (state.date === today && typeof state.index === 'number') {
    return QUOTES[state.index] || QUOTES[0];
  }

  // New day: pull the next quote from the deck
  var deck = Array.isArray(state.deck) && state.deck.length > 0
    ? state.deck.slice()   // remaining indices from last session
    : shuffleDeck(QUOTES.length);

  // Guard: if the deck somehow has stale indices, rebuild
  deck = deck.filter(function(i) { return i >= 0 && i < QUOTES.length; });
  if (deck.length === 0) deck = shuffleDeck(QUOTES.length);

  var index = deck.pop();

  setData('sj_quote_state', { date: today, index: index, deck: deck });
  return QUOTES[index];
}

// ── Storage ────────────────────────────────────────────────────────────────
function getData(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
}
function setData(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function deleteData(key) { localStorage.removeItem(key); }

// ── Toast ──────────────────────────────────────────────────────────────────
function showToast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2600);
}

// ── Navigation ─────────────────────────────────────────────────────────────
function switchSection(name) {
  activeSection = name;
  document.querySelectorAll('.section-page').forEach(function(s) { s.classList.remove('active'); });
  document.querySelectorAll('.nav-link').forEach(function(b) { b.classList.remove('active'); });
  var sec = document.getElementById('section-' + name);
  if (sec) sec.classList.add('active');
  var btn = document.querySelector('.nav-link[onclick*="\'' + name + '\'"]');
  if (btn) btn.classList.add('active');

  if (name === 'entries') {
    if (typeof applyEntryFilters === 'function') applyEntryFilters();
    else renderEntries({});
    if (typeof renderMoodChart === 'function') renderMoodChart();
  }
  if (name === 'challenges') renderChallenges();
  if (name === 'weekly') loadSection('weekly');
  if (name === 'monthly') loadSection('monthly');
  if (name === 'favorites') { if (typeof renderFavorites === 'function') renderFavorites(); }
  if (name === 'reading') { if (typeof renderReadingList === 'function') renderReadingList(); }
  if (name === 'community') { if (typeof renderCommunity === 'function') renderCommunity(); }
}

function beginPractice() {
  document.getElementById('main-nav').scrollIntoView({ behavior: 'smooth' });
  setTimeout(function() { switchSection('today'); }, 400);
}

function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
  var btn = document.getElementById('tab-btn-' + tab);
  var panel = document.getElementById('tab-' + tab);
  if (btn) btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

// ── Tab indicators ─────────────────────────────────────────────────────────
function updateTabIndicators() {
  var today = dateKey();
  ['morning', 'midday', 'evening'].forEach(function(p) {
    var dot = document.getElementById('dot-' + p);
    if (dot) dot.classList.toggle('visible', !!getData('sj_' + p + '_' + today));
  });
}

// ── Virtue selection ───────────────────────────────────────────────────────
function selectVirtue(v) {
  selectedVirtue = v;
  document.querySelectorAll('.virtue-card').forEach(function(c) {
    c.classList.toggle('selected', c.dataset.virtue === v);
  });
}

// ── Virtue ratings ─────────────────────────────────────────────────────────
function setVirtueRating(virtue, rating) {
  virtueRatings[virtue] = rating;
  renderVirtueDots();
}

function renderVirtueDots() {
  ['wisdom', 'courage', 'justice', 'temperance'].forEach(function(v) {
    var row = document.getElementById('vdots-' + v);
    if (!row) return;
    row.querySelectorAll('.vdot').forEach(function(dot, i) {
      dot.classList.toggle('filled', i < virtueRatings[v]);
    });
  });
}

// ── Panel save / load / clear ─────────────────────────────────────────────
function savePanel(panel) {
  var today = dateKey();
  var data;

  if (panel === 'morning') {
    data = {
      intention: document.getElementById('m-intention').value,
      within_control: document.getElementById('m-within').value,
      outside_control: document.getElementById('m-outside').value,
      premeditatio: document.getElementById('m-premeditatio').value,
      virtue: selectedVirtue,
      mood: typeof currentMood !== 'undefined' ? currentMood : 0,
      savedAt: new Date().toISOString()
    };
  } else if (panel === 'midday') {
    data = {
      morning_review: document.getElementById('md-review').value,
      emotional_awareness: document.getElementById('md-emotional').value,
      control_check: document.getElementById('md-control').value,
      afternoon_intention: document.getElementById('md-intention').value,
      savedAt: new Date().toISOString()
    };
  } else if (panel === 'evening') {
    data = {
      went_well: document.getElementById('e-well').value,
      improve: document.getElementById('e-improve').value,
      virtue_act: document.getElementById('e-virtue-act').value,
      gratitude: document.getElementById('e-gratitude').value,
      lesson: document.getElementById('e-lesson').value,
      virtue_ratings: Object.assign({}, virtueRatings),
      savedAt: new Date().toISOString()
    };
  }

  setData('sj_' + panel + '_' + today, data);
  var tsEl = document.getElementById(panel + '-saved-ts');
  if (tsEl) tsEl.innerHTML = 'Saved at ' + formatTimestamp(data.savedAt);
  updateTabIndicators();
  renderStreak();
  showToast(panel.charAt(0).toUpperCase() + panel.slice(1) + ' entry saved');

  if (typeof refreshAISection === 'function') refreshAISection(panel);
}

function loadPanel(panel) {
  var today = dateKey();
  var data = getData('sj_' + panel + '_' + today);

  if (panel === 'morning') {
    document.getElementById('m-intention').value = (data && data.intention) || '';
    document.getElementById('m-within').value = (data && data.within_control) || '';
    document.getElementById('m-outside').value = (data && data.outside_control) || '';
    document.getElementById('m-premeditatio').value = (data && data.premeditatio) || '';
    selectedVirtue = (data && data.virtue) || null;
    document.querySelectorAll('.virtue-card').forEach(function(c) {
      c.classList.toggle('selected', c.dataset.virtue === selectedVirtue);
    });
    if (data && data.savedAt) {
      var tsEl = document.getElementById('morning-saved-ts');
      if (tsEl) tsEl.innerHTML = 'Saved at ' + formatTimestamp(data.savedAt);
    }
  } else if (panel === 'midday') {
    document.getElementById('md-review').value = (data && data.morning_review) || '';
    document.getElementById('md-emotional').value = (data && data.emotional_awareness) || '';
    document.getElementById('md-control').value = (data && data.control_check) || '';
    document.getElementById('md-intention').value = (data && data.afternoon_intention) || '';
    if (data && data.savedAt) {
      var tsEl = document.getElementById('midday-saved-ts');
      if (tsEl) tsEl.innerHTML = 'Saved at ' + formatTimestamp(data.savedAt);
    }
  } else if (panel === 'evening') {
    document.getElementById('e-well').value = (data && data.went_well) || '';
    document.getElementById('e-improve').value = (data && data.improve) || '';
    document.getElementById('e-virtue-act').value = (data && data.virtue_act) || '';
    document.getElementById('e-gratitude').value = (data && data.gratitude) || '';
    document.getElementById('e-lesson').value = (data && data.lesson) || '';
    if (data && data.virtue_ratings) {
      Object.assign(virtueRatings, data.virtue_ratings);
      renderVirtueDots();
    }
    if (data && data.savedAt) {
      var tsEl = document.getElementById('evening-saved-ts');
      if (tsEl) tsEl.innerHTML = 'Saved at ' + formatTimestamp(data.savedAt);
    }
  }
}

function clearPanel(panel) {
  if (!confirm('Clear the ' + panel + ' fields? Your saved entry is not affected.')) return;
  if (panel === 'morning') {
    ['m-intention', 'm-within', 'm-outside', 'm-premeditatio'].forEach(function(id) {
      document.getElementById(id).value = '';
    });
    selectedVirtue = null;
    document.querySelectorAll('.virtue-card').forEach(function(c) { c.classList.remove('selected'); });
    if (typeof setMood === 'function') setMood(0);
  } else if (panel === 'midday') {
    ['md-review', 'md-emotional', 'md-control', 'md-intention'].forEach(function(id) {
      document.getElementById(id).value = '';
    });
  } else if (panel === 'evening') {
    ['e-well', 'e-improve', 'e-virtue-act', 'e-gratitude', 'e-lesson'].forEach(function(id) {
      document.getElementById(id).value = '';
    });
    Object.keys(virtueRatings).forEach(function(k) { virtueRatings[k] = 0; });
    renderVirtueDots();
  }
}

// ── Weekly / Monthly ──────────────────────────────────────────────────────
function saveSection(section) {
  var data, key;
  if (section === 'weekly') {
    key = 'sj_weekly_' + getWeekKey();
    data = {
      challenge: document.getElementById('w-challenge').value,
      growth: document.getElementById('w-growth').value,
      stoic_principle: document.getElementById('w-stoic').value,
      focus_next_week: document.getElementById('w-focus').value,
      savedAt: new Date().toISOString()
    };
  } else if (section === 'monthly') {
    key = 'sj_monthly_' + getMonthKey();
    data = {
      virtue_audit: document.getElementById('mo-virtue-audit').value,
      distractions: document.getElementById('mo-distractions').value,
      fear_inventory: document.getElementById('mo-fears').value,
      letter_future_self: document.getElementById('mo-letter').value,
      next_month_commitment: document.getElementById('mo-commitment').value,
      savedAt: new Date().toISOString()
    };
  }
  setData(key, data);
  var tsEl = document.getElementById(section + '-saved-ts');
  if (tsEl) tsEl.innerHTML = 'Saved at ' + formatTimestamp(data.savedAt);
  showToast(section.charAt(0).toUpperCase() + section.slice(1) + ' entry saved');
}

function loadSection(section) {
  var data, key;
  if (section === 'weekly') {
    key = 'sj_weekly_' + getWeekKey();
    data = getData(key);
    var lbl = document.getElementById('weekly-period-label');
    if (lbl) lbl.innerHTML = formatWeekLabel(getWeekKey());
    document.getElementById('w-challenge').value = (data && data.challenge) || '';
    document.getElementById('w-growth').value = (data && data.growth) || '';
    document.getElementById('w-stoic').value = (data && data.stoic_principle) || '';
    document.getElementById('w-focus').value = (data && data.focus_next_week) || '';
    if (data && data.savedAt) {
      var tsEl = document.getElementById('weekly-saved-ts');
      if (tsEl) tsEl.innerHTML = 'Saved at ' + formatTimestamp(data.savedAt);
    }
  } else if (section === 'monthly') {
    key = 'sj_monthly_' + getMonthKey();
    data = getData(key);
    var lbl = document.getElementById('monthly-period-label');
    if (lbl) lbl.textContent = formatMonthLabel(getMonthKey());
    document.getElementById('mo-virtue-audit').value = (data && data.virtue_audit) || '';
    document.getElementById('mo-distractions').value = (data && data.distractions) || '';
    document.getElementById('mo-fears').value = (data && data.fear_inventory) || '';
    document.getElementById('mo-letter').value = (data && data.letter_future_self) || '';
    document.getElementById('mo-commitment').value = (data && data.next_month_commitment) || '';
    if (data && data.savedAt) {
      var tsEl = document.getElementById('monthly-saved-ts');
      if (tsEl) tsEl.innerHTML = 'Saved at ' + formatTimestamp(data.savedAt);
    }
  }
}

function clearSection(section) {
  if (!confirm('Clear the ' + section + ' fields? Your saved entry is not affected.')) return;
  if (section === 'weekly') {
    ['w-challenge', 'w-growth', 'w-stoic', 'w-focus'].forEach(function(id) {
      document.getElementById(id).value = '';
    });
  } else if (section === 'monthly') {
    ['mo-virtue-audit', 'mo-distractions', 'mo-fears', 'mo-letter', 'mo-commitment'].forEach(function(id) {
      document.getElementById(id).value = '';
    });
  }
}

// ── Streak ────────────────────────────────────────────────────────────────
function calcStreak() {
  var streak = 0;
  for (var i = 0; i < 365; i++) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    var k = dateKey(d);
    var has = localStorage.getItem('sj_morning_' + k) ||
              localStorage.getItem('sj_midday_' + k) ||
              localStorage.getItem('sj_evening_' + k);
    if (has) { streak++; }
    else if (i > 0) { break; }
  }
  return streak;
}

function renderStreak() {
  var numEl = document.getElementById('streak-num');
  if (numEl) numEl.textContent = calcStreak();
  var dotsEl = document.getElementById('streak-dots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  for (var i = 6; i >= 0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    var k = dateKey(d);
    var filled = !!(localStorage.getItem('sj_morning_' + k) ||
                    localStorage.getItem('sj_midday_' + k) ||
                    localStorage.getItem('sj_evening_' + k));
    var dot = document.createElement('div');
    dot.className = 'streak-dot' + (filled ? ' filled' : '');
    dotsEl.appendChild(dot);
  }
}

// ── Challenges ────────────────────────────────────────────────────────────
function completeChallenge(id) {
  var all = getData('sj_challenges') || {};
  if (!all[id]) all[id] = { completedDates: [] };
  var today = dateKey();
  if (!all[id].completedDates.includes(today)) {
    all[id].completedDates.push(today);
    setData('sj_challenges', all);
    renderChallenges();
    showToast('Challenge completed — well done.');
  }
}

function renderChallenges() {
  var all = getData('sj_challenges') || {};
  var today = dateKey();
  var container = document.getElementById('challenges-container');
  if (!container) return;
  container.innerHTML = CHALLENGES.map(function(c) {
    var done = all[c.id] && all[c.id].completedDates && all[c.id].completedDates.includes(today);
    return '<div class="challenge-card">' +
      '<div class="challenge-numeral">' + c.numeral + '</div>' +
      '<div class="challenge-body">' +
        '<div class="challenge-name">' + c.name + '</div>' +
        '<div class="challenge-desc">' + c.desc + '</div>' +
        '<div class="challenge-context">' + c.context + '</div>' +
        '<button class="btn-challenge' + (done ? ' completed' : '') + '" ' +
          (done ? 'disabled' : 'onclick="completeChallenge(\'' + c.id + '\')"') + '>' +
          (done ? '&#10003; Completed Today' : 'Begin Challenge') +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ── Entries ────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderField(label, value) {
  if (!value || (typeof value === 'string' && !value.trim())) return '';
  return '<div class="entry-field">' +
    '<div class="entry-field-label">' + label + '</div>' +
    '<div class="entry-field-value">' + escapeHtml(value) + '</div>' +
    '</div>';
}

function deletePanelEntry(panel, date) {
  var name = panel.charAt(0).toUpperCase() + panel.slice(1);
  if (!confirm('Delete the ' + name + ' entry from ' + formatDateLong(date) + '? This cannot be undone.')) return;
  deleteData('sj_' + panel + '_' + date);
  if (typeof applyEntryFilters === 'function') applyEntryFilters();
  else renderEntries({});
  updateTabIndicators();
  renderStreak();
  showToast('Entry deleted');
  if (date === dateKey()) loadPanel(panel);
}

function deleteWeeklyEntry(week) {
  if (!confirm('Delete this weekly entry? This cannot be undone.')) return;
  deleteData('sj_weekly_' + week);
  if (typeof applyEntryFilters === 'function') applyEntryFilters();
  else renderEntries({});
  showToast('Entry deleted');
  if (week === getWeekKey()) loadSection('weekly');
}

function deleteMonthlyEntry(month) {
  if (!confirm('Delete this monthly entry? This cannot be undone.')) return;
  deleteData('sj_monthly_' + month);
  if (typeof applyEntryFilters === 'function') applyEntryFilters();
  else renderEntries({});
  showToast('Entry deleted');
  if (month === getMonthKey()) loadSection('monthly');
}

function renderEntries(opts) {
  opts = opts || {};
  var filter = (opts.filter || '').toLowerCase();
  var dateFrom = opts.dateFrom || '';
  var dateTo = opts.dateTo || '';
  var moodFilter = opts.mood || '';
  var items = [];

  // Daily entries
  var dates = new Set();
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    var m = k && k.match(/^sj_(morning|midday|evening)_(\d{4}-\d{2}-\d{2})$/);
    if (m) dates.add(m[2]);
  }
  dates.forEach(function(date) {
    if (dateFrom && date < dateFrom) return;
    if (dateTo && date > dateTo) return;
    var morning = getData('sj_morning_' + date);
    var midday = getData('sj_midday_' + date);
    var evening = getData('sj_evening_' + date);
    if (moodFilter && (!morning || String(morning.mood) !== moodFilter)) return;
    if (!filter) {
      items.push({ type:'daily', date:date, morning:morning, midday:midday, evening:evening, sortKey:date });
      return;
    }
    var text = [morning, midday, evening].filter(Boolean)
      .map(function(d) { return Object.values(d).filter(function(v) { return typeof v === 'string'; }).join(' '); })
      .join(' ').toLowerCase();
    if (text.includes(filter)) {
      items.push({ type:'daily', date:date, morning:morning, midday:midday, evening:evening, sortKey:date });
    }
  });

  // Weekly entries
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    var m = k && k.match(/^sj_weekly_(\d{4}-W\d{2})$/);
    if (!m) continue;
    var week = m[1];
    var data = getData(k);
    if (!data) continue;
    if (moodFilter) continue; // mood filter skips weekly
    if (filter) {
      var text = Object.values(data).filter(function(v) { return typeof v === 'string'; }).join(' ').toLowerCase();
      if (!text.includes(filter)) continue;
    }
    var parts = week.split('-W').map(Number);
    var d = new Date(parts[0], 0, 1 + (parts[1] - 1) * 7);
    var sk = dateKey(d);
    if (dateFrom && sk < dateFrom) continue;
    if (dateTo && sk > dateTo) continue;
    items.push({ type:'weekly', week:week, data:data, sortKey:sk });
  }

  // Monthly entries
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    var m = k && k.match(/^sj_monthly_(\d{4}-\d{2})$/);
    if (!m) continue;
    var month = m[1];
    var data = getData(k);
    if (!data) continue;
    if (moodFilter) continue;
    if (filter) {
      var text = Object.values(data).filter(function(v) { return typeof v === 'string'; }).join(' ').toLowerCase();
      if (!text.includes(filter)) continue;
    }
    var sk = month + '-01';
    if (dateFrom && sk < dateFrom) continue;
    if (dateTo && sk > dateTo) continue;
    items.push({ type:'monthly', month:month, data:data, sortKey:sk });
  }

  items.sort(function(a, b) { return b.sortKey.localeCompare(a.sortKey); });

  var container = document.getElementById('entries-timeline');
  var countLabel = document.getElementById('entries-count-label');
  if (countLabel) countLabel.textContent = items.length + ' entr' + (items.length !== 1 ? 'ies' : 'y') + ' found';

  if (items.length === 0) {
    container.innerHTML = '<div class="entries-empty"><p>' + (filter || moodFilter ? 'No entries match.' : 'No entries yet.') + '</p><p>' + (filter || moodFilter ? 'Try different filters.' : 'Begin your practice today.') + '</p></div>';
    return;
  }

  container.innerHTML = items.map(function(item) {
    if (item.type === 'daily') {
      var moodStr = '';
      if (item.morning && item.morning.mood && typeof getMoodEmoji === 'function') {
        moodStr = '<span class="timeline-mood">' + getMoodEmoji(item.morning.mood) + ' ' + getMoodLabel(item.morning.mood) + '</span>';
      }
      var panels = [];
      if (item.morning) {
        var d = item.date;
        panels.push('<div class="entry-panel">' +
          '<div class="entry-panel-head" onclick="this.closest(\'.entry-panel\').classList.toggle(\'open\')">' +
            '<span class="entry-panel-name">&#9728; Morning</span>' +
            '<span class="entry-panel-toggle">&#8964;</span>' +
          '</div>' +
          '<div class="entry-panel-body">' +
            renderField('Intention', item.morning.intention) +
            renderField('Within My Control', item.morning.within_control) +
            renderField('Outside My Control', item.morning.outside_control) +
            renderField('Premeditatio Malorum', item.morning.premeditatio) +
            (item.morning.virtue ? renderField('Guiding Virtue', item.morning.virtue.charAt(0).toUpperCase() + item.morning.virtue.slice(1)) : '') +
            '<div class="entry-panel-actions"><button class="btn-danger" onclick="deletePanelEntry(\'morning\',\'' + d + '\')">Delete</button></div>' +
          '</div>' +
        '</div>');
      }
      if (item.midday) {
        var d = item.date;
        panels.push('<div class="entry-panel">' +
          '<div class="entry-panel-head" onclick="this.closest(\'.entry-panel\').classList.toggle(\'open\')">' +
            '<span class="entry-panel-name">&#9675; Midday</span>' +
            '<span class="entry-panel-toggle">&#8964;</span>' +
          '</div>' +
          '<div class="entry-panel-body">' +
            renderField('Morning Review', item.midday.morning_review) +
            renderField('Emotional Awareness', item.midday.emotional_awareness) +
            renderField('Control Check', item.midday.control_check) +
            renderField('Afternoon Intention', item.midday.afternoon_intention) +
            '<div class="entry-panel-actions"><button class="btn-danger" onclick="deletePanelEntry(\'midday\',\'' + d + '\')">Delete</button></div>' +
          '</div>' +
        '</div>');
      }
      if (item.evening) {
        var d = item.date;
        var vr = item.evening.virtue_ratings;
        var vrText = vr ? 'Wisdom ' + vr.wisdom + '/5 \u00b7 Courage ' + vr.courage + '/5 \u00b7 Justice ' + vr.justice + '/5 \u00b7 Temperance ' + vr.temperance + '/5' : '';
        panels.push('<div class="entry-panel">' +
          '<div class="entry-panel-head" onclick="this.closest(\'.entry-panel\').classList.toggle(\'open\')">' +
            '<span class="entry-panel-name">&#9790; Evening</span>' +
            '<span class="entry-panel-toggle">&#8964;</span>' +
          '</div>' +
          '<div class="entry-panel-body">' +
            renderField('What Went Well', item.evening.went_well) +
            renderField('What I Would Improve', item.evening.improve) +
            renderField('A Virtuous Act', item.evening.virtue_act) +
            renderField('Gratitude', item.evening.gratitude) +
            renderField('The Lesson', item.evening.lesson) +
            (vrText ? renderField('Virtue Ratings', vrText) : '') +
            '<div class="entry-panel-actions"><button class="btn-danger" onclick="deletePanelEntry(\'evening\',\'' + d + '\')">Delete</button></div>' +
          '</div>' +
        '</div>');
      }
      return '<div class="timeline-item">' +
        '<div class="timeline-dot"></div>' +
        '<div class="timeline-date">' + formatDateLong(item.date) + moodStr + '</div>' +
        '<div class="timeline-entries">' + panels.join('') + '</div>' +
        '</div>';

    } else if (item.type === 'weekly') {
      var w = item.week;
      var d = item.data;
      return '<div class="timeline-item">' +
        '<div class="timeline-dot"></div>' +
        '<div class="timeline-date">Weekly &mdash; ' + formatWeekLabel(w) + '</div>' +
        '<div class="timeline-entries"><div class="entry-panel">' +
          '<div class="entry-panel-head" onclick="this.closest(\'.entry-panel\').classList.toggle(\'open\')">' +
            '<span class="entry-panel-name">Weekly Reflection</span>' +
            '<span class="entry-panel-toggle">&#8964;</span>' +
          '</div>' +
          '<div class="entry-panel-body">' +
            renderField("The Week's Challenge", d.challenge) +
            renderField('Growth Observed', d.growth) +
            renderField('Stoic Principle Applied', d.stoic_principle) +
            renderField('Focus for Next Week', d.focus_next_week) +
            '<div class="entry-panel-actions"><button class="btn-danger" onclick="deleteWeeklyEntry(\'' + w + '\')">Delete</button></div>' +
          '</div>' +
        '</div></div>' +
        '</div>';

    } else {
      var mo = item.month;
      var d = item.data;
      return '<div class="timeline-item">' +
        '<div class="timeline-dot"></div>' +
        '<div class="timeline-date">Monthly &mdash; ' + formatMonthLabel(mo) + '</div>' +
        '<div class="timeline-entries"><div class="entry-panel">' +
          '<div class="entry-panel-head" onclick="this.closest(\'.entry-panel\').classList.toggle(\'open\')">' +
            '<span class="entry-panel-name">Monthly Examination</span>' +
            '<span class="entry-panel-toggle">&#8964;</span>' +
          '</div>' +
          '<div class="entry-panel-body">' +
            renderField('Virtue Audit', d.virtue_audit) +
            renderField('What Distracted Me', d.distractions) +
            renderField('Fear Inventory', d.fear_inventory) +
            renderField('Letter from Future Self', d.letter_future_self) +
            renderField("Next Month's Commitment", d.next_month_commitment) +
            '<div class="entry-panel-actions"><button class="btn-danger" onclick="deleteMonthlyEntry(\'' + mo + '\')">Delete</button></div>' +
          '</div>' +
        '</div></div>' +
        '</div>';
    }
  }).join('');
}

// ── Keyboard shortcut ─────────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    if (activeSection === 'today') savePanel(activeTab);
    else if (activeSection === 'weekly') saveSection('weekly');
    else if (activeSection === 'monthly') saveSection('monthly');
  }
});

// ── Scroll shadow ─────────────────────────────────────────────────────────
var _nav = document.getElementById('main-nav');
var _hero = document.getElementById('hero');
if (_nav && _hero) {
  var _observer = new IntersectionObserver(function(entries) {
    _nav.classList.toggle('scrolled', !entries[0].isIntersecting);
  }, { threshold: 0 });
  _observer.observe(_hero);
}

// ── Definitions Panel ─────────────────────────────────────────────────────
function toggleDefinitions() {
  var panel = document.getElementById('def-panel');
  var overlay = document.getElementById('def-overlay');
  var isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
  if (!isOpen) {
    setTimeout(function() {
      var s = document.getElementById('def-search');
      if (s) s.focus();
    }, 350);
  } else {
    var s = document.getElementById('def-search');
    if (s) { s.value = ''; filterDefinitions(''); }
  }
}

function filterDefinitions(query) {
  var q = query.toLowerCase().trim();
  document.querySelectorAll('#def-body .def-item').forEach(function(item) {
    var terms = (item.dataset.terms || '') + ' ' +
      (item.querySelector('.def-term') ? item.querySelector('.def-term').textContent : '') + ' ' +
      (item.querySelector('.def-text') ? item.querySelector('.def-text').textContent : '');
    item.classList.toggle('hidden', q !== '' && !terms.toLowerCase().includes(q));
  });
  document.querySelectorAll('#def-body .def-category').forEach(function(cat) {
    var el = cat.nextElementSibling;
    var hasVisible = false;
    while (el && !el.classList.contains('def-category')) {
      if (el.classList.contains('def-item') && !el.classList.contains('hidden')) hasVisible = true;
      el = el.nextElementSibling;
    }
    cat.style.display = hasVisible ? '' : 'none';
  });
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('def-panel').classList.contains('open')) {
    toggleDefinitions();
  }
});

// ── Init ──────────────────────────────────────────────────────────────────
function initCore() {
  var today = dateKey();
  var parts = today.split('-');
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  var lbl = document.getElementById('today-date-label');
  if (lbl) lbl.textContent = d.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });

  var q = getDailyQuote();
  var qtEl = document.getElementById('morning-quote-text');
  var qaEl = document.getElementById('morning-quote-author');
  var qsEl = document.getElementById('morning-quote-source');
  if (qtEl) qtEl.textContent = q.quote;
  if (qaEl) qaEl.textContent = q.author;
  if (qsEl) qsEl.textContent = q.source;

  loadPanel('morning');
  loadPanel('midday');
  loadPanel('evening');
  renderStreak();
  updateTabIndicators();

  // Update fav button state
  if (typeof updateFavButton === 'function') updateFavButton();
}
