$(function () {
    $("#downloadCV").on("click", function (e) {
        e.preventDefault();

        const fileUrl = "assets/Rajamanickam_Resume.pdf";

        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "Rajamanickam_Resume.pdf";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
  /* ── Navbar scroll effect ── */
  $(window).on('scroll', function () {
    $('#mainNav').toggleClass('scrolled', $(this).scrollTop() > 50);
    var scrollPos = $(this).scrollTop() + 80;
    $('section[id]').each(function () {
      var top    = $(this).offset().top;
      var bottom = top + $(this).outerHeight();
      var id     = $(this).attr('id');
      if (scrollPos >= top && scrollPos < bottom) {
        $('.fs-link').removeClass('active-link');
        $('.fs-link[href="#' + id + '"]').addClass('active-link');
      }
    });
  });

  /* ── Close button in overlay ── */
  $('#closeMenuBtn').on('click', function () { closeMenu(); });

  /* ── Hamburger / fullscreen menu ── */
  var menuOpen = false;
  function openMenu() {
    menuOpen = true;
    $('#fullscreenMenu').addClass('open');
    $('#hamburgerBtn').addClass('open');
    $('body').css('overflow', 'hidden');
  }
  function closeMenu() {
    menuOpen = false;
    $('#fullscreenMenu').removeClass('open');
    $('#hamburgerBtn').removeClass('open');
    $('body').css('overflow', '');
  }
  $('#hamburgerBtn').on('click', function () { menuOpen ? closeMenu() : openMenu(); });
  $(document).on('keydown', function (e) { if (e.key === 'Escape' && menuOpen) closeMenu(); });

  /* ── Smooth scroll ── */
  $(document).on('click', '.fs-link', function (e) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      closeMenu();
      setTimeout(function () {
        $('html, body').stop().animate({ scrollTop: target.offset().top - 70 }, 700, 'swing');
      }, 400);
    }
  });

  /* ── Intersection Observer ── */
  var skillsAnimated = false;
  var counterAnimated = false;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { $(entry.target).addClass('visible'); }
    });
  }, { threshold: 0.12 });
  $('.fade-up').each(function () { observer.observe(this); });

  /* Skill bars */
  var skillObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !skillsAnimated) {
      skillsAnimated = true;
      $('.progress-bar').each(function () {
        var w = $(this).data('width');
        $(this).animate({ width: w + '%' }, 1500);
      });
    }
  }, { threshold: 0.3 });
  var $skillSection = $('#resume .progress').first();
  if ($skillSection.length) skillObserver.observe($skillSection[0]);

  /* Counter */
  var counterObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !counterAnimated) {
      counterAnimated = true;
      $('.counter').each(function () {
        var $el = $(this);
        var target = parseInt($el.data('target'));
        $({ count: 0 }).animate({ count: target }, {
          duration: 2000, easing: 'swing',
          step: function () { $el.text(Math.floor(this.count)); },
          complete: function () { $el.text(target); }
        });
      });
    }
  }, { threshold: 0.5 });
  var $counter = $('.counter').first();
  if ($counter.length) counterObserver.observe($counter[0]);

  /* ── EmailJS init ── */
  // ▶ SETUP: replace the two strings below with your EmailJS credentials
  // 1. Sign up free at https://www.emailjs.com
  // 2. Create a service (Gmail recommended) → copy Service ID
  // 3. Create an email template → copy Template ID
  // 4. Go to Account → API Keys → copy your Public Key
  var EMAILJS_SERVICE_ID  = 'service_7qv9f6b';   // e.g. 'service_abc123'
  var EMAILJS_TEMPLATE_ID = 'template_vguwz03';  // e.g. 'template_xyz789'
  var EMAILJS_PUBLIC_KEY  = 'G-xMtZ-Jyz_d5hGwE';    // e.g. 'AbCdEfGh1234567'

  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  /* ── Helpers ── */
  function setInvalid($el, show) {
    if (show) { $el.addClass('is-invalid'); }
    else       { $el.removeClass('is-invalid'); }
  }
  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
  function isValidPhone(v) { return /[\d\s\-()+]{10,}/.test(v.trim()); }

  /* Live clear-on-fix */
  $('#cf-name, #cf-email, #cf-phone, #cf-subject, #cf-message').on('input', function () {
    setInvalid($(this), false);
  });

  /* ── Contact form submit ── */
  $('#sendBtn').on('click', function () {
    var name    = $.trim($('#cf-name').val());
    var email   = $.trim($('#cf-email').val());
    var phone   = $.trim($('#cf-phone').val());
    var subject = $.trim($('#cf-subject').val());
    var message = $.trim($('#cf-message').val());

    var valid = true;

    setInvalid($('#cf-name'),    !name);          if (!name)                     valid = false;
    setInvalid($('#cf-email'),   !isValidEmail(email)); if (!isValidEmail(email)) valid = false;
    setInvalid($('#cf-phone'),   !isValidPhone(phone)); if (!isValidPhone(phone)) valid = false;
    setInvalid($('#cf-subject'), !subject);       if (!subject)                  valid = false;
    setInvalid($('#cf-message'), message.length < 20); if (message.length < 20)  valid = false;

    if (!valid) return;

    $('#cf-success, #cf-fail').hide();
    var $btn = $(this);
    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...');

    var templateParams = {
      from_name   : name,
      from_email  : email,
      from_phone  : phone,
      subject     : subject,
      message     : message,
      to_name     : 'Rajamanickam'   // shown in template greeting
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function () {
        $btn.prop('disabled', false).html('Send Message <i class="fas fa-paper-plane ms-2"></i>');
        $('#cf-success').fadeIn();
        $('#contactForm input, #contactForm textarea').val('');
        $('html, body').animate({ scrollTop: $('#cf-success').offset().top - 120 }, 500);
      })
      .catch(function (err) {
        console.error('EmailJS error:', err);
        $btn.prop('disabled', false).html('Send Message <i class="fas fa-paper-plane ms-2"></i>');
        $('#cf-fail').fadeIn();
      });
  });

});

/* ── Typing animation ── */
(function () {
  var words   = ['Angular', 'JavaScript', 'HTML5, CSS3 & SASS', 'Bootstrap', 'Material UI', 'PrimeNG', 'Figma & Adobe XD', 'Photoshop'];
  var el      = document.getElementById('typed-text');
  var wIndex  = 0;
  var cIndex  = 0;
  var deleting = false;
  var typeSpeed  = 110;
  var deleteSpeed = 65;
  var pauseEnd   = 1800;
  var pauseStart = 400;

  function type() {
    var word = words[wIndex];
    if (!deleting) {
      el.textContent = word.substring(0, cIndex + 1);
      cIndex++;
      if (cIndex === word.length) {
        deleting = true;
        setTimeout(type, pauseEnd);
        return;
      }
      setTimeout(type, typeSpeed);
    } else {
      el.textContent = word.substring(0, cIndex - 1);
      cIndex--;
      if (cIndex === 0) {
        deleting = false;
        wIndex = (wIndex + 1) % words.length;
        setTimeout(type, pauseStart);
        return;
      }
      setTimeout(type, deleteSpeed);
    }
  }
  setTimeout(type, 600);
})();
