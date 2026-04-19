(function initForms() {
    var forms = {
        memberSignup: document.getElementById('memberSignupForm'),
        memberLogin: document.getElementById('memberLoginForm'),
        staffSignup: document.getElementById('staffSignupForm'),
        staffLogin: document.getElementById('staffLoginForm'),
        adminLogin: document.getElementById('adminLoginForm')
    };

    function showPopupMessage(message) {
        var popup = document.createElement("div");
        popup.style.cssText = "position:fixed;top:20px;right:20px;background:#323232;color:#fff;padding:15px 25px;border-radius:4px;z-index:9999;box-shadow:0 4px 6px rgba(0,0,0,0.1);font-family:sans-serif;opacity:0;transition:opacity 0.3s ease;";
        popup.innerText = message;
        document.body.appendChild(popup);

        // Trigger reflow and fade in
        popup.offsetHeight; 
        popup.style.opacity = "1";

        setTimeout(function() {
            popup.style.opacity = "0";
            setTimeout(function() { popup.remove(); }, 300);
        }, 3000);
    }

    async function submitForm(form, endpoint, payload) {
        var btn = form.querySelector('button[type="submit"]');
        var text = btn.textContent;

        btn.disabled = true;
        btn.textContent = "Processing...";

        try {
            var res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            var result = await res.json();

            if (!res.ok) {
                showPopupMessage(result.message || "Error");
                return;
            }

            showPopupMessage(result.message);
            form.reset();
        } catch (err) {
            showPopupMessage("Server error");
        } finally {
            btn.disabled = false;
            btn.textContent = text;
        }
    }

    if (forms.memberSignup) {
        forms.memberSignup.onsubmit = function (e) {
            e.preventDefault();
            submitForm(this, "/api/member/signup", {
                firstName: this.firstName.value,
                lastName: this.lastName.value,
                email: this.email.value,
                phone: this.phone.value,
                password: this.password.value
            });
        };
    }

    if (forms.memberLogin) {
        forms.memberLogin.onsubmit = function (e) {
            e.preventDefault();
            submitForm(this, "/api/member/login", {
                email: this.email.value,
                password: this.password.value
            });
        };
    }

    if (forms.staffSignup) {
        forms.staffSignup.onsubmit = function (e) {
            e.preventDefault();
            submitForm(this, "/api/staff/signup", {
                fullName: this.fullName.value,
                email: this.email.value,
                password: this.password.value
            });
        };
    }

    if (forms.staffLogin) {
        forms.staffLogin.onsubmit = function (e) {
            e.preventDefault();
            submitForm(this, "/api/staff/login", {
                email: this.email.value,
                password: this.password.value
            });
        };
    }

    if (forms.adminLogin) {
        forms.adminLogin.onsubmit = function (e) {
            e.preventDefault();
            submitForm(this, "/api/admin/login", {
                email: this.email.value,
                password: this.password.value
            });
        };
    }
})();