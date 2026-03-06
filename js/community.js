// ── Community Reflections Board ───────────────────────────────────────────
//
// Posts are stored in the community_reflections Supabase table and visible
// to all authenticated users in real time.  No email or username is ever
// exposed — the avatar initial is derived deterministically from the user_id.
// Users can only delete their own posts (enforced by both RLS and the client).
// ─────────────────────────────────────────────────────────────────────────

var COMMUNITY_SEED = [
  { id:'seed_1', text:'Today I realised my resistance to change was the source of my suffering, not the change itself.', created_at:null, seed:true },
  { id:'seed_2', text:'Practising voluntary discomfort showed me how much I had been confusing comfort with genuine happiness.', created_at:null, seed:true },
  { id:'seed_3', text:'The moment I stopped trying to control the outcome, I found I could finally act well in the present.', created_at:null, seed:true },
  { id:'seed_4', text:'Memento mori is not morbid — it is the clearest lens I have found for seeing what truly matters today.', created_at:null, seed:true },
  { id:'seed_5', text:'I asked myself what the wisest version of me would do. The answer was always simpler than I expected.', created_at:null, seed:true },
  { id:'seed_6', text:'The dichotomy of control, once truly understood, removes more suffering than any comfort ever could.', created_at:null, seed:true },
  { id:'seed_7', text:'Begin at once to live, and count each separate day as a separate life. Seneca knew something we keep forgetting.', created_at:null, seed:true }
];

var _posts            = null;   // null = not yet loaded; [] = loaded, empty
var _communityChannel = null;   // Supabase Realtime channel

// ── Avatar initial ─────────────────────────────────────────────────────────
// Derives a consistent, anonymous single letter from a user UUID.

function _avatarLetter(userId) {
  if (!userId) return '?';
  var letters = ['A','S','M','E','T','C','J','V','P','R','L','D','N','K','B','F','G','H','W','Z'];
  var sum = 0;
  for (var i = 0; i < userId.length; i++) {
    sum = (sum + userId.charCodeAt(i)) & 0xffff;
  }
  return letters[sum % letters.length];
}

// ── Timestamp formatter ────────────────────────────────────────────────────
// Returns relative time for recent posts; absolute date + time for older ones.

function _formatTime(iso) {
  if (!iso) return '';
  try {
    var d   = new Date(iso);
    var now = new Date();
    var diffMin = Math.round((now - d) / 60000);
    if (diffMin < 1)  return 'just now';
    if (diffMin < 60) return diffMin + 'm ago';
    var diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24)  return diffHr + 'h ago';
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var h = d.getHours(), m = d.getMinutes();
    var ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return months[d.getMonth()] + ' ' + d.getDate() +
      ' \xb7 ' + h + ':' + (m < 10 ? '0' + m : m) + '\u202f' + ampm;
  } catch (e) { return ''; }
}

// ── Char counter ───────────────────────────────────────────────────────────

function updateCharCount() {
  var input   = document.getElementById('community-input');
  var counter = document.getElementById('char-count');
  if (input && counter) counter.textContent = input.value.length;
}

// ── Share ──────────────────────────────────────────────────────────────────

function shareReflection() {
  var input = document.getElementById('community-input');
  if (!input) return;
  var text = input.value.trim();
  if (!text)           { showToast('Please write a reflection first'); return; }
  if (text.length > 280) { showToast('Keep your reflection under 280 characters'); return; }

  var db     = _getDbClient();
  var userId = getCurrentUserId();
  if (!db || !userId) { showToast('Please sign in to share'); return; }

  var btn = document.querySelector('#section-community .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = 'Sharing\u2026'; }

  db.from('community_reflections')
    .insert({ user_id: userId, text: text })
    .then(function (r) {
      if (btn) { btn.disabled = false; btn.textContent = 'Share Reflection'; }
      if (r.error) { showToast('Could not share — please try again'); return; }
      input.value = '';
      updateCharCount();
      showToast('Reflection shared');
      // Realtime subscription will add it to the feed automatically.
      // If realtime is unavailable, reload the feed manually.
      if (!_communityChannel) _loadCommunityPosts();
    })
    .catch(function () {
      if (btn) { btn.disabled = false; btn.textContent = 'Share Reflection'; }
      showToast('Could not share — please try again');
    });
}

// ── Delete ─────────────────────────────────────────────────────────────────

function deleteCommunityPost(id) {
  var db     = _getDbClient();
  var userId = getCurrentUserId();
  if (!db || !userId) return;

  db.from('community_reflections')
    .delete()
    .eq('id', id)
    .eq('user_id', userId) // Belt-and-braces; RLS also enforces this
    .then(function (r) {
      if (r.error) { showToast('Could not remove reflection'); return; }
      showToast('Reflection removed');
      // Realtime will update the feed; fall back to manual removal if needed.
      if (!_communityChannel) {
        _posts = (_posts || []).filter(function (p) { return p.id !== id; });
        renderCommunity();
      }
    })
    .catch(function () { showToast('Could not remove reflection'); });
}

// ── Render ─────────────────────────────────────────────────────────────────

function renderCommunity() {
  var feed      = document.getElementById('community-feed');
  var feedLabel = document.getElementById('community-feed-label');
  if (!feed) return;

  // Still loading
  if (_posts === null) {
    feed.innerHTML = '<div class="community-loading">' +
      '<div class="community-loading-dots"><span></span><span></span><span></span></div>' +
      '</div>';
    if (feedLabel) feedLabel.textContent = 'Reflections';
    return;
  }

  var currentUserId = getCurrentUserId();

  // Use seed posts as examples when the board is empty
  var displayPosts = _posts.length > 0 ? _posts : COMMUNITY_SEED;
  var isSeed       = _posts.length === 0;

  if (feedLabel) {
    feedLabel.textContent = isSeed
      ? 'Example Reflections'
      : 'Reflections (' + _posts.length + ')';
  }

  feed.innerHTML = displayPosts.map(function (post) {
    var isOwn     = !post.seed && post.user_id === currentUserId;
    var letter    = post.seed ? 'S' : _avatarLetter(post.user_id);
    var timeStr   = post.seed ? 'example reflection' : _formatTime(post.created_at);
    var seedTag   = post.seed
      ? '<span class="community-seed-tag">example reflection</span>'
      : '';
    var deleteBtn = isOwn
      ? '<button class="community-delete" onclick="deleteCommunityPost(\'' +
          post.id + '\')" title="Remove your reflection">&times;</button>'
      : '';

    return '<div class="community-post' + (post.seed ? ' community-post--seed' : '') + '">' +
      '<div class="community-avatar">' + letter + '</div>' +
      '<div class="community-post-body">' +
        '<p class="community-post-text">\u201c' + escapeHtml(post.text) + '\u201d</p>' +
        '<div class="community-post-meta">' +
          (post.seed ? seedTag : '<span class="community-time">' + timeStr + '</span>') +
          deleteBtn +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ── Data loading ───────────────────────────────────────────────────────────

function _loadCommunityPosts() {
  var db = _getDbClient();
  if (!db) {
    _posts = [];
    renderCommunity();
    return;
  }
  db.from('community_reflections')
    .select('id, user_id, text, created_at')
    .order('created_at', { ascending: false })
    .limit(200)
    .then(function (r) {
      if (r.error) {
        console.warn('[Atarax] load community error:', r.error.message);
        _posts = [];
      } else {
        _posts = r.data || [];
      }
      renderCommunity();
    })
    .catch(function (e) {
      console.warn('[Atarax] load community exception:', e.message);
      _posts = [];
      renderCommunity();
    });
}

// ── Realtime subscription ──────────────────────────────────────────────────

function _subscribeToCommunity() {
  var db = _getDbClient();
  if (!db) return;

  _communityChannel = db
    .channel('community_reflections_feed')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'community_reflections' },
      function (payload) {
        if (!_posts) _posts = [];
        // Guard against duplicate events (our own inserts arrive here too)
        var alreadyPresent = _posts.some(function (p) { return p.id === payload.new.id; });
        if (alreadyPresent) return;
        _posts.unshift(payload.new);
        renderCommunity();
      }
    )
    .on('postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'community_reflections' },
      function (payload) {
        if (!_posts) return;
        _posts = _posts.filter(function (p) { return p.id !== payload.old.id; });
        renderCommunity();
      }
    )
    .subscribe(function (status) {
      if (status === 'SUBSCRIBED') {
        _updateLiveIndicator(true);
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        _updateLiveIndicator(false);
      }
    });
}

function _updateLiveIndicator(isLive) {
  var dot = document.getElementById('community-live-dot');
  if (!dot) return;
  dot.classList.toggle('connected', !!isLive);
}

// ── Init ───────────────────────────────────────────────────────────────────

function initCommunity() {
  _loadCommunityPosts();
  _subscribeToCommunity();
}
