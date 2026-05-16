import type { PageConfig } from '@/types/config.types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'modern' | 'classic' | 'minimalist';
  thumbnail: string;
  config: PageConfig;
}

export const templates: Template[] = [
  // 1. CREATIVE PORTFOLIO (minimalist) - Gallery → About → Testimonials → Footer
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Portfolio-first showcase with no hero section - starts with visual work',
    category: 'minimalist',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    config: {
      metadata: {
        projectName: 'Creative Portfolio',
        clientName: 'Alex Chen',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'Alex Chen | Creative Designer Portfolio',
        description: 'Visual designer specializing in branding, illustration, and digital art',
        keywords: ['portfolio', 'design', 'illustration', 'branding', 'creative'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'I would like to discuss a design project',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'GallerySection',
          order: 0,
          props: {
            heading: 'Selected Projects',
            images: [
              {
                url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
                alt: 'Brand Identity Project',
                caption: 'Nike Reimagined - Brand Identity',
              },
              {
                url: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800',
                alt: 'Editorial Design',
                caption: 'Magazine Editorial Design',
              },
              {
                url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800',
                alt: 'Digital Illustration',
                caption: 'Digital Illustration Series',
              },
              {
                url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
                alt: 'Packaging Design',
                caption: 'Organic Coffee Packaging',
              },
              {
                url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
                alt: 'Web Design',
                caption: 'Minimal Web Interface',
              },
              {
                url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
                alt: 'Print Design',
                caption: 'Poster Collection',
              },
            ],
          },
        },
        {
          id: '2',
          type: 'AboutSection',
          order: 1,
          props: {
            heading: 'About My Work',
            description: 'I am a visual designer with 8+ years of experience creating compelling brand identities and illustrations. My work focuses on minimalist aesthetics combined with bold conceptual thinking.',
            image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            imageAlt: 'Designer workspace',
            features: [
              'Specialized in brand identity & visual systems',
              'Featured in Communication Arts & Design Week',
              'Clients include Adobe, Spotify, and Airbnb',
              'Award-winning illustration portfolio',
            ],
          },
        },
        {
          id: '3',
          type: 'TestimonialsSection',
          order: 2,
          props: {
            heading: 'Client Testimonials',
            testimonials: [
              {
                id: '1',
                name: 'Sarah Martinez',
                comment: 'Alex brought our brand vision to life with incredible precision and creativity. The attention to detail is unmatched.',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                rating: 5,
              },
              {
                id: '2',
                name: 'Michael Chen',
                comment: 'Working with Alex was transformative for our brand identity. The concepts were fresh, modern, and exactly what we needed.',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                rating: 5,
              },
              {
                id: '3',
                name: 'Emily Rodriguez',
                comment: 'Exceptional work on our campaign illustrations. Alex has a unique ability to blend art and strategy seamlessly.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                rating: 5,
              },
            ],
          },
        },
        {
          id: '4',
          type: 'FooterSection',
          order: 3,
          props: {
            businessName: 'Alex Chen Design',
            tagline: 'Creating meaningful visual experiences',
            address: 'Brooklyn, New York',
            phone: '+1 (555) 234-5678',
            email: 'alex@alexchendesign.com',
            socialLinks: [
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
              { platform: 'Behance', url: 'https://behance.net', icon: '🎨' },
              { platform: 'Dribbble', url: 'https://dribbble.com', icon: '🏀' },
            ],
          },
        },
      ],
    },
  },

  // 2. E-COMMERCE STORE (modern) - Hero → Offers → Gallery → CTA → Footer
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Store',
    description: 'Product-focused store with special offers and visual catalog',
    category: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
    config: {
      metadata: {
        projectName: 'E-Commerce Store',
        clientName: 'UrbanWear',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'UrbanWear | Streetwear & Lifestyle Fashion',
        description: 'Premium streetwear and lifestyle clothing with exclusive drops and limited editions',
        keywords: ['streetwear', 'fashion', 'clothing', 'ecommerce', 'urban'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'I have a question about an item',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'New Season Drops',
            subheading: 'Exclusive streetwear collections designed for the bold',
            ctaText: 'Shop Now',
            ctaLink: '#offers',
            backgroundImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600',
            backgroundColor: '#000000',
            textColor: '#FFFFFF',
            overlayOpacity: 0.4,
          },
        },
        {
          id: '2',
          type: 'OffersSection',
          order: 1,
          props: {
            heading: 'Special Offers',
            subheading: 'Limited time deals you do not want to miss',
            offers: [
              {
                id: '1',
                title: 'Spring Collection Sale',
                description: 'Up to 40% off on all spring items',
                discount: '40% OFF',
                validUntil: '2024-04-30',
                image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600',
                ctaText: 'Shop Spring Sale',
                ctaLink: '#',
              },
              {
                id: '2',
                title: 'New Arrivals - Free Shipping',
                description: 'Free shipping on orders over $100',
                discount: 'FREE SHIP',
                validUntil: '2024-05-15',
                image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',
                ctaText: 'Shop New Arrivals',
                ctaLink: '#',
              },
              {
                id: '3',
                title: 'Bundle & Save',
                description: 'Buy 2 get 1 free on selected items',
                discount: 'BUY 2 GET 1',
                validUntil: '2024-04-20',
                image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600',
                ctaText: 'View Bundles',
                ctaLink: '#',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'GallerySection',
          order: 2,
          props: {
            heading: 'Latest Collection',
            images: [
              {
                url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
                alt: 'Oversized Hoodie',
                caption: 'Oversized Hoodie - $89',
              },
              {
                url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800',
                alt: 'Graphic Tee',
                caption: 'Limited Edition Graphic Tee - $45',
              },
              {
                url: 'https://images.unsplash.com/photo-1603217539865-3e1f73585066?w=800',
                alt: 'Cargo Pants',
                caption: 'Urban Cargo Pants - $95',
              },
              {
                url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
                alt: 'Bomber Jacket',
                caption: 'Vintage Bomber Jacket - $149',
              },
            ],
          },
        },
        {
          id: '4',
          type: 'CTASection',
          order: 3,
          props: {
            heading: 'Join the UrbanWear Club',
            description: 'Get early access to drops, exclusive discounts, and member-only events',
            ctaText: 'Sign Up Free',
            ctaLink: '#signup',
            backgroundColor: '#FF6B6B',
            textColor: '#FFFFFF',
          },
        },
        {
          id: '5',
          type: 'FooterSection',
          order: 4,
          props: {
            businessName: 'UrbanWear',
            tagline: 'Streetwear for the bold',
            address: '456 Fashion Avenue, NYC, NY 10001',
            phone: '+1 (555) 789-0123',
            email: 'shop@urbanwear.com',
            socialLinks: [
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
              { platform: 'TikTok', url: 'https://tiktok.com', icon: '🎵' },
              { platform: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
            ],
          },
        },
      ],
    },
  },

  // 3. RESTAURANT WITH REVIEWS (professional) - Hero → Menu → Testimonials → About → Footer
  {
    id: 'restaurant-reviews',
    name: 'Restaurant with Reviews',
    description: 'Menu-first restaurant with social proof before story',
    category: 'professional',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    config: {
      metadata: {
        projectName: 'Restaurant with Reviews',
        clientName: 'Bella Vista Ristorante',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'Bella Vista Ristorante | Authentic Italian Dining',
        description: 'Award-winning Italian restaurant serving authentic cuisine in a romantic setting',
        keywords: ['italian restaurant', 'fine dining', 'pasta', 'wine', 'authentic'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'I would like to make a reservation',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'Bella Vista Ristorante',
            subheading: 'Authentic Italian cuisine in the heart of the city',
            ctaText: 'Reserve a Table',
            ctaLink: '#contact',
            backgroundImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600',
            backgroundColor: '#8B4513',
            textColor: '#FFFFFF',
            overlayOpacity: 0.5,
          },
        },
        {
          id: '2',
          type: 'MenuSection',
          order: 1,
          props: {
            heading: 'Our Menu',
            subheading: 'Traditional recipes passed down through generations',
            categories: ['All', 'Antipasti', 'Primi Piatti', 'Secondi', 'Dolci'],
            backgroundColor: '#FFF8F0',
            menuItems: [
              {
                id: '1',
                category: 'Antipasti',
                name: 'Burrata con Pomodori',
                description: 'Fresh burrata cheese with heirloom tomatoes, basil, and aged balsamic',
                price: '$18',
                image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400',
              },
              {
                id: '2',
                category: 'Antipasti',
                name: 'Carpaccio di Manzo',
                description: 'Thinly sliced beef tenderloin with arugula, parmesan, and truffle oil',
                price: '$22',
                image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
              },
              {
                id: '3',
                category: 'Primi Piatti',
                name: 'Tagliatelle al Tartufo',
                description: 'Handmade pasta with black truffle cream sauce',
                price: '$34',
                image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
              },
              {
                id: '4',
                category: 'Primi Piatti',
                name: 'Risotto ai Funghi',
                description: 'Creamy arborio rice with wild mushrooms and parmesan',
                price: '$28',
                image: 'https://images.unsplash.com/photo-1476124369491-f6e6be3d1e62?w=400',
              },
              {
                id: '5',
                category: 'Secondi',
                name: 'Osso Buco',
                description: 'Braised veal shank with saffron risotto and gremolata',
                price: '$45',
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
              },
              {
                id: '6',
                category: 'Dolci',
                name: 'Panna Cotta',
                description: 'Vanilla bean panna cotta with seasonal berry compote',
                price: '$12',
                image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'TestimonialsSection',
          order: 2,
          props: {
            heading: 'What Our Guests Say',
            testimonials: [
              {
                id: '1',
                name: 'James Peterson',
                comment: 'The most authentic Italian dining experience outside of Italy. The pasta is handmade daily and you can taste the difference.',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
                rating: 5,
              },
              {
                id: '2',
                name: 'Maria Gonzalez',
                comment: 'Bella Vista has been our anniversary destination for 5 years. The ambiance, service, and food are consistently exceptional.',
                image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
                rating: 5,
              },
              {
                id: '3',
                name: 'David Kim',
                comment: 'Chef Antonio creates magic in the kitchen. Every dish is a masterpiece of flavor and presentation.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                rating: 5,
              },
            ],
          },
        },
        {
          id: '4',
          type: 'AboutSection',
          order: 3,
          props: {
            heading: 'Our Heritage',
            description: 'Founded in 1998 by Chef Antonio Russo, Bella Vista brings the flavors of Tuscany to your table. Using recipes from his grandmother and the finest imported ingredients, we create an unforgettable dining experience.',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
            imageAlt: 'Chef Antonio in the kitchen',
            features: [
              'Michelin-recommended since 2005',
              'Wine Spectator Award of Excellence',
              'Ingredients imported from Italy weekly',
              'Private wine cellar with 500+ selections',
            ],
          },
        },
        {
          id: '5',
          type: 'FooterSection',
          order: 4,
          props: {
            businessName: 'Bella Vista Ristorante',
            tagline: 'La dolce vita awaits',
            address: '789 Bistro Lane, Downtown, DT 12345',
            phone: '+1 (555) 456-7890',
            email: 'reservations@bellavista.com',
            socialLinks: [
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
              { platform: 'Facebook', url: 'https://facebook.com', icon: '📘' },
              { platform: 'Yelp', url: 'https://yelp.com', icon: '⭐' },
            ],
          },
        },
      ],
    },
  },

  // 4. EVENT LANDING PAGE (modern) - Hero → Gallery → Offers → Testimonials → CTA → Footer
  {
    id: 'event-landing',
    name: 'Event Landing Page',
    description: 'Event-focused with past highlights, ticket offers, and social proof',
    category: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
    config: {
      metadata: {
        projectName: 'Event Landing Page',
        clientName: 'TechSummit 2024',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'TechSummit 2024 | The Future of Innovation',
        description: 'Join 5000+ tech leaders, founders, and innovators at the biggest tech conference of the year',
        keywords: ['tech conference', 'innovation', 'startup', 'networking', 'technology'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'I have a question about TechSummit',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'TechSummit 2024',
            subheading: 'June 15-17, 2024 | San Francisco Convention Center',
            ctaText: 'Get Tickets',
            ctaLink: '#offers',
            backgroundImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600',
            backgroundColor: '#6366F1',
            textColor: '#FFFFFF',
            overlayOpacity: 0.6,
          },
        },
        {
          id: '2',
          type: 'GallerySection',
          order: 1,
          props: {
            heading: 'TechSummit 2023 Highlights',
            images: [
              {
                url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
                alt: 'Keynote presentation',
                caption: 'Inspiring keynotes from industry leaders',
              },
              {
                url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
                alt: 'Networking event',
                caption: '5000+ attendees from 50+ countries',
              },
              {
                url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
                alt: 'Workshop session',
                caption: '50+ hands-on workshops',
              },
              {
                url: 'https://images.unsplash.com/photo-1519167758481-83f29da8c310?w=800',
                alt: 'Exhibition floor',
                caption: '200+ exhibitors showcasing innovations',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'OffersSection',
          order: 2,
          props: {
            heading: 'Ticket Options',
            subheading: 'Choose the pass that fits your needs',
            offers: [
              {
                id: '1',
                title: 'Early Bird Pass',
                description: 'Full 3-day access to all sessions, workshops, and networking events',
                discount: 'SAVE $200',
                validUntil: '2024-04-15',
                image: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=600',
                ctaText: 'Buy Now - $499',
                ctaLink: '#',
              },
              {
                id: '2',
                title: 'VIP Experience',
                description: 'Everything in Early Bird plus exclusive speaker dinners and lounge access',
                discount: 'LIMITED',
                validUntil: '2024-05-01',
                image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600',
                ctaText: 'Buy Now - $999',
                ctaLink: '#',
              },
              {
                id: '3',
                title: 'Student Pass',
                description: 'Full access for students and educators with valid ID',
                discount: '70% OFF',
                validUntil: '2024-06-01',
                image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600',
                ctaText: 'Buy Now - $199',
                ctaLink: '#',
              },
            ],
          },
        },
        {
          id: '4',
          type: 'TestimonialsSection',
          order: 3,
          props: {
            heading: 'Hear From Past Attendees',
            testimonials: [
              {
                id: '1',
                name: 'Jennifer Wu',
                comment: 'TechSummit is where I met my co-founder and secured our Series A funding. The networking opportunities are unmatched.',
                image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
                rating: 5,
              },
              {
                id: '2',
                name: 'Carlos Rodriguez',
                comment: 'The workshops are incredibly valuable. I learned cutting-edge techniques I implemented immediately at my company.',
                image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
                rating: 5,
              },
              {
                id: '3',
                name: 'Aisha Patel',
                comment: 'Best tech conference I have attended. The speaker lineup is world-class and the content is always cutting-edge.',
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
                rating: 5,
              },
            ],
          },
        },
        {
          id: '5',
          type: 'CTASection',
          order: 4,
          props: {
            heading: 'Do not Miss TechSummit 2024',
            description: 'Join 5000+ innovators shaping the future of technology. Early bird pricing ends April 15th!',
            ctaText: 'Register Now',
            ctaLink: '#offers',
            backgroundColor: '#6366F1',
            textColor: '#FFFFFF',
          },
        },
        {
          id: '6',
          type: 'FooterSection',
          order: 5,
          props: {
            businessName: 'TechSummit',
            tagline: 'Where innovation happens',
            address: 'San Francisco Convention Center, 747 Howard St, SF, CA 94103',
            phone: '+1 (555) 123-TECH',
            email: 'info@techsummit.com',
            socialLinks: [
              { platform: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
              { platform: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
              { platform: 'YouTube', url: 'https://youtube.com', icon: '📺' },
            ],
          },
        },
      ],
    },
  },

  // 5. CONSULTING SERVICES (professional) - Hero → Services → About → Testimonials → CTA → Footer
  {
    id: 'consulting-services',
    name: 'Consulting Services',
    description: 'Services-heavy consulting firm with expertise showcase and credibility',
    category: 'professional',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    config: {
      metadata: {
        projectName: 'Consulting Services',
        clientName: 'Strategic Advisors Group',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'Strategic Advisors Group | Management Consulting Excellence',
        description: 'Transform your business with proven strategies from Fortune 500 consultants',
        keywords: ['consulting', 'management', 'strategy', 'business', 'advisory'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'I would like to discuss consulting services',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'Transform Your Business',
            subheading: 'Strategic consulting that delivers measurable results',
            ctaText: 'Schedule Consultation',
            ctaLink: '#contact',
            backgroundImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600',
            backgroundColor: '#1E40AF',
            textColor: '#FFFFFF',
            overlayOpacity: 0.7,
          },
        },
        {
          id: '2',
          type: 'ServicesSection',
          order: 1,
          props: {
            heading: 'Our Expertise',
            subheading: 'Comprehensive consulting services tailored to your needs',
            services: [
              {
                id: '1',
                icon: '📊',
                title: 'Business Strategy',
                description: 'Develop winning strategies for growth, market entry, and competitive advantage',
              },
              {
                id: '2',
                icon: '⚙️',
                title: 'Operational Excellence',
                description: 'Optimize processes, reduce costs, and improve efficiency across your organization',
              },
              {
                id: '3',
                icon: '💼',
                title: 'Digital Transformation',
                description: 'Modernize your business with technology-driven solutions and digital strategies',
              },
              {
                id: '4',
                icon: '📈',
                title: 'Change Management',
                description: 'Lead successful organizational changes with proven methodologies and frameworks',
              },
              {
                id: '5',
                icon: '🎯',
                title: 'Performance Improvement',
                description: 'Maximize ROI through data-driven performance optimization and KPI management',
              },
              {
                id: '6',
                icon: '🌐',
                title: 'Market Expansion',
                description: 'Enter new markets confidently with comprehensive research and go-to-market strategies',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'AboutSection',
          order: 2,
          props: {
            heading: 'Why Choose Us',
            description: 'With over 25 years of experience and 500+ successful engagements, Strategic Advisors Group brings Fortune 500 expertise to businesses of all sizes. Our consultants have led transformations at the world\'s most respected companies.',
            image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
            imageAlt: 'Consulting team meeting',
            features: [
              '500+ successful client engagements',
              'Average 35% improvement in key metrics',
              'Former executives from McKinsey, BCG, and Bain',
              '98% client satisfaction rate',
            ],
          },
        },
        {
          id: '4',
          type: 'TestimonialsSection',
          order: 3,
          props: {
            heading: 'Client Success Stories',
            testimonials: [
              {
                id: '1',
                name: 'Robert Chen',
                comment: 'Strategic Advisors helped us increase operational efficiency by 40% and reduce costs by $12M annually. Their expertise was invaluable.',
                image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
                rating: 5,
              },
              {
                id: '2',
                name: 'Lisa Thompson',
                comment: 'The digital transformation roadmap they created positioned us perfectly for future growth. Revenue increased 55% in 18 months.',
                image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
                rating: 5,
              },
              {
                id: '3',
                name: 'Ahmed Hassan',
                comment: 'Their strategic insights and hands-on approach delivered results beyond our expectations. True partners in our success.',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
                rating: 5,
              },
            ],
          },
        },
        {
          id: '5',
          type: 'CTASection',
          order: 4,
          props: {
            heading: 'Ready to Transform Your Business?',
            description: 'Schedule a complimentary consultation to discuss how we can help you achieve your goals',
            ctaText: 'Book Free Consultation',
            ctaLink: '#contact',
            backgroundColor: '#1E40AF',
            textColor: '#FFFFFF',
          },
        },
        {
          id: '6',
          type: 'FooterSection',
          order: 5,
          props: {
            businessName: 'Strategic Advisors Group',
            tagline: 'Transforming businesses, delivering results',
            address: '1 Executive Plaza, Suite 2000, Chicago, IL 60601',
            phone: '+1 (555) 246-8100',
            email: 'contact@strategicadvisors.com',
            socialLinks: [
              { platform: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
              { platform: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
            ],
          },
        },
      ],
    },
  },

  // 6. MODERN FOOD DELIVERY (modern) - Hero → Menu → Gallery → About → CTA → Footer
  {
    id: 'modern-food-delivery',
    name: 'Modern Food Delivery',
    description: 'Vibrant food delivery service with animated menu and bold colors',
    category: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    config: {
      metadata: {
        projectName: 'Modern Food Delivery',
        clientName: 'Rimberio Restaurant',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'Rimberio | Your Favorite Meals Delivered Fast',
        description: 'Fresh, delicious meals delivered to your door in 30 minutes',
        keywords: ['food delivery', 'restaurant', 'fast food', 'burgers', 'delivery'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'Hello! I would like to order...',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'YOUR FAVORITE MEALS',
            subheading: 'Delivered Fast ⚡',
            ctaText: 'ORDER NOW',
            ctaLink: '#menu',
            backgroundImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600',
            backgroundColor: '#FFF5E6',
            textColor: '#1F2937',
            overlayOpacity: 0.3,
          },
        },
        {
          id: '2',
          type: 'MenuSection',
          order: 1,
          props: {
            heading: 'Featured Dishes',
            subheading: 'Our most loved creations',
            categories: ['All', 'Burgers', 'Steak', 'Salads', 'Desserts'],
            backgroundColor: '#FFFFFF',
            menuItems: [
              {
                id: '1',
                category: 'Burgers',
                name: 'Classic Cheeseburger',
                description: 'Juicy beef patty with cheddar, lettuce, tomato, and special sauce',
                price: '$12.99',
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
              },
              {
                id: '2',
                category: 'Steak',
                name: 'Grilled Ribeye',
                description: 'Premium ribeye with garlic butter and seasonal vegetables',
                price: '$28.99',
                image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
              },
              {
                id: '3',
                category: 'Salads',
                name: 'Fresh Garden Salad',
                description: 'Mixed greens with fruits, nuts, and house vinaigrette',
                price: '$10.99',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
              },
              {
                id: '4',
                category: 'Burgers',
                name: 'Double Bacon Burger',
                description: 'Two patties, crispy bacon, cheese, and BBQ sauce',
                price: '$15.99',
                image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'GallerySection',
          order: 2,
          props: {
            heading: 'for hungry foodies',
            images: [
              {
                url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
                alt: 'Strawberry Pancake',
                caption: 'Breakfast Favorites',
              },
              {
                url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
                alt: 'Pasta',
                caption: 'Cheesy Pasta Delights',
              },
              {
                url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
                alt: 'Tacos',
                caption: 'Mexican Street Tacos',
              },
              {
                url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800',
                alt: 'Spaghetti',
                caption: 'Spicy Spaghetti',
              },
            ],
          },
        },
        {
          id: '4',
          type: 'AboutSection',
          order: 3,
          props: {
            heading: 'Fresh Ingredients, Bold Flavors',
            description: 'At Rimberio, we believe in serving only the freshest, highest-quality meals. Our chefs prepare every dish with care, using locally-sourced ingredients and time-honored recipes.',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
            imageAlt: 'Chef preparing food',
            features: [
              '30-minute delivery guarantee',
              '100% fresh ingredients daily',
              'Award-winning chef team',
              '5-star customer ratings',
            ],
          },
        },
        {
          id: '5',
          type: 'CTASection',
          order: 4,
          props: {
            heading: 'Ready to Order?',
            description: 'Get your favorite meals delivered in 30 minutes or less',
            ctaText: 'Order on WhatsApp',
            ctaLink: 'https://wa.me/1234567890',
            backgroundColor: '#DC2626',
            textColor: '#FFFFFF',
          },
        },
        {
          id: '6',
          type: 'FooterSection',
          order: 5,
          props: {
            businessName: 'Rimberio',
            tagline: 'Fast delivery, fresh food',
            address: '123 Food Street, Culinary District',
            phone: '+1 (555) FOOD-123',
            email: 'order@rimberio.com',
            socialLinks: [
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
              { platform: 'Facebook', url: 'https://facebook.com', icon: '📘' },
            ],
          },
        },
      ],
    },
  },

  // 7. CREATIVE AGENCY (minimalist) - About → Services → Gallery → CTA → Footer
  {
    id: 'creative-agency',
    name: 'Creative Agency',
    description: 'No hero section! Starts with philosophy, showcases services and work',
    category: 'minimalist',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400',
    config: {
      metadata: {
        projectName: 'Creative Agency',
        clientName: 'Pixel & Code Studio',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'Pixel & Code Studio | Digital Design & Development Agency',
        description: 'Award-winning creative agency specializing in brand identity, web design, and digital experiences',
        keywords: ['creative agency', 'web design', 'branding', 'digital', 'design studio'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'I would like to discuss a project',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'AboutSection',
          order: 0,
          props: {
            heading: 'We Create Digital Experiences',
            description: 'Pixel & Code is an award-winning creative studio that combines strategic thinking with beautiful design. We partner with ambitious brands to create digital experiences that drive growth and inspire audiences.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
            imageAlt: 'Creative team brainstorming',
            features: [
              'Webby Award & FWA recognized work',
              'Partnered with Nike, Google, and Airbnb',
              '50+ projects launched in 2023',
              'Remote-first team across 12 countries',
            ],
          },
        },
        {
          id: '2',
          type: 'ServicesSection',
          order: 1,
          props: {
            heading: 'What We Do',
            subheading: 'Full-service creative solutions',
            services: [
              {
                id: '1',
                icon: '🎨',
                title: 'Brand Identity',
                description: 'Create memorable brands with logos, guidelines, and visual systems',
              },
              {
                id: '2',
                icon: '💻',
                title: 'Web Design & Development',
                description: 'Beautiful, responsive websites built with modern technology',
              },
              {
                id: '3',
                icon: '📱',
                title: 'Digital Products',
                description: 'Native and web apps designed for exceptional user experiences',
              },
              {
                id: '4',
                icon: '🎬',
                title: 'Motion & Animation',
                description: 'Bring your brand to life with engaging motion design',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'GallerySection',
          order: 2,
          props: {
            heading: 'Featured Work',
            images: [
              {
                url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
                alt: 'Nike Digital Campaign',
                caption: 'Nike - Digital Campaign Platform',
              },
              {
                url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800',
                alt: 'Airbnb Brand Refresh',
                caption: 'Airbnb - Brand Guidelines System',
              },
              {
                url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
                alt: 'Google Dashboard',
                caption: 'Google - Analytics Dashboard',
              },
              {
                url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
                alt: 'Fintech App',
                caption: 'Fintech Startup - Mobile Banking App',
              },
              {
                url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
                alt: 'E-commerce Platform',
                caption: 'Fashion Brand - E-commerce Platform',
              },
              {
                url: 'https://images.unsplash.com/photo-1504270997636-07ddfbd48945?w=800',
                alt: 'SaaS Product',
                caption: 'SaaS Company - Product Interface',
              },
            ],
          },
        },
        {
          id: '4',
          type: 'CTASection',
          order: 3,
          props: {
            heading: 'Let\'s Build Something Great',
            description: 'Have a project in mind? We would love to hear about it.',
            ctaText: 'Start a Project',
            ctaLink: '#contact',
            backgroundColor: '#000000',
            textColor: '#FFFFFF',
          },
        },
        {
          id: '5',
          type: 'FooterSection',
          order: 4,
          props: {
            businessName: 'Pixel & Code Studio',
            tagline: 'Design. Develop. Deliver.',
            address: 'Remote Studio - Worldwide',
            phone: '+1 (555) PIXEL-CO',
            email: 'hello@pixelandcode.studio',
            socialLinks: [
              { platform: 'Dribbble', url: 'https://dribbble.com', icon: '🏀' },
              { platform: 'Behance', url: 'https://behance.net', icon: '🎨' },
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
              { platform: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
            ],
          },
        },
      ],
    },
  },
  // 8. PIZZA RESTAURANT (modern) - Hero → Menu → Gallery → Testimonials → CTA → Footer
  {
    id: 'pizza-restaurant',
    name: 'Artisan Pizza Restaurant',
    description: 'Homemade pizza restaurant with authentic Italian flavors',
    category: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    config: {
      metadata: {
        projectName: 'Artisan Pizza Restaurant',
        clientName: 'Mama\'s Kitchen',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'Mama\'s Kitchen | The Best Homemade Pizza in Town',
        description: 'Authentic Italian pizza made with love using traditional family recipes',
        keywords: ['pizza', 'italian restaurant', 'homemade', 'pizza delivery', 'authentic'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'I\'d like to order a pizza!',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'The Best Homemade Pizza in Town!',
            subheading: 'Made with love using grandmother\'s secret recipe',
            ctaText: 'ORDER NOW',
            ctaLink: '#menu',
            backgroundImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600',
            backgroundColor: '#7F1D1D',
            textColor: '#FFFFFF',
            overlayOpacity: 0.5,
          },
        },
        {
          id: '2',
          type: 'MenuSection',
          order: 1,
          props: {
            heading: 'Our Signature Pizzas',
            subheading: 'Handmade with fresh ingredients daily',
            categories: ['All', 'Classic', 'Specialty', 'Vegan'],
            backgroundColor: '#FEF3E2',
            menuItems: [
              {
                id: '1',
                category: 'Specialty',
                name: 'Vegetarian Delight',
                description: 'Olive oil, zucchini, eggplant, peppers, mozzarella, tomato sauce',
                price: '$16.99',
                image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400',
              },
              {
                id: '2',
                category: 'Specialty',
                name: 'Spinach & Ricotta',
                description: 'Fresh spinach, creamy ricotta cheese, garlic, and herbs',
                price: '$17.99',
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
              },
              {
                id: '3',
                category: 'Specialty',
                name: 'Mushroom Supreme',
                description: 'Beef, porcini mushrooms, champignons, parsley, mozzarella',
                price: '$19.99',
                image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400',
              },
              {
                id: '4',
                category: 'Classic',
                name: 'Margherita',
                description: 'Traditional tomato sauce, fresh mozzarella, basil',
                price: '$14.99',
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'GallerySection',
          order: 2,
          props: {
            heading: 'Fresh, Hot Pizza',
            images: [
              {
                url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
                alt: 'Freshly baked pizza',
                caption: 'Straight from our wood-fired oven',
              },
              {
                url: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800',
                alt: 'Mushroom pizza',
                caption: 'Loaded with toppings',
              },
              {
                url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800',
                alt: 'Pizza slice',
                caption: 'Every slice perfect',
              },
              {
                url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
                alt: 'Making pizza',
                caption: 'Handcrafted with care',
              },
            ],
          },
        },
        {
          id: '4',
          type: 'TestimonialsSection',
          order: 3,
          props: {
            heading: 'What Our Customers Say',
            testimonials: [
              {
                id: '1',
                name: 'Tony Martinez',
                comment: 'Best pizza I\'ve had outside of Italy! The crust is perfect and toppings are always fresh.',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
                rating: 5,
              },
              {
                id: '2',
                name: 'Sofia Romano',
                comment: 'Mama\'s recipes remind me of my childhood in Naples. Absolutely authentic!',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                rating: 5,
              },
            ],
          },
        },
        {
          id: '5',
          type: 'CTASection',
          order: 4,
          props: {
            heading: 'Hungry Yet?',
            description: 'Order now and taste the difference',
            ctaText: 'Order Via WhatsApp',
            ctaLink: 'https://wa.me/1234567890',
            backgroundColor: '#7F1D1D',
            textColor: '#FFFFFF',
          },
        },
        {
          id: '6',
          type: 'FooterSection',
          order: 5,
          props: {
            businessName: 'Mama\'s Kitchen',
            tagline: 'Homemade pizza with love',
            address: '123 Anywhere St., Any City',
            phone: '123-456-7890',
            email: '@reallygreatsite',
            socialLinks: [
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
              { platform: 'Facebook', url: 'https://facebook.com', icon: '📘' },
            ],
          },
        },
      ],
    },
  },

  // 9. PAINTING SERVICE (professional) - Hero → Services → About → Gallery → CTA → Footer
  {
    id: 'painting-service',
    name: 'Professional Painting Service',
    description: 'Home painting contractor with color showcase and portfolio',
    category: 'professional',
    thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
    config: {
      metadata: {
        projectName: 'Professional Painting Service',
        clientName: 'PAT\'S Painting Inc.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'PAT\'S Painting Inc. | Color That Stands the Test of Time',
        description: 'Professional interior and exterior painting with attention to detail',
        keywords: ['painting', 'interior painting', 'exterior painting', 'home improvement', 'contractor'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'I\'d like a quote for painting services',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'Color that stands the test of time',
            subheading: 'Interior and exterior painting done with proper prep and attention to detail',
            ctaText: 'EXPLORE',
            ctaLink: '#services',
            backgroundImage: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1600',
            backgroundColor: '#059669',
            textColor: '#FFFFFF',
            overlayOpacity: 0.3,
          },
        },
        {
          id: '2',
          type: 'ServicesSection',
          order: 1,
          props: {
            heading: 'Our Services',
            subheading: 'Professional painting solutions for your home',
            services: [
              {
                id: '1',
                icon: '🏠',
                title: 'Interior Painting',
                description: 'Transform your living spaces with professional interior painting',
              },
              {
                id: '2',
                icon: '🌟',
                title: 'Exterior Painting',
                description: 'Protect and beautify your home with weather-resistant exterior paint',
              },
              {
                id: '3',
                icon: '🎨',
                title: 'Color Consultation',
                description: 'Expert guidance to choose the perfect colors for your space',
              },
              {
                id: '4',
                icon: '✨',
                title: 'Surface Preparation',
                description: 'Proper prep work ensures a flawless, long-lasting finish',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'AboutSection',
          order: 2,
          props: {
            heading: 'Our crew',
            description: 'A local Bayview team that respects your time, your home, and your floors. We show up when we say we will, work carefully and efficiently, and leave your space spotless. From start to finish, you can count on us to deliver reliable service with pride and professionalism across the entire Bayview area.',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
            imageAlt: 'Professional painting crew',
            features: [
              'Licensed and insured professionals',
              '15+ years of experience',
              '100% satisfaction guarantee',
              'Eco-friendly paint options',
            ],
          },
        },
        {
          id: '4',
          type: 'GallerySection',
          order: 3,
          props: {
            heading: 'Our Recent Projects',
            images: [
              {
                url: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800',
                alt: 'Green living room',
                caption: 'Modern Living Room - Forest Green',
              },
              {
                url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
                alt: 'Blue bedroom',
                caption: 'Serene Bedroom - Soft Blue',
              },
              {
                url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
                alt: 'Beige kitchen',
                caption: 'Warm Kitchen - Beige Tones',
              },
              {
                url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
                alt: 'Gray office',
                caption: 'Professional Office - Modern Gray',
              },
            ],
          },
        },
        {
          id: '5',
          type: 'CTASection',
          order: 4,
          props: {
            heading: 'Ready to Transform Your Space?',
            description: 'Get a free quote today and see the difference quality makes',
            ctaText: 'Contact Us',
            ctaLink: 'https://wa.me/1234567890',
            backgroundColor: '#059669',
            textColor: '#FFFFFF',
          },
        },
        {
          id: '6',
          type: 'FooterSection',
          order: 5,
          props: {
            businessName: 'PAT\'S Painting Inc.',
            tagline: 'Quality painting, every time',
            address: 'Bayview Area',
            phone: '(555) 123-4567',
            email: 'info@patspainting.com',
            socialLinks: [
              { platform: 'Facebook', url: 'https://facebook.com', icon: '📘' },
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
            ],
          },
        },
      ],
    },
  },

  // 10. FURNITURE STORE (minimalist) - Hero → Gallery → Services → About → CTA → Footer
  {
    id: 'furniture-store',
    name: 'Modern Furniture Store',
    description: 'Minimalist furniture showroom with elegant product displays',
    category: 'minimalist',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    config: {
      metadata: {
        projectName: 'Modern Furniture Store',
        clientName: 'Hanover & Tyke',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'Hanover & Tyke | Timeless Design, Premium Materials',
        description: 'Modern minimalist furniture for contemporary living spaces',
        keywords: ['furniture', 'modern furniture', 'minimalist design', 'home decor', 'interior'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'I\'m interested in your furniture collection',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'Timeless Design,\nPremium Materials',
            subheading: 'Whether you love modern minimalism, timeless classics, or bold statement pieces',
            ctaText: 'LEARN MORE',
            ctaLink: '#products',
            backgroundImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600',
            backgroundColor: '#F5F3EF',
            textColor: '#3E2723',
            overlayOpacity: 0.2,
          },
        },
        {
          id: '2',
          type: 'GallerySection',
          order: 1,
          props: {
            heading: 'Featured Collection',
            images: [
              {
                url: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800',
                alt: 'Minimal Sofa',
                caption: 'Minimal Sofa - Tailor-made pieces',
              },
              {
                url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
                alt: 'Coffee Tables',
                caption: 'Coffee Tables - Quality furniture',
              },
              {
                url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
                alt: 'Decorations',
                caption: 'Decorations - Beauty meets responsibility',
              },
              {
                url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800',
                alt: 'Modern Armchair',
                caption: 'Modern Armchair - $899',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'ServicesSection',
          order: 2,
          props: {
            heading: 'Why Choose Us',
            subheading: 'Quality and craftsmanship in every piece',
            services: [
              {
                id: '1',
                icon: '✨',
                title: 'High Quality',
                description: 'Premium materials and expert craftsmanship',
              },
              {
                id: '2',
                icon: '🎨',
                title: 'Premium Design',
                description: 'Timeless aesthetics that never go out of style',
              },
              {
                id: '3',
                icon: '🔄',
                title: 'Versatile',
                description: 'Pieces that adapt to any living space',
              },
              {
                id: '4',
                icon: '🌿',
                title: 'Sustainable',
                description: 'Eco-friendly materials and processes',
              },
            ],
          },
        },
        {
          id: '4',
          type: 'AboutSection',
          order: 3,
          props: {
            heading: 'Craftsmanship Meets Modern Living',
            description: 'Each piece in our collection is thoughtfully designed and crafted with premium materials. We believe furniture should be an investment in your comfort and style, built to last for generations.',
            image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800',
            imageAlt: 'Furniture craftsmanship',
            features: [
              'Handcrafted with premium materials',
              'Lifetime warranty on all pieces',
              'Custom sizing available',
              'White-glove delivery service',
            ],
          },
        },
        {
          id: '5',
          type: 'CTASection',
          order: 4,
          props: {
            heading: 'Transform Your Space Today',
            description: 'Visit our showroom or chat with us on WhatsApp',
            ctaText: 'Visit Showroom',
            ctaLink: '#contact',
            backgroundColor: '#3E2723',
            textColor: '#FFFFFF',
          },
        },
        {
          id: '6',
          type: 'FooterSection',
          order: 5,
          props: {
            businessName: 'Hanover & Tyke',
            tagline: 'Timeless furniture for modern living',
            address: '123 Design Street, NYC',
            phone: '(555) 789-0123',
            email: 'info@hanoverandtyke.com',
            socialLinks: [
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
              { platform: 'Pinterest', url: 'https://pinterest.com', icon: '📌' },
            ],
          },
        },
      ],
    },
  },

  // 11. CATERING SERVICE (professional) - Hero → Services → Gallery → About → CTA → Footer
  {
    id: 'catering-service',
    name: 'Professional Catering',
    description: 'Catering service for events with menu variety and buffet options',
    category: 'professional',
    thumbnail: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400',
    config: {
      metadata: {
        projectName: 'Professional Catering',
        clientName: 'Borcelle Catering',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'Borcelle Catering | Elevate Your Next Party',
        description: 'Handcrafted meals, buffet service, and stress-free catering from local experts',
        keywords: ['catering', 'event catering', 'buffet', 'corporate events', 'party catering'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'I\'d like to inquire about catering services',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'Elevate Your Next Party',
            subheading: 'Handcrafted meals, buffet service, and stress-free catering from local experts',
            ctaText: 'BOOK NOW',
            ctaLink: '#contact',
            backgroundImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1600',
            backgroundColor: '#92400E',
            textColor: '#FFFFFF',
            overlayOpacity: 0.4,
          },
        },
        {
          id: '2',
          type: 'ServicesSection',
          order: 1,
          props: {
            heading: 'Catering Options',
            subheading: 'Services tailored to your event',
            services: [
              {
                id: '1',
                icon: '🍳',
                title: 'Breakfast Trays',
                description: 'Start your morning events with fresh breakfast selections',
              },
              {
                id: '2',
                icon: '💼',
                title: 'Corporate Events',
                description: 'Professional catering for business meetings and conferences',
              },
              {
                id: '3',
                icon: '🎄',
                title: 'Holiday Buffet',
                description: 'Festive spreads for your seasonal celebrations',
              },
              {
                id: '4',
                icon: '📋',
                title: 'Menu Variety',
                description: 'Diverse options to suit all tastes and dietary needs',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'GallerySection',
          order: 2,
          props: {
            heading: 'Our Catering in Action',
            images: [
              {
                url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
                alt: 'Buffet spread',
                caption: 'Full-service buffet catering',
              },
              {
                url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
                alt: 'Corporate event',
                caption: 'Corporate event catering',
              },
              {
                url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
                alt: 'Wedding catering',
                caption: 'Elegant wedding receptions',
              },
              {
                url: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800',
                alt: 'Breakfast tray',
                caption: 'Fresh breakfast trays',
              },
            ],
          },
        },
        {
          id: '4',
          type: 'AboutSection',
          order: 3,
          props: {
            heading: 'Trusted by the Bayview Community',
            description: 'Borcelle has been serving the local community with exceptional catering for over a decade. Our experienced team handles everything from intimate gatherings to large corporate events with the same level of care and attention to detail.',
            image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
            imageAlt: 'Catering chef',
            features: [
              '500+ successful events catered',
              'Locally-sourced ingredients',
              'Full-service setup and cleanup',
              'Custom menu planning available',
            ],
          },
        },
        {
          id: '5',
          type: 'CTASection',
          order: 4,
          props: {
            heading: 'Ready to Book?',
            description: 'Contact us today for a free consultation and menu tasting',
            ctaText: 'Contact Us',
            ctaLink: 'https://wa.me/1234567890',
            backgroundColor: '#92400E',
            textColor: '#FFFFFF',
          },
        },
        {
          id: '6',
          type: 'FooterSection',
          order: 5,
          props: {
            businessName: 'Borcelle Catering',
            tagline: 'Making your events memorable',
            address: 'Bayview Area',
            phone: '+123-456-7890',
            email: 'contact@borcelle.com',
            socialLinks: [
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
              { platform: 'Facebook', url: 'https://facebook.com', icon: '📘' },
            ],
          },
        },
      ],
    },
  },

  // 12. RESTAURANT DISCOVERY (modern) - Hero → Menu → Gallery → CTA → Footer
  {
    id: 'restaurant-discovery',
    name: 'Restaurant Discovery Platform',
    description: 'Food discovery platform showcasing restaurants and delicious dishes',
    category: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    config: {
      metadata: {
        projectName: 'Restaurant Discovery',
        clientName: 'Larana Inc.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'Larana Inc. | Discover Restaurant & Delicious Food',
        description: 'Find the best restaurants and food experiences near you',
        keywords: ['restaurant', 'food discovery', 'dining', 'cuisine', 'foodie'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'Tell me more about featured restaurants',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'Discover Restaurant & Delicious Food',
            subheading: 'Explore the finest dining experiences in your city',
            ctaText: 'ORDER NOW',
            ctaLink: '#menu',
            backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600',
            backgroundColor: '#000000',
            textColor: '#FFFFFF',
            overlayOpacity: 0.6,
          },
        },
        {
          id: '2',
          type: 'MenuSection',
          order: 1,
          props: {
            heading: 'Featured Dishes',
            subheading: 'Curated selections from top restaurants',
            categories: ['All', 'Main Course', 'Appetizers', 'Desserts'],
            backgroundColor: '#FFFFFF',
            menuItems: [
              {
                id: '1',
                category: 'Main Course',
                name: 'Grilled Chicken',
                description: 'Perfectly seasoned and grilled to perfection',
                price: '$18',
                image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
              },
              {
                id: '2',
                category: 'Main Course',
                name: 'Seafood Platter',
                description: 'Fresh catch of the day with seasonal vegetables',
                price: '$32',
                image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400',
              },
              {
                id: '3',
                category: 'Appetizers',
                name: 'Caesar Salad',
                description: 'Classic caesar with crispy croutons and parmesan',
                price: '$12',
                image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
              },
              {
                id: '4',
                category: 'Desserts',
                name: 'Chocolate Lava Cake',
                description: 'Rich molten chocolate with vanilla ice cream',
                price: '$10',
                image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'GallerySection',
          order: 2,
          props: {
            heading: 'Food Gallery',
            images: [
              {
                url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
                alt: 'Gourmet dish',
                caption: 'Gourmet dining experience',
              },
              {
                url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800',
                alt: 'Fresh salad',
                caption: 'Farm-fresh ingredients',
              },
              {
                url: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800',
                alt: 'Fine dining',
                caption: 'Five-star presentations',
              },
              {
                url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800',
                alt: 'Dessert platter',
                caption: 'Sweet endings',
              },
            ],
          },
        },
        {
          id: '4',
          type: 'CTASection',
          order: 3,
          props: {
            heading: 'Start Your Culinary Journey',
            description: 'Discover amazing restaurants and order your favorite dishes',
            ctaText: 'Explore Now',
            ctaLink: '#menu',
            backgroundColor: '#FF5722',
            textColor: '#FFFFFF',
          },
        },
        {
          id: '5',
          type: 'FooterSection',
          order: 4,
          props: {
            businessName: 'Larana, Inc.',
            tagline: 'Your guide to great food',
            address: 'Worldwide Service',
            phone: '1-800-LARANA',
            email: 'discover@larana.com',
            socialLinks: [
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
              { platform: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
              { platform: 'Facebook', url: 'https://facebook.com', icon: '📘' },
            ],
          },
        },
      ],
    },
  },

  // 13. BORCELLE CATERING SERVICE (professional) - Hero with Service Tags → Services → CTA → Footer
  {
    id: 'borcelle-catering',
    name: 'Borcelle Catering Service',
    description: 'Professional catering service with elegant split-screen hero and service highlights',
    category: 'professional',
    thumbnail: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400',
    config: {
      metadata: {
        projectName: 'Borcelle Catering',
        clientName: 'Borcelle',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'Borcelle | Professional Catering Service',
        description: 'Elevate your next party with handcrafted meals, buffet service, and stress-free catering from local experts',
        keywords: ['catering', 'buffet', 'events', 'corporate', 'breakfast', 'party'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'Hello! I would like to book catering services',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'CATERING SERVICE',
            subheading: 'Elevate your next party with handcrafted meals, buffet service, and stress-free catering from local experts.',
            ctaText: 'BOOK NOW',
            ctaLink: '#contact',
            backgroundImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1600',
            backgroundColor: '#FFFFFF',
            textColor: '#2D2D2D',
            overlayOpacity: 0,
          },
        },
        {
          id: '2',
          type: 'ServicesSection',
          order: 1,
          props: {
            heading: 'Our Catering Options',
            subheading: 'Choose from our professional services',
            backgroundColor: '#F8F8F8',
            columns: 4,
            services: [
              {
                id: '1',
                icon: '🍳',
                title: 'Breakfast Trays',
                description: 'Start your day right with our gourmet breakfast selections',
              },
              {
                id: '2',
                icon: '🏢',
                title: 'Corporate Events',
                description: 'Professional catering for your business meetings and conferences',
              },
              {
                id: '3',
                icon: '🎄',
                title: 'Holiday Buffet',
                description: 'Festive spreads for your special celebrations',
              },
              {
                id: '4',
                icon: '🍽️',
                title: 'Menu Variety',
                description: 'Customizable menus to suit any taste or dietary requirement',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'CTASection',
          order: 2,
          props: {
            heading: 'Ready to Elevate Your Event?',
            description: 'Contact us today to discuss your catering needs and get a custom quote',
            ctaText: 'Get Started',
            ctaLink: '#contact',
            backgroundImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600',
            backgroundColor: '#C85A28',
            textColor: '#FFFFFF',
          },
        },
        {
          id: '4',
          type: 'FooterSection',
          order: 3,
          props: {
            businessName: 'Borcelle',
            tagline: 'Professional Catering Excellence',
            address: '123 Culinary Street, Food City, FC 12345',
            phone: '+123-456-7890',
            email: 'hello@borcelle.com',
            backgroundColor: '#2D2D2D',
            textColor: '#FFFFFF',
            socialLinks: [
              { platform: 'Facebook', url: 'https://facebook.com', icon: '📘' },
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
              { platform: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
            ],
          },
        },
      ],
    },
  },

  // 14. LARANA RESTAURANT DISCOVERY (modern) - Hero with Food Cards → About → Gallery → Footer
  {
    id: 'larana-restaurant-discovery',
    name: 'Larana Restaurant Discovery',
    description: 'Modern restaurant discovery platform with dark theme and food showcase',
    category: 'modern',
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    config: {
      metadata: {
        projectName: 'Larana Restaurant',
        clientName: 'Larana, Inc.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      seo: {
        title: 'Larana, Inc. | Discover Restaurant & Delicious Food',
        description: 'Explore amazing restaurants and delicious food experiences',
        keywords: ['restaurant', 'food', 'dining', 'discovery', 'gourmet'],
      },
      whatsapp: {
        enabled: true,
        phoneNumber: '1234567890',
        defaultMessage: 'Hello! I would like to make a reservation',
        position: 'bottom-right',
      },
      sections: [
        {
          id: '1',
          type: 'HeroSection',
          order: 0,
          props: {
            heading: 'Discover Restaurant & Delicious Food',
            subheading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ipsum augue, tincidunt ut arcu id, venenatis efficitur leo.',
            ctaText: 'ORDER NOW',
            ctaLink: '#menu',
            backgroundImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600',
            backgroundColor: '#0D0D0D',
            textColor: '#FFFFFF',
            overlayOpacity: 0.7,
          },
        },
        {
          id: '2',
          type: 'ServicesSection',
          order: 1,
          props: {
            heading: 'Featured Dishes',
            subheading: 'Our signature creations',
            backgroundColor: '#0D0D0D',
            columns: 2,
            services: [
              {
                id: '1',
                icon: '⭐',
                title: 'FOOD NAME',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ipsum augue, tincidunt',
              },
              {
                id: '2',
                icon: '⭐',
                title: 'FOOD NAME',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ipsum augue, tincidunt',
              },
            ],
          },
        },
        {
          id: '3',
          type: 'GallerySection',
          order: 2,
          props: {
            heading: 'Food Gallery',
            subheading: 'Visual feast',
            backgroundColor: '#0D0D0D',
            layout: 'grid',
            columns: 3,
            images: [
              {
                id: '1',
                url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
                alt: 'Gourmet dish 1',
                caption: 'Signature Dish',
              },
              {
                id: '2',
                url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
                alt: 'Gourmet dish 2',
                caption: 'Chef Special',
              },
              {
                id: '3',
                url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
                alt: 'Gourmet dish 3',
                caption: 'House Favorite',
              },
            ],
          },
        },
        {
          id: '4',
          type: 'AboutSection',
          order: 3,
          props: {
            heading: 'About Larana, Inc.',
            description: 'We are dedicated to bringing you the finest dining experiences. Our restaurant discovery platform connects food lovers with the best culinary destinations. From casual dining to fine cuisine, we help you discover your next favorite meal.',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
            imageAlt: 'About Larana',
            imagePosition: 'right',
            backgroundColor: '#1A1A1A',
          },
        },
        {
          id: '5',
          type: 'FooterSection',
          order: 4,
          props: {
            businessName: 'LARANA, INC.',
            tagline: 'Your guide to exceptional dining',
            address: '456 Gourmet Avenue, Culinary District, CD 67890',
            phone: '+1-800-LARANA',
            email: 'discover@larana.com',
            backgroundColor: '#0D0D0D',
            textColor: '#FF6B35',
            socialLinks: [
              { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
              { platform: 'Facebook', url: 'https://facebook.com', icon: '📘' },
              { platform: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
            ],
          },
        },
      ],
    },
  },
];

export const getTemplatesByCategory = (category: Template['category']) => {
  return templates.filter((t) => t.category === category);
};

export const getTemplateById = (id: string) => {
  return templates.find((t) => t.id === id);
};
