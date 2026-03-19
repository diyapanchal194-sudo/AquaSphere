/* ============================================================
   ADMIN-DASHBOARD.JS - AquaSphere Admin Control Panel
   ============================================================
   Powers the Admin Dashboard section (page-admin-dashboard):
     - Sidebar section tab switching
     - Staff search / filter in the staff table
     - Remove staff with custom confirm modal (no browser confirm())
     - Direct SMS button toast notifications
     - Broadcast alert button
     - Messages button
     - System settings: save timing changes
     - System settings: register new admin
     - Toast notification helper
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ===========================
     SIDEBAR SECTION TABS
     Clicking a sidebar nav item
     shows the matching section.
  =========================== */
  var navItems = document.querySelectorAll('#page-admin-dashboard .sidebar-nav-item');
  var sections = document.querySelectorAll('#page-admin-dashboard .dash-section');

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var target = item.getAttribute('data-section');

      /* Deactivate all items and sections */
      navItems.forEach(function (n) { n.classList.remove('active'); });
      sections.forEach(function (s) { s.classList.remove('active'); });

      /* Activate selected item and matching section */
      item.classList.add('active');
      var sec = document.getElementById('section-' + target);
      if (sec) { sec.classList.add('active'); }
    });
  });

  /* ===========================
     STAFF SEARCH / FILTER
     Filters table rows by the
     employee name in real time.
  =========================== */
  var staffSearch = document.getElementById('staffSearch');
  if (staffSearch) {
    staffSearch.addEventListener('input', function () {
      var query = staffSearch.value.toLowerCase();
      var rows  = document.querySelectorAll('#staffTableBody tr');
      rows.forEach(function (row) {
        var nameEl = row.querySelector('.staff-name');
        row.style.display = (nameEl && nameEl.textContent.toLowerCase().includes(query)) ? '' : 'none';
      });
    });
  }

  /* ===========================
     ADD EMPLOYEE BUTTON
     Placeholder — shows a toast
     until the form is built.
  =========================== */
  var addBtn = document.getElementById('addEmployeeBtn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      showAdminToast('Add Employee form coming soon.');
    });
  }

  /* ===========================
     REMOVE STAFF BUTTONS
     Uses a custom modal instead
     of the native confirm() call
     so the UI stays consistent.
  =========================== */
  var removeBtns = document.querySelectorAll('#staffTableBody .staff-action-remove');
  removeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var row  = btn.closest('tr');
      var name = row ? row.querySelector('.staff-name').textContent : 'this staff member';

      showAdminModal(
        'Remove Staff Member?',
        'Are you sure you want to remove ' + name + ' from the staff directory? This cannot be undone.',
        function () {
          if (row) { row.remove(); }
          showAdminToast(name + ' removed from directory.');
        }
      );
    });
  });

  /* ===========================
     DIRECT SMS BUTTONS
     Sends a simulated SMS toast.
  =========================== */
  var smsBtns = document.querySelectorAll('.staff-sms-btn');
  smsBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var row  = btn.closest('tr');
      var name = row ? row.querySelector('.staff-name').textContent : 'staff member';
      showAdminToast('SMS sent to ' + name + '.');
    });
  });

  /* ===========================
     MESSAGES BUTTON
     Sidebar "Messages" shortcut.
  =========================== */
  var msgBtn = document.getElementById('msgBtn');
  if (msgBtn) {
    msgBtn.addEventListener('click', function () {
      showAdminToast('Messages panel coming soon.');
    });
  }

  /* ===========================
     BROADCAST ALERT BUTTON
     Sends alert to all 10 pools.
  =========================== */
  var broadcastBtn = document.querySelector('.ops-btn-broadcast');
  if (broadcastBtn) {
    broadcastBtn.addEventListener('click', function () {
      showAdminToast('Broadcast alert sent to all 10 facilities.');
    });
  }

  /* ===========================
     SAVE TIMING CHANGES
     System Settings section.
  =========================== */
  var saveBtn = document.getElementById('saveTimingBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      showAdminToast('Timing changes saved successfully.');
    });
  }

  /* ===========================
     REGISTER NEW ADMIN
     Validates all three fields
     before showing success toast.
  =========================== */
  var registerBtn = document.querySelector('.settings-register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', function () {
      var inputs    = document.querySelectorAll('.settings-register-fields .settings-input');
      var allFilled = true;
      inputs.forEach(function (inp) { if (!inp.value.trim()) { allFilled = false; } });

      if (!allFilled) {
        showAdminToast('Please fill in all fields to register a new admin.');
        return;
      }
      showAdminToast('New admin account registered successfully.');
      inputs.forEach(function (inp) { inp.value = ''; });
    });
  }

});

/* ===========================
   showAdminModal(title, desc, onConfirm)
   Custom confirmation modal for
   the admin dashboard. Uses the
   #adminConfirmModal element
   defined in index.html.
=========================== */
function showAdminModal(title, desc, onConfirm) {
  var overlay    = document.getElementById('adminConfirmModal');
  var titleEl    = document.getElementById('adminModalTitle');
  var descEl     = document.getElementById('adminModalDesc');
  var confirmBtn = document.getElementById('adminModalConfirmBtn');
  var cancelBtn  = document.getElementById('adminModalCancelBtn');
  if (!overlay) { return; }

  /* Populate modal content */
  titleEl.textContent = title;
  descEl.textContent  = desc;

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

  function onConfirmClick() {
    close();
    onConfirm();
  }

  function onOverlayClick(e) {
    if (e.target === overlay) { close(); }
  }

  confirmBtn.addEventListener('click', onConfirmClick);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', onOverlayClick);
}

/* ===========================
   showAdminToast(message)
   Displays a temporary toast
   notification at the bottom-
   right of the viewport for
   2.8 seconds, then fades out.
=========================== */
function showAdminToast(message) {
  /* Remove any existing toast first */
  var existing = document.querySelector('.dash-toast');
  if (existing) { existing.remove(); }

  var toast = document.createElement('div');
  toast.className   = 'dash-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('hide');
    setTimeout(function () { toast.remove(); }, 300);
  }, 2800);
}
