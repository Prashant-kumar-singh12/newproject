/* ============================================================
   auth.js — demo authentication using localStorage
   ------------------------------------------------------------
   This is a FRONTEND-ONLY demo so the project runs without a
   server. Everything below is deliberately isolated in one
   module, so swapping in a real backend later means changing
   only the four functions marked "BACKEND HOOK" — the rest of
   the site keeps calling Auth.signup / Auth.login / Auth.logout.

   BACKEND HOOK examples:
     signup()  ->  POST /api/auth/register
     login()   ->  POST /api/auth/login   (returns a JWT)
     session   ->  store the token, not the user object
     logout()  ->  POST /api/auth/logout  + clear the token

   Note: passwords are stored in plain text here because this is
   a local demo. A real app must hash them on the server
   (bcrypt / argon2) and never keep them in the browser.
   ============================================================ */

const Auth = (function () {
  const USERS_KEY = 'internlink_users';
  const SESSION_KEY = 'internlink_session';

  /** Read the stored user list. Returns [] if storage is empty or broken. */
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (err) {
      console.warn('Could not read saved users:', err);
      return [];
    }
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch (err) {
      console.warn('Could not save users:', err);
      return false;
    }
  }

  /** BACKEND HOOK: replace with POST /api/auth/register */
  function signup(fullName, emailAddress, plainPassword) {
    const users = getUsers();
    const emailKey = emailAddress.trim().toLowerCase();

    const exists = users.some(function (u) { return u.email === emailKey; });
    if (exists) {
      return { ok: false, message: 'That email is already registered. Sign in instead.' };
    }

    users.push({
      name: fullName.trim(),
      email: emailKey,
      password: plainPassword,
      joined: new Date().toISOString()
    });

    if (!saveUsers(users)) {
      return { ok: false, message: 'Your browser blocked local storage, so the account was not saved.' };
    }
    return { ok: true, message: 'Account created. Taking you to sign in…' };
  }

  /** BACKEND HOOK: replace with POST /api/auth/login */
  function login(emailAddress, plainPassword) {
    const emailKey = emailAddress.trim().toLowerCase();
    const user = getUsers().find(function (u) { return u.email === emailKey; });

    if (!user || user.password !== plainPassword) {
      return { ok: false, message: 'Email or password is incorrect.' };
    }

    startSession({ name: user.name, email: user.email });
    return { ok: true, message: 'Signed in. Loading your dashboard…' };
  }

  /** BACKEND HOOK: store a JWT here instead of the user object. */
  function startSession(user) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (err) {
      console.warn('Could not start session:', err);
    }
  }

  function currentUser() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (err) {
      return null;
    }
  }

  function isSignedIn() {
    return currentUser() !== null;
  }

  /** BACKEND HOOK: also call POST /api/auth/logout */
  function logout() {
    localStorage.removeItem(SESSION_KEY);
    renderNav();
  }

  /**
   * Update the navbar for the signed-in / signed-out state.
   * Runs on every page so the header is always correct.
   */
  function renderNav() {
    const user = currentUser();
    const chip = document.querySelector('[data-user-chip]');
    const chipName = document.querySelector('[data-user-name]');
    const signedOutLinks = document.querySelectorAll('[data-when="signed-out"]');
    const signedInOnly = document.querySelectorAll('[data-when="signed-in"]');

    if (user) {
      if (chip) chip.classList.add('is-visible');
      if (chipName) chipName.textContent = user.name.split(' ')[0];
      signedOutLinks.forEach(function (el) { el.style.display = 'none'; });
      signedInOnly.forEach(function (el) { el.style.display = ''; });
    } else {
      if (chip) chip.classList.remove('is-visible');
      signedOutLinks.forEach(function (el) { el.style.display = ''; });
      signedInOnly.forEach(function (el) { el.style.display = 'none'; });
    }
  }

  return {
    signup: signup,
    login: login,
    logout: logout,
    currentUser: currentUser,
    isSignedIn: isSignedIn,
    renderNav: renderNav
  };
})();
