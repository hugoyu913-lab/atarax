// ── AI Journaling Companion ───────────────────────────────────────────────

// The API key is a device-local credential — never synced to Supabase.
// It is stored directly in localStorage, bypassing db.js intentionally.
function getStoredAPIKey() {
  try { return localStorage.getItem('sj_api_key') || ''; } catch (e) { return ''; }
}

function saveAPIKey(panel) {
  var input = document.getElementById('api-key-input-' + panel);
  if (!input) return;
  var key = input.value.trim();
  if (!key || !key.startsWith('sk-')) {
    showToast('Please enter a valid Anthropic API key (starts with sk-)');
    return;
  }
  try { localStorage.setItem('sj_api_key', key); } catch (e) {}
  showToast('API key saved');
  renderAISection(panel);
}

function clearAPIKey() {
  if (!confirm('Remove your saved API key?')) return;
  try { localStorage.removeItem('sj_api_key'); } catch (e) {}
  ['morning', 'midday', 'evening'].forEach(function(p) { renderAISection(p); });
  showToast('API key removed');
}

function refreshAISection(panel) {
  renderAISection(panel);
}

function renderAISection(panel) {
  var wrap = document.getElementById('ai-wrap-' + panel);
  if (!wrap) return;
  var key = getStoredAPIKey();
  var today = dateKey();
  var hasSaved = !!getData('sj_' + panel + '_' + today);

  if (!hasSaved) {
    wrap.innerHTML = '';
    return;
  }

  if (!key) {
    wrap.innerHTML =
      '<div class="ai-key-card">' +
        '<div class="ai-key-eyebrow">AI Companion</div>' +
        '<div class="ai-key-title">Get Personalised Stoic Wisdom</div>' +
        '<div class="ai-key-desc">Enter your Anthropic API key to receive a thoughtful, personalised Stoic reflection on what you have written. Your key is stored locally and never shared.</div>' +
        '<div class="ai-key-row">' +
          '<input class="api-key-input" id="api-key-input-' + panel + '" type="password" placeholder="sk-ant-..." />' +
          '<button class="btn-primary" onclick="saveAPIKey(\'' + panel + '\')">Save Key</button>' +
        '</div>' +
      '</div>';
    return;
  }

  var responseCardId = 'ai-response-' + panel;
  var existing = document.getElementById(responseCardId);
  var responseHtml = existing ? existing.outerHTML : '';

  wrap.innerHTML =
    '<div class="ai-wisdom-btn-row" style="margin-bottom:' + (responseHtml ? '0' : '0') + '">' +
      '<button class="btn-wisdom" id="ai-btn-' + panel + '" onclick="getAIWisdom(\'' + panel + '\')">' +
        '&#10022; Get Stoic Wisdom' +
      '</button>' +
      '<button class="btn-change-key" onclick="clearAPIKey()">Remove API key</button>' +
    '</div>' +
    (responseHtml ? responseHtml : '<div id="ai-response-' + panel + '"></div>');
}

function getJournalContext(panel) {
  var today = dateKey();
  var data = getData('sj_' + panel + '_' + today);
  if (!data) return '';

  var parts = [];
  if (panel === 'morning') {
    if (data.intention) parts.push('Morning intention: ' + data.intention);
    if (data.within_control) parts.push('Within my control: ' + data.within_control);
    if (data.outside_control) parts.push('Outside my control: ' + data.outside_control);
    if (data.premeditatio) parts.push('Anticipated challenges: ' + data.premeditatio);
    if (data.virtue) parts.push('Guiding virtue chosen: ' + data.virtue);
  } else if (panel === 'midday') {
    if (data.morning_review) parts.push('Morning review: ' + data.morning_review);
    if (data.emotional_awareness) parts.push('Emotional awareness: ' + data.emotional_awareness);
    if (data.control_check) parts.push('Control check: ' + data.control_check);
    if (data.afternoon_intention) parts.push('Afternoon intention: ' + data.afternoon_intention);
  } else if (panel === 'evening') {
    if (data.went_well) parts.push('What went well: ' + data.went_well);
    if (data.improve) parts.push('What I would improve: ' + data.improve);
    if (data.virtue_act) parts.push('A virtuous act: ' + data.virtue_act);
    if (data.gratitude) parts.push('Gratitude: ' + data.gratitude);
    if (data.lesson) parts.push("Today's lesson: " + data.lesson);
  }
  return parts.join('\n\n');
}

function getAIWisdom(panel) {
  var key = getStoredAPIKey();
  if (!key) return;

  var context = getJournalContext(panel);
  if (!context.trim()) {
    showToast('Write something in your journal entry first');
    return;
  }

  var btn = document.getElementById('ai-btn-' + panel);
  var responseEl = document.getElementById('ai-response-' + panel);
  if (!responseEl) return;

  if (btn) { btn.disabled = true; btn.textContent = 'Consulting the Stoics...'; }
  responseEl.innerHTML =
    '<div class="ai-response-card">' +
      '<div class="ai-response-eyebrow">Stoic Wisdom &mdash; Atarax</div>' +
      '<p class="ai-response-text"><span class="ai-loading">Reflecting on your words...</span></p>' +
    '</div>';

  var panelName = { morning: 'morning', midday: 'midday', evening: 'evening' }[panel];
  var prompt = 'You are a wise Stoic philosopher and compassionate mentor guiding a student in their daily practice. ' +
    'Read the following ' + panelName + ' journal entry carefully and respond with personalised Stoic wisdom — ' +
    'offering thoughtful reflection, gentle encouragement, and philosophical insight rooted in the teachings of ' +
    'Marcus Aurelius, Epictetus, and Seneca. Be warm but direct. Reference specific Stoic principles where relevant. ' +
    'Keep your response to 2-3 paragraphs. Speak in second person, directly to the student.\n\n' +
    'Journal entry:\n\n' + context;

  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  .then(function(res) {
    if (!res.ok) {
      return res.json().then(function(err) {
        throw new Error((err.error && err.error.message) || 'API error ' + res.status);
      });
    }
    return res.json();
  })
  .then(function(data) {
    var text = data.content && data.content[0] && data.content[0].text;
    if (!text) throw new Error('No response received');
    var paragraphs = text.split('\n\n').filter(function(p) { return p.trim(); });
    var html = paragraphs.map(function(p) { return '<p class="ai-response-text" style="margin-bottom:14px">' + escapeHtml(p.trim()) + '</p>'; }).join('');
    if (responseEl) {
      responseEl.innerHTML =
        '<div class="ai-response-card">' +
          '<div class="ai-response-eyebrow">Stoic Wisdom &mdash; Atarax</div>' +
          html +
        '</div>';
    }
  })
  .catch(function(err) {
    if (responseEl) {
      responseEl.innerHTML =
        '<div class="ai-response-card">' +
          '<div class="ai-response-eyebrow">Stoic Wisdom</div>' +
          '<p class="ai-error">Unable to reach the AI: ' + escapeHtml(err.message) + '. Please check your API key and internet connection.</p>' +
        '</div>';
    }
  })
  .finally(function() {
    if (btn) { btn.disabled = false; btn.innerHTML = '&#10022; Get Stoic Wisdom'; }
  });
}

function initAI() {
  ['morning', 'midday', 'evening'].forEach(function(panel) {
    renderAISection(panel);
  });
}
