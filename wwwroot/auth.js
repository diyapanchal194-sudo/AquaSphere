(function () {
    var signupForm = document.getElementById('memberSignupForm');
    var loginForm = document.getElementById('memberLoginForm');

    function showMessage(message, type) {
        var messageBox = document.getElementById('formMessage');

        if (!messageBox) {
            alert(message);
            return;
        }

        messageBox.textContent = message;
        messageBox.className = 'form-message ' + type;
        messageBox.style.display = 'block';
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            var firstName = document.getElementById('firstName').value.trim();
            var lastName = document.getElementById('lastName').value.trim();
            var email = document.getElementById('signupEmail').value.trim();
            var phoneInput = document.getElementById('phone');
            var phone = phoneInput ? phoneInput.value.trim() : '';
            var password = document.getElementById('signupPassword').value;
            var confirmPassword = document.getElementById('confirmSignupPassword').value;

            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showMessage("Please fill all fields", "error");
                return;
            }

            if (password !== confirmPassword) {
                showMessage("Passwords do not match", "error");
                return;
            }

            try {
                var response = await fetch('/api/member/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phone: phone,
                        password: password
                    })
                });

                var result = await response.json().catch(function () { return null; });

                if (!response.ok) {
                    showMessage((result && result.message) || "Signup failed", "error");
                    return;
                }

                showMessage("Signup successful! Redirecting to login...", "success");

                setTimeout(function () {
                    window.location.href = "auth-member-login.html";
                }, 1200);
            } catch (error) {
                showMessage("Something went wrong. Please try again.", "error");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            var email = document.getElementById('memberEmail').value.trim();
            var password = document.getElementById('memberPassword').value;

            if (!email || !password) {
                showMessage("Please enter email and password", "error");
                return;
            }

            try {
                var response = await fetch('/api/member/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                var result = await response.json().catch(function () { return null; });

                if (!response.ok) {
                    showMessage((result && result.message) || "Invalid email or password", "error");
                    return;
                }

                localStorage.setItem('aquasphere_customer_logged_in', 'true');
                localStorage.setItem('aquasphere_customer_name', (result && result.member && result.member.FirstName) || email);
                localStorage.setItem('aquasphere_customer_email', email);

                showMessage("Login successful! Redirecting to dashboard...", "success");

                setTimeout(function () {
                    window.location.href = "dashboard.html";
                }, 1200);
            } catch (error) {
                showMessage("Something went wrong. Please try again.", "error");
            }
        });
    }
})();