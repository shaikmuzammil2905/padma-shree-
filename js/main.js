/**
 * PADMASRI GLOBAL EXPORTS & ENTERPRISES
 * Interactive Logic, RFQ Estimator, Modals & WhatsApp Trade Desk
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollEffects();
  initProductTabs();
  initRfqCalculator();
  initModals();
  initContactForm();
  initGrandShowcase();
});

/* Mobile Menu Toggle - Immediate 0ms Touch Response */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    let lastActionTime = 0;

    const toggleMenu = (e) => {
      const now = Date.now();
      if (now - lastActionTime < 200) return; // Debounce rapid multi-events
      lastActionTime = now;

      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      document.body.classList.toggle('mobile-menu-active', isOpen);
      toggleBtn.innerHTML = isOpen ? '<i class="fa fa-times"></i>' : '<i class="fa fa-bars"></i>';
      toggleBtn.setAttribute('aria-expanded', isOpen);
    };

    // Fast pointerdown for immediate 0ms reaction on mobile screens
    toggleBtn.addEventListener('pointerdown', toggleMenu, { passive: false });
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (Date.now() - lastActionTime > 200) toggleMenu(e);
    });

    // Close when tapping outside
    document.addEventListener('pointerdown', (e) => {
      if (navMenu.classList.contains('open') && !toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        document.body.classList.remove('mobile-menu-active');
        toggleBtn.innerHTML = '<i class="fa fa-bars"></i>';
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on link click immediately
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        document.body.classList.remove('mobile-menu-active');
        toggleBtn.innerHTML = '<i class="fa fa-bars"></i>';
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* Scroll Effects & Back-to-Top Button */
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.float-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header styling
    if (header) {
      if (scrollY > 50) {
        header.style.boxShadow = '0 10px 25px -5px rgba(10, 37, 64, 0.15)';
      } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* Product Category Filter Tabs */
function initProductTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (!tabButtons.length || !productCards.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetCategory = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* RFQ (Request For Quotation) Live Calculator & Message Builder */
function initRfqCalculator() {
  const rfqProduct = document.getElementById('rfq-product');
  const rfqQty = document.getElementById('rfq-quantity');
  const rfqUnit = document.getElementById('rfq-unit');
  const rfqIncoterm = document.getElementById('rfq-incoterm');
  const rfqPort = document.getElementById('rfq-port');
  const rfqSummaryProduct = document.getElementById('summary-product');
  const rfqSummaryVolume = document.getElementById('summary-volume');
  const rfqSummaryTerms = document.getElementById('summary-terms');
  const rfqSummaryPort = document.getElementById('summary-port');

  function updateRfqSummary() {
    if (rfqSummaryProduct && rfqProduct) {
      rfqSummaryProduct.textContent = rfqProduct.options[rfqProduct.selectedIndex]?.text || 'Kewda Ruh & Extracts';
    }
    if (rfqSummaryVolume && rfqQty && rfqUnit) {
      rfqSummaryVolume.textContent = `${rfqQty.value || '1'} ${rfqUnit.value}`;
    }
    if (rfqSummaryTerms && rfqIncoterm) {
      rfqSummaryTerms.textContent = rfqIncoterm.value;
    }
    if (rfqSummaryPort && rfqPort) {
      rfqSummaryPort.textContent = rfqPort.value || 'Jebel Ali / Dubai (Default)';
    }
  }

  // Bind change listeners
  [rfqProduct, rfqQty, rfqUnit, rfqIncoterm, rfqPort].forEach(el => {
    if (el) {
      el.addEventListener('input', updateRfqSummary);
      el.addEventListener('change', updateRfqSummary);
    }
  });

  // Initial calculation
  updateRfqSummary();

  // RFQ Submission via WhatsApp
  const rfqForm = document.getElementById('rfq-calculator-form');
  if (rfqForm) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rfq-name')?.value || 'Trade Partner';
      const company = document.getElementById('rfq-company')?.value || 'Import Firm';
      const email = document.getElementById('rfq-email')?.value || 'Not provided';
      const product = rfqProduct?.options[rfqProduct.selectedIndex]?.text || 'Commodity Export';
      const quantity = `${rfqQty?.value || '1'} ${rfqUnit?.value || 'MT'}`;
      const incoterm = rfqIncoterm?.value || 'CIF';
      const destination = rfqPort?.value || 'Destination Port';
      const notes = document.getElementById('rfq-notes')?.value || 'Requesting earliest availability and price quotation.';

      const waMessage = `*EXPORT RFQ INQUIRY - PADMASRI GLOBAL EXPORTS*%0A%0A` +
        `👤 *Buyer Name:* ${encodeURIComponent(name)}%0A` +
        `🏢 *Company:* ${encodeURIComponent(company)}%0A` +
        `📧 *Email:* ${encodeURIComponent(email)}%0A%0A` +
        `📦 *Selected Commodity:* ${encodeURIComponent(product)}%0A` +
        `⚖️ *Order Volume:* ${encodeURIComponent(quantity)}%0A` +
        `🚢 *Incoterms:* ${encodeURIComponent(incoterm)}%0A` +
        `📍 *Destination Port:* ${encodeURIComponent(destination)}%0A` +
        `📝 *Additional Specs:* ${encodeURIComponent(notes)}%0A%0A` +
        `_Sent via Padmasri Global Exports Trade Portal_`;

      const targetPhone = '919114477616';
      const waUrl = `https://wa.me/${targetPhone}?text=${waMessage}`;

      showToast('Opening Trade Desk on WhatsApp...', 'success');
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 700);
    });
  }
}

/* Modals Management (RFQ Modal & Technical Spec Modal) */
const productSpecsData = {
  kewda: {
    title: 'Ganjam Kewda Ruh (Pandanus fascicularis)',
    subtitle: 'GI Tag Registered • 100% Traditional Hydro-Distilled Extract',
    image: 'assets/images/kewda-ruh.jpg',
    origin: 'Chikiti / Surula, Ganjam District, Odisha - 761009',
    description: '100% pure hydro-distilled Pandanus extract harvested from the coastal plantations of Chikiti, Ganjam, Odisha. Traditional copper deg-bhapka artisan distillation yielding pure natural floral essence with high phenyl ethyl methyl ether content. Worldwide export grade in UN certified containers.',
    specs: [
      { label: 'Botanical Name', val: 'Pandanus fascicularis / odoratissimus' },
      { label: 'Origin GI Certificate', val: 'Ganjam Kewda Flower (Odisha GI Tagged)' },
      { label: 'CAS Registry No.', val: '93455-95-9' },
      { label: 'Distillation Process', val: 'Traditional Hydro-distillation (Copper Deg & Bhapka)' },
      { label: 'Appearance & Odor', val: 'Pale yellow to deep golden, rich floral, honeyed green note' },
      { label: 'Specific Gravity', val: '0.920 – 0.950 at 25°C' },
      { label: 'Refractive Index', val: '1.485 – 1.515 at 20°C' },
      { label: 'Optical Rotation', val: '+1° to +5°' },
      { label: 'Solubility', val: '100% soluble in 90% ethanol and vegetable oils' },
      { label: 'Export Packaging', val: '1kg, 5kg, 10kg, 25kg Food-grade Aluminum Canisters & UN Barrels' }
    ],
    applications: 'Luxury perfumery & high-end attar crafting, gourmet culinary essence, premium cosmetics, mouth fresheners & tobacco blending.'
  },
  chicken: {
    title: 'Certified Frozen Halal Chicken & Poultry Cuts',
    subtitle: 'Grade-A Blast Frozen (-38°C) • HACCP & Halal Certified',
    image: 'assets/images/frozen-chicken.jpg',
    origin: 'Padmasri Cold-Chain Hub, Odisha, India',
    description: '100% Halal slaughtered whole chickens and calibrated cuts processed in modern biosecure abattoirs. Immediate -38°C contact blast freezing locks in natural moisture, color, and nutritional density with zero chemical injections or added water.',
    specs: [
      { label: 'Quality Grade', val: 'Grade A (Export Specification)' },
      { label: 'Certifications', val: 'Halal India, HACCP, ISO 22000:2018, FSSAI' },
      { label: 'Freezing Method', val: 'IQF Blast Frozen at -38°C, Stored at -18°C' },
      { label: 'Available Cuts', val: 'Whole Chicken (800g - 1400g), Boneless Breast, Drumsticks, Wings' },
      { label: 'Water Content', val: 'Less than 4% (Zero excessive moisture retention)' },
      { label: 'Salmonella & E.coli', val: 'Completely Absent (0 in 25g lab tested)' },
      { label: 'Shelf Life', val: '24 months at -18°C reefer condition' },
      { label: 'Container Load', val: '27-28 MT per 40ft High Cube Reefer Container' },
      { label: 'Packaging', val: '10kg / 15kg Heavy-duty corrugated export cartons with food-grade LDPE liners' }
    ],
    applications: 'Institutional catering, hospitality, supermarket retail chains, food processing industries worldwide.'
  },
  seafood: {
    title: 'Bay of Bengal Premium Marine Seafood & Black Tiger Prawns',
    subtitle: 'MPEDA & EIC Registered • Pristine Coastal Catch',
    image: 'assets/images/marine-seafood.jpg',
    origin: 'Odisha Marine Coast (Bay of Bengal belt)',
    description: 'Harvested directly from Odisha’s coastal Bay of Bengal waters. Featuring giant Black Tiger Shrimp (Penaeus monodon), Vannamei, Sea Bass (Bhetki), and Ribbon Fish. Rapid IQF blast frozen at sea to preserve pristine oceanic sweetness and firmness.',
    specs: [
      { label: 'Primary Species', val: 'Black Tiger Shrimp (Penaeus monodon), Vannamei, Sea Bass, Ribbon Fish' },
      { label: 'Size Grades', val: 'HOSO & HLSO 16/20, 21/25, 26/30, 31/40, 41/50 pcs/lb' },
      { label: 'Processing Types', val: 'Block Frozen, Semi-IQF, Individual Quick Frozen (IQF)' },
      { label: 'Chemical Residuals', val: 'Antibiotic-free, Chloramphenicol & Nitrofurans negative' },
      { label: 'Glaze Percentage', val: '0% - 20% customized according to buyer specifications' },
      { label: 'Reefer Storage Temp', val: '-18°C to -22°C with telemetry loggers' },
      { label: 'Export Certifications', val: 'MPEDA, Export Inspection Council (EIC), US FDA compliant' },
      { label: 'Master Carton', val: '6 x 2kg, 10 x 1kg, 10 x 2kg waxed master cartons' }
    ],
    applications: 'International seafood wholesalers, Japanese sashimi & culinary restaurants, European & GCC distributors.'
  },
  logistics: {
    title: 'Global Cold-Chain Reefer Logistics & Freight Solutions',
    subtitle: 'ISO 22000 Certified • Paradip & Visakhapatnam Port Gateways',
    image: 'assets/images/padmasri-export-hub.jpg',
    origin: 'Govindapur, Chikiti, Ganjam to Worldwide Ports',
    description: 'End-to-end refrigerated export logistics connecting eastern India’s deep sea ports directly to international hubs. Temperature-controlled multi-modal supply chains maintaining strict -18°C integrity from farm gate to discharge port.',
    specs: [
      { label: 'Container Fleet', val: '20ft & 40ft High-Cube Daikin / Carrier Reefer Units' },
      { label: 'Temperature Control', val: '-25°C to +15°C with digital telemetry & satellite GPS' },
      { label: 'Port Gateways', val: 'Paradip Port (Odisha) & Visakhapatnam Port (Andhra Pradesh)' },
      { label: 'Key Destinations', val: 'Jebel Ali (UAE), Jeddah (KSA), Singapore, Port Klang, Rotterdam, New York' },
      { label: 'Average Transit', val: 'Middle East: 6-8 days | Southeast Asia: 5-7 days | Europe: 22-26 days' },
      { label: 'Documentation', val: 'Phytosanitary, Health Cert, Bill of Lading, Certificate of Origin, SGS Inspection' },
      { label: 'Incoterms Available', val: 'CIF, FOB, CFR, EXW with flexible Irrevocable LC & TT terms' }
    ],
    applications: 'International import houses, bulk food distributors, pharmaceutical cold chain, institutional catering.'
  }
};

function initModals() {
  const modalOverlay = document.getElementById('spec-modal');
  const modalCloseBtn = document.querySelector('.modal-close');

  // Trigger modal when clicking "View Specifications" or clicking anywhere on product card
  document.querySelectorAll('[data-spec-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If user clicked an internal link or button with specific action, let it proceed
      if (e.target.closest('a[href^="#rfq"]') || e.target.closest('button[onclick*="selectRfq"]')) {
        return;
      }
      e.preventDefault();
      const productKey = btn.getAttribute('data-spec-trigger');
      const data = productSpecsData[productKey];

      if (data && modalOverlay) {
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-subtitle').textContent = data.subtitle;
        document.getElementById('modal-img').src = data.image;
        document.getElementById('modal-origin').textContent = data.origin;
        document.getElementById('modal-apps').textContent = data.applications;
        
        const descElem = document.getElementById('modal-desc');
        if (descElem && data.description) {
          descElem.textContent = data.description;
        }

        const tableBody = document.getElementById('modal-specs-table');
        if (tableBody) {
          tableBody.innerHTML = data.specs.map(s => `
            <tr>
              <td style="padding: 0.5rem 0.75rem; font-weight: 600; color: var(--slate-600); border-bottom: 1px solid var(--slate-200); width: 38%;">${s.label}</td>
              <td style="padding: 0.5rem 0.75rem; font-weight: 700; color: var(--slate-900); border-bottom: 1px solid var(--slate-200);">${s.val}</td>
            </tr>
          `).join('');
        }

        // WhatsApp inquiry button inside modal
        const modalWaBtn = document.getElementById('modal-wa-btn');
        if (modalWaBtn) {
          modalWaBtn.href = `https://wa.me/919114477616?text=${encodeURIComponent('Hello Padmasri Global Exports, I would like to receive the full specifications and quote for ' + data.title)}`;
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal
  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* Contact Form Validation and WhatsApp Forwarding */
function initContactForm() {
  const contactForm = document.getElementById('contact-us-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const phone = document.getElementById('contact-phone')?.value.trim();
    const subject = document.getElementById('contact-subject')?.value.trim();
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const tradeMsg = `*NEW CONTACT INQUIRY - PADMASRI GLOBAL EXPORTS*%0A%0A` +
      `👤 *Name:* ${encodeURIComponent(name)}%0A` +
      `📧 *Email:* ${encodeURIComponent(email)}%0A` +
      `📞 *Phone:* ${encodeURIComponent(phone || 'N/A')}%0A` +
      `🏷️ *Subject:* ${encodeURIComponent(subject || 'General Inquiry')}%0A%0A` +
      `💬 *Message:*%0A${encodeURIComponent(message)}%0A%0A` +
      `_Submitted via Padmasri Website Contact Form_`;

    showToast('Inquiry sent successfully! Connecting to WhatsApp...', 'success');
    contactForm.reset();

    setTimeout(() => {
      window.open(`https://wa.me/919114477616?text=${tradeMsg}`, '_blank');
    }, 900);
  });
}

/* Toast Notification Utility */
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  toast.innerHTML = `<i class="fa ${icon}"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* Grand Side-Slide Showcase & Viewport Observer */
function initGrandShowcase() {
  const showcaseVisuals = document.querySelectorAll('.grand-slide-entry');

  if (showcaseVisuals.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            entry.target.classList.add('js-ready');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

      showcaseVisuals.forEach(visual => {
        visual.classList.add('js-ready');
        observer.observe(visual);
      });
    } else {
      showcaseVisuals.forEach(visual => visual.classList.add('in-view'));
    }
  }

  // Interactive Grand Slider
  const track = document.getElementById('grand-slider-track');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');
  const dots = document.querySelectorAll('.grand-dot');

  if (!track) return;

  const slides = track.querySelectorAll('.grand-slide');
  const totalSlides = slides.length;
  if (totalSlides <= 1) return;

  let currentIndex = 0;
  let autoSlideTimer = null;

  function updateSlider(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    updateSlider(currentIndex + 1);
  }

  function prevSlide() {
    updateSlider(currentIndex - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(nextSlide, 5200);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const slideIdx = parseInt(dot.getAttribute('data-slide'), 10) || 0;
      updateSlider(slideIdx);
      startAutoSlide();
    });
  });

  // Touch Swipe for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoSlide();
  }, { passive: true });

  // Pause on hover
  const frame = track.closest('.about-image-main');
  if (frame) {
    frame.addEventListener('mouseenter', stopAutoSlide);
    frame.addEventListener('mouseleave', startAutoSlide);
  }

  startAutoSlide();
}

