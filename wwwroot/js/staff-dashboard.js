/* ============================================================
   STAFF-DASHBOARD.JS - AquaSphere Staff Dashboard
   ============================================================
   Powers the Staff Dashboard section (page-staff-dashboard):
     - Sidebar section tab switching (Shift / History / Request)
     - Live clock (HH:MM, updates every second)
     - Shift requirements checklist (toggle checked state)
     - Break request button (toast)
     - Report Incident button (toast)
     - Safety Protocol Confirmed button
     - Request history: Cancel and Delete with custom modal
     - New Request form submission
     - Toast notification helper
     - showModal() — shared custom confirm modal
     - handleRequestSubmit() — called via form onsubmit=""
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ===========================
     SIDEBAR SECTION TABS
     Switches between Shift,
     History, and New Request.
  =========================== */
  var navItems = document.querySelectorAll('#page-staff-dashboard .sdash-nav-item');
  var sections = document.querySelectorAll('#page-staff-dashboard .sdash-section');

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var target = item.getAttribute('data-section');

      /* Deactivate all items and sections */
      navItems.forEach(function (n) { n.classList.remove('active'); });
      sections.forEach(function (s) { s.classList.remove('active'); });

      /* Activate chosen item and section */
      item.classList.add('active');
      var sec = document.getElementById('section-' + target);
      if (sec) { sec.classList.add('active'); }
    });
  });

  /* ===========================
     LIVE CLOCK
     Updates the HH:MM display
     in the Shift Dashboard every
     second.
  =========================== */
  function updateClock() {
    var now   = new Date();
    var h     = String(now.getHours()).padStart(2, '0');
    var m     = String(now.getMinutes()).padStart(2, '0');
    var clock = document.getElementById('liveClock');
    if (clock) { clock.textContent = h + ':' + m; }
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ===========================
     DEFAULT DATE FOR REQUEST
     Pre-fills the target date
     field with today's date.
  =========================== */
  var targetDate = document.getElementById('targetDate');
  if (targetDate) {
    var today = new Date();
    var yyyy  = today.getFullYear();
    var mm    = String(today.getMonth() + 1).padStart(2, '0');
    var dd    = String(today.getDate()).padStart(2, '0');
    targetDate.value = yyyy + '-' + mm + '-' + dd;
  }

  /* ===========================
     SHIFT REQUIREMENTS CHECKLIST
     Clicking a check button
     toggles the checked state
     and updates the fraction.
  =========================== */
  var reqItems    = document.querySelectorAll('.sdash-req-item');
  var reqFraction = document.getElementById('reqFraction');

  function updateFraction() {
    var done = document.querySelectorAll('.sdash-req-item.checked').length;
    if (reqFraction) { reqFraction.textContent = done + '/' + reqItems.length; }
  }

  reqItems.forEach(function (item) {
    var btn = item.querySelector('.sdash-req-check');
    if (!btn) { return; }
    btn.addEventListener('click', function () {
      item.classList.toggle('checked');
      btn.classList.toggle('active');
      updateFraction();
    });
  });

  /* ===========================
     TAKE A BREAK BUTTON
  =========================== */
  var breakBtn = document.getElementById('breakBtn');
  if (breakBtn) {
    breakBtn.addEventListener('click', function () {
      showToast('Break request logged. Supervisor has been notified.');
    });
  }

  /* ===========================
     REPORT INCIDENT BUTTON
  =========================== */
  var incidentBtn = document.getElementById('incidentBtn');
  if (incidentBtn) {
    incidentBtn.addEventListener('click', function () {
      showToast('Incident report form opening — coming soon.');
    });
  }

  /* ===========================
     WIRE HISTORY ACTION BUTTONS
     Attaches cancel/delete modal
     handlers to the history list.
  =========================== */
  wireHistoryActions();

  /* ===========================
     SAFETY PROTOCOL BUTTON
     One-time confirmation button
     that changes to "Confirmed".
  =========================== */
  var protocolBtn = document.getElementById('protocolBtn');
  if (protocolBtn) {
    protocolBtn.addEventListener('click', function () {
      if (!protocolBtn.classList.contains('confirmed')) {
        protocolBtn.classList.add('confirmed');
        protocolBtn.textContent = 'Confirmed';
        showToast('Safety protocol confirmed for this shift.');
      }
    });
  }

});

/* ===========================
   wireHistoryActions()
   Attaches event handlers for
   Cancel and Delete buttons in
   the request history list.
   Uses showModal() for both.
=========================== */
function wireHistoryActions() {
  var list = document.getElementById('historyList');
  if (!list) { return; }

  /* --- Cancel pending request --- */
  list.querySelectorAll('.sdash-history-cancel-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.sdash-history-item');
      var type = item.querySelector('.sdash-history-type').textContent;

      showModal({
        kind:         'cancel',
        title:        'Cancel Request',
        desc:         'Are you sure you want to cancel the "' + type + '" request? This cannot be undone.',
        confirmLabel: 'Yes, cancel it',
        onConfirm:    function () {
          /* Change badge to Cancelled */
          var badge = item.querySelector('.sdash-badge');
          if (badge) {
            badge.className       = 'sdash-badge';
            badge.style.background = '#F3F4F6';
            badge.style.color      = '#6B7280';
            badge.textContent      = 'Cancelled';
          }
          btn.remove();
          item.setAttribute('data-status', 'cancelled');
          showToast(type + ' request cancelled.');
        }
      });
    });
  });

  /* --- Delete request from history --- */
  list.querySelectorAll('.sdash-history-delete-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.sdash-history-item');
      var type = item.querySelector('.sdash-history-type').textContent;

      showModal({
        kind:         'delete',
        title:        'Delete Request',
        desc:         'Are you sure you want to permanently delete the "' + type + '" request? It will be removed from your history.',
        confirmLabel: 'Yes, delete it',
        onConfirm:    function () {
          /* Animate out then remove */
          item.classList.add('removing');
          setTimeout(function () {
            item.remove();
            checkHistoryEmpty();
          }, 280);
          showToast(type + ' request deleted.');
        }
      });
    });
  });
}

/* ===========================
   checkHistoryEmpty()
   Shows an empty state message
   when all history items have
   been removed.
=========================== */
function checkHistoryEmpty() {
  var list = document.getElementById('historyList');
  if (!list) { return; }
  if (list.querySelectorAll('.sdash-history-item').length === 0) {
    var empty       = document.createElement('div');
    empty.className = 'sdash-history-empty';
    empty.textContent = 'No requests found.';
    list.appendChild(empty);
  }
}

/* ===========================
   showModal(opts)
   Custom confirmation modal for
   the staff dashboard.

   opts = {
     kind:         'cancel' | 'delete',
     title:        string,
     desc:         string,
     confirmLabel: string,
     onConfirm:    function
   }
=========================== */
function showModal(opts) {
  var overlay    = document.getElementById('confirmModal');
  var icon       = document.getElementById('modalIcon');
  var title      = document.getElementById('modalTitle');
  var desc       = document.getElementById('modalDesc');
  var confirmBtn = document.getElementById('modalConfirmBtn');
  var cancelBtn  = document.getElementById('modalCancelBtn');
  if (!overlay) { return; }

  /* Set icon and button style based on action type */
  if (opts.kind === 'cancel') {
    icon.className = 'sdash-modal-icon cancel-icon';
    icon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
      + '<circle cx="12" cy="12" r="10"/>'
      + '<line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    confirmBtn.className = 'sdash-modal-confirm confirm-cancel';
  } else {
    icon.className = 'sdash-modal-icon delete-icon';
    icon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
      + '<polyline points="3 6 5 6 21 6"/>'
      + '<path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>'
      + '<path d="M10 11v6"/><path d="M14 11v6"/>'
      + '<path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>';
    confirmBtn.className = 'sdash-modal-confirm confirm-delete';
  }

  /* Populate text content */
  title.textContent      = opts.title;
  desc.textContent       = opts.desc;
  confirmBtn.textContent = opts.confirmLabel;

  /* Open the modal overlay */
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');

  /* ---- Internal close function ---- */
  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    confirmBtn.removeEventListener('click', onConfirm);
    cancelBtn.removeEventListener('click', close);
    overlay.removeEventListener('click', onOverlayClick);
  }

  function onConfirm() { close(); opts.onConfirm(); }
  function onOverlayClick(e) { if (e.target === overlay) { close(); } }

  confirmBtn.addEventListener('click', onConfirm);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', onOverlayClick);
}

/* ===========================
   handleRequestSubmit(event)
   Called from the New Request
   form: onsubmit="handleRequestSubmit(event)"
   Validates and adds the request
   to the history list.
=========================== */
function handleRequestSubmit(e) {
  e.preventDefault();
  var typeEl    = document.getElementById('requestType');
  var detailsEl = document.getElementById('requestDetails');
  if (!typeEl || !detailsEl) { return; }

  var type    = typeEl.value;
  var details = detailsEl.value.trim();

  if (!details) {
    showToast('Please enter request details before submitting.');
    return;
  }

  /* Clear the form */
  detailsEl.value = '';
  showToast(type + ' request submitted successfully.');
}

/* ===========================
   showToast(message)
   Temporary notification toast
   that fades out after 3 seconds.
=========================== */
function showToast(message) {
  var existing = document.querySelector('.sdash-toast');
  if (existing) { existing.remove(); }

  var toast         = document.createElement('div');
  toast.className   = 'sdash-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('hide');
    setTimeout(function () { toast.remove(); }, 300);
  }, 3000);
}
