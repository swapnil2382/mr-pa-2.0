"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    description: "Perfect for individuals starting out",
    features: [
      "Basic AI design tools",
      "Code generation",
      "3 projects per month",
      "Email support",
    ],
  },
  {
    name: "Standard",
    price: "$79",
    period: "/month",
    description: "Great for small teams and freelancers",
    features: [
      "Everything in Basic",
      "Enhanced AI capabilities",
      "10 projects per month",
      "Priority email support",
      "Basic templates",
    ],
  },
  {
    name: "Pro",
    price: "$149",
    period: "/month",
    description: "Ideal for growing businesses and teams",
    features: [
      "Everything in Standard",
      "Advanced AI features",
      "Unlimited projects",
      "Phone & email support",
      "Custom templates",
      "Team collaboration",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored for large organizations",
    features: [
      "Everything in Pro",
      "Custom AI models",
      "Dedicated support",
      "Advanced security",
      "Custom integrations",
    ],
  },
]

export default function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const handleBuyNow = (planName) => {
    console.log(`Buy Now clicked for ${planName}`);
    // Placeholder for payment gateway integration
  };

  return (
    <section id="pricing" className="py-24 md:py-32 bg-zinc-950">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Pricing</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include our core AI capabilities.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative flex flex-col h-full"
            >
              <div
                className="flex flex-col justify-between h-full p-8 rounded-2xl border border-white/50 bg-zinc-900/30"
              >
                {/* Header */}
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-2 text-white">{plan.name}</h3>
                  <p className="text-zinc-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-zinc-400 ml-1">{plan.period}</span>}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                      <span className="text-zinc-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Buy Now Button */}
                <motion.button
                  onClick={() => handleBuyNow(plan.name)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 md:px-6 md:py-3 bg-white text-black rounded-lg font-medium text-sm md:text-base transition-all duration-200 shadow-sm"
                >
                  Buy Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}