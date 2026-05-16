import JSZip from 'jszip';
import type { PageConfig } from '@/types/config.types';

/**
 * Generate a complete standalone HTML file from page configuration
 */
export const generateHTML = (config: PageConfig): string => {
  const { metadata, seo, sections } = config;

  // Generate HTML for all sections
  const sectionsHTML = sections
    .sort((a, b) => a.order - b.order)
    .map((section) => generateSectionHTML(section))
    .join('\n');

  // Generate WhatsApp widget HTML if enabled
  const whatsappHTML = config.whatsapp?.enabled
    ? generateWhatsAppWidget(config.whatsapp)
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seo.title || metadata.projectName}</title>
  <meta name="description" content="${seo.description || ''}">
  <meta name="keywords" content="${seo.keywords?.join(', ') || ''}">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>">

  <style>
    ${generateCSS()}
  </style>
</head>
<body>
  ${sectionsHTML}
  ${whatsappHTML}

  <script>
    ${generateJavaScript()}
  </script>
</body>
</html>`;
};

/**
 * Generate section HTML based on type
 */
const generateSectionHTML = (section: any): string => {
  const { type, props } = section;

  switch (type) {
    case 'HeroSection':
      return generateHeroSection(props);
    case 'AboutSection':
      return generateAboutSection(props);
    case 'ServicesSection':
      return generateServicesSection(props);
    case 'GallerySection':
      return generateGallerySection(props);
    case 'MenuSection':
      return generateMenuSection(props);
    case 'TestimonialsSection':
      return generateTestimonialsSection(props);
    case 'OfferSection':
      return generateOffersSection(props);
    case 'CTASection':
      return generateCTASection(props);
    case 'FooterSection':
      return generateFooterSection(props);
    case 'CardSection':
      return generateCardSection(props);
    case 'StatsSection':
      return generateStatsSection(props);
    case 'CategorySection':
      return generateCategorySection(props);
    case 'ProfileSection':
      return generateProfileSection(props);
    case 'PricingSection':
      return generatePricingSection(props);
    case 'FAQSection':
      return generateFAQSection(props);
    case 'TimelineSection':
      return generateTimelineSection(props);
    case 'FeatureSection':
      return generateFeatureSection(props);
    case 'JobBoardSection':
      return generateJobBoardSection(props);
    default:
      return '';
  }
};

const generateHeroSection = (props: any): string => {
  const {
    heading = 'Welcome',
    subheading = 'Your journey starts here',
    ctaText = 'Get Started',
    ctaLink = '#',
    backgroundImage = '',
    backgroundColor = '#1e293b',
    textColor = '#ffffff',
    overlayOpacity = 0.5,
  } = props;

  return `
  <section class="hero-section" style="background-color: ${backgroundColor}; background-image: url('${backgroundImage}'); color: ${textColor};">
    <div class="overlay" style="opacity: ${overlayOpacity};"></div>
    <div class="hero-content">
      <h1 class="animate-fade-in">${heading}</h1>
      <p class="animate-fade-in-delay">${subheading}</p>
      <a href="${ctaLink}" class="cta-button animate-fade-in-delay-2">${ctaText}</a>
    </div>
  </section>`;
};

const generateAboutSection = (props: any): string => {
  const {
    heading = 'About Us',
    description = '',
    image = '',
    imagePosition = 'right',
    backgroundColor = '#ffffff',
  } = props;

  const imageFirst = imagePosition === 'left';

  return `
  <section class="about-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="about-grid ${imageFirst ? 'reverse' : ''}">
        <div class="about-text animate-on-scroll">
          <h2>${heading}</h2>
          <p>${description}</p>
        </div>
        <div class="about-image animate-on-scroll-delay">
          ${image ? `<img src="${image}" alt="${heading}">` : '<div class="placeholder-image">📷</div>'}
        </div>
      </div>
    </div>
  </section>`;
};

const generateServicesSection = (props: any): string => {
  const {
    heading = 'Our Services',
    subheading = '',
    services = [],
    backgroundColor = '#f8fafc',
    columns = 3,
  } = props;

  const servicesHTML = services
    .map(
      (service: any, index: number) => `
    <div class="service-card animate-on-scroll" style="animation-delay: ${index * 0.1}s;">
      <div class="service-icon">${service.icon || '⚙️'}</div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    </div>
  `
    )
    .join('');

  return `
  <section class="services-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      <div class="services-grid cols-${columns}">
        ${servicesHTML}
      </div>
    </div>
  </section>`;
};

const generateGallerySection = (props: any): string => {
  const {
    heading = 'Gallery',
    subheading = '',
    images = [],
    backgroundColor = '#ffffff',
    columns = 3,
  } = props;

  const imagesHTML = images
    .map(
      (img: any, index: number) => `
    <div class="gallery-item animate-on-scroll" style="animation-delay: ${index * 0.05}s;">
      <img src="${img.url}" alt="${img.alt || ''}" loading="lazy">
      ${img.caption ? `<div class="gallery-caption">${img.caption}</div>` : ''}
    </div>
  `
    )
    .join('');

  return `
  <section class="gallery-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      <div class="gallery-grid cols-${columns}">
        ${imagesHTML}
      </div>
    </div>
  </section>`;
};

const generateMenuSection = (props: any): string => {
  const {
    heading = 'Our Menu',
    subheading = '',
    menuItems = [],
    categories = ['All'],
    backgroundColor = '#ffffff',
  } = props;

  const categoriesHTML = categories
    .map(
      (cat: string) => `
    <button class="category-btn" data-category="${cat}">${cat}</button>
  `
    )
    .join('');

  const menuHTML = menuItems
    .map(
      (item: any) => `
    <div class="menu-item animate-on-scroll" data-category="${item.category}">
      ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<div class="menu-placeholder">🍽️</div>'}
      <div class="menu-info">
        <div class="menu-header">
          <h3>${item.name}</h3>
          <span class="price">${item.price}</span>
        </div>
        <p>${item.description}</p>
      </div>
    </div>
  `
    )
    .join('');

  return `
  <section class="menu-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      <div class="category-filters">
        ${categoriesHTML}
      </div>
      <div class="menu-grid">
        ${menuHTML}
      </div>
    </div>
  </section>`;
};

const generateTestimonialsSection = (props: any): string => {
  const {
    heading = 'Testimonials',
    subheading = '',
    testimonials = [],
    backgroundColor = '#f8fafc',
  } = props;

  const testimonialsHTML = testimonials
    .map(
      (testimonial: any, index: number) => `
    <div class="testimonial-card animate-on-scroll" style="animation-delay: ${index * 0.1}s;">
      <div class="stars">${'⭐'.repeat(testimonial.rating || 5)}</div>
      <p class="testimonial-text">"${testimonial.review}"</p>
      <div class="testimonial-author">
        ${
          testimonial.photo
            ? `<img src="${testimonial.photo}" alt="${testimonial.name}">`
            : `<div class="author-initial">${testimonial.name.charAt(0)}</div>`
        }
        <div>
          <h4>${testimonial.name}</h4>
          ${testimonial.position ? `<p>${testimonial.position}</p>` : ''}
        </div>
      </div>
    </div>
  `
    )
    .join('');

  return `
  <section class="testimonials-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      <div class="testimonials-grid">
        ${testimonialsHTML}
      </div>
    </div>
  </section>`;
};

const generateOffersSection = (props: any): string => {
  const {
    heading = 'Special Offers',
    subheading = '',
    offers = [],
    backgroundColor = '#ffffff',
  } = props;

  const offersHTML = offers
    .map(
      (offer: any, index: number) => `
    <div class="offer-card animate-on-scroll" style="animation-delay: ${index * 0.1}s;">
      ${offer.image ? `<img src="${offer.image}" alt="${offer.title}">` : '<div class="offer-placeholder">🎁</div>'}
      ${offer.discount ? `<div class="offer-badge">${offer.discount}</div>` : ''}
      <div class="offer-content">
        <h3>${offer.title}</h3>
        <p>${offer.description}</p>
        ${offer.validUntil ? `<p class="offer-validity">Valid until ${offer.validUntil}</p>` : ''}
      </div>
    </div>
  `
    )
    .join('');

  return `
  <section class="offers-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      <div class="offers-grid">
        ${offersHTML}
      </div>
    </div>
  </section>`;
};

const generateCTASection = (props: any): string => {
  const {
    heading = 'Ready to Get Started?',
    description = '',
    ctaText = 'Contact Us',
    ctaLink = '#',
    backgroundImage = '',
    backgroundColor = '#1e40af',
    textColor = '#ffffff',
  } = props;

  return `
  <section class="cta-section" style="background-color: ${backgroundColor}; background-image: url('${backgroundImage}'); color: ${textColor};">
    <div class="overlay"></div>
    <div class="cta-content">
      <h2 class="animate-fade-in">${heading}</h2>
      <p class="animate-fade-in-delay">${description}</p>
      <a href="${ctaLink}" class="cta-button animate-fade-in-delay-2">${ctaText}</a>
    </div>
  </section>`;
};

const generateFooterSection = (props: any): string => {
  const {
    businessName = 'Your Business',
    tagline = '',
    address = '',
    phone = '',
    email = '',
    socialLinks = [],
    backgroundColor = '#1f2937',
    textColor = '#ffffff',
  } = props;

  const socialHTML = socialLinks
    .map(
      (social: any) => `
    <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="social-link">
      ${social.icon || social.platform}
    </a>
  `
    )
    .join('');

  return `
  <footer class="footer-section" style="background-color: ${backgroundColor}; color: ${textColor};">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h3>${businessName}</h3>
          ${tagline ? `<p>${tagline}</p>` : ''}
          ${socialLinks.length > 0 ? `<div class="social-links">${socialHTML}</div>` : ''}
        </div>
        <div class="footer-contact">
          <h4>Contact Us</h4>
          ${address ? `<p>📍 ${address}</p>` : ''}
          ${phone ? `<p>📞 ${phone}</p>` : ''}
          ${email ? `<p>📧 ${email}</p>` : ''}
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
      </div>
    </div>
  </footer>`;
};

const generateCardSection = (props: any): string => {
  const { heading = 'Cards', subheading = '', cards = [], backgroundColor = '#ffffff', columns = 3 } = props;
  const cardsHTML = cards.map((card: any, i: number) => `
    <div class="service-card animate-on-scroll" style="animation-delay: ${i * 0.1}s;">
      ${card.image ? `<img src="${card.image}" alt="${card.title}" style="width:100%;height:200px;object-fit:cover;border-radius:8px 8px 0 0;">` : ''}
      ${card.badge ? `<span style="display:inline-block;background:#3b82f6;color:#fff;padding:4px 12px;border-radius:50px;font-size:0.75rem;font-weight:600;margin-bottom:0.5rem;">${card.badge}</span>` : ''}
      <div class="service-icon">${card.icon || ''}</div>
      <h3>${card.title}</h3>
      <p>${card.description}</p>
      ${card.price ? `<p class="price">${card.price}</p>` : ''}
      ${card.linkText ? `<a href="${card.link || '#'}" class="cta-button" style="margin-top:1rem;font-size:0.9rem;padding:0.5rem 1.5rem;">${card.linkText}</a>` : ''}
    </div>`).join('');
  return `
  <section class="services-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      <div class="services-grid cols-${columns}">${cardsHTML}</div>
    </div>
  </section>`;
};

const generateStatsSection = (props: any): string => {
  const { heading = '', subheading = '', stats = [], backgroundColor = '#f8fafc', columns = 4 } = props;
  const statsHTML = stats.map((stat: any, i: number) => `
    <div class="service-card animate-on-scroll" style="animation-delay: ${i * 0.1}s;text-align:center;">
      ${stat.icon ? `<div class="service-icon">${stat.icon}</div>` : ''}
      <h3 style="font-size:2.5rem;color:#3b82f6;">${stat.prefix || ''}${stat.value}${stat.suffix || ''}</h3>
      <p>${stat.label}</p>
    </div>`).join('');
  return `
  <section class="services-section" style="background-color: ${backgroundColor};">
    <div class="container">
      ${heading ? `<div class="section-header">${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}<h2>${heading}</h2></div>` : ''}
      <div class="services-grid cols-${columns}">${statsHTML}</div>
    </div>
  </section>`;
};

const generateCategorySection = (props: any): string => {
  const { heading = 'Categories', subheading = '', categories = [], backgroundColor = '#ffffff' } = props;
  const catsHTML = categories.map((cat: any, i: number) => `
    <button class="category-btn animate-on-scroll" style="animation-delay: ${i * 0.05}s;${cat.color ? `background:${cat.color};color:#fff;` : ''}">
      ${cat.icon || ''} ${cat.label}${cat.count != null ? ` (${cat.count})` : ''}
    </button>`).join('');
  return `
  <section class="menu-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      <div class="category-filters">${catsHTML}</div>
    </div>
  </section>`;
};

const generateProfileSection = (props: any): string => {
  const { heading = 'Our Team', subheading = '', profiles = [], backgroundColor = '#ffffff', columns = 3 } = props;
  const profilesHTML = profiles.map((p: any, i: number) => `
    <div class="testimonial-card animate-on-scroll" style="animation-delay: ${i * 0.1}s;text-align:center;">
      ${p.photo ? `<img src="${p.photo}" alt="${p.name}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;margin:0 auto 1rem;">` : `<div class="author-initial" style="width:100px;height:100px;font-size:2.5rem;margin:0 auto 1rem;">${p.name.charAt(0)}</div>`}
      <h3 style="margin-bottom:0.25rem;">${p.name}</h3>
      <p style="color:#3b82f6;font-weight:600;margin-bottom:0.75rem;">${p.role}</p>
      ${p.bio ? `<p style="color:#6b7280;font-size:0.9rem;">${p.bio}</p>` : ''}
      ${p.rating ? `<div class="stars">${'⭐'.repeat(p.rating)}</div>` : ''}
    </div>`).join('');
  return `
  <section class="testimonials-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      <div class="services-grid cols-${columns}">${profilesHTML}</div>
    </div>
  </section>`;
};

const generatePricingSection = (props: any): string => {
  const { heading = 'Pricing', subheading = '', plans = [], backgroundColor = '#f8fafc' } = props;
  const plansHTML = plans.map((plan: any, i: number) => `
    <div class="service-card animate-on-scroll" style="animation-delay: ${i * 0.1}s;text-align:center;${plan.recommended ? 'border:2px solid #3b82f6;transform:scale(1.05);' : ''}">
      ${plan.recommended ? '<span style="display:inline-block;background:#3b82f6;color:#fff;padding:4px 16px;border-radius:50px;font-size:0.75rem;font-weight:600;margin-bottom:1rem;">Recommended</span>' : ''}
      <h3>${plan.name}</h3>
      <p style="font-size:2.5rem;font-weight:700;color:#1f2937;margin:1rem 0;">${plan.price}<span style="font-size:1rem;color:#6b7280;">/${plan.period || 'mo'}</span></p>
      ${plan.description ? `<p style="color:#6b7280;margin-bottom:1.5rem;">${plan.description}</p>` : ''}
      <ul style="list-style:none;padding:0;text-align:left;margin-bottom:1.5rem;">
        ${plan.features.map((f: string) => `<li style="padding:0.5rem 0;border-bottom:1px solid #e5e7eb;">✓ ${f}</li>`).join('')}
      </ul>
      <a href="${plan.ctaLink || '#'}" class="cta-button" style="width:100%;text-align:center;display:block;">${plan.ctaText || 'Get Started'}</a>
    </div>`).join('');
  return `
  <section class="services-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      <div class="services-grid cols-${plans.length > 3 ? 4 : plans.length}">${plansHTML}</div>
    </div>
  </section>`;
};

const generateFAQSection = (props: any): string => {
  const { heading = 'FAQ', subheading = '', faqs = [], backgroundColor = '#ffffff' } = props;
  const faqsHTML = faqs.map((faq: any, i: number) => `
    <div class="faq-item animate-on-scroll" style="animation-delay: ${i * 0.05}s;border:1px solid #e5e7eb;border-radius:12px;padding:1.5rem;margin-bottom:1rem;cursor:pointer;" onclick="this.classList.toggle('open');this.querySelector('.faq-answer').style.display=this.classList.contains('open')?'block':'none';">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="font-size:1.1rem;color:#1f2937;">${faq.question}</h3>
        <span style="font-size:1.5rem;color:#6b7280;transition:transform 0.3s;">+</span>
      </div>
      <div class="faq-answer" style="display:none;margin-top:1rem;color:#6b7280;line-height:1.8;">${faq.answer}</div>
    </div>`).join('');
  return `
  <section style="padding:80px 20px;background-color:${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      ${faqsHTML}
    </div>
  </section>`;
};

const generateTimelineSection = (props: any): string => {
  const { heading = 'Timeline', subheading = '', items = [], backgroundColor = '#f8fafc' } = props;
  const itemsHTML = items.map((item: any, i: number) => `
    <div class="animate-on-scroll" style="animation-delay: ${i * 0.1}s;display:flex;gap:2rem;margin-bottom:2rem;">
      <div style="flex-shrink:0;width:80px;text-align:center;">
        ${item.year ? `<span style="display:inline-block;background:#3b82f6;color:#fff;padding:4px 12px;border-radius:50px;font-size:0.85rem;font-weight:600;">${item.year}</span>` : ''}
        ${item.icon ? `<div style="font-size:2rem;margin-top:0.5rem;">${item.icon}</div>` : ''}
      </div>
      <div style="flex:1;background:#fff;padding:1.5rem;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.1);">
        <h3 style="color:#1f2937;margin-bottom:0.5rem;">${item.title}</h3>
        <p style="color:#6b7280;">${item.description}</p>
        ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width:100%;border-radius:8px;margin-top:1rem;">` : ''}
      </div>
    </div>`).join('');
  return `
  <section style="padding:80px 20px;background-color:${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      ${itemsHTML}
    </div>
  </section>`;
};

const generateFeatureSection = (props: any): string => {
  const { heading = 'Features', subheading = '', features = [], backgroundColor = '#ffffff', columns = 3 } = props;
  const featuresHTML = features.map((f: any, i: number) => `
    <div class="service-card animate-on-scroll" style="animation-delay: ${i * 0.1}s;">
      <div class="service-icon">${f.icon || '⚡'}</div>
      <h3>${f.title}</h3>
      <p>${f.description}</p>
      ${f.link ? `<a href="${f.link}" style="color:#3b82f6;font-weight:600;text-decoration:none;margin-top:1rem;display:inline-block;">Learn more →</a>` : ''}
    </div>`).join('');
  return `
  <section class="services-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      <div class="services-grid cols-${columns}">${featuresHTML}</div>
    </div>
  </section>`;
};

const generateJobBoardSection = (props: any): string => {
  const { heading = 'Open Positions', subheading = '', jobs = [], backgroundColor = '#f8fafc' } = props;
  const jobsHTML = jobs.map((job: any, i: number) => `
    <div class="menu-item animate-on-scroll" style="animation-delay: ${i * 0.1}s;">
      ${job.logo ? `<img src="${job.logo}" alt="${job.company}" style="width:80px;height:80px;object-fit:contain;padding:1rem;">` : `<div class="menu-placeholder" style="width:80px;height:80px;font-size:2rem;">💼</div>`}
      <div class="menu-info">
        <div class="menu-header">
          <div>
            <h3>${job.title}</h3>
            <p style="color:#6b7280;font-size:0.85rem;">${job.company} · ${job.location}</p>
          </div>
          ${job.salary ? `<span class="price">${job.salary}</span>` : ''}
        </div>
        <p style="margin-top:0.5rem;">${job.description}</p>
        <div style="margin-top:0.75rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
          <span class="category-btn" style="font-size:0.75rem;padding:4px 10px;">${job.jobType}</span>
          <span class="category-btn" style="font-size:0.75rem;padding:4px 10px;">${job.workMode}</span>
          ${(job.tags || []).map((t: string) => `<span class="category-btn" style="font-size:0.75rem;padding:4px 10px;">${t}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');
  return `
  <section class="menu-section" style="background-color: ${backgroundColor};">
    <div class="container">
      <div class="section-header">
        ${subheading ? `<p class="section-subheading">${subheading}</p>` : ''}
        <h2>${heading}</h2>
      </div>
      <div class="menu-grid">${jobsHTML}</div>
    </div>
  </section>`;
};

const generateWhatsAppWidget = (whatsapp: any): string => {
  return `
  <a href="https://wa.me/${whatsapp.phoneNumber}?text=${encodeURIComponent(whatsapp.defaultMessage || 'Hello!')}"
     class="whatsapp-widget ${whatsapp.position || 'bottom-right'}"
     target="_blank"
     rel="noopener noreferrer"
     aria-label="Chat on WhatsApp">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>`;
};

const generateCSS = (): string => {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      overflow-x: hidden;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Hero Section */
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background-size: cover;
      background-position: center;
      text-align: center;
      padding: 60px 20px;
    }

    .hero-section .overlay {
      position: absolute;
      inset: 0;
      background: #000;
    }

    .hero-content {
      position: relative;
      z-index: 10;
      max-width: 800px;
    }

    .hero-content h1 {
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    .hero-content p {
      font-size: clamp(1rem, 2vw, 1.5rem);
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-button {
      display: inline-block;
      padding: 1rem 2.5rem;
      background: #fff;
      color: #1e293b;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    /* Section Header */
    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-subheading {
      color: #3b82f6;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .section-header h2 {
      font-size: clamp(1.8rem, 4vw, 3rem);
      font-weight: 700;
      color: #1f2937;
    }

    /* About Section */
    .about-section {
      padding: 80px 20px;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      align-items: center;
    }

    @media (min-width: 768px) {
      .about-grid {
        grid-template-columns: 1fr 1fr;
      }

      .about-grid.reverse {
        direction: rtl;
      }

      .about-grid.reverse > * {
        direction: ltr;
      }
    }

    .about-text h2 {
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      margin-bottom: 1.5rem;
      color: #1f2937;
    }

    .about-text p {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #4b5563;
    }

    .about-image img {
      width: 100%;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .placeholder-image {
      width: 100%;
      height: 400px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 5rem;
    }

    /* Services Section */
    .services-section {
      padding: 80px 20px;
    }

    .services-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .services-grid.cols-2 {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .services-grid.cols-3 {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .services-grid.cols-4 {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    .service-card {
      background: #fff;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      text-align: center;
    }

    .service-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    .service-icon {
      font-size: 3.5rem;
      margin-bottom: 1rem;
    }

    .service-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #1f2937;
    }

    .service-card p {
      color: #6b7280;
      line-height: 1.6;
    }

    /* Gallery Section */
    .gallery-section {
      padding: 80px 20px;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .gallery-grid.cols-2 {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .gallery-grid.cols-3 {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .gallery-grid.cols-4 {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    .gallery-item {
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }

    .gallery-item img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .gallery-item:hover img {
      transform: scale(1.1);
    }

    .gallery-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
      color: white;
      padding: 1.5rem 1rem 1rem;
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }

    .gallery-item:hover .gallery-caption {
      transform: translateY(0);
    }

    /* Menu Section */
    .menu-section {
      padding: 80px 20px;
    }

    .category-filters {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .category-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 50px;
      background: #e5e7eb;
      color: #374151;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .category-btn.active,
    .category-btn:hover {
      background: #3b82f6;
      color: white;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .menu-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .menu-item {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 1.5rem;
      transition: all 0.3s ease;
    }

    .menu-item:hover {
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
    }

    .menu-item img,
    .menu-placeholder {
      width: 150px;
      height: 150px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .menu-placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
    }

    .menu-info {
      padding: 1.5rem 1.5rem 1.5rem 0;
      flex: 1;
    }

    .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.5rem;
      gap: 1rem;
    }

    .menu-item h3 {
      font-size: 1.25rem;
      color: #1f2937;
    }

    .price {
      color: #3b82f6;
      font-weight: 700;
      font-size: 1.25rem;
      white-space: nowrap;
    }

    .menu-item p {
      color: #6b7280;
      font-size: 0.9rem;
    }

    /* Testimonials Section */
    .testimonials-section {
      padding: 80px 20px;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .testimonials-grid {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      }
    }

    .testimonial-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .stars {
      color: #fbbf24;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .testimonial-text {
      font-style: italic;
      color: #374151;
      margin-bottom: 1.5rem;
      line-height: 1.8;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .testimonial-author img,
    .author-initial {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }

    .author-initial {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.5rem;
    }

    .testimonial-author h4 {
      font-size: 1rem;
      color: #1f2937;
    }

    .testimonial-author p {
      font-size: 0.85rem;
      color: #6b7280;
    }

    /* Offers Section */
    .offers-section {
      padding: 80px 20px;
    }

    .offers-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .offers-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
    }

    .offer-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .offer-card img,
    .offer-placeholder {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .offer-placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 5rem;
    }

    .offer-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #ef4444;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-weight: 700;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .offer-content {
      padding: 1.5rem;
    }

    .offer-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #1f2937;
    }

    .offer-card p {
      color: #6b7280;
      line-height: 1.6;
    }

    .offer-validity {
      font-size: 0.85rem;
      color: #9ca3af;
      margin-top: 1rem;
      border-top: 1px solid #e5e7eb;
      padding-top: 1rem;
    }

    /* CTA Section */
    .cta-section {
      padding: 100px 20px;
      position: relative;
      background-size: cover;
      background-position: center;
      text-align: center;
    }

    .cta-section .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
    }

    .cta-content {
      position: relative;
      z-index: 10;
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-content h2 {
      font-size: clamp(2rem, 4vw, 3rem);
      margin-bottom: 1.5rem;
    }

    .cta-content p {
      font-size: clamp(1rem, 2vw, 1.25rem);
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    /* Footer Section */
    .footer-section {
      padding: 60px 20px 30px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .footer-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
    }

    .footer-brand h3 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
    }

    .footer-brand p {
      opacity: 0.8;
      margin-bottom: 1.5rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
    }

    .footer-contact h4 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .footer-contact p {
      margin-bottom: 0.5rem;
      opacity: 0.8;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 2rem;
      text-align: center;
      opacity: 0.7;
      font-size: 0.9rem;
    }

    /* WhatsApp Widget */
    .whatsapp-widget {
      position: fixed;
      z-index: 9999;
      width: 60px;
      height: 60px;
      background: #25D366;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }

    .whatsapp-widget:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.4);
    }

    .whatsapp-widget.bottom-right {
      bottom: 20px;
      right: 20px;
    }

    .whatsapp-widget.bottom-left {
      bottom: 20px;
      left: 20px;
    }

    .whatsapp-widget.top-right {
      top: 20px;
      right: 20px;
    }

    .whatsapp-widget.top-left {
      top: 20px;
      left: 20px;
    }

    /* Animations */
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out;
    }

    .animate-fade-in-delay {
      animation: fadeIn 0.8s ease-out 0.2s both;
    }

    .animate-fade-in-delay-2 {
      animation: fadeIn 0.8s ease-out 0.4s both;
    }

    .animate-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      animation: slideUp 0.6s ease-out forwards;
    }

    .animate-on-scroll-delay {
      opacity: 0;
      transform: translateY(30px);
      animation: slideUp 0.6s ease-out 0.2s forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-section {
        min-height: 70vh;
      }

      .services-grid,
      .gallery-grid,
      .offers-grid {
        grid-template-columns: 1fr !important;
      }

      .menu-item {
        flex-direction: column;
      }

      .menu-item img,
      .menu-placeholder {
        width: 100%;
        height: 200px;
      }

      .menu-info {
        padding: 1.5rem;
      }
    }
  `;
};

const generateJavaScript = (): string => {
  return `
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Menu category filter
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    categoryBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const category = this.dataset.category;

        // Update active button
        categoryBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Filter items
        menuItems.forEach(item => {
          if (category === 'All' || item.dataset.category === category) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    // Set first category as active
    if (categoryBtns.length > 0) {
      categoryBtns[0].classList.add('active');
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-delay').forEach(el => {
      observer.observe(el);
    });

    console.log('Website loaded successfully! 🚀');
  `;
};

/**
 * Generate and download ZIP file with website files
 */
export const generateAndDownloadZip = async (config: PageConfig): Promise<void> => {
  const zip = new JSZip();

  // Generate HTML content
  const htmlContent = generateHTML(config);

  // Add files to ZIP
  zip.file('index.html', htmlContent);
  zip.file('README.txt', `
Website Package
===============

This package contains your complete website.

Files included:
- index.html: Your complete website (HTML, CSS, and JavaScript all in one file)

How to deploy:
1. Upload index.html to your web hosting provider
2. Access via your domain

That's it! Your website is ready to use.

Generated with Page Builder
${new Date().toLocaleString()}
  `.trim());

  // Generate ZIP file
  const blob = await zip.generateAsync({ type: 'blob' });

  // Download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${config.metadata.projectName.toLowerCase().replace(/\s+/g, '-')}-website.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
