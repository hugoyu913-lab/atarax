// ── Atarax — Supabase Integration ────────────────────────────────────────
//
// This file is loaded AFTER all other JS files but BEFORE the inline init
// block.  It overrides the localStorage-based getData / setData / deleteData
// helpers defined in core.js with Supabase-backed versions that:
//   1.  Keep an in-memory cache (_sjCache) as the authoritative source.
//   2.  Write through to Supabase on every setData / deleteData call.
//   3.  Fall back silently to localStorage when Supabase is unavailable.
//
// Tables used (see supabase-schema.sql for CREATE statements):
//   journal_entries   — morning / midday / evening / weekly / monthly entries
//   favorite_quotes   — saved Stoic quotes
//   challenge_progress— 7-challenge and 30-day challenge progress
//   reading_list      — per-book read status
//   streak_data       — current streak metadata
// ─────────────────────────────────────────────────────────────────────────

var SUPABASE_URL      = 'https://pcfqrqbqwhhewkfzvtni.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZnFycWJxd2hoZXdrZnp2dG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTU1OTksImV4cCI6MjA4ODM5MTU5OX0.YeT4aRlVf-q4abiBspmwqvecuAz6DwFlTEUXoR8pOwE';

var _db       = null;   // Supabase client instance (null if unavailable)
var _sjCache  = {};     // key → parsed value, in-memory mirror of Supabase

// ── Override core.js storage helpers ──────────────────────────────────────

function getData(key) {
  if (_sjCache.hasOwnProperty(key)) return _sjCache[key];
  // Fall back to localStorage (also serves local-only keys: sj_theme, sj_api_key)
  try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
}

function setData(key, val) {
  _sjCache[key] = val;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  if (_db) _writeToSupabase(key, val);
}

function deleteData(key) {
  delete _sjCache[key];
  try { localStorage.removeItem(key); } catch (e) {}
  if (_db) _deleteFromSupabase(key);
}

// Returns all sj_* keys currently held in the cache.
// Used by renderEntries / streak helpers instead of iterating localStorage.
function sjCacheKeys() {
  return Object.keys(_sjCache);
}

// ── Key classification helpers ─────────────────────────────────────────────

function _isJournalKey(key) {
  return /^sj_(morning|midday|evening|weekly|monthly|quote_state)/.test(key);
}

function _getEntryType(key) {
  var m = key.match(/^sj_(morning|midday|evening|weekly|monthly)_/);
  if (m) return m[1];
  if (key === 'sj_quote_state') return 'quote_state';
  return 'unknown';
}

function _getDateKey(key) {
  var m = key.match(/^sj_(?:morning|midday|evening|weekly|monthly)_(.+)$/);
  if (m) return m[1];
  if (key === 'sj_quote_state') return 'global';
  return key;
}

// ── Supabase write operations ──────────────────────────────────────────────

function _writeToSupabase(key, val) {
  if (!_db) return;
  try {
    if (_isJournalKey(key)) {
      _db.from('journal_entries')
        .upsert({
          storage_key: key,
          entry_type:  _getEntryType(key),
          date_key:    _getDateKey(key),
          content:     val,
          saved_at:    (val && val.savedAt) ? val.savedAt : new Date().toISOString(),
          updated_at:  new Date().toISOString()
        }, { onConflict: 'storage_key' })
        .then(function (r) {
          if (r.error) console.warn('[Atarax] journal write error:', r.error.message);
        });

    } else if (key === 'sj_favorites') {
      _syncFavoritesToSupabase(val);

    } else if (key === 'sj_challenges') {
      _db.from('challenge_progress')
        .upsert({ challenge_type: 'seven',  data: val, updated_at: new Date().toISOString() },
                { onConflict: 'challenge_type' })
        .then(function (r) {
          if (r.error) console.warn('[Atarax] challenges write error:', r.error.message);
        });

    } else if (key === 'sj_30day') {
      _db.from('challenge_progress')
        .upsert({ challenge_type: 'thirty', data: val, updated_at: new Date().toISOString() },
                { onConflict: 'challenge_type' })
        .then(function (r) {
          if (r.error) console.warn('[Atarax] 30day write error:', r.error.message);
        });

    } else if (key === 'sj_reading') {
      _syncReadingToSupabase(val);
    }
    // sj_theme and sj_api_key intentionally kept localStorage-only
  } catch (e) {
    console.warn('[Atarax] Supabase sync error:', e.message);
  }
}

// Replace entire favorites list (delete-all + re-insert preserves sort order)
function _syncFavoritesToSupabase(favs) {
  if (!_db || !Array.isArray(favs)) return;
  _db.from('favorite_quotes')
    .delete()
    .not('id', 'is', null)
    .then(function () {
      if (!favs.length) return Promise.resolve();
      var rows = favs.map(function (q, i) {
        return {
          quote_text: q.quote  || '',
          author:     q.author || '',
          source:     q.source || '',
          sort_order: i
        };
      });
      return _db.from('favorite_quotes').insert(rows);
    })
    .then(function (r) {
      if (r && r.error) console.warn('[Atarax] favorites sync error:', r.error.message);
    })
    .catch(function (e) { console.warn('[Atarax] favorites sync error:', e.message); });
}

// Upsert one row per book
function _syncReadingToSupabase(status) {
  if (!_db || typeof status !== 'object' || status === null) return;
  var rows = Object.keys(status).map(function (bookId) {
    return { book_id: bookId, is_read: !!status[bookId], updated_at: new Date().toISOString() };
  });
  if (!rows.length) return;
  _db.from('reading_list')
    .upsert(rows, { onConflict: 'book_id' })
    .then(function (r) {
      if (r.error) console.warn('[Atarax] reading_list sync error:', r.error.message);
    });
}

function _deleteFromSupabase(key) {
  if (!_db) return;
  try {
    if (_isJournalKey(key)) {
      _db.from('journal_entries')
        .delete()
        .eq('storage_key', key)
        .then(function (r) {
          if (r.error) console.warn('[Atarax] journal delete error:', r.error.message);
        });
    }
  } catch (e) { console.warn('[Atarax] Supabase delete error:', e.message); }
}

// ── Load all Supabase data into _sjCache ───────────────────────────────────

function _loadJournalEntries() {
  return _db.from('journal_entries')
    .select('storage_key, content')
    .then(function (r) {
      if (r.error) { console.warn('[Atarax] load journal error:', r.error.message); return; }
      (r.data || []).forEach(function (row) {
        _sjCache[row.storage_key] = row.content;
      });
    })
    .catch(function (e) { console.warn('[Atarax] load journal exception:', e.message); });
}

function _loadFavoriteQuotes() {
  return _db.from('favorite_quotes')
    .select('quote_text, author, source')
    .order('sort_order', { ascending: true })
    .then(function (r) {
      if (r.error) { console.warn('[Atarax] load favorites error:', r.error.message); return; }
      var favs = (r.data || []).map(function (row) {
        return { quote: row.quote_text, author: row.author, source: row.source };
      });
      _sjCache['sj_favorites'] = favs;
    })
    .catch(function (e) { console.warn('[Atarax] load favorites exception:', e.message); });
}

function _loadChallengeProgress() {
  return _db.from('challenge_progress')
    .select('challenge_type, data')
    .then(function (r) {
      if (r.error) { console.warn('[Atarax] load challenges error:', r.error.message); return; }
      (r.data || []).forEach(function (row) {
        if (row.challenge_type === 'seven')  _sjCache['sj_challenges'] = row.data;
        if (row.challenge_type === 'thirty') _sjCache['sj_30day']      = row.data;
      });
    })
    .catch(function (e) { console.warn('[Atarax] load challenges exception:', e.message); });
}

function _loadReadingList() {
  return _db.from('reading_list')
    .select('book_id, is_read')
    .then(function (r) {
      if (r.error) { console.warn('[Atarax] load reading error:', r.error.message); return; }
      var status = {};
      (r.data || []).forEach(function (row) { status[row.book_id] = row.is_read; });
      _sjCache['sj_reading'] = status;
    })
    .catch(function (e) { console.warn('[Atarax] load reading exception:', e.message); });
}

function _loadStreakData() {
  return _db.from('streak_data')
    .select('record_key, data')
    .then(function (r) {
      // Streak is always recomputed from journal_entries at render time.
      // We load the row here only to confirm the table is accessible.
      if (r.error) console.warn('[Atarax] load streak error:', r.error.message);
    })
    .catch(function (e) { console.warn('[Atarax] load streak exception:', e.message); });
}

function _loadAllFromSupabase() {
  return Promise.all([
    _loadJournalEntries(),
    _loadFavoriteQuotes(),
    _loadChallengeProgress(),
    _loadReadingList(),
    _loadStreakData()
  ]);
}

// ── Streak sync (called from renderStreak in core.js) ─────────────────────

function _updateStreakData() {
  if (!_db || typeof calcStreak !== 'function') return;
  try {
    var streak = calcStreak();
    _db.from('streak_data')
      .upsert({
        record_key: 'current',
        data:       { current_streak: streak, last_updated: new Date().toISOString() },
        updated_at: new Date().toISOString()
      }, { onConflict: 'record_key' })
      .then(function (r) {
        if (r.error) console.warn('[Atarax] streak update error:', r.error.message);
      });
  } catch (e) { console.warn('[Atarax] streak update exception:', e.message); }
}

// ── Seed in-memory cache from localStorage (offline fallback) ─────────────

function _seedCacheFromLocalStorage() {
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.startsWith('sj_')) {
        try { _sjCache[k] = JSON.parse(localStorage.getItem(k)); } catch (e) {}
      }
    }
  } catch (e) {}
}

// ── One-time migration: push existing localStorage data to Supabase ────────

function _migrateLocalStorageToSupabase() {
  if (!_db) return;
  var MIGRATION_KEY = 'sj_supabase_migrated_v1';
  if (localStorage.getItem(MIGRATION_KEY)) return;

  var migrationData = {};
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (!k || !k.startsWith('sj_')) continue;
      if (k === 'sj_theme' || k === 'sj_api_key' || k === MIGRATION_KEY) continue;
      // Only migrate keys not already loaded from Supabase
      if (_sjCache.hasOwnProperty(k)) continue;
      try {
        var val = JSON.parse(localStorage.getItem(k));
        if (val !== null) migrationData[k] = val;
      } catch (e) {}
    }
  } catch (e) {}

  var keys = Object.keys(migrationData);
  if (!keys.length) {
    localStorage.setItem(MIGRATION_KEY, '1');
    return;
  }

  console.log('[Atarax] Migrating', keys.length, 'localStorage entries to Supabase...');
  keys.forEach(function (k) {
    _sjCache[k] = migrationData[k];
    _writeToSupabase(k, migrationData[k]);
  });
  localStorage.setItem(MIGRATION_KEY, '1');
  console.log('[Atarax] Migration complete.');
}

// ── Public init ───────────────────────────────────────────────────────────
//
// Returns a Promise that resolves when the cache is ready.
// Called from the inline init block in index.html instead of calling
// initCore / initMood / etc. directly.

function initDB() {
  return new Promise(function (resolve) {
    // Try to initialise the Supabase JS client (loaded from CDN)
    try {
      if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
        _db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }
    } catch (e) {
      console.warn('[Atarax] Supabase client init failed:', e.message);
    }

    if (_db) {
      _loadAllFromSupabase()
        .then(function () {
          // After Supabase load, migrate any pre-existing localStorage data
          _migrateLocalStorageToSupabase();
          resolve();
        })
        .catch(function (e) {
          console.warn('[Atarax] Supabase load failed, using localStorage:', e.message);
          _seedCacheFromLocalStorage();
          resolve();
        });
    } else {
      // Supabase JS not available — run entirely from localStorage
      _seedCacheFromLocalStorage();
      resolve();
    }
  });
}
