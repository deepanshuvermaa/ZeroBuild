// Example usage of all client-facing components
// This file demonstrates how to use each component with sample data

import {
  HeroSection,
  AboutSection,
  ServicesSection,
  MenuSection,
  GallerySection,
  TestimonialsSection,
  OffersSection,
  CTASection,
  FooterSection,
  FloatingWhatsApp
} from '../components';

const ComponentUsageExample = () => {
  // Sample data for each component

  const heroData = {
    backgroundImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    heading: 'Welcome to Our Restaurant',
    subheading: 'Experience culinary excellence with every dish',
    ctaText: 'View Menu',
    ctaLink: '#menu'
  };

  const aboutData = {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    imageAlt: 'Our Restaurant Interior',
    heading: 'About Our Story',
    description: 'For over 20 years, we have been serving authentic cuisine made with the finest ingredients. Our passion for food and commitment to quality has made us a favorite destination for food lovers.',
    features: [
      'Fresh, locally-sourced ingredients',
      'Award-winning chef with 15+ years experience',
      'Cozy and elegant dining atmosphere',
      'Extensive wine and cocktail selection'
    ]
  };

  const servicesData = {
    heading: 'Our Services',
    subheading: 'Everything you need for a perfect dining experience',
    services: [
      {
        id: '1',
        icon: '🍽️',
        title: 'Dine In',
        description: 'Enjoy our cozy atmosphere and impeccable service in our beautifully designed dining room.'
      },
      {
        id: '2',
        icon: '🚗',
        title: 'Takeaway',
        description: 'Take your favorite dishes home with our convenient takeaway service.'
      },
      {
        id: '3',
        icon: '🎉',
        title: 'Catering',
        description: 'Let us cater your special events with our delicious food and professional service.'
      },
      {
        id: '4',
        icon: '🎂',
        title: 'Private Events',
        description: 'Host your private parties and celebrations in our exclusive event space.'
      },
      {
        id: '5',
        icon: '👨‍🍳',
        title: 'Cooking Classes',
        description: 'Learn from our expert chefs in hands-on cooking classes every weekend.'
      },
      {
        id: '6',
        icon: '🍷',
        title: 'Wine Tasting',
        description: 'Explore our curated wine selection with guided tasting sessions.'
      }
    ]
  };

  const menuData = {
    heading: 'Our Menu',
    categories: ['All', 'Appetizers', 'Main Courses', 'Desserts'],
    items: [
      {
        id: '1',
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with parmesan and croutons',
        price: 12.99,
        category: 'appetizers',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1'
      },
      {
        id: '2',
        name: 'Grilled Salmon',
        description: 'Atlantic salmon with seasonal vegetables',
        price: 28.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288'
      },
      {
        id: '3',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with vanilla ice cream',
        price: 9.99,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51'
      }
    ]
  };

  const galleryData = {
    heading: 'Gallery',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
        alt: 'Restaurant Interior',
        caption: 'Our Beautiful Dining Space'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        alt: 'Restaurant Bar',
        caption: 'Craft Cocktails & Fine Wines'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
        alt: 'Food Plate',
        caption: 'Exquisite Dishes'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c',
        alt: 'Chef Cooking',
        caption: 'Our Talented Chefs'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2',
        alt: 'Dessert',
        caption: 'Delicious Desserts'
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd',
        alt: 'Outdoor Seating',
        caption: 'Al Fresco Dining'
      }
    ]
  };

  const testimonialsData = {
    heading: 'What Our Customers Say',
    testimonials: [
      {
        id: '1',
        name: 'Sarah Johnson',
        rating: 5,
        comment: 'Absolutely amazing experience! The food was incredible and the service was impeccable. Will definitely be back!',
        image: 'https://i.pravatar.cc/150?img=1',
        date: 'November 2024'
      },
      {
        id: '2',
        name: 'Michael Chen',
        rating: 5,
        comment: 'Best restaurant in town! The atmosphere is cozy and the dishes are always perfectly prepared.',
        image: 'https://i.pravatar.cc/150?img=2',
        date: 'October 2024'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        rating: 4,
        comment: 'Great food and wonderful service. The desserts are to die for!',
        image: 'https://i.pravatar.cc/150?img=3',
        date: 'October 2024'
      }
    ]
  };

  const offersData = {
    heading: 'Special Offers',
    offers: [
      {
        id: '1',
        title: 'Happy Hour',
        description: 'Get 50% off all appetizers and drinks from 4-6 PM every weekday!',
        discount: '50% OFF',
        validUntil: 'December 31, 2024',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b'
      },
      {
        id: '2',
        title: 'Family Feast',
        description: 'Special family menu for 4 people. Includes appetizers, main courses, and desserts.',
        discount: '30% OFF',
        validUntil: 'December 31, 2024',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
      },
      {
        id: '3',
        title: 'Weekend Brunch',
        description: 'Unlimited brunch buffet every Saturday and Sunday. Includes bottomless mimosas!',
        discount: '25% OFF',
        validUntil: 'December 31, 2024',
        image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666'
      }
    ]
  };

  const ctaData = {
    heading: 'Ready to Experience Something Special?',
    description: 'Book your table now and join us for an unforgettable dining experience',
    ctaText: 'Reserve Your Table',
    ctaLink: '#reservation',
    backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
  };

  const footerData = {
    businessName: 'Gourmet Restaurant',
    tagline: 'Where Every Meal is a Celebration',
    address: '123 Main Street, Downtown, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@gourmetrestaurant.com',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com', icon: '📘' },
      { platform: 'Instagram', url: 'https://instagram.com', icon: '📷' },
      { platform: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
      { platform: 'TikTok', url: 'https://tiktok.com', icon: '🎵' }
    ]
  };

  const whatsappData = {
    phoneNumber: '+15551234567',
    message: 'Hello! I would like to make a reservation.',
    position: 'right' as const
  };

  return (
    <div className="min-h-screen">
      <HeroSection {...heroData} />
      <AboutSection {...aboutData} />
      <ServicesSection {...servicesData} />
      <MenuSection {...menuData} />
      <GallerySection {...galleryData} />
      <TestimonialsSection {...testimonialsData} />
      <OffersSection {...offersData} />
      <CTASection {...ctaData} />
      <FooterSection {...footerData} />
      <FloatingWhatsApp {...whatsappData} />
    </div>
  );
};

export default ComponentUsageExample;
