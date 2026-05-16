import { v4 as uuidv4 } from 'uuid';
import { aiComplete } from './client.js';

// Unsplash image search helper — generates relevant URLs based on keywords
function unsplashImg(keywords, w = 800, h = 600) {
  const query = encodeURIComponent(keywords);
  return `https://source.unsplash.com/${w}x${h}/?${query}`;
}

const SECTION_SCHEMAS = {
  HeroSection: `{ heading: string, subheading: string, backgroundImage: string, ctaText: string, ctaLink: string, backgroundColor: string, textColor: string, overlayOpacity: number }`,
  AboutSection: `{ heading: string, subheading: string, description: string, image: string, imagePosition: "left"|"right", stats: {label:string,value:string}[], backgroundColor: string }`,
  ServicesSection: `{ heading: string, subheading: string, services: {icon:string,title:string,description:string}[], columns: 3, backgroundColor: string }`,
  MenuSection: `{ heading: string, subheading: string, categories: {name:string, items:{name:string,description:string,price:string,image:string}[]}[], backgroundColor: string }`,
  GallerySection: `{ heading: string, subheading: string, images: {src:string,alt:string,caption:string}[], columns: 3, layout: "grid", backgroundColor: string }`,
  TestimonialsSection: `{ heading: string, subheading: string, testimonials: {name:string,role:string,company:string,content:string,avatar:string,rating:5}[], layout: "grid", backgroundColor: string }`,
  OffersSection: `{ heading: string, subheading: string, offers: {title:string,description:string,discount:string,originalPrice:string,salePrice:string,image:string,badge:string,ctaText:string,ctaLink:string}[], backgroundColor: string }`,
  CTASection: `{ heading: string, description: string, ctaText: string, ctaLink: string, backgroundImage: string, backgroundColor: string, textColor: string }`,
  FooterSection: `{ businessName: string, tagline: string, address: string, phone: string, email: string, socialLinks: {platform:string,url:string}[], backgroundColor: string, textColor: string }`,
  CardSection: `{ heading: string, subheading: string, cards: {title:string,description:string,image:string,icon:string}[], columns: 3, backgroundColor: string }`,
  StatsSection: `{ heading: string, subheading: string, stats: {value:string,label:string,icon:string}[], backgroundColor: string }`,
  CategorySection: `{ heading: string, subheading: string, categories: {name:string,description:string,image:string,itemCount:number}[], columns: 3, backgroundColor: string }`,
  PricingSection: `{ heading: string, subheading: string, plans: {name:string,price:string,period:string,description:string,features:string[],ctaText:string,ctaLink:string,isPopular:boolean}[], backgroundColor: string }`,
  FAQSection: `{ heading: string, subheading: string, faqs: {question:string,answer:string}[], layout: "accordion", backgroundColor: string }`,
  FeatureSection: `{ heading: string, subheading: string, features: {icon:string,title:string,description:string}[], columns: 3, backgroundColor: string }`,
};

export async function generateFullPage(prompt) {
  console.log(`[Orchestrator] Starting generation for: "${prompt.substring(0, 80)}..."`);

  // Step 1: Understand the business
  console.log('[Orchestrator] Step 1: Analyzing business intent...');
  const intent = await aiComplete({
    systemPrompt: `You are a web strategist. Analyze the business and decide what sections to build.

AVAILABLE: HeroSection, AboutSection, ServicesSection, MenuSection, GallerySection, TestimonialsSection, OffersSection, CTASection, FooterSection, CardSection, StatsSection, CategorySection, PricingSection, FAQSection, FeatureSection

OUTPUT ONLY THIS JSON:
{ "industry": string, "businessName": string, "location": string, "audience": string, "tone": "professional"|"warm"|"luxury"|"playful", "imageKeywords": string[], "sections": string[] }

RULES:
- imageKeywords: 5-8 specific search terms for stock photos (e.g. ["almonds close up", "cashews bowl", "dry fruits packaging", "indian spices market"])
- sections: 6-8 sections. ALWAYS start with HeroSection, end with FooterSection.
- For food/grocery: use CategorySection, MenuSection, OffersSection
- For services: use ServicesSection, PricingSection, FAQSection
- For e-commerce: use CategorySection, CardSection, OffersSection`,
    userPrompt: prompt,
    maxTokens: 512,
    json: true,
  });
  console.log(`[Orchestrator] Intent: ${intent.businessName} (${intent.industry}), ${intent.sections.length} sections planned`);

  // Step 2: Generate theme
  console.log('[Orchestrator] Step 2: Generating brand theme...');
  const theme = await aiComplete({
    systemPrompt: `Generate a brand color palette. Output ONLY JSON:
{ "primaryColor": "#hex", "secondaryColor": "#hex", "accentColor": "#hex", "fontFamily": string }

Rules:
- primaryColor: main brand color (used for headers, buttons)
- secondaryColor: supporting color (used for backgrounds, cards)
- accentColor: highlight color (used for badges, CTAs)
- fontFamily: one of "Inter", "Poppins", "Playfair Display", "Montserrat", "Lato"
- For food businesses: warm tones (amber #d97706, green #16a34a, brown #92400e)
- For tech: cool tones (blue #2563eb, purple #7c3aed, cyan #06b6d4)
- For luxury: deep tones (gold #b8860b, navy #1e3a5f, black #0a0a0a)`,
    userPrompt: `${intent.businessName} - ${intent.industry} - ${intent.tone} - audience: ${intent.audience}`,
    maxTokens: 200,
    json: true,
  });
  console.log(`[Orchestrator] Theme: ${theme.primaryColor} / ${theme.secondaryColor} / ${theme.fontFamily}`);

  // Step 3: Generate sections with FULL context
  const imageKeywords = intent.imageKeywords || [intent.industry];
  const sections = [];

  for (let i = 0; i < intent.sections.length; i++) {
    const sectionType = intent.sections[i];
    const schema = SECTION_SCHEMAS[sectionType];
    if (!schema) { console.warn(`[Orchestrator] Unknown: ${sectionType}`); continue; }

    console.log(`[Orchestrator] Step 3.${i + 1}: Generating ${sectionType}...`);

    const imgHint = imageKeywords[i % imageKeywords.length] || intent.industry;

    try {
      const props = await aiComplete({
        systemPrompt: `You generate website section content as JSON. Output ONLY valid JSON matching this schema:
${schema}

BUSINESS CONTEXT:
- Name: ${intent.businessName}
- Industry: ${intent.industry}
- Location: ${intent.location || 'India'}
- Audience: ${intent.audience}
- Tone: ${intent.tone}

THEME COLORS (use these in backgroundColor/textColor fields):
- Primary: ${theme.primaryColor}
- Secondary: ${theme.secondaryColor}
- Accent: ${theme.accentColor}

IMAGE RULES:
- Use this format: https://source.unsplash.com/800x600/?KEYWORD
- Replace KEYWORD with relevant terms like: ${imgHint}
- For avatars: https://source.unsplash.com/150x150/?portrait,indian
- Each image URL must be UNIQUE (add different keywords)

CONTENT RULES:
- Write in the language/style appropriate for ${intent.audience}
- Testimonials must have realistic Indian names, specific feedback (not generic)
- Prices in ₹ (Indian Rupees) if location is India
- Stats should be impressive but believable
- descriptions should be 1-2 sentences, compelling
- backgroundColor: alternate between "#ffffff", "${theme.primaryColor}10", "${theme.secondaryColor}10" for visual rhythm
- textColor: use "#1f2937" for light backgrounds, "#ffffff" for dark backgrounds`,
        userPrompt: `Generate ${sectionType} for ${intent.businessName}: ${prompt}`,
        maxTokens: 2048,
        json: true,
      });

      sections.push({ id: uuidv4(), type: sectionType, props, order: i });
    } catch (err) {
      console.error(`[Orchestrator] Failed to generate ${sectionType}:`, err.message);
    }
  }

  console.log(`[Orchestrator] Complete: ${sections.length}/${intent.sections.length} sections generated`);

  if (sections.length === 0) throw new Error('AI failed to generate any sections');

  return {
    metadata: {
      clientName: intent.businessName || '',
      projectName: intent.businessName || prompt.substring(0, 60),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
    },
    theme,
    whatsapp: { phoneNumber: '', defaultMessage: `Hi! I'm interested in ${intent.businessName || 'your services'}.`, enabled: false },
    seo: {
      title: `${intent.businessName || intent.industry} - ${intent.location || ''}`,
      description: prompt.substring(0, 160),
      keywords: [intent.industry, intent.audience, intent.businessName, intent.location].filter(Boolean),
    },
    sections,
  };
}

export async function editSection(currentConfig, sectionId, instruction) {
  const section = currentConfig.sections?.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');
  const schema = SECTION_SCHEMAS[section.type];

  console.log(`[Orchestrator] Editing ${section.type}: "${instruction.substring(0, 50)}..."`);

  return aiComplete({
    systemPrompt: `Modify this section's props based on the user's instruction. Return COMPLETE updated props as JSON.

SECTION: ${section.type}
SCHEMA: ${schema || 'unknown'}
CURRENT:
${JSON.stringify(section.props, null, 2)}

Rules: Change ONLY what user asks. Keep everything else identical. Never return null.`,
    userPrompt: instruction,
    maxTokens: 2048,
    json: true,
  });
}

export async function rewriteCopy(sectionType, currentProps, instruction) {
  const schema = SECTION_SCHEMAS[sectionType];
  return aiComplete({
    systemPrompt: `Rewrite text content. Keep structure (layout, columns, images) unchanged. Return COMPLETE props as JSON.
TYPE: ${sectionType} | SCHEMA: ${schema}
CURRENT: ${JSON.stringify(currentProps, null, 2)}`,
    userPrompt: instruction,
    maxTokens: 2048,
    json: true,
  });
}

export async function generateSEO(config) {
  const summary = (config.sections || []).slice(0, 4).map(s => s.type).join(', ');
  return aiComplete({
    systemPrompt: `Generate SEO. Output JSON: { "title": string (60 chars max), "description": string (160 chars max), "keywords": string[] }`,
    userPrompt: `Site: ${config.metadata?.projectName}. Sections: ${summary}`,
    maxTokens: 256,
    json: true,
  });
}
