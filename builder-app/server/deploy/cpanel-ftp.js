import * as ftp from 'basic-ftp';

function generateHTML(config) {
  const { metadata, theme, sections, seo, whatsapp } = config;

  const sectionHTML = (sections || [])
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      const props = section.props || {};
      switch (section.type) {
        case 'HeroSection':
          return `<section class="hero" style="background-image:url('${props.backgroundImage || ''}');text-align:${props.alignment || 'center'}">
  <div class="hero-overlay" style="opacity:${props.overlayOpacity || 0.5}"></div>
  <div class="hero-content">
    ${props.badgeText ? `<span class="badge">${props.badgeText}</span>` : ''}
    <h1>${props.title || ''}</h1>
    <p>${props.subtitle || ''}</p>
    ${props.ctaText ? `<a href="${props.ctaLink || '#'}" class="btn btn-primary">${props.ctaText}</a>` : ''}
    ${props.secondaryCtaText ? `<a href="${props.secondaryCtaLink || '#'}" class="btn btn-secondary">${props.secondaryCtaText}</a>` : ''}
  </div>
</section>`;
        case 'AboutSection':
          return `<section class="about">
  <h2>${props.title || ''}</h2>
  <p class="subtitle">${props.subtitle || ''}</p>
  <div class="about-content" style="flex-direction:${props.imagePosition === 'left' ? 'row' : 'row-reverse'}">
    <img src="${props.image || ''}" alt="About" />
    <p>${props.description || ''}</p>
  </div>
</section>`;
        case 'ServicesSection':
          return `<section class="services">
  <h2>${props.title || ''}</h2>
  <p class="subtitle">${props.subtitle || ''}</p>
  <div class="services-grid" style="grid-template-columns:repeat(${props.columns || 3},1fr)">
    ${(props.services || []).map((s) => `<div class="service-card"><h3>${s.title}</h3><p>${s.description}</p></div>`).join('\n    ')}
  </div>
</section>`;
        case 'FooterSection':
          return `<footer>
  <div class="footer-content">
    <div class="footer-brand"><h3>${props.companyName || ''}</h3><p>${props.description || ''}</p></div>
    ${(props.links || []).map((g) => `<div class="footer-links"><h4>${g.group}</h4><ul>${g.items.map((i) => `<li><a href="${i.url}">${i.label}</a></li>`).join('')}</ul></div>`).join('\n    ')}
  </div>
  <p class="copyright">${props.copyrightText || ''}</p>
</footer>`;
        default:
          return `<section class="${section.type.toLowerCase()}">
  <h2>${props.title || ''}</h2>
  <p>${props.subtitle || props.description || ''}</p>
</section>`;
      }
    })
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${seo?.title || metadata?.projectName || 'Website'}</title>
  <meta name="description" content="${seo?.description || ''}" />
  <meta name="keywords" content="${(seo?.keywords || []).join(', ')}" />
  <link href="https://fonts.googleapis.com/css2?family=${(theme?.fontFamily || 'Inter').replace(/ /g, '+')}&display=swap" rel="stylesheet" />
  <style>
    :root {
      --primary: ${theme?.primaryColor || '#3B82F6'};
      --secondary: ${theme?.secondaryColor || '#1E40AF'};
      --accent: ${theme?.accentColor || '#F59E0B'};
      --font: '${theme?.fontFamily || 'Inter'}', sans-serif;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: var(--font); color: #333; line-height: 1.6; }
    .hero { position: relative; min-height: 80vh; display: flex; align-items: center; justify-content: center; color: white; background-size: cover; background-position: center; }
    .hero-overlay { position: absolute; inset: 0; background: #000; }
    .hero-content { position: relative; z-index: 1; max-width: 800px; padding: 2rem; }
    .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.25rem; margin-bottom: 2rem; }
    .btn { display: inline-block; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 0.5rem; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-secondary { background: transparent; color: white; border: 2px solid white; }
    section { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
    h2 { font-size: 2rem; margin-bottom: 0.5rem; color: var(--secondary); }
    .subtitle { color: #666; margin-bottom: 2rem; }
    .services-grid { display: grid; gap: 2rem; }
    .service-card { padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .about-content { display: flex; gap: 2rem; align-items: center; }
    .about-content img { max-width: 400px; border-radius: 12px; }
    footer { background: var(--secondary); color: white; padding: 3rem 2rem 1rem; }
    .footer-content { display: flex; gap: 3rem; max-width: 1200px; margin: 0 auto; flex-wrap: wrap; }
    .footer-links ul { list-style: none; }
    .footer-links a { color: rgba(255,255,255,0.8); text-decoration: none; }
    .copyright { text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2); }
    .badge { display: inline-block; background: var(--accent); color: #000; padding: 0.25rem 1rem; border-radius: 20px; font-size: 0.875rem; margin-bottom: 1rem; }
    @media (max-width: 768px) {
      .hero h1 { font-size: 2rem; }
      .about-content { flex-direction: column !important; }
      .about-content img { max-width: 100%; }
      .services-grid { grid-template-columns: 1fr !important; }
      .footer-content { flex-direction: column; }
    }
  </style>
</head>
<body>
${sectionHTML}
${whatsapp?.enabled ? `<a href="https://wa.me/${whatsapp.phoneNumber}?text=${encodeURIComponent(whatsapp.defaultMessage)}" class="whatsapp-float" style="position:fixed;bottom:20px;right:20px;background:#25D366;color:white;border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;font-size:28px;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,0.2);z-index:9999;">&#128172;</a>` : ''}
</body>
</html>`;
}

export async function deployCPanel(config, ftpConfig, deploymentId) {
  const html = generateHTML(config);

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: ftpConfig.host,
      user: ftpConfig.user,
      password: ftpConfig.password,
      secure: false,
    });

    const remotePath = ftpConfig.path || '/public_html';

    // Ensure directory exists
    await client.ensureDir(remotePath);

    // Upload the HTML as a buffer
    const buffer = Buffer.from(html, 'utf-8');
    const { Readable } = await import('stream');
    const stream = Readable.from(buffer);
    await client.uploadFrom(stream, `${remotePath}/index.html`);

    return { url: `http://${ftpConfig.host}${remotePath === '/public_html' ? '' : remotePath}` };
  } finally {
    client.close();
  }
}
