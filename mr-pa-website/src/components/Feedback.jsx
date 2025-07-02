"use client"

import React, { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

const Feedback = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  }

  // Animation variants for form elements
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (!formData.message.trim()) newErrors.message = "Message is required"
    return newErrors
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Simulate API call (replace with actual API logic)
    console.log("Feedback submitted:", formData)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", message: "" })

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <section id="feedback" className="py-20 sm:py-24 lg:py-32 bg-black relative overflow-hidden">
      {/* Background gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "6rem" } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"
          />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">Feedback</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed font-light">
            Your insights drive our innovation. Share your thoughts to help us enhance our AI solutions and deliver exceptional value to your business.
          </p>
        </motion.div>

        {/* Form section */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="relative bg-gray-900/30 border border-gray-800/50 backdrop-blur-sm rounded-2xl p-8 sm:p-10 shadow-lg"
          >
            {/* Success message */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 text-center text-green-400 text-sm sm:text-base"
                role="alert"
              >
                Thank you for your feedback! We’ll get back to you soon.
              </motion.div>
            )}

            <div className="relative z-10 space-y-8">
              {/* Name field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                  aria-describedby="name-error"
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-red-500 text-xs sm:text-sm" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  placeholder="Enter your email address"
                  required
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-red-500 text-xs sm:text-sm" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                  Message <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 resize-y"
                  placeholder="Share your feedback or suggestions"
                  required
                  aria-describedby="message-error"
                ></textarea>
                {errors.message && (
                  <p id="message-error" className="mt-1 text-red-500 text-xs sm:text-sm" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="w-full sm:w-auto px-8 py-3 bg-white text-black font-semibold rounded-full text-sm sm:text-base hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                aria-label="Submit feedback form"
              >
                Submit Feedback
                <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
              </motion.button>
            </div>

            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Feedback