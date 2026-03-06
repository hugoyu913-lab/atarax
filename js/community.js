// ── Community Reflections Board ───────────────────────────────────────────

var COMMUNITY_SEED = [
  { id:'seed_1', text:'Today I realised my resistance to change was the source of my suffering, not the change itself.', date:'2026-02-28', seed:true },
  { id:'seed_2', text:'Practising voluntary discomfort showed me how much I had been confusing comfort with genuine happiness.', date:'2026-02-27', seed:true },
  { id:'seed_3', text:'The moment I stopped trying to control the outcome, I found I could finally act well in the present.', date:'2026-02-26', seed:true },
  { id:'seed_4', text:'Memento mori is not morbid — it is the clearest lens I have found for seeing what truly matters today.', date:'2026-02-25', seed:true },
  { id:'seed_5', text:'I asked myself what the wisest version of me would do. The answer was always simpler than I expected.', date:'2026-02-24', seed:true },
  { id:'seed_6', text:'The dichotomy of control, once truly understood, removes more suffering than any comfort ever could.', date:'2026-02-23', seed:true },
  { id:'seed_7', text:'Begin at once to live, and count each separate day as a separate life. Seneca knew something we keep forgetting.', date:'2026-02-22', seed:true }
];

function getUserPosts() {
  return getData('sj_community') || [];
}

function saveUserPosts(posts) {
  setData('sj_community', posts);
}

function updateCharCount() {
  var input = document.getElementById('community-input');
  var counter = document.getElementById('char-count');
  if (input && counter) counter.textContent = input.value.length;
}

function shareReflection() {
  var input = document.getElementById('community-input');
  if (!input) return;
  var text = input.value.trim();
  if (!text) { showToast('Please write a reflection first'); return; }
  if (text.length > 280) { showToast('Keep your reflection under 280 characters'); return; }

  var posts = getUserPosts();
  var newPost = {
    id: 'user_' + Date.now(),
    text: text,
    date: dateKey(),
    seed: false
  };
  posts.unshift(newPost);
  saveUserPosts(posts);
  input.value = '';
  updateCharCount();
  renderCommunity();
  showToast('Reflection shared to your board');
}

function deleteCommunityPost(id) {
  var posts = getUserPosts();
  posts = posts.filter(function(p) { return p.id !== id; });
  saveUserPosts(posts);
  renderCommunity();
  showToast('Reflection removed');
}

function getInitials(index) {
  var letters = ['A', 'S', 'M', 'E', 'T', 'C', 'J', 'V', 'P', 'R'];
  return letters[index % letters.length];
}

function formatCommunityDate(iso) {
  if (!iso) return '';
  try {
    var parts = iso.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) { return iso; }
}

function renderCommunity() {
  var feed = document.getElementById('community-feed');
  var feedLabel = document.getElementById('community-feed-label');
  if (!feed) return;

  var userPosts = getUserPosts();
  var allPosts = userPosts.concat(COMMUNITY_SEED);

  if (feedLabel) {
    feedLabel.textContent = 'Reflections (' + allPosts.length + ')';
  }

  if (allPosts.length === 0) {
    feed.innerHTML = '<div class="entries-empty"><p>No reflections yet.</p><p>Share your first insight above.</p></div>';
    return;
  }

  feed.innerHTML = allPosts.map(function(post, index) {
    var isUser = !post.seed;
    var seedTag = post.seed ? '<span class="community-seed-tag">example reflection</span>' : '';
    var deleteBtn = isUser
      ? '<button class="community-delete" onclick="deleteCommunityPost(\'' + post.id + '\')" title="Remove">&times;</button>'
      : '';
    return '<div class="community-post">' +
      '<div class="community-avatar">' + getInitials(index) + '</div>' +
      '<div class="community-post-body">' +
        '<p class="community-post-text">"' + escapeHtml(post.text) + '"</p>' +
        '<div class="community-post-meta">' +
          '<span>' + formatCommunityDate(post.date) + '</span>' +
          seedTag +
          deleteBtn +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function initCommunity() {
  // nothing needed on load; rendered when section is visited
}
