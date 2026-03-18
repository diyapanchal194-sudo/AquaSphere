/* ============================================================
   AUTH.JS - AquaSphere Authentication Forms
   ============================================================
   Handles all five auth forms in the SPA:
     - Staff Login  (#staffLoginForm)
     - Staff Signup (#staffSignupForm)
     - Admin Login  (#adminLoginForm)
     - Member Login (#memberLoginForm)
     - Member Signup (#memberSignupForm)

   After successful validation the form simulates a short
   processing delay and then calls showPage() (defined in
   app.js) to navigate to the appropriate dashboard.

   Also adds:
     - Password visibility toggle buttons
     - Input border reset on change
     - LocalStorage form persistence (email only)
============================================================ */

/* ===========================
   NAVBAR - Scroll Shadow
   Auth pages share the global
   navbar and need the scroll
   shadow behaviour too.
=========================== */
(function initNavbarScroll() {
  window.addEventListener('scroll', function () {
    var navbar = document.getElementById('navbar');
    if (!navbar) { return; }
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();

/* ===========================
   FORM VALIDATION & SUBMISSION
   Central form handler wired
   to all five auth forms.
=========================== */
(function initForms() {

  /* ---- Validate all required inputs in a form ---- */
  function validateForm(form) {
    var inputs  = form.querySelectorAll('input[required]');
    var isValid = true;

    inputs.forEach(function (input) {
      /* Empty field check */
      if (!input.value.trim()) {
        input.style.borderColor = '#EF4444';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }

      /* Email format check */
      if (input.type === 'email' && !isValidEmail(input.value)) {
        input.style.borderColor = '#EF4444';
        isValid = false;
      }

      /* Minimum password length: 6 characters */
      if ((input.name === 'password' || input.name === 'confirmPassword') && input.value.length < 6) {
        input.style.borderColor = '#EF4444';
        isValid = false;
      }
    });

    /* Password and confirm-password must match */
    var passwordInput = form.querySelector('input[name="password"]');
    var confirmInput  = form.querySelector('input[name="confirmPassword"]');
    if (passwordInput && confirmInput && passwordInput.value !== confirmInput.value) {
      confirmInput.style.borderColor = '#EF4444';
      isValid = false;
    }

    return isValid;
  }

  /* ---- Simple email format check ---- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ---- Identify which dashboard to navigate to ---- */
  function getDestinationPage(form) {
    if (form.id === 'staffLoginForm')   { return 'staff-dashboard'; }
    if (form.id === 'staffSignupForm')  { return 'staff-dashboard'; }
    if (form.id === 'adminLoginForm')   { return 'admin-dashboard'; }
    if (form.id === 'memberLoginForm')  { return 'member-dashboard'; }
    if (form.id === 'memberSignupForm') { return 'member-dashboard'; }
    return 'home';
  }

  /* ---- Submit handler: validate → delay → navigate ---- */
  function handleFormSubmit(e) {
    e.preventDefault();
    var form = e.target;

    if (!validateForm(form)) { return; }

    /* Show "Processing..." state on the button */
    var submitBtn    = form.querySelector('button[type="submit"]');
    var originalHTML = submitBtn.innerHTML;
    submitBtn.disabled   = true;
    submitBtn.textContent = 'Processing...';

    /* Simulate a short server round-trip then navigate */
    setTimeout(function () {
      var destination = getDestinationPage(form);
      showPage(destination);

      /* Restore button state in case user navigates back */
      submitBtn.disabled  = false;
      submitBtn.innerHTML = originalHTML;

      /* Clear persisted form data after successful login */
      try { localStorage.removeItem('aquasphere_form_data_' + form.id); } catch (_) {}
    }, 600);
  }

  /* Wire up all five forms */
  var formIds = ['staffLoginForm', 'staffSignupForm', 'adminLoginForm', 'memberLoginForm', 'memberSignupForm'];
  formIds.forEach(function (id) {
    /* Use event delegation so this works even if a form is hidden */
    document.addEventListener('submit', function (e) {
      if (e.target && e.target.id === id) {
        handleFormSubmit(e);
      }
    });
  });

  /* Reset red border when the user starts correcting a field */
  document.addEventListener('change', function (e) {
    if (e.target.classList.contains('form-input')) {
      e.target.style.borderColor = '';
    }
  });

})();

/* ===========================
   PASSWORD VISIBILITY TOGGLE
   Adds an eye icon button to
   every password input field.
=========================== */
(function initPasswordToggles() {
  /* Run immediately; inputs are always in the DOM in a SPA */
  document.querySelectorAll('input[type="password"]').forEach(function (input) {
    var wrapper = input.closest('.form-input-wrapper');
    if (!wrapper) { return; }

    /* Build the toggle button */
    var toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'password-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
    toggleBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
      + '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>'
      + '<circle cx="12" cy="12" r="3"/></svg>';

    wrapper.appendChild(toggleBtn);

    /* Toggle between password and text type on click */
    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggleBtn.classList.toggle('active', isPassword);
    });
  });
})();

/* ===========================
   INPUT FOCUS OPACITY STATES
   Subtly dims unfilled inputs
   and restores on focus.
=========================== */
(function initInputFocus() {
  document.addEventListener('focusin', function (e) {
    if (!e.target.classList.contains('form-input')) { return; }
    var wrapper = e.target.closest('.form-input-wrapper');
    if (wrapper) { wrapper.style.opacity = '1'; }
  });

  document.addEventListener('focusout', function (e) {
    if (!e.target.classList.contains('form-input')) { return; }
    if (!e.target.value) {
      var wrapper = e.target.closest('.form-input-wrapper');
      if (wrapper) { wrapper.style.opacity = '0.8'; }
    }
  });
})();

/* ===========================
   FORM PERSISTENCE (Demo)
   Saves non-password field
   values to localStorage so
   the email field is pre-filled
   if the user returns.
=========================== */
(function initFormPersistence() {
  document.querySelectorAll('.auth-form').forEach(function (form) {
    var inputs     = form.querySelectorAll('input');
    var storageKey = 'aquasphere_form_data_' + form.id;

    /* Restore previously saved values */
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      inputs.forEach(function (input) {
        if (input.type !== 'password' && saved[input.name]) {
          input.value = saved[input.name];
        }
      });
    } catch (_) {}

    /* Save values on input (skip passwords) */
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        try {
          var data = {};
          inputs.forEach(function (i) {
            if (i.type !== 'password' && i.type !== 'checkbox') {
              data[i.name] = i.value;
            }
          });
          localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (_) {}
      });
    });
  });
})();
