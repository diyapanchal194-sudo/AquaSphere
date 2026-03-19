/* ============================================================
   MEMBER-DASHBOARD.JS - AquaSphere Member Dashboard
   ============================================================
   Powers the Member Dashboard section (page-member-dashboard):
     - Sidebar section tab switching (Dashboard / Membership / Settings)
     - Cancel booking with custom confirm modal (no browser confirm())
     - Delete account with custom confirm modal (no browser confirm())
     - View All / Full Report buttons (placeholder toasts)
     - Book a Lane button (placeholder)
     - Manage Subscription button (placeholder)
     - Upgrade Plan button (placeholder)
     - Booking Reminders toggle
     - Bell notification buttons
     - Toast notification helper
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ===========================
     SIDEBAR SECTION TABS
     Switches between Dashboard,
     Membership, and Settings.
  =========================== */
  var navItems = document.querySelectorAll('#page-member-dashboard .mside-nav-item');
  var sections = document.querySelectorAll('#page-member-dashboard .mdash-section');

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var target = item.getAttribute('data-section');

      /* Deactivate all sidebar items and sections */
      navItems.forEach(function (n) { n.classList.remove('active'); });
      sections.forEach(function (s) { s.classList.remove('active'); });

      /* Activate the selected item and corresponding section */
      item.classList.add('active');
      var sec = document.getElementById('section-' + target);
      if (sec) { sec.classList.add('active'); }
    });
  });

  /* ===========================
     CANCEL BOOKING BUTTONS
     Uses a custom modal instead
     of the browser confirm() so
     the design stays consistent.
  =========================== */
  var cancelBtns = document.querySelectorAll('.mdash-cancel-btn');
  cancelBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.mdash-booking-item');
      var name = item ? item.querySelector('.mdash-booking-name').textContent : 'this booking';

      showMemberModal(
        'cancel',
        'Cancel Booking?',
        'Are you sure you want to cancel your "' + name + '" booking? This cannot be undone.',
        'Yes, cancel it',
        function () {
          /* Visually dim the cancelled booking */
          if (item) {
            item.style.opacity       = '0.4';
            item.style.pointerEvents = 'none';
          }
          showMemberToast(name + ' booking cancelled.');
        }
      );
    });
  });

  /* ===========================
     VIEW ALL / REPORT BUTTONS
     Placeholder toasts until
     the full list views exist.
  =========================== */
  var viewAllBtns = document.querySelectorAll('.mdash-view-all-btn');
  viewAllBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      showMemberToast(btn.textContent.trim() + ' — coming soon.');
    });
  });

  /* ===========================
     BOOK A LANE BUTTON
  =========================== */
  var bookBtn = document.querySelector('.mdash-book-btn');
  if (bookBtn) {
    bookBtn.addEventListener('click', function () {
      showMemberToast('Lane booking coming soon.');
    });
  }

  /* ===========================
     MANAGE SUBSCRIPTION
  =========================== */
  var manageSub = document.querySelector('.mdash-manage-sub-btn');
  if (manageSub) {
    manageSub.addEventListener('click', function () {
      showMemberToast('Subscription management coming soon.');
    });
  }

  /* ===========================
     UPGRADE PLAN BUTTON
  =========================== */
  var upgradeBtn = document.querySelector('.mdash-upgrade-btn');
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', function () {
      showMemberToast('Upgrade to Elite Tier — coming soon.');
    });
  }

  /* ===========================
     BOOKING REMINDERS TOGGLE
     Toggles the visual state of
     the switch and shows a toast.
  =========================== */
  var toggle = document.getElementById('remindersToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      var on = toggle.classList.contains('active');
      showMemberToast('Booking reminders ' + (on ? 'enabled' : 'disabled') + '.');
    });
  }

  /* ===========================
     DELETE ACCOUNT BUTTON
     Uses a custom modal with a
     strong destructive warning.
  =========================== */
  var deleteBtn = document.getElementById('deleteAccountBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function () {
      showMemberModal(
        'delete',
        'Delete Account Permanently?',
        'Are you sure you want to permanently delete your AquaSphere account? All your data and bookings will be lost. This cannot be undone.',
        'Yes, delete my account',
        function () {
          showMemberToast('Account deletion request submitted. You will receive a confirmation email.');
          /* Navigate to home after short delay */
          setTimeout(function () { showPage('home'); }, 1500);
        }
      );
    });
  }

  /* ===========================
     BELL NOTIFICATION BUTTONS
  =========================== */
  var bellBtns = document.querySelectorAll('.mdash-bell-btn');
  bellBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      showMemberToast('No new notifications.');
    });
  });

});

/* ===========================
   showMemberModal(kind, title, desc, confirmLabel, onConfirm)
   Custom confirmation modal for
   the member dashboard. Uses the
   #memberConfirmModal element
   defined in index.html.

   kind: 'cancel' | 'delete'
     Colours the confirm button
     accordingly (orange / red).
=========================== */
function showMemberModal(kind, title, desc, confirmLabel, onConfirm) {
  var overlay    = document.getElementById('memberConfirmModal');
  var iconEl     = document.getElementById('memberModalIcon');
  var titleEl    = document.getElementById('memberModalTitle');
  var descEl     = document.getElementById('memberModalDesc');
  var confirmBtn = document.getElementById('memberModalConfirmBtn');
  var cancelBtn  = document.getElementById('memberModalCancelBtn');
  if (!overlay) { return; }

  /* Set icon and button colour by action type */
  if (kind === 'cancel') {
    iconEl.className = 'sdash-modal-icon cancel-icon';
    iconEl.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
      + '<circle cx="12" cy="12" r="10"/>'
      + '<line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    confirmBtn.className = 'sdash-modal-confirm confirm-cancel';
  } else {
    iconEl.className = 'sdash-modal-icon delete-icon';
    iconEl.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
      + '<polyline points="3 6 5 6 21 6"/>'
      + '<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>'
      + '<path d="M10 11v6"/><path d="M14 11v6"/>'
      + '<path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>';
    confirmBtn.className = 'sdash-modal-confirm confirm-delete';
  }

  /* Populate modal content */
  titleEl.textContent    = title;
  descEl.textContent     = desc;
  confirmBtn.textContent = confirmLabel;

  /* Open the modal */
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');

  /* ---- Close helpers ---- */
  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    confirmBtn.removeEventListener('click', onConfirmClick);
    cancelBtn.removeEventListener('click', close);
    overlay.removeEventListener('click', onOverlayClick);
  }

  function onConfirmClick() { close(); onConfirm(); }
  function onOverlayClick(e) { if (e.target === overlay) { close(); } }

  confirmBtn.addEventListener('click', onConfirmClick);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', onOverlayClick);
}

/* ===========================
   showMemberToast(message)
   Temporary notification toast
   that fades out after 2.8s.
=========================== */
function showMemberToast(message) {
  var existing = document.querySelector('.mdash-toast');
  if (existing) { existing.remove(); }

  var toast = document.createElement('div');
  toast.className   = 'mdash-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('hide');
    setTimeout(function () { toast.remove(); }, 300);
  }, 2800);
}
