// ── PDF Export ────────────────────────────────────────────────────────────

function exportToPDF() {
  // Switch to entries section and ensure all entries are visible
  if (activeSection !== 'entries') {
    switchSection('entries');
    setTimeout(function() { triggerPrint(); }, 300);
  } else {
    triggerPrint();
  }
}

function triggerPrint() {
  // Clear all filters so all entries are shown
  var searchInput = document.getElementById('search-input');
  var dateFrom = document.getElementById('filter-date-from');
  var dateTo = document.getElementById('filter-date-to');
  var moodFilter = document.getElementById('filter-mood');

  var prevSearch = searchInput ? searchInput.value : '';
  var prevFrom = dateFrom ? dateFrom.value : '';
  var prevTo = dateTo ? dateTo.value : '';
  var prevMood = moodFilter ? moodFilter.value : '';

  // Expand all entry panels for printing
  document.querySelectorAll('.entry-panel').forEach(function(panel) {
    panel.classList.add('open');
  });

  // Print
  window.print();

  // Restore panels after print dialog closes
  setTimeout(function() {
    document.querySelectorAll('.entry-panel').forEach(function(panel) {
      panel.classList.remove('open');
    });
  }, 1000);
}
