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


(function initMobileMenu() {
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    if (!hamburgerBtn || !mobileMenu) return;

    hamburgerBtn.addEventListener('click', function () {
        var isOpen = mobileMenu.classList.toggle('open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
        if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    });
})();


function scrollToSection(sectionId) {
    var target = document.getElementById(sectionId);
    if (!target) return;

    var navbarHeight = 64;
    var offsetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}


(function initLocationsList() {
    var locationItems = document.querySelectorAll('.location-item');
    var mapFrame = document.getElementById('mapFrame');
    var membershipLocation = document.getElementById('membershipLocation');

    if (!locationItems.length) return;

    var locationData = [
        {
            name: 'AquaSphere London Royal Docks',
            mapSrc: 'https://maps.google.com/maps?q=Royal+Docks+London+E16+1AH+UK&output=embed&z=14',
            directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Royal+Docks+London+E16+1AH+UK',
            membershipLabel: 'LOCATION: AQUASPHERE LONDON ROYAL DOCKS'
        },
        {
            name: 'AquaSphere Liverpool Albert Dock',
            mapSrc: 'https://maps.google.com/maps?q=Albert+Dock+Liverpool+L3+4AF+UK&output=embed&z=14',
            directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Albert+Dock+Liverpool+L3+4AF+UK',
            membershipLabel: 'LOCATION: AQUASPHERE LIVERPOOL ALBERT DOCK'
        },
        {
            name: 'AquaSphere Sheffield Peak',
            mapSrc: 'https://maps.google.com/maps?q=Sheffield+City+Centre+S1+2BP+UK&output=embed&z=14',
            directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Sheffield+City+Centre+S1+2BP+UK',
            membershipLabel: 'LOCATION: AQUASPHERE SHEFFIELD PEAK'
        },
        {
            name: 'AquaSphere Cardiff Bay',
            mapSrc: 'https://maps.google.com/maps?q=Cardiff+Bay+CF10+5AN+UK&output=embed&z=14',
            directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Cardiff+Bay+CF10+5AN+UK',
            membershipLabel: 'LOCATION: AQUASPHERE CARDIFF BAY'
        }
    ];

    function setActiveLocation(index) {
        locationItems.forEach(function (item, i) {
            item.classList.toggle('active', i === index);
        });

        var data = locationData[index];
        if (!data) return;

        if (mapFrame) {
            mapFrame.src = data.mapSrc;
        }

        if (membershipLocation) {
            membershipLocation.textContent = data.membershipLabel;
        }

        var joinBtns = document.querySelectorAll('.plan-btn');
        var locationShort = data.name.replace('AquaSphere ', '').split(' ').slice(0, 2).join(' ');

        joinBtns.forEach(function (btn) {
            btn.textContent = 'Join ' + locationShort;
        });

        window._activeDirectionsUrl = data.directionsUrl;
        window._selectedLocationName = data.name;
    }

    locationItems.forEach(function (item, index) {
        item.addEventListener('click', function () {
            setActiveLocation(index);
        });
    });

    setActiveLocation(0);
})();


function openDirections() {
    var url = window._activeDirectionsUrl || 'https://www.google.com/maps/search/AquaSphere+London+Royal+Docks';
    window.open(url, '_blank', 'noopener,noreferrer');
}


(function initGeolocation() {
    var btn = document.getElementById('useLocationBtn');
    if (!btn) return;

    btn.addEventListener('click', function () {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        btn.textContent = 'Locating...';
        btn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var mapFrame = document.getElementById('mapFrame');

                if (mapFrame) {
                    mapFrame.src = 'https://maps.google.com/maps?q=' + lat + ',' + lng + '&output=embed&z=13';
                }

                btn.textContent = 'Use my current location';
                btn.disabled = false;
            },
            function () {
                alert('Unable to retrieve your location. Please check your browser permissions.');
                btn.textContent = 'Use my current location';
                btn.disabled = false;
            }
        );
    });
})();


(function initTestimonials() {
    var testimonials = [
        {
            quote: '"The best pool membership in the city. Crystal clear and never crowded."',
            name: 'Sarah Jenkins',
            role: 'Elite Member for 2 years',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80'
        },
        {
            quote: '"Incredible facilities and the staff are always helpful. Worth every penny!"',
            name: 'James Whitmore',
            role: 'Pro Member for 1 year',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80'
        },
        {
            quote: '"AquaSphere changed my fitness routine completely. The sauna alone is worth it."',
            name: 'Priya Kapoor',
            role: 'Starter Member for 6 months',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80'
        }
    ];

    var quoteEl = document.getElementById('testimonialQuote');
    var nameEl = document.getElementById('authorName');
    var roleEl = document.getElementById('authorRole');
    var avatarEl = document.querySelector('.author-avatar');
    var dots = document.querySelectorAll('.dot');
    var currentIndex = 0;
    var autoplay;

    if (!quoteEl || !nameEl || !roleEl || !dots.length) return;

    function updateTestimonial(index) {
        var t = testimonials[index];
        if (!t) return;

        quoteEl.textContent = t.quote;
        nameEl.textContent = t.name;
        roleEl.textContent = t.role;

        if (avatarEl) {
            avatarEl.src = t.avatar;
            avatarEl.alt = t.name;
        }

        dots.forEach(function (dot, i) {
            dot.classList.toggle('dot-active', i === index);
        });

        currentIndex = index;
    }

    window.changeTestimonial = function (index) {
        updateTestimonial(index);
    };

    updateTestimonial(0);

    autoplay = setInterval(function () {
        var next = (currentIndex + 1) % testimonials.length;
        updateTestimonial(next);
    }, 5000);

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            clearInterval(autoplay);
            updateTestimonial(i);
        });
    });
})();


(function initPlanButtons() {
    var planMap = {
        joinStarterBtn: 'Starter',
        joinProBtn: 'Pro',
        joinEliteBtn: 'Elite'
    };

    Object.keys(planMap).forEach(function (id) {
        var btn = document.getElementById(id);
        if (!btn) return;

        btn.addEventListener('click', function () {
            var selectedPlan = planMap[id];
            var selectedLocation = window._selectedLocationName || 'AquaSphere London Royal Docks';

            localStorage.setItem('selectedPlan', selectedPlan);
            localStorage.setItem('selectedLocation', selectedLocation);

            window.location.href = 'auth-member-signup.html';
        });
    });
})();


(function initSignupPrefill() {
    var planInput = document.getElementById('selectedPlan');
    var locationInput = document.getElementById('selectedLocation');
    var planDisplay = document.getElementById('selectedPlanText');
    var locationDisplay = document.getElementById('selectedLocationText');

    var savedPlan = localStorage.getItem('selectedPlan');
    var savedLocation = localStorage.getItem('selectedLocation');

    if (planInput) planInput.value = savedPlan || '';
    if (locationInput) locationInput.value = savedLocation || '';
    if (planDisplay && savedPlan) planDisplay.textContent = savedPlan;
    if (locationDisplay && savedLocation) locationDisplay.textContent = savedLocation;
})();


function goToDashboard() {
    window.location.href = 'dashboard.html';
}


/* ✅ FIXED LOGOUT */
function logout() {
    localStorage.removeItem('aquasphere_customer_logged_in');
    localStorage.removeItem('aquasphere_customer_name');
    localStorage.removeItem('aquasphere_customer_email');
    window.location.href = 'auth-member-login.html';
}