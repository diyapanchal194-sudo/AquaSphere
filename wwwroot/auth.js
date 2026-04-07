
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
            input.style.borderColor = '';

            if (input.type === 'checkbox') {
                if (!input.checked) {
                    isValid = false;
                }
                return;
            }

            if (!input.value.trim()) {
                input.style.borderColor = '#EF4444';
                isValid = false;
            }

            if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
                input.style.borderColor = '#EF4444';
                isValid = false;
            }

            if ((input.name === 'password' || input.name === 'confirmPassword') && input.value.length < 6) {
                input.style.borderColor = '#EF4444';
                isValid = false;
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

    async function handleFormSubmission(form, data) {
        var submitBtn = form.querySelector('button[type="submit"]');
        var originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        try {
            var pageType = identifyPageType(form);

            if (pageType === 'member-signup') {
                var signupPayload = {
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    password: data.password || ''
                };

                var signupResponse = await fetch('/api/member/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signupPayload)
                });

                var signupResult = await signupResponse.json().catch(function () { return null; });

                if (!signupResponse.ok) {
                    alert(signupResult?.message || 'Signup failed.');
                    return;
                }

                alert('Member signup successful!');
                localStorage.removeItem('aquasphere_form_data_' + form.id);
                form.reset();
                window.location.href = 'auth-member-login.html';
                return;
            }

            if (pageType === 'member-login') {
                var loginPayload = {
                    email: data.email || '',
                    password: data.password || ''
                };

                try {
                    var loginResponse = await fetch('/api/member/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(loginPayload)
                    });

                    var loginResult = await loginResponse.json().catch(function () { return null; });

                    if (!loginResponse.ok) {
                        alert(loginResult?.message || 'Login failed.');
                        return;
                    }
                } catch (e) {
                    console.warn("API not running, continuing anyway...");
                }

                
                localStorage.setItem("aquasphere_customer_logged_in", "true");
                localStorage.setItem("aquasphere_customer_email", data.email);

                alert('Member login successful!');
                window.location.href = "dashboard.html";
                return;
            }

            if (pageType === 'staff-login') {
                console.log('Staff login:', data);
                alert('Staff login under development');
            } else if (pageType === 'staff-signup') {
                console.log('Staff signup:', data);
                alert('Staff signup under development');
            } else if (pageType === 'admin-login') {
                console.log('Admin login:', data);
                alert('Admin backend under development');
            } else {
                alert('Unknown form type.');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    function identifyPageType(form) {
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


(function initInputFocus() {
    var inputs = document.querySelectorAll('.form-input');

    inputs.forEach(function (input) {
        input.addEventListener('focus', function () {
            var wrapper = this.closest('.form-input-wrapper');
            if (wrapper) {
                wrapper.style.opacity = '1';
            }
        });

        input.addEventListener('blur', function () {
            var wrapper = this.closest('.form-input-wrapper');
            if (wrapper && !this.value) {
                wrapper.style.opacity = '0.8';
            }
        });
    });
})();


(function initFormPersistence() {
    var forms = document.querySelectorAll('.auth-form');
    var storageKey = 'aquasphere_form_data';

    forms.forEach(function (form) {
        var inputs = form.querySelectorAll('input');

        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                var formData = {};
                inputs.forEach(function (i) {
                    if (i.type === 'checkbox') {
                        formData[i.name] = i.checked;
                    } else {
                        formData[i.name] = i.value;
                    }
                });
                localStorage.setItem(storageKey + '_' + form.id, JSON.stringify(formData));
            });

            var saved = localStorage.getItem(storageKey + '_' + form.id);
            if (saved) {
                var data = JSON.parse(saved);

                if (input.type === 'checkbox') {
                    input.checked = !!data[input.name];
                } else if (data[input.name]) {
                    input.value = data[input.name];
                }
            }
        });
    });
})();