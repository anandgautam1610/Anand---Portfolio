/**
 * Anand Gautam - Personal Portfolio Modern JavaScript
 * Features:
 * - Persistent Dark/Light Theme with localStorage
 * - Mobile Drawer Navigation & Accessible ARIA
 * - Scroll-Spy Active Nav Link Tracker & Sticky Header Elevation
 * - IntersectionObserver Scroll Reveal Animations
 * - Interactive Project Details Modal
 * - Client-Side Contact Form Validation & Toast Notification
 * - Back to Top Floating Action Button
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollEffects();
  initIntersectionObserver();
  initProjectModals();
  initContactForm();
  initFooterYear();
});

/* ==========================================================================
   1. Theme Toggle & Persistence
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const THEME_STORAGE_KEY = 'anand_portfolio_theme';

  // Determine initial theme: saved preference -> system preference -> default dark
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  let currentTheme = 'dark';

  if (savedTheme) {
    currentTheme = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    currentTheme = 'light';
  }

  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(activeTheme);
      localStorage.setItem(THEME_STORAGE_KEY, activeTheme);
    });
  }

  // Sync with OS theme changes if user has not set an explicit override
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    }
  }
}

/* ==========================================================================
   2. Mobile Drawer Navigation & Scroll Spy
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');

  if (!mobileToggle || !mobileNav) return;

  function toggleMobileMenu(isOpen) {
    const expand = typeof isOpen === 'boolean' ? isOpen : !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', expand);
    mobileToggle.classList.toggle('active', expand);
    mobileToggle.setAttribute('aria-expanded', String(expand));
    document.body.style.overflow = expand ? 'hidden' : '';
  }

  mobileToggle.addEventListener('click', () => toggleMobileMenu());

  // Close when clicking any nav link
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });

  // Close when clicking outside mobile nav
  document.addEventListener('click', (e) => {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !mobileToggle.contains(e.target)
    ) {
      toggleMobileMenu(false);
    }
  });
}

/* ==========================================================================
   3. Sticky Header Elevation & Scroll-Spy
   ========================================================================== */
function initScrollEffects() {
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollY = window.scrollY;

    // Header elevation on scroll
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 380) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll-Spy active section highlighter
    let activeSectionId = '';
    const scrollThreshold = scrollY + 120;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollThreshold >= top && scrollThreshold < top + height) {
        activeSectionId = sec.getAttribute('id');
      }
    });

    if (activeSectionId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${activeSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once initially

  // Back to top smooth scroll
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   4. Intersection Observer - Smooth Scroll Reveal Animations
   ========================================================================== */
function initIntersectionObserver() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach((el) => el.classList.add('reveal-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target); // Reveal once
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    // Stagger items slightly if they are siblings in grids
    if (el.parentElement && (el.parentElement.classList.contains('about-grid') ||
        el.parentElement.classList.contains('skills-grid') ||
        el.parentElement.classList.contains('projects-grid'))) {
      el.style.transitionDelay = `${(index % 3) * 0.12}s`;
    }
    observer.observe(el);
  });
}

/* ==========================================================================
   5. Interactive Project Details Modal
   ========================================================================== */
const PROJECT_DATA = {
  medimind: {
    title: 'Medi-Mind',
    tagline: 'Intelligent Health-Tech Diagnostic Report Analyzer',
    stack: ['Python', 'Streamlit', 'Data Analysis', 'NLP / Text Extraction'],
    summary:
      'Medi-Mind bridges the communication gap between dense laboratory pathology reports and accessible clinical summaries. By parsing raw text streams and extracting reference ranges, it flags anomalous readings in real time.',
    keyFeatures: [
      'Automated extraction of vital biological markers (e.g. Glucose, Hemoglobin, Lipid Panel)',
      'Threshold comparison with clinical standard baseline ranges',
      'Interactive visual distribution charts and health metrics dashboard built on Streamlit',
      'Exportable summary reports for both patients and medical consultations'
    ],
    architecture:
      'Built using Python regular expression parsers and NLP tokenizers, rendering an ultra-fast reactive frontend via Streamlit without needing complex client-side setups.',
    githubUrl: 'https://github.com'
  },
  lostandfound: {
    title: 'VIT Campus Lost & Found Ledger',
    tagline: 'Modern Desktop Management System for Misplaced Campus Items',
    stack: ['Python', 'CustomTkinter', 'Desktop UI', 'SQLite / JSON Ledger'],
    summary:
      'A dedicated desktop application designed to streamline the logging, tracing, and claiming of misplaced items across university campus facilities, libraries, labs, and sports complexes.',
    keyFeatures: [
      'Modern, high-DPI desktop interface designed with CustomTkinter',
      'Rapid full-text search and multi-criteria filters (date, building, category)',
      'Secure claiming workflow with claimant verification notes and audit records',
      'Zero external cloud dependencies for quick offline deployment by facility desk staff'
    ],
    architecture:
      'Built purely with Python and CustomTkinter, leveraging modular object-oriented classes for view controllers, data persistence, and state management.',
    githubUrl: 'https://github.com'
  },
  optimizer: {
    title: 'Campus Resource Optimizer',
    tagline: 'Predictive Allocation System Powered by Random Forest Regression',
    stack: ['Python', 'Machine Learning', 'Random Forest', 'Scikit-learn', 'Pandas'],
    summary:
      'An analytical engineering project utilizing ensemble machine learning to forecast campus utility consumption, computing lab demand, and departmental resource constraints to prevent bottlenecking.',
    keyFeatures: [
      'Random Forest Regressor trained on academic timetable schedules, seasonal climate, and student density',
      'Multi-departmental demand prediction achieving high variance explanation (R² > 0.88)',
      'Actionable recommendations for smart HVAC and laboratory electrical scheduling',
      'Comprehensive comparative analysis against linear regression and decision tree baselines'
    ],
    architecture:
      'End-to-end data pipeline implemented in Python with Pandas and Scikit-learn, featuring cross-validated hyperparameter tuning and model export routines.',
    githubUrl: 'https://github.com'
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalInnerContent = document.getElementById('modal-inner-content');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  if (!modal || !modalInnerContent) return;

  function openModal(projectId) {
    const data = PROJECT_DATA[projectId];
    if (!data) return;

    modalInnerContent.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-secondary); font-weight: 600; text-transform: uppercase;">Project Deep Dive</span>
        <h2 id="modal-title" style="font-size: 1.8rem; margin: 0.25rem 0 0.5rem 0;">${data.title}</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5;">${data.tagline}</p>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 1.5rem;">
        ${data.stack.map(tag => `<span class="tag-pill"><span class="tag-hash">#</span>${tag}</span>`).join('')}
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--text-primary);">Overview</h4>
        <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${data.summary}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1.05rem; margin-bottom: 0.65rem; color: var(--text-primary);">Key Architectural Highlights</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
          ${data.keyFeatures.map(item => `
            <li style="font-size: 0.88rem; color: var(--text-secondary); position: relative; padding-left: 1.25rem; line-height: 1.5;">
              <span style="position: absolute; left: 0; color: var(--accent-secondary); font-size: 0.9rem;">▹</span>
              ${item}
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--text-primary);">Technical Implementation</h4>
        <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${data.architecture}</p>
      </div>

      <div style="display: flex; gap: 1rem; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
        <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <span>View Source Repository</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project');
      openModal(id);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. Contact Form Validation & Toast Notification
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const messageInput = document.getElementById('form-message');
  const submitBtn = document.getElementById('contact-submit-btn');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  if (!form) return;

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).trim().toLowerCase());
  }

  function clearError(input, errorEl) {
    if (input) input.classList.remove('input-error');
    if (errorEl) errorEl.textContent = '';
  }

  function setError(input, errorEl, message) {
    if (input) input.classList.add('input-error');
    if (errorEl) errorEl.textContent = message;
  }

  // Live input cleanup on user typing
  [nameInput, emailInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      if (input === nameInput) clearError(nameInput, nameError);
      if (input === emailInput) clearError(emailInput, emailError);
      if (input === messageInput) clearError(messageInput, messageError);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      setError(nameInput, nameError, 'Please enter your name.');
      isValid = false;
    } else if (nameVal.length < 2) {
      setError(nameInput, nameError, 'Name must be at least 2 characters.');
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // Validate Email
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (!emailVal) {
      setError(emailInput, emailError, 'Please enter your email address.');
      isValid = false;
    } else if (!validateEmail(emailVal)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // Validate Message
    const messageVal = messageInput ? messageInput.value.trim() : '';
    if (!messageVal) {
      setError(messageInput, messageError, 'Please enter your message.');
      isValid = false;
    } else if (messageVal.length < 10) {
      setError(messageInput, messageError, 'Message must be at least 10 characters.');
      isValid = false;
    } else {
      clearError(messageInput, messageError);
    }

    if (!isValid) return;

    // Simulate submission state
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }

      // Reset form fields
      form.reset();

      // Show toast notification
      showToast('Message Sent Successfully!', `Thank you ${nameVal}, Anand will respond to your message shortly.`);
    }, 1100);
  });
}

function showToast(title, description) {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');

  if (!toast) return;

  if (toastTitle && title) toastTitle.textContent = title;
  if (toastDesc && description) toastDesc.textContent = description;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   7. Footer Dynamic Year
   ========================================================================== */
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
