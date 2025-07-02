import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Bot } from "lucide-react"
import botimg from "../lib/mrpa.jpg" // Replace with your actual image path

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Simulated AI responses
  const aiResponses = [
    "Thank you for your message! How can I assist you further?",
    "I'm here to help with any questions about our AI platform. What's on your mind?",
    "Great to hear from you! Could you specify your query for a tailored response?",
    "Our AI solutions are designed for enterprise excellence. Want to explore specific features?",
  ]

  // Scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsOpen(!isOpen)
  }

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { text: input, isUser: true, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)
    scrollToBottom()

    // Simulate API delay and AI response
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
    setMessages((prev) => [
      ...prev,
      { text: randomResponse, isUser: false, timestamp: new Date() },
    ])
    setIsTyping(false)
    scrollToBottom()
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  // Initialize with welcome message and focus input when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: "Hello! I'm Mr. Pa AI, here to answer questions about our cutting-edge AI platform. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
        },
      ])
    }
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    scrollToBottom()
  }, [isOpen])

  // Button animation variants
  const buttonVariants = {
    open: { rotate: 45, backgroundColor: "#ffffff" },
    closed: { rotate: 0, backgroundColor: "#ffffff" },
  }

  // Format timestamp
  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={toggleChatbot}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md flex items-center justify-center overflow-hidden border border-white/20 bg-black/20 backdrop-blur-md"
        variants={buttonVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(255, 255, 255, 0.15)" }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} className="text-black sm:w-6 sm:h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot-image"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={botimg}
                alt="AI Agent"
                className="w-[85%] h-[85%] object-cover rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 right-0 w-[85vw] max-w-[320px] sm:max-w-[360px] md:max-w-[400px] bg-black/20 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md overflow-hidden"
          >
            {/* Chat Header */}
            <div className="flex justify-between items-center p-3 sm:p-4 bg-black/50 border-b border-white/20">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex items-center justify-center bg-white">
                  <img
                    src={botimg}
                    alt="AI Agent"
                    className="w-[85%] h-[85%] object-cover rounded-full"
                  />
                </div>
                <div>
                  <span className="font-semibold text-white text-sm sm:text-base">Mr. Pa AI</span>
                  <p className="text-xs flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  </p>
                </div>
              </div>
              <button
                onClick={toggleChatbot}
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Close chatbot"
              >
                <X size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-[250px] sm:h-[300px] md:h-[350px] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-black/50 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-black/50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-2 sm:p-3 rounded-xl text-xs sm:text-sm ${
                      message.isUser ? "bg-white text-black" : "bg-black/70 text-white"
                    } shadow-sm`}
                  >
                    {message.text}
                    <div className="text-xs text-white/50 mt-1 text-right">
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-black/70 p-2 sm:p-3 rounded-xl text-xs sm:text-sm text-white shadow-sm">
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 sm:p-4 border-t border-white/20 bg-black/50">
              <div className="flex space-x-2 sm:space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-black/70 text-white rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 transition-all duration-300 hover:bg-black/90"
                  aria-label="Type your message"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="bg-white text-black rounded-xl p-2 sm:p-2.5 hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  disabled={!input.trim()}
                  aria-label="Send message"
                >
                  <Send size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Chatbot