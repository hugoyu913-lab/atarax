// ── Mood Tracking ─────────────────────────────────────────────────────────

var MOOD_LABELS = ['', 'Struggling', 'Low', 'Neutral', 'Good', 'Excellent'];
var MOOD_EMOJI  = ['', '\uD83D\uDE14', '\uD83D\uDE10', '\uD83D\uDE42', '\uD83D\uDE0A', '\u2728'];

var currentMood = 0;

function getMoodEmoji(n) { return MOOD_EMOJI[n] || ''; }
function getMoodLabel(n) { return MOOD_LABELS[n] || ''; }

function setMood(n) {
  currentMood = n;
  document.querySelectorAll('.mood-btn').forEach(function(btn) {
    var m = parseInt(btn.dataset.mood);
    btn.classList.toggle('selected', m === n);
  });
}

function loadMoodForDay() {
  var today = dateKey();
  var data = getData('sj_morning_' + today);
  var mood = (data && data.mood) ? data.mood : 0;
  setMood(mood);
}

function renderMoodChart() {
  var container = document.getElementById('mood-chart-bars');
  if (!container) return;
  var bars = [];
  for (var i = 29; i >= 0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    var k = dateKey(d);
    var data = getData('sj_morning_' + k);
    var mood = (data && data.mood) ? data.mood : 0;
    if (mood > 0) {
      var pct = Math.round((mood / 5) * 100);
      var label = formatDateLong(k) + ': ' + getMoodLabel(mood);
      bars.push('<div class="mood-bar" data-mood="' + mood + '" style="height:' + pct + '%" title="' + label + '"></div>');
    } else {
      bars.push('<div class="mood-bar-empty" title="' + k + ': No entry"></div>');
    }
  }
  container.innerHTML = bars.join('');
}

function initMood() {
  loadMoodForDay();
}
