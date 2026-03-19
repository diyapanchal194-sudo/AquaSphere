/* ===========================
   NAVBAR - Scroll Shadow
=========================== */
(function initNavbarScroll() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();

/* ===========================
   FORM VALIDATION & SUBMISSION
=========================== */
(function initForms() {
  var staffLoginForm = document.getElementById('staffLoginForm');
  var staffSignupForm = document.getElementById('staffSignupForm');
  var adminLoginForm = document.getElementById('adminLoginForm');
  var memberLoginForm = document.getElementById('memberLoginForm');
  var memberSignupForm = document.getElementById('memberSignupForm');

  function handleFormSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var isValid = validateForm(form);
    
    if (isValid) {
      var formData = new FormData(form);
      var data = Object.fromEntries(formData);
      handleFormSubmission(form, data);
    }
  }

  function validateForm(form) {
    var inputs = form.querySelectorAll('input[required]');
    var isValid = true;

    inputs.forEach(function (input) {
      if (!input.value.trim()) {
        input.style.borderColor = '#EF4444';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }

      if (input.type === 'email' && !isValidEmail(input.value)) {
        input.style.borderColor = '#EF4444';
        isValid = false;
      }

      if (input.name === 'password' || input.name === 'confirmPassword') {
        if (input.value.length < 6) {
          input.style.borderColor = '#EF4444';
          isValid = false;
        }
      }
    });

    var passwordInput = form.querySelector('input[name="password"]');
    var confirmInput = form.querySelector('input[name="confirmPassword"]');
    if (passwordInput && confirmInput && passwordInput.value !== confirmInput.value) {
      confirmInput.style.borderColor = '#EF4444';
      isValid = false;
    }

    return isValid;
  }

  function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function handleFormSubmission(form, data) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    setTimeout(function () {
      var pageType = identifyPageType(form);
      
      if (pageType === 'staff-login') {
        console.log('Staff login:', data);
        alert('Staff login would be processed. (Demo - no backend)');
      } else if (pageType === 'staff-signup') {
        console.log('Staff signup:', data);
        alert('Staff account creation would be processed. (Demo - no backend)');
      } else if (pageType === 'admin-login') {
        console.log('Admin login:', data);
        alert('Admin verification would be processed. (Demo - no backend)');
      } else if (pageType === 'member-login') {
        console.log('Member login:', data);
        alert('Member login would be processed. (Demo - no backend)');
      } else if (pageType === 'member-signup') {
        console.log('Member signup:', data);
        alert('Member account creation would be processed. (Demo - no backend)');
      }

      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 600);
  }

  function identifyPageType(form) {
    var inputs = form.querySelectorAll('input');
    var hasConfirmPassword = Array.from(inputs).some(function (i) {
      return i.name === 'confirmPassword';
    });
    var hasFullName = Array.from(inputs).some(function (i) {
      return i.name === 'fullName';
    });
    var hasFirstName = Array.from(inputs).some(function (i) {
      return i.name === 'firstName';
    });

    if (form.id === 'staffLoginForm') return 'staff-login';
    if (form.id === 'staffSignupForm') return 'staff-signup';
    if (form.id === 'adminLoginForm') return 'admin-login';
    if (form.id === 'memberLoginForm') return 'member-login';
    if (form.id === 'memberSignupForm') return 'member-signup';
    
    return 'unknown';
  }

  if (staffLoginForm) {
    staffLoginForm.addEventListener('submit', handleFormSubmit);
  }
  if (staffSignupForm) {
    staffSignupForm.addEventListener('submit', handleFormSubmit);
  }
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleFormSubmit);
  }
  if (memberLoginForm) {
    memberLoginForm.addEventListener('submit', handleFormSubmit);
  }
  if (memberSignupForm) {
    memberSignupForm.addEventListener('submit', handleFormSubmit);
  }

  var allInputs = document.querySelectorAll('.form-input');
  allInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      this.style.borderColor = '';
    });
  });
})();

/* ===========================
   PASSWORD VISIBILITY TOGGLE
=========================== */
(function initPasswordToggle() {
  var passwordInputs = document.querySelectorAll('input[type="password"]');
  
  passwordInputs.forEach(function (input) {
    var wrapper = input.closest('.form-input-wrapper');
    if (!wrapper) return;

    var toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'password-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
    toggleBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    
    wrapper.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggleBtn.classList.toggle('active', !isPassword);
    });
  });
})();

/* ===========================
   INPUT FOCUS STATES
=========================== */
(function initInputFocus() {
  var inputs = document.querySelectorAll('.form-input');
  
  inputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      this.closest('.form-input-wrapper').style.opacity = '1';
    });

    input.addEventListener('blur', function () {
      if (!this.value) {
        this.closest('.form-input-wrapper').style.opacity = '0.8';
      }
    });
  });
})();

/* ===========================
   FORM PERSISTENCE (LocalStorage Demo)
=========================== */
(function initFormPersistence() {
  var forms = document.querySelectorAll('.auth-form');
  var storageKey = 'aquasphere_form_data';

  forms.forEach(function (form) {
    var inputs = form.querySelectorAll('input');
    
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        var formData = {};
        inputs.forEach(function (i) {
          if (i.type !== 'checkbox' || i.checked) {
            formData[i.name] = i.value;
          }
        });
        localStorage.setItem(storageKey + '_' + form.id, JSON.stringify(formData));
      });

      var saved = localStorage.getItem(storageKey + '_' + form.id);
      if (saved) {
        var data = JSON.parse(saved);
        if (data[input.name]) {
          input.value = data[input.name];
        }
      }
    });
  });
})();
