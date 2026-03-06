// ── Atarax — Supabase Integration ────────────────────────────────────────
//
// Requires js/auth.js to be loaded first (provides _getAuthClient, getCurrentUserId).
//
// Overrides the localStorage-based getData / setData / deleteData helpers
// defined in core.js with Supabase-backed versions that:
//   1.  Keep an in-memory cache (_sjCache) as the authoritative source.
//   2.  Write through to Supabase on every setData / deleteData call.
//   3.  Fall back silently to localStorage when Supabase is unavailable.
//   4.  Scope ALL reads and writes to the current authenticated user.
//
// Tables used (see supabase-schema.sql for CREATE statements):
//   journal_entries   — morning / midday / evening / weekly / monthly entries
//   favorite_quotes   — saved Stoic quotes
//   challenge_progress— 7-challenge and 30-day challenge progress
//   reading_list      — per-book read status
//   streak_data       — current streak metadata
// ─────────────────────────────────────────────────────────────────────────

var _db      = null;   // Supabase client (shared with auth.js)
var _sjCache = {};     // key → parsed value, in-memory mirror

// ── Reuse auth client ──────────────────────────────────────────────────────
// auth.js already initialised the Supabase client; we reuse it so there is
// only one connection.

function _getDbClient() {
  if (_db) return _db;
  if (typeof _getAuthClient === 'function') {
    _db = _getAuthClient();
  }
  return _db;
}

// ── Core storage overrides ─────────────────────────────────────────────────

function getData(key) {
  if (_sjCache.hasOwnProperty(key)) return _sjCache[key];
  try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
}

function setData(key, val) {
  _sjCache[key] = val;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  if (_getDbClient() && getCurrentUserId()) _writeToSupabase(key, val);
}

function deleteData(key) {
  delete _sjCache[key];
  try { localStorage.removeItem(key); } catch (e) {}
  if (_getDbClient() && getCurrentUserId()) _deleteFromSupabase(key);
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
  var db = _getDbClient();
  var userId = getCurrentUserId();
  if (!db || !userId) return;
  try {
    if (_isJournalKey(key)) {
      db.from('journal_entries')
        .upsert({
          user_id:     userId,
          storage_key: key,
          entry_type:  _getEntryType(key),
          date_key:    _getDateKey(key),
          content:     val,
          saved_at:    (val && val.savedAt) ? val.savedAt : new Date().toISOString(),
          updated_at:  new Date().toISOString()
        }, { onConflict: 'user_id,storage_key' })
        .then(function (r) {
          if (r.error) console.warn('[Atarax] journal write error:', r.error.message);
        });

    } else if (key === 'sj_favorites') {
      _syncFavoritesToSupabase(val);

    } else if (key === 'sj_challenges') {
      db.from('challenge_progress')
        .upsert({
          user_id:        userId,
          challenge_type: 'seven',
          data:            val,
          updated_at:      new Date().toISOString()
        }, { onConflict: 'user_id,challenge_type' })
        .then(function (r) {
          if (r.error) console.warn('[Atarax] challenges write error:', r.error.message);
        });

    } else if (key === 'sj_30day') {
      db.from('challenge_progress')
        .upsert({
          user_id:        userId,
          challenge_type: 'thirty',
          data:            val,
          updated_at:      new Date().toISOString()
        }, { onConflict: 'user_id,challenge_type' })
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

// Replace entire favorites list for this user (delete-all + re-insert preserves sort order)
function _syncFavoritesToSupabase(favs) {
  var db = _getDbClient();
  var userId = getCurrentUserId();
  if (!db || !userId || !Array.isArray(favs)) return;
  db.from('favorite_quotes')
    .delete()
    .eq('user_id', userId)
    .then(function () {
      if (!favs.length) return Promise.resolve();
      var rows = favs.map(function (q, i) {
        return {
          user_id:    userId,
          quote_text: q.quote  || '',
          author:     q.author || '',
          source:     q.source || '',
          sort_order: i
        };
      });
      return db.from('favorite_quotes').insert(rows);
    })
    .then(function (r) {
      if (r && r.error) console.warn('[Atarax] favorites sync error:', r.error.message);
    })
    .catch(function (e) { console.warn('[Atarax] favorites sync error:', e.message); });
}

// Upsert one row per book for this user
function _syncReadingToSupabase(status) {
  var db = _getDbClient();
  var userId = getCurrentUserId();
  if (!db || !userId || typeof status !== 'object' || status === null) return;
  var rows = Object.keys(status).map(function (bookId) {
    return {
      user_id:    userId,
      book_id:    bookId,
      is_read:    !!status[bookId],
      updated_at: new Date().toISOString()
    };
  });
  if (!rows.length) return;
  db.from('reading_list')
    .upsert(rows, { onConflict: 'user_id,book_id' })
    .then(function (r) {
      if (r.error) console.warn('[Atarax] reading_list sync error:', r.error.message);
    });
}

function _deleteFromSupabase(key) {
  var db = _getDbClient();
  var userId = getCurrentUserId();
  if (!db || !userId) return;
  try {
    if (_isJournalKey(key)) {
      db.from('journal_entries')
        .delete()
        .eq('user_id', userId)
        .eq('storage_key', key)
        .then(function (r) {
          if (r.error) console.warn('[Atarax] journal delete error:', r.error.message);
        });
    }
  } catch (e) { console.warn('[Atarax] Supabase delete error:', e.message); }
}

// ── Load this user's data from Supabase ───────────────────────────────────

function _loadJournalEntries() {
  var db = _getDbClient();
  var userId = getCurrentUserId();
  return db.from('journal_entries')
    .select('storage_key, content')
    .eq('user_id', userId)
    .then(function (r) {
      if (r.error) { console.warn('[Atarax] load journal error:', r.error.message); return; }
      (r.data || []).forEach(function (row) {
        _sjCache[row.storage_key] = row.content;
      });
    })
    .catch(function (e) { console.warn('[Atarax] load journal exception:', e.message); });
}

function _loadFavoriteQuotes() {
  var db = _getDbClient();
  var userId = getCurrentUserId();
  return db.from('favorite_quotes')
    .select('quote_text, author, source')
    .eq('user_id', userId)
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
  var db = _getDbClient();
  var userId = getCurrentUserId();
  return db.from('challenge_progress')
    .select('challenge_type, data')
    .eq('user_id', userId)
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
  var db = _getDbClient();
  var userId = getCurrentUserId();
  return db.from('reading_list')
    .select('book_id, is_read')
    .eq('user_id', userId)
    .then(function (r) {
      if (r.error) { console.warn('[Atarax] load reading error:', r.error.message); return; }
      var status = {};
      (r.data || []).forEach(function (row) { status[row.book_id] = row.is_read; });
      _sjCache['sj_reading'] = status;
    })
    .catch(function (e) { console.warn('[Atarax] load reading exception:', e.message); });
}

function _loadStreakData() {
  var db = _getDbClient();
  var userId = getCurrentUserId();
  return db.from('streak_data')
    .select('record_key, data')
    .eq('user_id', userId)
    .then(function (r) {
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
  var db = _getDbClient();
  var userId = getCurrentUserId();
  if (!db || !userId || typeof calcStreak !== 'function') return;
  try {
    var streak = calcStreak();
    db.from('streak_data')
      .upsert({
        user_id:    userId,
        record_key: 'current',
        data:       { current_streak: streak, last_updated: new Date().toISOString() },
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,record_key' })
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
  var db = _getDbClient();
  var userId = getCurrentUserId();
  if (!db || !userId) return;
  // Key is user-scoped so each user only migrates once per device
  var MIGRATION_KEY = 'sj_supabase_migrated_v2_' + userId;
  if (localStorage.getItem(MIGRATION_KEY)) return;

  var migrationData = {};
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (!k || !k.startsWith('sj_')) continue;
      if (k === 'sj_theme' || k === 'sj_api_key') continue;
      if (k.startsWith('sj_supabase_migrated')) continue;
      if (_sjCache.hasOwnProperty(k)) continue; // Already loaded from Supabase
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
// Called from the inline init block in index.html AFTER auth has been
// verified (checkSession resolves to a user).  By the time this runs,
// getCurrentUserId() is guaranteed to be non-null.

function initDB() {
  return new Promise(function (resolve) {
    _getDbClient(); // Ensure client is initialised

    if (_db && getCurrentUserId()) {
      _loadAllFromSupabase()
        .then(function () {
          _migrateLocalStorageToSupabase();
          resolve();
        })
        .catch(function (e) {
          console.warn('[Atarax] Supabase load failed, using localStorage:', e.message);
          _seedCacheFromLocalStorage();
          resolve();
        });
    } else {
      _seedCacheFromLocalStorage();
      resolve();
    }
  });
}
