import { motion } from 'framer-motion';
import type { FooterSectionProps } from '../types';

const FooterSection = ({
  businessName,
  tagline,
  address,
  phone,
  email,
  socialLinks,
  copyright
}: FooterSectionProps) => {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright || `© ${currentYear} ${businessName}. All rights reserved.`;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8"
        >
          {/* Business Info */}
          <motion.div variants={item}>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 break-words">{businessName}</h3>
            {tagline && (
              <p className="text-gray-400 mb-4 text-sm break-words">{tagline}</p>
            )}
            {address && (
              <div className="flex items-start mb-3">
                <svg
                  className="w-5 h-5 mr-3 flex-shrink-0 mt-1 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-400 text-xs sm:text-sm break-words">{address}</span>
              </div>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={item}>
            <h4 className="text-base sm:text-lg font-semibold mb-4 break-words">Contact Us</h4>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center mb-3 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5 mr-3 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-xs sm:text-sm break-words">{phone}</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center mb-3 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5 mr-3 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs sm:text-sm break-words">{email}</span>
              </a>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div variants={item}>
            <h4 className="text-base sm:text-lg font-semibold mb-4 break-words">Follow Us</h4>
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                  aria-label={social.platform}
                >
                  <span className="text-xl">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-gray-800 mb-8"
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-gray-400 text-xs sm:text-sm"
        >
          <p className="break-words">{copyrightText}</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
