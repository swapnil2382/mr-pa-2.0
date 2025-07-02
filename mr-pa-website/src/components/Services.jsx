import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const services = [
  { number: '01', title: 'Strategic AI Implementation', id: 'strategic-ai' },
  { number: '02', title: 'Workflow Automation', id: 'workflow-automation' },
  { number: '03', title: 'Intelligent Email Management', id: 'email-management' },
  { number: '04', title: 'AI-Powered Web Solutions', id: 'web-solutions' },
  { number: '05', title: 'Automated Lead Generation', id: 'lead-generation' },
  { number: '06', title: 'Smart Project Management', id: 'project-management' },
  { number: '07', title: 'AI-Powered Web Solutions', id: 'web-solutions-2' },
  { number: '08', title: 'Automated Lead Generation', id: 'lead-generation-2' },
];

const WhatWeDo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const numberVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { scale: 1, rotate: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
  };

  return (
    <section id="what-we-do" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: '4rem' } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-white mx-auto mb-6"
          />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            What We <span className="text-gray-400">Deliver</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed font-light">
            Mr. Pa transforms businesses through strategic AI implementation, delivering measurable results 
            across operations, customer engagement, and growth initiatives.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
              className="group relative bg-black border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 overflow-hidden hover-scale"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                variants={numberVariants}
                className="relative inline-flex items-center justify-center w-12 h-12 bg-white text-black font-bold text-lg rounded-full mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                {service.number}
              </motion.div>
              <div className="relative z-10">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300">
                  {service.title}
                </h3>
                <Link
                  to={`/servicepage/${service.id}`}
                  className="inline-flex items-center px-4 py-2 bg-transparent border border-gray-600 text-gray-300 font-semibold rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                >
                  Learn More <span className="ml-2">→</span>
                </Link>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
{/* 
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16 pt-16 border-t border-gray-800"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Discover how AI can revolutionize your operations and drive unprecedented growth.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            Get Started Today <span className="ml-2">→</span>
          </motion.button>
        </motion.div> */}
      </div>
    </section>
  );
};

export default WhatWeDo;