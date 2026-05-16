import { motion } from 'framer-motion';
import type { OffersSectionProps } from '../types';

const OffersSection = ({ heading, offers }: OffersSectionProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12 break-words"
        >
          {heading}
        </motion.h2>

        {/* Offers Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              variants={item}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Discount Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-4 right-4 z-10"
              >
                <div className="bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg">
                  <span className="font-bold text-sm sm:text-base lg:text-lg break-words">{offer.discount}</span>
                </div>
              </motion.div>

              {/* Image */}
              {offer.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 break-words">
                  {offer.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed break-words">
                  {offer.description}
                </p>

                {/* Valid Until */}
                {offer.validUntil && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4">
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="break-words">Valid until {offer.validUntil}</span>
                  </div>
                )}

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition-colors duration-300 text-sm sm:text-base break-words"
                >
                  Claim Offer
                </motion.button>
              </div>

              {/* Decorative Corner */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 opacity-5 rounded-tl-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OffersSection;
