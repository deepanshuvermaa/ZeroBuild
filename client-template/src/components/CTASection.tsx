import { motion } from 'framer-motion';
import type { CTASectionProps } from '../types';
import { extractTextStyle, getTextStyle } from '../utils/textStyles';

const CTASection = (props: CTASectionProps) => {
  const {
    heading,
    description,
    ctaText,
    ctaLink,
    backgroundImage
  } = props;
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-600 to-purple-600" />
      )}

      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight break-words"
          style={getTextStyle(extractTextStyle(props, 'heading'))}
        >
          {heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed break-words"
          style={getTextStyle(extractTextStyle(props, 'description'))}
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        >
          <motion.a
            href={ctaLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-white text-blue-600 font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 text-base sm:text-lg break-words"
            style={getTextStyle(extractTextStyle(props, 'ctaText'))}
          >
            {ctaText}
          </motion.a>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center gap-8 mt-12"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut'
              }}
              className="w-2 h-2 bg-white rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
