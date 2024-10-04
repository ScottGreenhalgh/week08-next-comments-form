"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <motion.div
      style={{
        width: "50px",
        height: "50px",
        border: "5px solid rgba(255, 255, 255, 0.3)",
        borderTop: "5px solid rgba(255, 255, 255, 1)",
        borderRadius: "50%",
        margin: "auto",
      }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    />
  );
}
