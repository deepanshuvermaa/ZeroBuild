import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FooterSectionProps } from '@/types/component.types';
import { extractTextStyle, getTextStyle } from '@/utils/textStyles';

interface PreviewProps {
  id: string;
  props: FooterSectionProps;
  isSelected: boolean;
  onSelect: () => void;
}

const socialIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
};

export const FooterSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  const {
    businessName = 'Your Business',
    tagline = 'Building amazing experiences',
    address = '123 Main Street, City, Country',
    phone = '+1 (234) 567-8900',
    email = 'info@yourbusiness.com',
    socialLinks = [],
    backgroundColor = '#1f2937',
    textColor = '#ffffff',
  } = props;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative cursor-pointer transition-all group',
        isSelected && 'ring-4 ring-blue-500 ring-offset-2'
      )}
    >
      {/* Footer Section Content */}
      <footer
        className="py-8 sm:py-12 px-4 sm:px-6 md:px-8"
        style={{ backgroundColor }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-6 sm:mb-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3
                className="text-xl sm:text-2xl font-bold mb-2 break-words"
                style={{
                  color: textColor,
                  ...getTextStyle(extractTextStyle(props, 'businessName'))
                }}
              >
                {businessName}
              </h3>
              <p
                className="opacity-80 mb-4 text-sm sm:text-base break-words"
                style={{
                  color: textColor,
                  ...getTextStyle(extractTextStyle(props, 'tagline'))
                }}
              >
                {tagline}
              </p>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      style={{ color: textColor }}
                    >
                      {socialIcons[social.platform.toLowerCase()] || social.icon}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h4
                className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 break-words"
                style={{ color: textColor }}
              >
                Contact Us
              </h4>
              <div className="space-y-2 sm:space-y-3">
                {address && (
                  <div className="flex items-start gap-2 sm:gap-3 opacity-80" style={{ color: textColor }}>
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">{address}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-2 sm:gap-3 opacity-80" style={{ color: textColor }}>
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-2 sm:gap-3 opacity-80" style={{ color: textColor }}>
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm break-words">{email}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Business Hours or Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4
                className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 break-words"
                style={{ color: textColor }}
              >
                Business Hours
              </h4>
              <div className="space-y-1 sm:space-y-2 opacity-80 text-xs sm:text-sm" style={{ color: textColor }}>
                <p className="break-words">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="break-words">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="break-words">Sunday: Closed</p>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div
            className="border-t pt-6 sm:pt-8 text-center opacity-70 text-xs sm:text-sm px-4"
            style={{ borderColor: textColor, color: textColor }}
          >
            <p className="break-words">
              © {new Date().getFullYear()} {businessName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Hover Indicator */}
      <div className="absolute inset-0 border-2 border-dashed border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

    </div>
  );
};

