/**
 * Fierro Arquitectura y Diseño — V3 Main Script
 * Premium interactive experience
 */

(function () {
  'use strict';

  // ============================================
  // AOS INITIALIZATION
  // ============================================
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
    delay: 0,
  });

  // ============================================
  // HERO ENTRANCE SEQUENCE
  // ============================================
  window.addEventListener('load', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
      // Small delay for paint to settle, then trigger hero entrance animation
      requestAnimationFrame(() => {
        setTimeout(() => {
          hero.classList.add('loaded');
        }, 100);
      });
    }
  });

  // ============================================
  // SCROLL PROGRESS BAR
  // ============================================
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // ============================================
  // HEADER SCROLL BEHAVIOR
  // ============================================
  const header = document.getElementById('header');
  const heroSection = document.getElementById('hero');
  let lastScrollY = 0;
  let ticking = false;

  function onHeaderScroll() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection ? heroSection.offsetHeight : 600;

    if (header) {
      // Toggle transparent vs solid header
      if (scrollY > 80) {
        header.classList.add('scrolled');
        header.classList.remove('header--hero');
      } else {
        header.classList.remove('scrolled');
        header.classList.add('header--hero');
      }

      // Hide/show header on scroll direction
      if (scrollY > heroHeight) {
        if (scrollY > lastScrollY && scrollY - lastScrollY > 10) {
          header.classList.add('header--hidden');
        } else if (lastScrollY - scrollY > 10) {
          header.classList.remove('header--hidden');
        }
      } else {
        header.classList.remove('header--hidden');
      }
    }
    lastScrollY = scrollY;
  }

  // ============================================
  // ACTIVE NAV LINK (Intersection Observer)
  // ============================================
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  // ============================================
  // COMBINED SCROLL HANDLER (Throttled with rAF)
  // ============================================
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        onHeaderScroll();
        handleScrollVisibility();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  // Initial call
  updateScrollProgress();
  onHeaderScroll();

  // ============================================
  // HAMBURGER MOBILE MENU
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openMenu() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('active');
      isOpen ? closeMenu() : openMenu();
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
  }

  // Close menu on nav link click
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navMenu && navMenu.classList.contains('active')) closeMenu();
      if (lightbox && lightbox.classList.contains('active')) closeLightbox();
    }
  });

  // ============================================
  // DARK / LIGHT MODE TOGGLE
  // ============================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  function setTheme(mode) {
    if (mode === 'light') {
      htmlEl.classList.remove('dark-mode');
      htmlEl.classList.add('light-mode');
    } else {
      htmlEl.classList.remove('light-mode');
      htmlEl.classList.add('dark-mode');
    }
    localStorage.setItem('fierro-theme', mode);
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('fierro-theme');
  if (savedTheme) {
    setTheme(savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = htmlEl.classList.contains('dark-mode');
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = this.getAttribute('href');
      if (target === '#') return;
      const el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        const headerOffset = header ? header.offsetHeight : 80;
        const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  const counters = document.querySelectorAll('.stat__number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(eased * target);
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }
      requestAnimationFrame(update);
    });
  }

  // Observe the about stats section
  const statsSection = document.querySelector('.about__stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  // ============================================
  // PORTFOLIO FILTER
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio__item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items with animation
      portfolioItems.forEach((item) => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          });
        } else {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ============================================
  // PORTFOLIO LIGHTBOX WITH GALLERY
  // ============================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxThumbs = document.getElementById('lightboxThumbs');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');

  let currentGallery = [];
  let currentIndex = 0;

  function openLightbox(item) {
    try {
      currentGallery = JSON.parse(item.getAttribute('data-gallery') || '[]');
    } catch {
      currentGallery = [];
    }
    currentIndex = 0;

    // Get info from item
    const cat = item.querySelector('.portfolio__item-cat');
    const title = item.querySelector('.portfolio__item-title');
    const desc = item.querySelector('.portfolio__item-desc');

    if (lightboxCat) lightboxCat.textContent = cat ? cat.textContent : '';
    if (lightboxTitle) lightboxTitle.textContent = title ? title.textContent : '';
    if (lightboxDesc) lightboxDesc.textContent = desc ? desc.textContent : '';

    updateLightboxImage();
    buildThumbnails();

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    if (!currentGallery.length) return;
    lightboxImg.src = currentGallery[currentIndex];
    lightboxImg.alt = `Imagen ${currentIndex + 1} de ${currentGallery.length}`;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    }
    // Update active thumb
    if (lightboxThumbs) {
      lightboxThumbs.querySelectorAll('.lightbox__thumb').forEach((t, i) => {
        t.classList.toggle('active', i === currentIndex);
      });
    }
  }

  function buildThumbnails() {
    if (!lightboxThumbs) return;
    lightboxThumbs.innerHTML = '';
    currentGallery.forEach((src, i) => {
      const thumb = document.createElement('button');
      thumb.className = 'lightbox__thumb' + (i === 0 ? ' active' : '');
      thumb.setAttribute('aria-label', `Imagen ${i + 1}`);
      const img = document.createElement('img');
      img.src = src.replace('w=1200', 'w=100');
      img.alt = '';
      img.loading = 'lazy';
      thumb.appendChild(img);
      thumb.addEventListener('click', () => {
        currentIndex = i;
        updateLightboxImage();
      });
      lightboxThumbs.appendChild(thumb);
    });
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightboxImage();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
  }

  // Event listeners for lightbox
  portfolioItems.forEach((item) => {
    const btn = item.querySelector('.portfolio__item-btn');
    const overlay = item.querySelector('.portfolio__item-overlay');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(item);
      });
    }
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.closest('.portfolio__item-title') || e.target.closest('.portfolio__item-desc') || e.target.closest('.portfolio__item-cat')) {
          openLightbox(item);
        }
      });
    }
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

  // Click outside lightbox content to close
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Touch/swipe for lightbox
  let lightboxTouchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      lightboxTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - lightboxTouchStartX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? prevImage() : nextImage();
      }
    }, { passive: true });
  }

  // ============================================
  // TESTIMONIALS CAROUSEL
  // ============================================
  const testimTrack = document.getElementById('testimonialsTrack');
  const testimPrev = document.getElementById('testimPrev');
  const testimNext = document.getElementById('testimNext');
  const testimDots = document.getElementById('testimDots');
  let testimIndex = 0;
  let testimCards = [];

  function initTestimonials() {
    if (!testimTrack) return;
    testimCards = testimTrack.querySelectorAll('.testimonial-card');
    if (!testimCards.length) return;

    // Build dots
    if (testimDots) {
      testimDots.innerHTML = '';
      testimCards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
        dot.addEventListener('click', () => goToTestim(i));
        testimDots.appendChild(dot);
      });
    }

    updateTestimonials();
  }

  function goToTestim(idx) {
    testimIndex = idx;
    updateTestimonials();
  }

  function updateTestimonials() {
    if (!testimTrack || !testimCards.length) return;

    const cardWidth = testimCards[0].offsetWidth;
    const gap = parseInt(getComputedStyle(testimTrack).gap) || 24;
    const offset = testimIndex * (cardWidth + gap);

    testimTrack.style.transform = `translateX(-${offset}px)`;

    // Update dots
    if (testimDots) {
      testimDots.querySelectorAll('.testimonials__dot').forEach((d, i) => {
        d.classList.toggle('active', i === testimIndex);
      });
    }
  }

  if (testimPrev) {
    testimPrev.addEventListener('click', () => {
      testimIndex = (testimIndex - 1 + testimCards.length) % testimCards.length;
      updateTestimonials();
    });
  }

  if (testimNext) {
    testimNext.addEventListener('click', () => {
      testimIndex = (testimIndex + 1) % testimCards.length;
      updateTestimonials();
    });
  }

  // Touch/swipe for testimonials
  let testimTouchStartX = 0;
  if (testimTrack) {
    testimTrack.addEventListener('touchstart', (e) => {
      testimTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    testimTrack.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - testimTouchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          testimIndex = (testimIndex - 1 + testimCards.length) % testimCards.length;
        } else {
          testimIndex = (testimIndex + 1) % testimCards.length;
        }
        updateTestimonials();
      }
    }, { passive: true });
  }

  // Auto-play testimonials
  let testimAutoPlay = setInterval(() => {
    if (testimCards.length) {
      testimIndex = (testimIndex + 1) % testimCards.length;
      updateTestimonials();
    }
  }, 6000);

  // Pause on hover
  if (testimTrack) {
    testimTrack.addEventListener('mouseenter', () => clearInterval(testimAutoPlay));
    testimTrack.addEventListener('mouseleave', () => {
      testimAutoPlay = setInterval(() => {
        if (testimCards.length) {
          testimIndex = (testimIndex + 1) % testimCards.length;
          updateTestimonials();
        }
      }, 6000);
    });
  }

  initTestimonials();
  window.addEventListener('resize', updateTestimonials);

  // ============================================
  // CONTACT FORM VALIDATION
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  function validateField(input, errorEl, message) {
    if (!input.value.trim()) {
      errorEl.textContent = message;
      input.classList.add('error');
      return false;
    }
    errorEl.textContent = '';
    input.classList.remove('error');
    return true;
  }

  function validateEmail(input, errorEl) {
    if (!input.value.trim()) {
      errorEl.textContent = 'El email es obligatorio';
      input.classList.add('error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      errorEl.textContent = 'Ingresa un email válido';
      input.classList.add('error');
      return false;
    }
    errorEl.textContent = '';
    input.classList.remove('error');
    return true;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const type = document.getElementById('contactType');
      const message = document.getElementById('contactMessage');

      const nameOk = validateField(name, document.getElementById('nameError'), 'El nombre es obligatorio');
      const emailOk = validateEmail(email, document.getElementById('emailError'));
      const typeOk = validateField(type, document.getElementById('typeError'), 'Selecciona un tipo de proyecto');
      const msgOk = validateField(message, document.getElementById('messageError'), 'Cuéntanos sobre tu proyecto');

      if (nameOk && emailOk && typeOk && msgOk) {
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate submission then redirect to mailto
        setTimeout(() => {
          const subject = encodeURIComponent(`Nuevo proyecto ${type.value} — ${name.value}`);
          const body = encodeURIComponent(
            `Nombre: ${name.value}\nEmail: ${email.value}\nTeléfono: ${document.getElementById('contactPhone').value || 'No especificado'}\nTipo: ${type.value}\n\nMensaje:\n${message.value}`
          );
          window.location.href = `mailto:fernanda@fierroarquitectura.com?subject=${subject}&body=${body}`;

          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          contactForm.style.display = 'none';
          formSuccess.style.display = 'flex';
        }, 1200);
      }
    });

    // Clear errors on input
    contactForm.querySelectorAll('.form-input').forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorEl = input.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  }

  // ============================================
  // WHATSAPP FLOAT & BACK TO TOP VISIBILITY
  // ============================================
  const whatsappFloat = document.getElementById('whatsappFloat');
  const backToTop = document.getElementById('backToTop');

  function handleScrollVisibility() {
    const scrollY = window.scrollY;
    if (whatsappFloat) {
      whatsappFloat.classList.toggle('visible', scrollY > 400);
    }
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 600);
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Initial call
  handleScrollVisibility();

  // ============================================
  // LAZY IMAGE LOADING (fallback for older browsers)
  // ============================================
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    lazyImages.forEach((img) => imageObserver.observe(img));
  }

  // ============================================
  // RESIZE HANDLER FOR AOS REFRESH
  // ============================================
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      AOS.refresh();
    }, 250);
  });

})();
