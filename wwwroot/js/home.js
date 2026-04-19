/* ============================================================
   HOME.JS - AquaSphere Homepage Interactivity
   ============================================================
   Handles all interactive behaviour on the public-facing
   homepage:
     - Navbar scroll shadow effect
     - Mobile hamburger menu toggle
     - Smooth scroll to in-page sections
     - Location list → Google Maps iframe switching
     - Geolocation "use my location" button
     - Testimonials auto-rotating carousel
     - Membership plan buttons (navigate to signup)
============================================================ */

/* ===========================
   NAVBAR - Scroll Shadow
   Adds a drop shadow when the
   user scrolls past 10 px.
=========================== */
(function initNavbarScroll() {
  window.addEventListener('scroll', function () {
    var navbar = document.querySelector('#page-home .navbar');
    if (!navbar) { return; }
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();

/* ===========================
   MOBILE MENU - Toggle
   Uses event delegation so it
   works after page show/hide.
=========================== */
(function initMobileMenu() {
  document.addEventListener('click', function (e) {
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var mobileMenu   = document.getElementById('mobileMenu');
    if (!hamburgerBtn || !mobileMenu) { return; }

    if (hamburgerBtn.contains(e.target)) {
      /* Toggle on hamburger click */
      var isOpen = mobileMenu.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    } else if (!mobileMenu.contains(e.target)) {
      /* Close when clicking outside */
      mobileMenu.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ===========================
   SMOOTH SCROLL TO SECTION
   Called from hero buttons:
   scrollToSection('locations')
=========================== */
function scrollToSection(sectionId) {
  var target = document.getElementById(sectionId);
  if (!target) { return; }
  var navbarHeight = 64;
  var offsetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
  window.scrollTo({ top: offsetTop, behavior: 'smooth' });
}

/* ===========================
   LOCATIONS - Map Switching
   Clicking a location item
   updates the embedded Google
   Maps iframe and plan labels.
=========================== */
(function initLocationsList() {

  /* All 10 UK AquaSphere locations */
  var locationData = [
    {
      name:            'AquaSphere London Royal Docks',
      mapSrc:          'https://maps.google.com/maps?q=Royal+Docks+London+E16+1AH+UK&output=embed&z=14',
      directionsUrl:   'https://www.google.com/maps/dir/?api=1&destination=Royal+Docks+London+E16+1AH+UK',
      membershipLabel: 'LOCATION: AQUASPHERE LONDON ROYAL DOCKS'
    },
    {
      name:            'AquaSphere Manchester MediaCity',
      mapSrc:          'https://maps.google.com/maps?q=MediaCity+Salford+M50+2EQ+UK&output=embed&z=14',
      directionsUrl:   'https://www.google.com/maps/dir/?api=1&destination=MediaCity+Salford+M50+2EQ+UK',
      membershipLabel: 'LOCATION: AQUASPHERE MANCHESTER MEDIACITYUK'
    },
    {
      name:            'AquaSphere Birmingham Edgbaston',
      mapSrc:          'https://maps.google.com/maps?q=Edgbaston+Birmingham+B15+2TT+UK&output=embed&z=14',
      directionsUrl:   'https://www.google.com/maps/dir/?api=1&destination=Edgbaston+Birmingham+B15+2TT+UK',
      membershipLabel: 'LOCATION: AQUASPHERE BIRMINGHAM EDGBASTON'
    },
    {
      name:            'AquaSphere Edinburgh Holyrood',
      mapSrc:          'https://maps.google.com/maps?q=Holyrood+Edinburgh+EH8+8AS+UK&output=embed&z=14',
      directionsUrl:   'https://www.google.com/maps/dir/?api=1&destination=Holyrood+Edinburgh+EH8+8AS+UK',
      membershipLabel: 'LOCATION: AQUASPHERE EDINBURGH HOLYROOD'
    },
    {
      name:            'AquaSphere Bristol Harbourside',
      mapSrc:          'https://maps.google.com/maps?q=Harbourside+Bristol+BS1+5LL+UK&output=embed&z=14',
      directionsUrl:   'https://www.google.com/maps/dir/?api=1&destination=Harbourside+Bristol+BS1+5LL+UK',
      membershipLabel: 'LOCATION: AQUASPHERE BRISTOL HARBOURSIDE'
    },
    {
      name:            'AquaSphere Leeds Victoria',
      mapSrc:          'https://maps.google.com/maps?q=Victoria+Quarter+Leeds+LS2+7AU+UK&output=embed&z=14',
      directionsUrl:   'https://www.google.com/maps/dir/?api=1&destination=Victoria+Quarter+Leeds+LS2+7AU+UK',
      membershipLabel: 'LOCATION: AQUASPHERE LEEDS VICTORIA'
    },
    {
      name:            'AquaSphere Glasgow West End',
      mapSrc:          'https://maps.google.com/maps?q=West+End+Glasgow+G12+8QQ+UK&output=embed&z=14',
      directionsUrl:   'https://www.google.com/maps/dir/?api=1&destination=West+End+Glasgow+G12+8QQ+UK',
      membershipLabel: 'LOCATION: AQUASPHERE GLASGOW WEST END'
    },
    {
      name:            'AquaSphere Liverpool Albert Dock',
      mapSrc:          'https://maps.google.com/maps?q=Albert+Dock+Liverpool+L3+4AF+UK&output=embed&z=14',
      directionsUrl:   'https://www.google.com/maps/dir/?api=1&destination=Albert+Dock+Liverpool+L3+4AF+UK',
      membershipLabel: 'LOCATION: AQUASPHERE LIVERPOOL ALBERT DOCK'
    },
    {
      name:            'AquaSphere Sheffield Peak',
      mapSrc:          'https://maps.google.com/maps?q=Sheffield+City+Centre+S1+2BP+UK&output=embed&z=14',
      directionsUrl:   'https://www.google.com/maps/dir/?api=1&destination=Sheffield+City+Centre+S1+2BP+UK',
      membershipLabel: 'LOCATION: AQUASPHERE SHEFFIELD PEAK'
    },
    {
      name:            'AquaSphere Cardiff Bay',
      mapSrc:          'https://maps.google.com/maps?q=Cardiff+Bay+CF10+5AN+UK&output=embed&z=14',
      directionsUrl:   'https://www.google.com/maps/dir/?api=1&destination=Cardiff+Bay+CF10+5AN+UK',
      membershipLabel: 'LOCATION: AQUASPHERE CARDIFF BAY'
    }
  ];

  var activeIndex = 0;

  /* Update map, membership label, and plan button text */
  function setActiveLocation(index) {
    activeIndex = index;

    /* Highlight active location item */
    var locationItems = document.querySelectorAll('.location-item');
    locationItems.forEach(function (item, i) {
      item.classList.toggle('active', i === index);
    });

    /* Update map iframe source */
    var data      = locationData[index];
    var mapFrame  = document.getElementById('mapFrame');
    if (mapFrame) { mapFrame.src = data.mapSrc; }

    /* Update membership section location label */
    var membershipLocation = document.getElementById('membershipLocation');
    if (membershipLocation) { membershipLocation.textContent = data.membershipLabel; }

    /* Update "Join ..." text on all plan buttons */
    var joinBtns     = document.querySelectorAll('.plan-btn');
    var locationShort = data.name.replace('AquaSphere ', '').split(' ').slice(0, 2).join(' ');
    joinBtns.forEach(function (btn) { btn.textContent = 'Join ' + locationShort; });

    /* Store directions URL for the Get Directions button */
    window._activeDirectionsUrl = data.directionsUrl;
  }

  /* Delegate clicks on location-item elements */
  document.addEventListener('click', function (e) {
    var item = e.target.closest('.location-item');
    if (!item) { return; }
    var locationItems = document.querySelectorAll('.location-item');
    var index = Array.from(locationItems).indexOf(item);
    if (index >= 0) { setActiveLocation(index); }
  });

  /* Start with London Royal Docks selected */
  setActiveLocation(0);
})();

/* ===========================
   DIRECTIONS BUTTON
   Opens Google Maps in a new
   tab for the active location.
=========================== */
function openDirections() {
  var url = window._activeDirectionsUrl
    || 'https://www.google.com/maps/search/AquaSphere+London+Royal+Docks';
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ===========================
   GEOLOCATION
   "Use my current location"
   button centres the map on
   the user's position.
=========================== */
function showHomePopup(message) {
    var popup = document.createElement("div");
    popup.style.cssText = "position:fixed;top:20px;right:20px;background:#323232;color:#fff;padding:15px 25px;border-radius:4px;z-index:9999;box-shadow:0 4px 6px rgba(0,0,0,0.1);font-family:sans-serif;opacity:0;transition:opacity 0.3s ease;";
    popup.innerText = message;
    document.body.appendChild(popup);
    popup.offsetHeight; 
    popup.style.opacity = "1";
    setTimeout(function() {
        popup.style.opacity = "0";
        setTimeout(function() { popup.remove(); }, 300);
    }, 3000);
}

(function initGeolocation() {
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#useLocationBtn')) { return; }
    var btn = document.getElementById('useLocationBtn');
    if (!btn) { return; }

    if (!navigator.geolocation) {
      showHomePopup('Geolocation is not supported by your browser.');
      return;
    }

    btn.textContent = 'Locating...';
    btn.disabled    = true;

    navigator.geolocation.getCurrentPosition(
      function (position) {
        var lat      = position.coords.latitude;
        var lng      = position.coords.longitude;
        var mapFrame = document.getElementById('mapFrame');
        if (mapFrame) {
          mapFrame.src = 'https://maps.google.com/maps?q=' + lat + ',' + lng + '&output=embed&z=13';
        }
        btn.textContent = 'Use my current location';
        btn.disabled    = false;
      },
      function () {
        showHomePopup('Unable to retrieve your location. Please check your browser permissions.');
        btn.textContent = 'Use my current location';
        btn.disabled    = false;
      }
    );
  });
})();

/* ===========================
   TESTIMONIALS - Carousel
   Auto-rotates every 5 seconds.
   Dots also allow manual nav.
=========================== */
(function initTestimonials() {
  var testimonials = [
    {
      quote:  '"The best pool membership in the city. Crystal clear and never crowded."',
      name:   'Sarah Jenkins',
      role:   'Elite Member for 2 years',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80'
    },
    {
      quote:  '"Incredible facilities and the staff are always helpful. Worth every penny!"',
      name:   'James Whitmore',
      role:   'Pro Member for 1 year',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80'
    },
    {
      quote:  '"AquaSphere changed my fitness routine completely. The sauna alone is worth it."',
      name:   'Priya Kapoor',
      role:   'Starter Member for 6 months',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80'
    }
  ];

  var currentIndex = 0;

  /* Update all testimonial DOM elements */
  function updateTestimonial(index) {
    var quoteEl  = document.getElementById('testimonialQuote');
    var nameEl   = document.getElementById('authorName');
    var roleEl   = document.getElementById('authorRole');
    var avatarEl = document.querySelector('.author-avatar');
    var dots     = document.querySelectorAll('.dot');
    if (!quoteEl || !nameEl || !roleEl) { return; }

    var t = testimonials[index];
    quoteEl.textContent = t.quote;
    nameEl.textContent  = t.name;
    roleEl.textContent  = t.role;
    if (avatarEl) { avatarEl.src = t.avatar; avatarEl.alt = t.name; }
    dots.forEach(function (dot, i) { dot.classList.toggle('dot-active', i === index); });
    currentIndex = index;
  }

  /* Exposed for inline onclick="changeTestimonial(n)" in HTML */
  window.changeTestimonial = function (index) { updateTestimonial(index); };

  /* Auto-advance every 5 seconds */
  var autoplay = setInterval(function () {
    updateTestimonial((currentIndex + 1) % testimonials.length);
  }, 5000);

  /* Manual dot clicks (event delegation) */
  document.addEventListener('click', function (e) {
    var dot = e.target.closest('.dot');
    if (!dot) { return; }
    var dots  = document.querySelectorAll('.dot');
    var index = Array.from(dots).indexOf(dot);
    if (index >= 0) {
      clearInterval(autoplay);
      updateTestimonial(index);
    }
  });
})();

/* ===========================
   MEMBERSHIP PLAN BUTTONS
   Starter / Pro / Elite buttons
   navigate to the signup page.
=========================== */
(function initPlanButtons() {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('#joinStarterBtn, #joinProBtn, #joinEliteBtn');
    if (btn) {
      if (btn.id === 'joinStarterBtn') {
        localStorage.setItem("selectedPlan", "Starter");
        localStorage.setItem("selectedPrice", "74");
      } else if (btn.id === 'joinProBtn') {
        localStorage.setItem("selectedPlan", "Pro");
        localStorage.setItem("selectedPrice", "149");
      } else if (btn.id === 'joinEliteBtn') {
        localStorage.setItem("selectedPlan", "Elite");
        localStorage.setItem("selectedPrice", "299");
      }
      window.location.href = 'payment.html';
    }
  });
})();
