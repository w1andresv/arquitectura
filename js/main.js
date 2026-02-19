/* ============================================
   FIERRO ARQUITECTURA — MAIN JAVASCRIPT
   Navigation, Dark Mode, Portfolio, Carousel,
   Counter, Form Validation, AOS Init
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ──────────────────────────────────────
  // AOS INITIALIZATION
  // ──────────────────────────────────────
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  // ──────────────────────────────────────
  // NAVIGATION
  // ──────────────────────────────────────
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const navLinks = document.querySelectorAll('.nav__link');

  // Scroll — header shrink
  let lastScroll = 0;
  const handleScroll = () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // Hamburger toggle
  const toggleMenu = () => {
    const isOpen = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    hamburger.setAttribute('aria-expanded', isOpen);
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', toggleMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  // Close menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      // Also close lightbox
      closeLightbox();
    }
  });

  // Active nav link on scroll (Intersection Observer)
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -80% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // ──────────────────────────────────────
  // DARK / LIGHT MODE TOGGLE
  // ──────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved preference or detect system preference
  const savedTheme = localStorage.getItem('fierro-theme');
  if (savedTheme === 'light') {
    html.classList.remove('dark-mode');
    html.classList.add('light-mode');
  } else if (savedTheme === 'dark') {
    html.classList.remove('light-mode');
    html.classList.add('dark-mode');
  } else {
    // Default: dark mode (brand identity)
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      html.classList.remove('dark-mode');
      html.classList.add('light-mode');
    }
  }

  themeToggle.addEventListener('click', () => {
    const isLight = html.classList.contains('light-mode');
    if (isLight) {
      html.classList.remove('light-mode');
      html.classList.add('dark-mode');
      localStorage.setItem('fierro-theme', 'dark');
    } else {
      html.classList.remove('dark-mode');
      html.classList.add('light-mode');
      localStorage.setItem('fierro-theme', 'light');
    }
  });

  // ──────────────────────────────────────
  // COUNTER ANIMATION
  // ──────────────────────────────────────
  const counters = document.querySelectorAll('.stat__number[data-target]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  // Observe stats section
  const statsContainer = document.querySelector('.about__stats');
  if (statsContainer) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsContainer);
  }

  // ──────────────────────────────────────
  // PORTFOLIO FILTER
  // ──────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  // ──────────────────────────────────────
  // PORTFOLIO LIGHTBOX (MINI GALLERY)
  // ──────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxThumbs = document.getElementById('lightboxThumbs');
  const portfolioBtns = document.querySelectorAll('.portfolio__item-btn');

  let galleryImages = [];
  let galleryIndex = 0;

  const updateGalleryImage = (index) => {
    galleryIndex = index;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = galleryImages[index];
      lightboxImg.style.opacity = '1';
    }, 150);
    lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
    // Update thumbnails
    const thumbs = lightboxThumbs.querySelectorAll('.lightbox__thumb');
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  };

  const openLightbox = (item) => {
    const cat = item.querySelector('.portfolio__item-cat');
    const title = item.querySelector('.portfolio__item-title');
    const desc = item.querySelector('.portfolio__item-desc');
    const imgWrap = item.querySelector('.portfolio__img-wrap');

    // Parse gallery images from data attribute
    try {
      galleryImages = JSON.parse(item.dataset.gallery || '[]');
    } catch (e) {
      galleryImages = [];
    }

    // Fallback to background-image if no gallery data
    if (!galleryImages.length) {
      const bgStyle = imgWrap ? imgWrap.style.backgroundImage : '';
      const bgUrl = bgStyle.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
      if (bgUrl) galleryImages = [bgUrl];
    }

    // Build thumbnails
    lightboxThumbs.innerHTML = '';
    galleryImages.forEach((url, i) => {
      const thumb = document.createElement('img');
      thumb.className = 'lightbox__thumb' + (i === 0 ? ' active' : '');
      thumb.src = url.replace('w=1200', 'w=150');
      thumb.alt = `Vista ${i + 1}`;
      thumb.addEventListener('click', () => updateGalleryImage(i));
      lightboxThumbs.appendChild(thumb);
    });

    // Set first image
    galleryIndex = 0;
    if (galleryImages.length) {
      lightboxImg.src = galleryImages[0];
      lightboxImg.alt = imgWrap ? imgWrap.getAttribute('aria-label') || '' : '';
      lightboxImg.style.opacity = '1';
    }
    lightboxCounter.textContent = `1 / ${galleryImages.length}`;

    // Show/hide arrows
    const showArrows = galleryImages.length > 1;
    lightboxPrev.style.display = showArrows ? 'flex' : 'none';
    lightboxNext.style.display = showArrows ? 'flex' : 'none';

    if (cat) lightboxCat.textContent = cat.textContent;
    if (title) lightboxTitle.textContent = title.textContent;
    if (desc) lightboxDesc.textContent = desc.textContent;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Gallery navigation
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      const newIndex = galleryIndex > 0 ? galleryIndex - 1 : galleryImages.length - 1;
      updateGalleryImage(newIndex);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      const newIndex = galleryIndex < galleryImages.length - 1 ? galleryIndex + 1 : 0;
      updateGalleryImage(newIndex);
    });
  }

  // Keyboard navigation in lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') {
      const newIndex = galleryIndex > 0 ? galleryIndex - 1 : galleryImages.length - 1;
      updateGalleryImage(newIndex);
    } else if (e.key === 'ArrowRight') {
      const newIndex = galleryIndex < galleryImages.length - 1 ? galleryIndex + 1 : 0;
      updateGalleryImage(newIndex);
    } else if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  portfolioBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.closest('.portfolio__item');
      openLightbox(item);
    });
  });

  // Also open on item click (for touch)
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(item);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // ──────────────────────────────────────
  // TESTIMONIALS CAROUSEL
  // ──────────────────────────────────────
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testimPrev');
  const nextBtn = document.getElementById('testimNext');
  const dotsContainer = document.getElementById('testimDots');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  let currentSlide = 0;
  let autoPlayInterval;

  const totalSlides = cards.length;

  // Create dots
  if (dotsContainer && totalSlides > 0) {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('testimonials__dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.testimonials__dot') : [];

  const goToSlide = (index) => {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

  // Auto-play
  const startAutoPlay = () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  if (totalSlides > 1) {
    startAutoPlay();
  }

  // Touch/swipe support for carousel
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetAutoPlay();
      }
    }, { passive: true });
  }

  // ──────────────────────────────────────
  // CONTACT FORM VALIDATION
  // ──────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset errors
      clearErrors();

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const type = document.getElementById('contactType');
      const message = document.getElementById('contactMessage');

      let isValid = true;

      // Name validation
      if (!name.value.trim()) {
        showError(name, 'nameError', 'Por favor ingresa tu nombre');
        isValid = false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        showError(email, 'emailError', 'Por favor ingresa tu email');
        isValid = false;
      } else if (!emailRegex.test(email.value)) {
        showError(email, 'emailError', 'Por favor ingresa un email válido');
        isValid = false;
      }

      // Project type validation
      if (!type.value) {
        showError(type, 'typeError', 'Por favor selecciona el tipo de proyecto');
        isValid = false;
      }

      // Message validation
      if (!message.value.trim()) {
        showError(message, 'messageError', 'Por favor describe tu proyecto');
        isValid = false;
      } else if (message.value.trim().length < 10) {
        showError(message, 'messageError', 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
      }

      if (isValid) {
        // Simulate form submission
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          contactForm.reset();
          formSuccess.classList.add('show');

          // Build mailto link as fallback
          const subject = encodeURIComponent(`Nuevo proyecto - ${type.value}`);
          const body = encodeURIComponent(
            `Nombre: ${name.value}\nEmail: ${email.value}\nTeléfono: ${document.getElementById('contactPhone').value || 'No proporcionado'}\nTipo: ${type.value}\n\nMensaje:\n${message.value}`
          );
          window.open(`mailto:fernanda@fierroarquitectura.com?subject=${subject}&body=${body}`, '_self');

          setTimeout(() => {
            formSuccess.classList.remove('show');
          }, 5000);
        }, 1500);
      }
    });
  }

  function showError(input, errorId, message) {
    input.classList.add('error');
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll('.form-input').forEach(input => {
      input.classList.remove('error');
    });
    document.querySelectorAll('.form-error').forEach(error => {
      error.textContent = '';
    });
  }

  // Real-time validation on blur
  const formInputs = document.querySelectorAll('.form-input[required]');
  formInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim()) {
        input.classList.remove('error');
        const errorEl = input.parentElement.querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
      }
    });
  });

  // ──────────────────────────────────────
  // WHATSAPP FLOAT + BACK TO TOP
  // ──────────────────────────────────────
  const whatsappFloat = document.getElementById('whatsappFloat');
  const backToTop = document.getElementById('backToTop');

  const handleFloatVisibility = () => {
    const scrollY = window.scrollY;

    if (scrollY > 400) {
      whatsappFloat?.classList.add('visible');
      backToTop?.classList.add('visible');
    } else {
      whatsappFloat?.classList.remove('visible');
      backToTop?.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleFloatVisibility, { passive: true });
  handleFloatVisibility();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ──────────────────────────────────────
  // SMOOTH SCROLL (fallback for older browsers)
  // ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ──────────────────────────────────────
  // LAZY IMAGE LOADING ENHANCEMENT
  // ──────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.opacity = '0';
          img.addEventListener('load', () => {
            img.style.transition = 'opacity 0.5s ease';
            img.style.opacity = '1';
          });
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imgObserver.observe(img);
    });
  }

  // ──────────────────────────────────────
  // PERFORMANCE: Debounce resize handler
  // ──────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Close mobile menu on resize to desktop
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    }, 250);
  });

});
