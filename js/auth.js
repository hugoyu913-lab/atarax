// ── Atarax — Authentication ───────────────────────────────────────────────
//
// Provides Supabase Auth utilities used by both auth.html and index.html.
// Load this BEFORE db.js so db.js can call _getAuthClient() / getCurrentUserId().
// ─────────────────────────────────────────────────────────────────────────

var SUPABASE_URL      = 'https://pcfqrqbqwhhewkfzvtni.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZnFycWJxd2hoZXdrZnp2dG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTU1OTksImV4cCI6MjA4ODM5MTU5OX0.YeT4aRlVf-q4abiBspmwqvecuAz6DwFlTEUXoR8pOwE';

var _authClient  = null;
var _currentUser = null;

// ── Client ────────────────────────────────────────────────────────────────

function _getAuthClient() {
  if (_authClient) return _authClient;
  try {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      _authClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  } catch (e) {
    console.warn('[Atarax Auth] Client init failed:', e.message);
  }
  return _authClient;
}

// ── Public accessors ──────────────────────────────────────────────────────

function getCurrentUser()   { return _currentUser; }
function getCurrentUserId() { return _currentUser ? _currentUser.id : null; }

// ── Session check ─────────────────────────────────────────────────────────
//
// Returns a Promise resolving to the User object if logged in, or null.

function checkSession() {
  return new Promise(function (resolve) {
    var client = _getAuthClient();
    if (!client) { resolve(null); return; }
    client.auth.getSession()
      .then(function (result) {
        var session = result.data && result.data.session;
        _currentUser = session ? session.user : null;
        resolve(_currentUser);
      })
      .catch(function () { resolve(null); });
  });
}

// ── Sign In ───────────────────────────────────────────────────────────────

function authSignIn(email, password) {
  return new Promise(function (resolve, reject) {
    var client = _getAuthClient();
    if (!client) { reject(new Error('Auth service unavailable')); return; }
    client.auth.signInWithPassword({ email: email, password: password })
      .then(function (result) {
        if (result.error) { reject(result.error); return; }
        _currentUser = result.data.user;
        resolve(result.data);
      })
      .catch(reject);
  });
}

// ── Sign Up ───────────────────────────────────────────────────────────────

function authSignUp(email, password) {
  return new Promise(function (resolve, reject) {
    var client = _getAuthClient();
    if (!client) { reject(new Error('Auth service unavailable')); return; }
    client.auth.signUp({ email: email, password: password })
      .then(function (result) {
        if (result.error) { reject(result.error); return; }
        _currentUser = result.data.user;
        resolve(result.data);
      })
      .catch(reject);
  });
}

// ── Sign Out ──────────────────────────────────────────────────────────────

function authSignOut() {
  var client = _getAuthClient();
  var _doRedirect = function () {
    _currentUser = null;
    // Clear any welcome flags
    try { sessionStorage.removeItem('sj_welcome'); } catch (e) {}
    window.location.replace('auth.html');
  };
  if (!client) { _doRedirect(); return; }
  client.auth.signOut()
    .then(_doRedirect)
    .catch(_doRedirect);
}

// ── Password Reset ────────────────────────────────────────────────────────

function authResetPassword(email) {
  return new Promise(function (resolve, reject) {
    var client = _getAuthClient();
    if (!client) { reject(new Error('Auth service unavailable')); return; }
    var redirectTo = window.location.origin +
      window.location.pathname.replace(/\/[^/]*$/, '/index.html');
    client.auth.resetPasswordForEmail(email, { redirectTo: redirectTo })
      .then(function (result) {
        if (result.error) { reject(result.error); return; }
        resolve();
      })
      .catch(reject);
  });
}
