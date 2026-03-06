// ── Community Reflections Board ───────────────────────────────────────────
//
// All reads and writes go directly to Supabase (community_reflections table).
// Requires _getAuthClient() and getCurrentUserId() from auth.js.
// ─────────────────────────────────────────────────────────────────────────

function updateCharCount() {
  var input   = document.getElementById('community-input');
  var counter = document.getElementById('char-count');
  if (input && counter) counter.textContent = input.value.length;
}

function shareReflection() {
  var input = document.getElementById('community-input');
  if (!input) return;
  var text = input.value.trim();
  if (!text) { showToast('Please write a reflection first'); return; }
  if (text.length > 280) { showToast('Keep your reflection under 280 characters'); return; }

  var userId = getCurrentUserId();
  if (!userId) { showToast('You must be logged in to share a reflection'); return; }

  var client = _getAuthClient();
  if (!client) { showToast('Unable to connect to the server'); return; }

  var payload = { user_id: userId, text: text };

  client
    .from('community_reflections')
    .insert(payload)
    .then(function(result) {
      if (result.error) {
        console.log('[Community] Insert failed — full error:', result.error, '| user_id:', userId, '| payload:', payload);
        showToast('Failed to share: ' + (result.error.message || JSON.stringify(result.error)));
        return;
      }
      input.value = '';
      updateCharCount();
      showToast('Reflection shared with the community');
      renderCommunity();
    });
}

function deleteCommunityPost(id) {
  var userId = getCurrentUserId();
  if (!userId) return;

  var client = _getAuthClient();
  if (!client) return;

  client
    .from('community_reflections')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .then(function(result) {
      if (result.error) {
        console.error('[Community] Delete failed:', result.error);
        showToast('Failed to remove reflection');
        return;
      }
      showToast('Reflection removed');
      renderCommunity();
    });
}

function getInitials(index) {
  var letters = ['A', 'S', 'M', 'E', 'T', 'C', 'J', 'V', 'P', 'R'];
  return letters[index % letters.length];
}

function formatCommunityDate(isoString) {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) { return isoString; }
}

function renderCommunity() {
  var feed      = document.getElementById('community-feed');
  var feedLabel = document.getElementById('community-feed-label');
  if (!feed) return;

  var client = _getAuthClient();
  if (!client) {
    feed.innerHTML = '<div class="entries-empty"><p>Unable to load reflections.</p></div>';
    return;
  }

  feed.innerHTML = '<div class="entries-empty"><p>Loading reflections…</p></div>';

  var currentUserId = getCurrentUserId();

  client
    .from('community_reflections')
    .select('id, user_id, text, created_at')
    .order('created_at', { ascending: false })
    .then(function(result) {
      if (result.error) {
        console.error('[Community] Select failed:', result.error);
        feed.innerHTML = '<div class="entries-empty"><p>Failed to load reflections.</p></div>';
        return;
      }

      var posts = result.data || [];

      if (feedLabel) {
        feedLabel.textContent = 'Reflections (' + posts.length + ')';
      }

      if (posts.length === 0) {
        feed.innerHTML = '<div class="entries-empty"><p>No reflections yet.</p><p>Share your first insight above.</p></div>';
        return;
      }

      feed.innerHTML = posts.map(function(post, index) {
        var isOwn     = post.user_id === currentUserId;
        var deleteBtn = isOwn
          ? '<button class="community-delete" onclick="deleteCommunityPost(\'' + post.id + '\')" title="Remove">&times;</button>'
          : '';
        return '<div class="community-post">' +
          '<div class="community-avatar">' + getInitials(index) + '</div>' +
          '<div class="community-post-body">' +
            '<p class="community-post-text">"' + escapeHtml(post.text) + '"</p>' +
            '<div class="community-post-meta">' +
              '<span>' + formatCommunityDate(post.created_at) + '</span>' +
              deleteBtn +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    });
}

function initCommunity() {
  // nothing needed on load; rendered when section is visited
}
