import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';

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

const ServicePage = () => {
  const { serviceId } = useParams();
  const service = services.find(s => s.id === serviceId) || { title: 'Service Not Found' };

  return (
    <section className="py-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {service.title}
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '4rem' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-white mx-auto mb-6"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Overview</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Benefits</h2>
          <ul className="list-disc list-inside text-gray-300 text-lg leading-relaxed mb-8">
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</li>
            <li>Duis aute irure dolor in reprehenderit in voluptate velit esse.</li>
          </ul>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">How It Works</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
          <Link
            to="/#what-we-do"
            className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            Back to Services <span className="ml-2">←</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicePage;