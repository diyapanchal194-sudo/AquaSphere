(function initForms() {
    var forms = {
        memberSignup: document.getElementById('memberSignupForm'),
        memberLogin: document.getElementById('memberLoginForm'),
        staffSignup: document.getElementById('staffSignupForm'),
        staffLogin: document.getElementById('staffLoginForm'),
        adminLogin: document.getElementById('adminLoginForm')
    };

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
                alert(result.message || "Error");
                return;
            }

            alert(result.message);
            form.reset();
        } catch (err) {
            alert("Server error");
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