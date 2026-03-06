// ── 30-Day Stoic Challenge ────────────────────────────────────────────────

var DAYS_30 = [
  { day:1,  virtue:'Wisdom',     title:'The Morning Audit',         task:'Before the day begins, write three specific intentions — not wishes, but commitments. Define clearly who you will choose to be in each major role today.' },
  { day:2,  virtue:'Temperance', title:'Voluntary Discomfort',      task:'Forgo one comfort today — a warm shower, morning coffee, or a digital device. Sit consciously with the discomfort. Notice what it teaches you about dependency.' },
  { day:3,  virtue:'Wisdom',     title:'The Silent Walk',           task:'Walk for 30 minutes without your phone, without music, without agenda. Simply observe what is present — both around you and within you.' },
  { day:4,  virtue:'Wisdom',     title:'Memento Mori',              task:'Spend 10 minutes in quiet contemplation of your mortality. Write what becomes clear when you truly remember that this day will not return.' },
  { day:5,  virtue:'Temperance', title:'Deep Gratitude',            task:'Write in detail about three things you are grateful for. Not what they are — but why they matter, and what it would mean to lose them permanently.' },
  { day:6,  virtue:'Courage',    title:'Premeditatio Malorum',      task:'Visualize in concrete detail a difficulty you fear. Sit with it patiently. Plan your calm response. Remove its power by making it familiar.' },
  { day:7,  virtue:'Wisdom',     title:'The Dichotomy Review',      task:'For every significant concern today, classify clearly: Is it within my control, or not? Direct your energy only toward what you can genuinely influence.' },
  { day:8,  virtue:'Temperance', title:'Digital Sabbath',           task:'No social media, no news, no streaming for one full day. Observe carefully what fills the silence when distraction is removed from your life.' },
  { day:9,  virtue:'Wisdom',     title:'The Sage Test',             task:'Before every significant decision today, pause and ask honestly: What would a perfectly wise person do here? Then act on the answer you find.' },
  { day:10, virtue:'Courage',    title:'Amor Fati',                 task:'Find one thing today that would normally frustrate you. Embrace it wholeheartedly. Write about how this obstacle might be serving your development.' },
  { day:11, virtue:'All',        title:'One Virtue Focus',          task:'Choose one cardinal virtue — wisdom, courage, justice, or temperance. Bring it consciously to every interaction and decision throughout your entire day.' },
  { day:12, virtue:'Temperance', title:'Negative Visualization',    task:'Spend 20 minutes imagining the loss of the things you love most. Feel the genuine weight of their absence. Return to them with deeper gratitude.' },
  { day:13, virtue:'Wisdom',     title:'The Observer',              task:'Three times today, pause for five minutes and simply watch your thoughts without engaging them — as if observing from a calm, distant vantage point.' },
  { day:14, virtue:'Justice',    title:'The Unsent Letter',         task:'Write a full, truthful letter to someone with whom you have unresolved emotional business. Write with complete honesty. Do not send it. Keep it.' },
  { day:15, virtue:'Wisdom',     title:'Halfway Reflection',        task:'Review your practice from days one through fourteen. What patterns appear? Where have you genuinely grown? What resistance remains most stubborn?' },
  { day:16, virtue:'Wisdom',     title:'Stoic Dialogue',            task:'Read one page of Marcus Aurelius, Epictetus, or Seneca. Then write your own thoughtful response — agreement, challenge, or sincere question.' },
  { day:17, virtue:'Justice',    title:'Day of Service',            task:'Perform three meaningful acts of service for others today. Do each without any expectation of recognition, gratitude, or return whatsoever.' },
  { day:18, virtue:'Courage',    title:'Fear Naming',               task:'Write out your three deepest current fears in plain, direct language. Examine each: Is it within your control? Is it likely? What would you actually do?' },
  { day:19, virtue:'All',        title:'Evening Virtue Audit',      task:'At day\'s end, rate yourself honestly on all four cardinal virtues. Be specific about where you fell short. Identify the cause without self-judgment.' },
  { day:20, virtue:'Wisdom',     title:'The Present Hour',          task:'Set an hourly reminder. Each time it sounds, return fully and deliberately to this moment. Notice how often your mind had drifted, and to where.' },
  { day:21, virtue:'Justice',    title:'Role Examination',          task:'List every significant role you currently hold in life. For each role, write one completely honest sentence about how faithfully you are fulfilling it.' },
  { day:22, virtue:'Temperance', title:'Simplicity Day',            task:'Remove all non-essential stimulation for one full day. Eat simply. Rest without entertainment. Observe with curiosity what the quiet space reveals.' },
  { day:23, virtue:'Justice',    title:'The Philosophical Letter',   task:'Write a sincere letter to a close friend sharing one Stoic principle that has genuinely helped you. Explain it entirely in your own words and experience.' },
  { day:24, virtue:'Courage',    title:'Obstacle as Teacher',       task:'Identify your most significant current obstacle. Write three specific ways it could be serving your growth. Practise amor fati with genuine intention.' },
  { day:25, virtue:'Wisdom',     title:'Impermanence Walk',         task:'Walk slowly and notice ten things that will inevitably change or end — a tree, a face, a building, a mood. Sit briefly with the truth of each one.' },
  { day:26, virtue:'Wisdom',     title:'The Inner Citadel',         task:'In one paragraph, define your core values with precision. Then ask with complete honesty: Does how I actually spend my time genuinely reflect these values?' },
  { day:27, virtue:'Justice',    title:'Community Virtue',          task:'Do something meaningful today for your community, neighbourhood, or family — not because it will be noticed or remembered, but because it is simply right.' },
  { day:28, virtue:'All',        title:'Full Practice Day',         task:'Complete morning, midday, and evening journal practice in full, without shortcuts. This is what committed daily practice looks like when you truly mean it.' },
  { day:29, virtue:'Wisdom',     title:'Letter to Future Self',     task:'Write a letter to yourself exactly one year from now. What do you hope that person has become? What are you asking of them — beginning today?' },
  { day:30, virtue:'All',        title:'The Final Accounting',      task:'Review your entire thirty-day journey with honesty. What has genuinely changed in your thinking? What practice will you carry forward? Who are you becoming?' }
];

function getProgress30() {
  return getData('sj_30day') || {};
}

function saveProgress30(progress) {
  setData('sj_30day', progress);
}

function completeDay30(day) {
  var progress = getProgress30();
  if (progress[day]) return;
  progress[day] = dateKey();
  saveProgress30(progress);
  renderChallenge30();
  showToast('Day ' + day + ' complete. Well done.');
}

function switchChallengesTab(tab) {
  document.querySelectorAll('.ch-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.ch-panel').forEach(function(p) { p.classList.remove('active'); });
  var tabEl = document.getElementById('chtab-' + tab);
  var panelEl = document.getElementById('ch-panel-' + tab);
  if (tabEl) tabEl.classList.add('active');
  if (panelEl) panelEl.classList.add('active');
  if (tab === 'thirty') renderChallenge30();
  if (tab === 'seven') renderChallenges();
}

function renderChallenge30() {
  var container = document.getElementById('challenge30-container');
  if (!container) return;

  var progress = getProgress30();
  var completedCount = Object.keys(progress).length;
  var totalDays = DAYS_30.length;

  // Progress header
  var headerHtml =
    '<div class="progress-header">' +
      '<div>' +
        '<div class="section-eyebrow" style="margin-bottom:4px">30-Day Stoic Journey</div>' +
        '<p style="font-size:0.84rem;color:var(--muted)">Complete each day\'s practice. Progress is yours alone to track.</p>' +
      '</div>' +
      '<div class="progress-stats"><strong>' + completedCount + '</strong> / ' + totalDays + ' days complete</div>' +
    '</div>';

  // Progress grid
  var gridCells = DAYS_30.map(function(d) {
    var done = !!progress[d.day];
    return '<div class="progress-cell' + (done ? ' done' : '') + '" ' +
      'title="Day ' + d.day + ': ' + d.title + (done ? ' — Completed ' + progress[d.day] : '') + '" ' +
      'onclick="scrollToDay30(' + d.day + ')">' +
      d.day +
    '</div>';
  }).join('');
  var gridHtml = '<div class="progress-grid">' + gridCells + '</div>';

  // Task list
  var tasksHtml = '<div class="day-tasks-list">' +
    DAYS_30.map(function(d) {
      var done = !!progress[d.day];
      return '<div class="day-task-card' + (done ? ' done' : '') + '" id="day30-' + d.day + '">' +
        '<div class="day-number">' + d.day + '</div>' +
        '<div class="day-body">' +
          '<div class="day-title">' + d.title + '</div>' +
          '<div class="day-virtue">Virtue: ' + d.virtue + '</div>' +
          '<div class="day-task">' + d.task + '</div>' +
          '<button class="btn-complete-day' + (done ? ' done' : '') + '" ' +
            (done ? 'disabled' : 'onclick="completeDay30(' + d.day + ')"') + '>' +
            (done ? '&#10003; Completed ' + progress[d.day] : 'Mark Complete') +
          '</button>' +
        '</div>' +
      '</div>';
    }).join('') +
  '</div>';

  container.innerHTML = headerHtml + gridHtml + tasksHtml;
}

function scrollToDay30(day) {
  var el = document.getElementById('day30-' + day);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
