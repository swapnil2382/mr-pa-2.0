import { motion } from "framer-motion";
import { memo } from "react";

function MouseFollower({ mousePosition }) {
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border-2 border-violet-400/30 rounded-full pointer-events-none z-40"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
        }}
      />
    </>
  );
}

export default memo(MouseFollower);