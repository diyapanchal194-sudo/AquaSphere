/* ============================================================
   APP.JS - AquaSphere Single-Page Application Router
   ============================================================
   This file manages all page navigation without full page
   reloads. Each "page" is a <div class="page" id="page-...">
   element in index.html that is shown or hidden using CSS.

   Usage from HTML:
     onclick="showPage('member-login')"

   Available page IDs:
     home, staff-login, staff-signup, admin-login,
     member-login, member-signup, admin-dashboard,
     member-dashboard, staff-dashboard
============================================================ */

/* ===========================
   PAGE TITLE MAP
   Maps each page ID to the
   document <title> string.
=========================== */
var PAGE_TITLES = {
  'home':             'AquaSphere - Dive into Excellence',
  'staff-login':      'Staff Access - AquaSphere',
  'staff-signup':     'Staff Registration - AquaSphere',
  'admin-login':      'Admin Control - AquaSphere',
  'member-login':     'Member Login - AquaSphere',
  'member-signup':    'Join AquaSphere - Membership Registration',
  'admin-dashboard':  'Admin Dashboard - AquaSphere',
  'member-dashboard': 'My Dashboard - AquaSphere',
  'staff-dashboard':  'Staff Dashboard - AquaSphere'
};

/* ===========================
   Currently visible page ID
=========================== */
var _currentPage = 'home';

/* ===========================
   showPage(pageId)
   Core navigation function.
   Call from any onclick="" to
   navigate between pages.
=========================== */
function showPage(pageId) {
  /* Hide every page section */
  var allPages = document.querySelectorAll('.page');
  allPages.forEach(function (p) {
    p.classList.remove('active');
  });

  /* Find and show the target page */
  var targetPage = document.getElementById('page-' + pageId);
  if (!targetPage) {
    console.warn('[AquaSphere] showPage: page not found — page-' + pageId);
    return;
  }
  targetPage.classList.add('active');
  _currentPage = pageId;

  /* Update the browser tab title */
  document.title = PAGE_TITLES[pageId] || 'AquaSphere';

  /* Scroll to the top so the user sees the page from the start */
  window.scrollTo(0, 0);

  /* Push a history entry so the browser back button works */
  var slug = (pageId === 'home') ? '/' : '/' + pageId;
  history.pushState({ page: pageId }, document.title, slug);
}

/* ===========================
   Browser back / forward
   Restores the page when the
   user presses the back button.
=========================== */
window.addEventListener('popstate', function (e) {
  if (e.state && e.state.page) {
    /* Use internal routing without pushing another history entry */
    var allPages = document.querySelectorAll('.page');
    allPages.forEach(function (p) { p.classList.remove('active'); });
    var target = document.getElementById('page-' + e.state.page);
    if (target) {
      target.classList.add('active');
      _currentPage = e.state.page;
      document.title = PAGE_TITLES[e.state.page] || 'AquaSphere';
      window.scrollTo(0, 0);
    }
  } else {
    showPage('home');
  }
});

/* ===========================
   Initial page load
   Show the home page and set
   the initial history state.
=========================== */
document.addEventListener('DOMContentLoaded', function () {
  /* Show home page first */
  showPage('home');
  /* Replace the auto-pushed entry so we start clean */
  history.replaceState({ page: 'home' }, PAGE_TITLES['home'], '/');
});
