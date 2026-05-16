import { v4 as uuidv4 } from 'uuid';
import { aiComplete } from './client.js';

const SECTION_INTERFACES = {
  HeroSection: `{ title: string, subtitle: string, backgroundImage: string, ctaText: string, ctaLink: string, secondaryCtaText?: string, secondaryCtaLink?: string, alignment: "left"|"center"|"right", overlayOpacity: number, showBadge?: boolean, badgeText?: string }`,
  AboutSection: `{ title: string, subtitle: string, description: string, image: string, imagePosition: "left"|"right", stats?: {label:string,value:string}[], showButton?: boolean, buttonText?: string, buttonLink?: string }`,
  ServicesSection: `{ title: string, subtitle: string, services: {icon:string,title:string,description:string,link?:string}[], columns: 2|3|4, layout: "grid"|"list" }`,
  MenuSection: `{ title: string, subtitle: string, categories: {name:string, items:{name:string,description:string,price:string,image?:string,badge?:string}[]}[] }`,
  GallerySection: `{ title: string, subtitle: string, images: {src:string,alt:string,caption?:string}[], columns: 2|3|4, layout: "grid"|"masonry", showLightbox: boolean }`,
  TestimonialsSection: `{ title: string, subtitle: string, testimonials: {name:string,role:string,company?:string,content:string,avatar:string,rating:number}[], layout: "grid"|"carousel" }`,
  OffersSection: `{ title: string, subtitle: string, offers: {title:string,description:string,discount:string,originalPrice?:string,salePrice?:string,image?:string,badge?:string,ctaText:string,ctaLink:string,validUntil?:string}[] }`,
  CTASection: `{ title: string, subtitle: string, buttonText: string, buttonLink: string, secondaryButtonText?: string, secondaryButtonLink?: string, backgroundImage?: string, backgroundColor?: string, layout: "centered"|"split" }`,
  FooterSection: `{ companyName: string, description: string, logo?: string, links: {group:string,items:{label:string,url:string}[]}[], socialLinks: {platform:string,url:string}[], contactInfo?: {email?:string,phone?:string,address?:string}, copyrightText: string }`,
  FloatingWhatsApp: `{ phoneNumber: string, defaultMessage: string, position: "bottom-right"|"bottom-left", showOnMobile: boolean }`,
  CardSection: `{ title: string, subtitle: string, cards: {title:string,description:string,image?:string,icon?:string,ctaText?:string,ctaLink?:string,badge?:string}[], columns: 2|3|4, layout: "standard"|"horizontal"|"overlay" }`,
  StatsSection: `{ title: string, subtitle: string, stats: {value:string,label:string,icon?:string,prefix?:string,suffix?:string}[], backgroundColor?: string, layout: "row"|"grid" }`,
  CategorySection: `{ title: string, subtitle: string, categories: {name:string,description?:string,image:string,link?:string,itemCount?:number}[], columns: 2|3|4, layout: "grid"|"carousel" }`,
  ProfileSection: `{ name: string, title: string, bio: string, avatar: string, coverImage?: string, socialLinks: {platform:string,url:string}[], skills?: string[], contactEmail?: string }`,
  PricingSection: `{ title: string, subtitle: string, plans: {name:string,price:string,period:string,description:string,features:string[],ctaText:string,ctaLink:string,isPopular?:boolean,badge?:string}[], showToggle?: boolean }`,
  FAQSection: `{ title: string, subtitle: string, faqs: {question:string,answer:string}[], layout: "accordion"|"grid" }`,
  TimelineSection: `{ title: string, subtitle: string, events: {date:string,title:string,description:string,icon?:string,image?:string}[], layout: "vertical"|"horizontal" }`,
  FeatureSection: `{ title: string, subtitle: string, features: {icon:string,title:string,description:string,image?:string}[], layout: "grid"|"alternating"|"centered", columns: 2|3 }`,
  JobBoardSection: `{ title: string, subtitle: string, jobs: {title:string,department:string,location:string,type:string,description:string,applyLink:string,postedDate?:string}[], showFilters: boolean }`,
};

const ALL_SECTION_TYPES = Object.keys(SECTION_INTERFACES).join(', ');

const SYSTEM_ROLE = `You are ZeroBuild's AI website architect. You generate structured JSON configurations for pre-built React components.

CONSTRAINTS:
- Output ONLY valid JSON. No markdown, no explanation, no code fences.
- Every string value must be a non-empty string (never null/undefined).
- Use placeholder images from https://placehold.co (e.g. "https://placehold.co/800x600").
- Icons should be emoji characters (e.g. "🚀", "💼", "📱").
- All URLs should start with "#" for internal links or "https://" for external.
- Generate realistic, compelling business content — not lorem ipsum.`;

export async function generateFullPage(prompt) {
  // Step 1: Intent + section selection
  const intent = await aiComplete({
    systemPrompt: `${SYSTEM_ROLE}

TASK: Analyze the user's business description and select appropriate sections.
AVAILABLE SECTIONS: ${ALL_SECTION_TYPES}

OUTPUT FORMAT (strict JSON):
{ "industry": string, "businessName": string, "audience": string, "tone": "professional"|"casual"|"luxury"|"playful"|"minimal", "sections": string[] }

RULES:
- Choose 5-8 sections that make sense for this business type.
- ALWAYS start with HeroSection and end with FooterSection.
- For restaurants/cafes: include MenuSection.
- For e-commerce: include CategorySection, OffersSection.
- For services: include ServicesSection, PricingSection.
- For portfolios: include GallerySection, ProfileSection.
- Never include FloatingWhatsApp in the sections array (handled separately).`,
    userPrompt: prompt,
    maxTokens: 512,
    json: true,
  });

  // Step 2: Theme generation
  const theme = await aiComplete({
    systemPrompt: `${SYSTEM_ROLE}

TASK: Generate a brand color palette and font for this business.
OUTPUT FORMAT (strict JSON):
{ "primaryColor": "#hex", "secondaryColor": "#hex", "accentColor": "#hex", "fontFamily": string }

RULES:
- Use accessible color combinations (WCAG AA contrast).
- fontFamily must be a Google Font: Inter, Poppins, Playfair Display, Roboto, Montserrat, Lato, Raleway, or Open Sans.
- For luxury brands: use Playfair Display with deep colors.
- For tech/modern: use Inter or Montserrat with blue/purple tones.
- For food/restaurants: use warm colors (amber, red, green).`,
    userPrompt: `Business: ${intent.businessName || prompt}\nIndustry: ${intent.industry}\nTone: ${intent.tone}\nAudience: ${intent.audience}`,
    maxTokens: 256,
    json: true,
  });

  // Step 3: Generate each section in parallel with explicit schema
  const sectionPromises = intent.sections.map(async (sectionType) => {
    const schema = SECTION_INTERFACES[sectionType];
    if (!schema) {
      console.warn(`[AI] Unknown section type: ${sectionType}`);
      return null;
    }

    const props = await aiComplete({
      systemPrompt: `${SYSTEM_ROLE}

TASK: Generate content for a ${sectionType} component.
EXACT OUTPUT SCHEMA: ${schema}

CONTEXT:
- Business: ${intent.businessName || 'Business'}
- Industry: ${intent.industry}
- Audience: ${intent.audience}
- Tone: ${intent.tone}
- Brand colors: primary=${theme.primaryColor}, secondary=${theme.secondaryColor}, accent=${theme.accentColor}

RULES:
- Every field in the schema MUST be present in your output.
- String fields must never be empty — generate real content.
- Arrays must have at least 3 items (except socialLinks which needs 2+).
- rating fields must be 4 or 5 (positive testimonials).
- price fields should be realistic for the industry.`,
      userPrompt: `Generate ${sectionType} content for: ${prompt}`,
      maxTokens: 2048,
      json: true,
    });

    return { id: uuidv4(), type: sectionType, props, order: 0 };
  });

  const results = await Promise.allSettled(sectionPromises);
  const sections = results
    .filter(r => r.status === 'fulfilled' && r.value)
    .map(r => r.value)
    .map((s, i) => ({ ...s, order: i }));

  if (sections.length === 0) {
    throw new Error('AI failed to generate any sections');
  }

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
      title: `${intent.businessName || intent.industry} - Official Website`,
      description: prompt.substring(0, 160),
      keywords: [intent.industry, intent.audience, intent.businessName].filter(Boolean),
    },
    sections,
  };
}

/**
 * Diff-based edit: only regenerates the targeted section, not the full config.
 */
export async function editSection(currentConfig, sectionId, instruction) {
  const section = currentConfig.sections?.find(s => s.id === sectionId);
  if (!section) throw new Error('Section not found');

  const schema = SECTION_INTERFACES[section.type];

  return aiComplete({
    systemPrompt: `${SYSTEM_ROLE}

TASK: Modify ONLY the specified properties based on the user's instruction.
SECTION TYPE: ${section.type}
SCHEMA: ${schema || 'unknown'}

CURRENT PROPS:
${JSON.stringify(section.props, null, 2)}

RULES:
- Return the COMPLETE props object (not just changed fields).
- Only change what the user explicitly asks for.
- Keep all other values exactly the same.
- Never return null or undefined values — use empty string "" if removing text.`,
    userPrompt: instruction,
    maxTokens: 2048,
    json: true,
  });
}

export async function rewriteCopy(sectionType, currentProps, instruction) {
  const schema = SECTION_INTERFACES[sectionType];

  return aiComplete({
    systemPrompt: `${SYSTEM_ROLE}

TASK: Rewrite text/copy content based on the instruction.
SECTION TYPE: ${sectionType}
SCHEMA: ${schema || 'unknown'}

CURRENT PROPS:
${JSON.stringify(currentProps, null, 2)}

RULES:
- Only modify text fields (title, subtitle, description, content, name, etc.).
- Keep structural properties unchanged (layout, columns, links, images).
- Return the COMPLETE props object.`,
    userPrompt: instruction,
    maxTokens: 2048,
    json: true,
  });
}

export async function generateSEO(config) {
  const sectionSummary = (config.sections || [])
    .slice(0, 5)
    .map(s => `${s.type}: ${JSON.stringify(s.props).substring(0, 200)}`)
    .join('\n');

  return aiComplete({
    systemPrompt: `${SYSTEM_ROLE}

TASK: Generate SEO metadata for this website.
OUTPUT FORMAT: { "title": string (max 60 chars), "description": string (max 160 chars), "keywords": string[] (5-10 keywords) }`,
    userPrompt: `Website: ${config.metadata?.projectName || 'Website'}\nTheme: ${JSON.stringify(config.theme)}\nSections:\n${sectionSummary}`,
    maxTokens: 512,
    json: true,
  });
}

/**
 * Clarification check: returns a question if the prompt is too vague.
 * Returns null if the prompt is clear enough to proceed.
 */
export async function checkClarification(prompt) {
  if (prompt.split(/\s+/).length >= 20) return null; // Long enough, proceed

  const result = await aiComplete({
    systemPrompt: `You evaluate website generation prompts. If the prompt is clear enough to build a website (has business type OR purpose), respond: { "needsClarification": false }
If it's too vague (under 5 words, no business context, ambiguous), respond: { "needsClarification": true, "question": "one short clarifying question" }
Output ONLY JSON.`,
    userPrompt: prompt,
    maxTokens: 128,
    json: true,
  });

  return result.needsClarification ? result.question : null;
}
